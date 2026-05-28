import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const encoder = new TextEncoder()

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('mobile_token')?.value
    if (!token) return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado' }, { status: 401 })

    const secret = encoder.encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    const responsavelId = (payload as any).id

    const solicitacoes = await prisma.cupom.findMany({
      where: { Indice: responsavelId },
      orderBy: { Data: 'desc' }
    })

    const historico = solicitacoes.map(s => ({
      id: s.Lanc,
      tipo: s.Cupom,
      data: s.Data,
      status: s.Status || 'Em Análise',
      respostaAdmin: s.RespostaAdmin || null
    }))

    return NextResponse.json({ sucesso: true, solicitacoes: historico })
  } catch (error) {
    console.error('Erro ao buscar historico:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('mobile_token')?.value
    if (!token) return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado' }, { status: 401 })

    const secret = encoder.encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    const responsavelId = (payload as any).id

    const body = await request.json()
    const { tipo, cuidadorId, datasFolga, observacao } = body

    if (tipo === 'FOLGA' && datasFolga && datasFolga.length > 0) {
      // Cria um registro de solicitação para cada dia de folga solicitado
      const promessas = datasFolga.map(async (dataIso: string) => {
        return prisma.cupom.create({
          data: {
            Cupom: 'FOLGA',
            Data: new Date(),
            Indice: responsavelId,
            NumVen: cuidadorId || null,
            Validade: new Date(dataIso),
            Observacao: observacao || null,
            Status: 'Em Análise',
            RespostaAdmin: null
          }
        })
      });

      await Promise.all(promessas);
      return NextResponse.json({ sucesso: true })
    }

    // Para outros tipos de solicitações (REMOVER, ALTERAR, OUTRA)
    const novaSolicitacao = await prisma.cupom.create({
      data: {
        Cupom: tipo.substring(0, 10), // Limite de 10 chars
        Data: new Date(),
        Indice: responsavelId,
        NumVen: cuidadorId || null,
        Validade: null,
        Observacao: observacao || null,
        Status: 'Em Análise',
        RespostaAdmin: null
      }
    })

    return NextResponse.json({ sucesso: true, solicitacao: novaSolicitacao })
  } catch (error) {
    console.error('Erro ao criar solicitacao:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
