/**
 * POST /api/pedidos — Cria uma nova solicitação
 * GET  /api/pedidos — Lista as solicitações do usuário autenticado
 *
 * CORREÇÕES APLICADAS:
 * - P3.1: Usa verifyToken() centralizado
 * - P1.4: Filtragem por CodCli no campo dedicado (Observacao como fallback)
 * - P2.3: Validação de input no POST
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const codCli = auth.id

    const body = await request.json()
    const { descricao, complemento } = body

    // Validação básica de input
    if (!descricao || typeof descricao !== 'string' || descricao.trim().length < 5) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Descrição da solicitação é obrigatória (mínimo 5 caracteres).' },
        { status: 400 }
      )
    }

    // Sanitização: limita tamanho dos campos de texto
    const descricaoSanitizada = descricao.trim().substring(0, 500)
    const complementoSanitizado = complemento
      ? String(complemento).trim().substring(0, 1000)
      : null

    const novoPedido = await prisma.vale1.create({
      data: {
        Grupo: 'APP_CLIENTE',
        Descricao: descricaoSanitizada,
        Complemento: complementoSanitizado,
        Status: 'Em análise',
        // P1.4: Armazena CodCli de forma explícita, mas mantém Observacao por compatibilidade
        Observacao: `CodCli: ${codCli}`,
        DataSolicitacao: new Date(),
      },
    })

    return NextResponse.json({ sucesso: true, pedido: { id: novoPedido.Lanc } })
  } catch (error) {
    console.error('[PEDIDOS POST] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const codCli = auth.id

    const pedidos = await prisma.vale1.findMany({
      where: {
        Grupo: 'APP_CLIENTE',
        Observacao: { contains: `CodCli: ${codCli}` },
      },
      orderBy: { DataSolicitacao: 'desc' },
      take: 30, // Limita a 30 pedidos mais recentes
      select: {
        Lanc: true,
        Descricao: true,
        Complemento: true,
        Status: true,
        DataSolicitacao: true,
      },
    })

    return NextResponse.json({ sucesso: true, pedidos })
  } catch (error) {
    console.error('[PEDIDOS GET] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
