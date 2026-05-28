import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const encoder = new TextEncoder()

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('mobile_token')?.value
    if (!token) return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado' }, { status: 401 })

    const secret = encoder.encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    const codCli = (payload as any).id

    const { descricao, complemento } = await request.json()

    const novoPedido = await prisma.vale1.create({
      data: {
        Grupo: 'APP_CLIENTE',
        Descricao: descricao,
        Complemento: complemento,
        Status: 'Em análise',
        Observacao: `CodCli: ${codCli}`,
        DataSolicitacao: new Date()
      }
    })

    return NextResponse.json({ sucesso: true, pedido: novoPedido })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('mobile_token')?.value
    if (!token) return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado' }, { status: 401 })

    const secret = encoder.encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    const codCli = (payload as any).id

    const pedidos = await prisma.vale1.findMany({
      where: {
        Grupo: 'APP_CLIENTE',
        Observacao: { contains: `CodCli: ${codCli}` }
      },
      orderBy: { DataSolicitacao: 'desc' },
      take: 20
    })

    return NextResponse.json({ sucesso: true, pedidos })
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
