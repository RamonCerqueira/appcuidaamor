/**
 * GET /api/solicitacoes — Lista histórico de solicitações (Cupom) do usuário
 * POST /api/solicitacoes — Cria nova solicitação de folga ou outra natureza
 *
 * CORREÇÕES APLICADAS:
 * - P3.1: Usa verifyToken() centralizado
 * - P2.3: Validação de input no POST
 * - P3.3: Select explícito
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const TIPOS_VALIDOS = ['FOLGA', 'REMOVER', 'ALTERAR', 'ESCALA', 'OUTRA'] as const
type TipoSolicitacao = typeof TIPOS_VALIDOS[number]

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const responsavelId = auth.id

    const solicitacoes = await prisma.cupom.findMany({
      where: { Indice: responsavelId },
      orderBy: { Data: 'desc' },
      take: 40,
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
    })

    // Busca os nomes dos cuidadores vinculados às solicitações
    const cuidadoresIds = Array.from(
      new Set(
        solicitacoes
          .map((s) => s.NumVen)
          .filter((id): id is number => typeof id === 'number')
      )
    )

    const cuidadoresMap = new Map<number, string>()
    if (cuidadoresIds.length > 0) {
      const cuidadores = await prisma.cLIENTEs.findMany({
        where: { CodCli: { in: cuidadoresIds } },
        select: { CodCli: true, Cliente: true },
      })
      for (const c of cuidadores) {
        if (typeof c.CodCli === 'number') {
          cuidadoresMap.set(c.CodCli, c.Cliente || 'Profissional')
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
    }))

    return NextResponse.json({ sucesso: true, solicitacoes: historico })
  } catch (error) {
    console.error('[SOLICITACOES GET] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const responsavelId = auth.id
    const body = await request.json()
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
    } = body

    // Validação do tipo de solicitação
    if (!tipo || !TIPOS_VALIDOS.includes(tipo as TipoSolicitacao)) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: `Tipo de solicitação inválido. Use: ${TIPOS_VALIDOS.join(', ')}.`,
        },
        { status: 400 }
      )
    }

    const tipoNormalizado = tipo === 'ESCALA' ? 'ALTERAR' : tipo

    // Monta observação estruturada legível para a coordenação
    const prefixos: string[] = []
    if (motivo) prefixos.push(`[MOTIVO: ${String(motivo).trim()}]`)
    if (tipoAjuste) prefixos.push(`[AJUSTE: ${String(tipoAjuste).trim()}]`)
    if (categoria) prefixos.push(`[CATEGORIA: ${String(categoria).trim()}]`)
    if (dataDesejada) prefixos.push(`[DATA DESEJADA: ${String(dataDesejada).trim()}]`)
    if (dataInicio) prefixos.push(`[INÍCIO: ${String(dataInicio).trim()}]`)

    const textoObs = observacao ? String(observacao).trim() : ''
    const observacaoSanitizada =
      [...prefixos, textoObs].filter(Boolean).join(' ').substring(0, 500) || null

    // Validação do cuidadorId se fornecido
    const cuidadorIdNumerico =
      cuidadorId && !isNaN(parseInt(cuidadorId, 10))
        ? parseInt(cuidadorId, 10)
        : null

    // Data de validade / evento se informada
    let validadeData: Date | null = null
    const dataRef = dataDesejada || dataInicio
    if (dataRef) {
      const dt = new Date(dataRef)
      if (!isNaN(dt.getTime())) {
        validadeData = dt
      }
    }

    if (tipoNormalizado === 'FOLGA' && Array.isArray(datasFolga) && datasFolga.length > 0) {
      // Limita a 31 dias de folga por solicitação
      const datasLimitadas = datasFolga.slice(0, 31)

      const promessas = datasLimitadas.map((dataIso: string) => {
        const dataValida = new Date(dataIso)
        if (isNaN(dataValida.getTime())) return null

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
        })
      })

      await Promise.all(promessas.filter(Boolean))
      return NextResponse.json({ sucesso: true })
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
    })

    return NextResponse.json({ sucesso: true, solicitacao: { Lanc: novoCupom.Lanc } })
  } catch (error) {
    console.error('[SOLICITACOES POST] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
