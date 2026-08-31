import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resolverFamilia } from '@/lib/paciente';

const TIPOS_VALIDOS = ['FOLGA', 'REMOVER', 'ALTERAR', 'ESCALA', 'OUTRA'] as const;
type TipoSolicitacao = typeof TIPOS_VALIDOS[number];

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 });
    }

    const familia = await resolverFamilia(auth.id);
    const indicesBusca = familia ? familia.todosCodClis : [auth.id];

    const solicitacoes = await prisma.cupom.findMany({
      where: { Indice: { in: indicesBusca } },
      orderBy: { Data: 'desc' },
      take: 50,
      select: {
        Lanc: true,
        Cupom: true,
        Data: true,
        Status: true,
        RespostaAdmin: true,
        NumVen: true,
        Validade: true,
        Observacao: true,
      },
    });

    // Busca os nomes dos cuidadores vinculados às solicitações
    const cuidadoresIds = Array.from(
      new Set(
        solicitacoes
          .map((s) => s.NumVen)
          .filter((id): id is number => typeof id === 'number')
      )
    );

    const cuidadoresMap = new Map<number, string>();
    if (cuidadoresIds.length > 0) {
      const cuidadores = await prisma.cLIENTEs.findMany({
        where: { CodCli: { in: cuidadoresIds } },
        select: { CodCli: true, Cliente: true },
      });
      for (const c of cuidadores) {
        if (typeof c.CodCli === 'number') {
          cuidadoresMap.set(c.CodCli, c.Cliente || 'Profissional');
        }
      }
    }

    const historico = solicitacoes.map((s) => ({
      id: s.Lanc,
      tipo: s.Cupom === 'ESCALA' ? 'ALTERAR' : s.Cupom,
      data: s.Data,
      status: s.Status || 'Em Análise',
      respostaAdmin: s.RespostaAdmin || null,
      cuidadorId: s.NumVen || null,
      cuidadorNome: s.NumVen ? cuidadoresMap.get(s.NumVen) || null : null,
      validade: s.Validade || null,
      observacao: s.Observacao || null,
    }));

    return NextResponse.json({ sucesso: true, solicitacoes: historico });
  } catch (error) {
    console.error('[SOLICITACOES GET] Erro:', error instanceof Error ? error.message : error);
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 });
    }

    const familia = await resolverFamilia(auth.id);
    const responsavelId = familia?.responsavel.CodCli || auth.id;

    const body = await request.json();
    const {
      tipo,
      cuidadorId,
      datasFolga,
      observacao,
      motivo,
      tipoAjuste,
      categoria,
      dataDesejada,
      dataInicio,
      urgenciaTroca,
      tagsPerfil,
      precisaSubstituta,
      escopoAjuste,
      novoHorarioInicio,
      novoHorarioFim,
    } = body;

    // Validação do tipo de solicitação
    if (!tipo || !TIPOS_VALIDOS.includes(tipo as TipoSolicitacao)) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: `Tipo de solicitação inválido. Use: ${TIPOS_VALIDOS.join(', ')}.`,
        },
        { status: 400 }
      );
    }

    const tipoNormalizado = tipo === 'ESCALA' ? 'ALTERAR' : tipo;

    // Monta observação altamente estruturada e legível para a equipe de coordenação
    const prefixos: string[] = [];

    if (urgenciaTroca) {
      prefixos.push(urgenciaTroca === 'IMEDIATA' ? '[URGÊNCIA: IMEDIATA]' : '[TRANSIÇÃO: REGULAR]');
    }

    if (motivo) prefixos.push(`[MOTIVO: ${String(motivo).trim()}]`);

    if (Array.isArray(tagsPerfil) && tagsPerfil.length > 0) {
      prefixos.push(`[PREFERÊNCIAS: ${tagsPerfil.join(', ')}]`);
    }

    if (tipoNormalizado === 'FOLGA') {
      prefixos.push(
        precisaSubstituta
          ? '[COBERTURA: REQUER CUIDADORA SUBSTITUTA]'
          : '[COBERTURA: APENAS SUSPENDER PLANTÃO (FAMÍLIA CUIDA)]'
      );
    }

    if (escopoAjuste) {
      prefixos.push(escopoAjuste === 'DEFINITIVO' ? '[ESCOPO: DEFINITIVO]' : '[ESCOPO: TEMPORÁRIO/PONTUAL]');
    }

    if (novoHorarioInicio || novoHorarioFim) {
      prefixos.push(`[HORÁRIO: ${novoHorarioInicio || '--:--'} às ${novoHorarioFim || '--:--'}]`);
    }

    if (tipoAjuste) prefixos.push(`[AJUSTE: ${String(tipoAjuste).trim()}]`);
    if (categoria) prefixos.push(`[CATEGORIA: ${String(categoria).trim()}]`);
    if (dataDesejada) prefixos.push(`[DATA DESEJADA: ${String(dataDesejada).trim()}]`);
    if (dataInicio) prefixos.push(`[INÍCIO: ${String(dataInicio).trim()}]`);

    const textoObs = observacao ? String(observacao).trim() : '';
    const observacaoSanitizada =
      [...prefixos, textoObs].filter(Boolean).join('\n').substring(0, 700) || null;

    // Validação do cuidadorId se fornecido
    const cuidadorIdNumerico =
      cuidadorId && !isNaN(parseInt(cuidadorId, 10))
        ? parseInt(cuidadorId, 10)
        : null;

    // Data de validade / evento se informada
    let validadeData: Date | null = null;
    const dataRef = dataDesejada || dataInicio;
    if (dataRef) {
      const dt = new Date(dataRef);
      if (!isNaN(dt.getTime())) {
        validadeData = dt;
      }
    }

    if (tipoNormalizado === 'FOLGA' && Array.isArray(datasFolga) && datasFolga.length > 0) {
      const datasLimitadas = datasFolga.slice(0, 31);

      const promessas = datasLimitadas.map((dataIso: string) => {
        const dataValida = new Date(dataIso);
        if (isNaN(dataValida.getTime())) return null;

        return prisma.cupom.create({
          data: {
            Cupom: 'FOLGA',
            Data: new Date(),
            Indice: responsavelId,
            NumVen: cuidadorIdNumerico,
            Validade: dataValida,
            Observacao: observacaoSanitizada,
            Status: 'Em Análise',
            RespostaAdmin: null,
          },
        });
      });

      await Promise.all(promessas.filter(Boolean));
      return NextResponse.json({ sucesso: true });
    }

    // Para outros tipos (REMOVER, ALTERAR, OUTRA)
    const novoCupom = await prisma.cupom.create({
      data: {
        Cupom: tipoNormalizado.substring(0, 10),
        Data: new Date(),
        Indice: responsavelId,
        NumVen: cuidadorIdNumerico,
        Validade: validadeData,
        Observacao: observacaoSanitizada,
        Status: 'Em Análise',
        RespostaAdmin: null,
      },
    });

    return NextResponse.json({ sucesso: true, solicitacao: { Lanc: novoCupom.Lanc } });
  } catch (error) {
    console.error('[SOLICITACOES POST] Erro:', error instanceof Error ? error.message : error);
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyToken(request);
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;

    if (!id || isNaN(id)) {
      return NextResponse.json({ sucesso: false, mensagem: 'ID inválido.' }, { status: 400 });
    }

    const familia = await resolverFamilia(auth.id);
    const indicesPermitidos = familia ? familia.todosCodClis : [auth.id];

    const cupom = await prisma.cupom.findUnique({
      where: { Lanc: id },
      select: { Lanc: true, Indice: true, Status: true },
    });

    if (!cupom || !cupom.Indice || !indicesPermitidos.includes(cupom.Indice)) {
      return NextResponse.json({ sucesso: false, mensagem: 'Solicitação não encontrada.' }, { status: 404 });
    }

    if (cupom.Status && cupom.Status !== 'Em Análise') {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Apenas solicitações em análise podem ser canceladas.' },
        { status: 400 }
      );
    }

    await prisma.cupom.update({
      where: { Lanc: id },
      data: {
        Status: 'CANCELADO',
        RespostaAdmin: 'Solicitação cancelada pelo familiar solicitante.',
      },
    });

    return NextResponse.json({ sucesso: true, mensagem: 'Solicitação cancelada com sucesso.' });
  } catch (error) {
    console.error('[SOLICITACOES DELETE] Erro:', error instanceof Error ? error.message : error);
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 });
  }
}
