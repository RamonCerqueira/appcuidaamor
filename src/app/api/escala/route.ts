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

    // Check year and month from URL search params
    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')
    
    const hoje = new Date()
    const year = yearParam ? parseInt(yearParam) : hoje.getFullYear()
    const month = monthParam ? parseInt(monthParam) : hoje.getMonth() // 0-based

    const dataInicio = new Date(year, month, 1)
    const dataFim = new Date(year, month + 1, 0, 23, 59, 59)

    // Busca pacientes do responsavel para achar os Pedidos
    const pacientesVinculados = await prisma.cLIENTEs.findMany({
      where: { CodCli1: responsavelId },
      select: { CodCli: true }
    })

    if (pacientesVinculados.length === 0) {
      return NextResponse.json({ sucesso: true, plantoes: [] })
    }

    const pacientePrincipal = pacientesVinculados[0]

    const servicosDoPaciente = await prisma.servico.findMany({
      where: { Codcli: pacientePrincipal.CodCli },
      select: { Pedido: true, HoraInicio: true, HoraSaida: true }
    })

    if (servicosDoPaciente.length === 0) {
      return NextResponse.json({ sucesso: true, plantoes: [] })
    }

    const pedidosMap = new Map()
    servicosDoPaciente.forEach((s: any) => {
      pedidosMap.set(s.Pedido, { inicio: s.HoraInicio, saida: s.HoraSaida })
    })

    const pedidos = servicosDoPaciente.map((s: any) => s.Pedido)

    const plantoesMes = await prisma.servico1.findMany({
      where: {
        Pedido: { in: pedidos },
        Data: { gte: dataInicio, lte: dataFim }
      },
      orderBy: { Data: 'asc' }
    })

    const plantoesFormatados = await Promise.all(plantoesMes.map(async (plantao) => {
      let nomeCuidador = 'Cuidador Escalado'
      if (plantao.CodInd) {
        const cuidador = await prisma.cLIENTEs.findUnique({
          where: { CodCli: plantao.CodInd },
          select: { Cliente: true }
        })
        if (cuidador && cuidador.Cliente) {
          nomeCuidador = cuidador.Cliente
        }
      }

      const horarioPedido = pedidosMap.get(plantao.Pedido)

      return {
        id: plantao.Lanc,
        data: plantao.Data,
        horaInicio: horarioPedido?.inicio || '00:00',
        horaSaida: horarioPedido?.saida || '23:59',
        cuidador: nomeCuidador,
        status: plantao.Situacao || 'AGENDADO',
        pedido: plantao.Pedido
      }
    }))

    // Busca do Responsavel
    const responsavel = await prisma.cLIENTEs.findUnique({
      where: { CodCli: responsavelId },
      select: { Cliente: true }
    })

    // Extrai iniciais do responsável
    const nomeResponsavel = responsavel?.Cliente || 'Família Silva'
    const iniciais = nomeResponsavel
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'FS'

    return NextResponse.json({
      sucesso: true,
      responsavel: nomeResponsavel,
      iniciais,
      plantoes: plantoesFormatados
    })
  } catch (error) {
    console.error('Erro ao buscar escalas:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
