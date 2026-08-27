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

const TIPOS_VALIDOS = ['FOLGA', 'REMOVER', 'ALTERAR', 'OUTRA'] as const
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
      take: 30,
      select: {
        Lanc: true,
        Cupom: true,
        Data: true,
        Status: true,
        RespostaAdmin: true,
      },
    })

    const historico = solicitacoes.map((s) => ({
      id: s.Lanc,
      tipo: s.Cupom,
      data: s.Data,
      status: s.Status || 'Em Análise',
      respostaAdmin: s.RespostaAdmin || null,
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
    const { tipo, cuidadorId, datasFolga, observacao } = body

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

    // Sanitização da observação
    const observacaoSanitizada = observacao
      ? String(observacao).trim().substring(0, 500)
      : null

    // Validação do cuidadorId se fornecido
    const cuidadorIdNumerico = cuidadorId && !isNaN(parseInt(cuidadorId, 10))
      ? parseInt(cuidadorId, 10)
      : null

    if (tipo === 'FOLGA' && Array.isArray(datasFolga) && datasFolga.length > 0) {
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

    // Para outros tipos
    await prisma.cupom.create({
      data: {
        Cupom: tipo.substring(0, 10),
        Data: new Date(),
        Indice: responsavelId,
        NumVen: cuidadorIdNumerico,
        Validade: null,
        Observacao: observacaoSanitizada,
        Status: 'Em Análise',
        RespostaAdmin: null,
      },
    })

    return NextResponse.json({ sucesso: true })
  } catch (error) {
    console.error('[SOLICITACOES POST] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
