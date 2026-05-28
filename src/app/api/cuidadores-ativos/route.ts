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

    // Busca pacientes do responsavel para achar os Pedidos
    const pacientesVinculados = await prisma.cLIENTEs.findMany({
      where: { CodCli1: responsavelId },
      select: { CodCli: true }
    })

    if (pacientesVinculados.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    const pacientePrincipal = pacientesVinculados[0]

    const servicosDoPaciente = await prisma.servico.findMany({
      where: { Codcli: pacientePrincipal.CodCli },
      select: { Pedido: true }
    })

    const pedidos = servicosDoPaciente.map(s => s.Pedido)

    // Busca todas as escalas futuras/atuais para descobrir quem são os cuidadores e seus dias
    const hoje = new Date()
    hoje.setHours(0,0,0,0)
    
    const escalasFuturas = await prisma.servico1.findMany({
      where: {
        Pedido: { in: pedidos },
        Data: { gte: hoje },
        CodInd: { not: null }
      },
      select: { CodInd: true, Data: true },
      orderBy: { Data: 'asc' }
    })

    const codigosCuidadores = Array.from(new Set(escalasFuturas.map(e => e.CodInd).filter(Boolean))) as number[]

    if (codigosCuidadores.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    // Busca os nomes reais dos cuidadores
    const cuidadoresAtivos = await prisma.cLIENTEs.findMany({
      where: { CodCli: { in: codigosCuidadores } },
      select: { CodCli: true, Cliente: true }
    })

    const resultado = cuidadoresAtivos.map(c => {
      // Extrai e formata as datas em que este cuidador especifico está escalado
      const datasBrutas = escalasFuturas
        .filter(e => e.CodInd === c.CodCli && e.Data)
        .map(e => (e.Data as Date).toISOString())
      
      const datasUnicas = Array.from(new Set(datasBrutas))

      return {
        id: c.CodCli,
        nome: c.Cliente,
        plantoes: datasUnicas
      }
    })

    return NextResponse.json({ sucesso: true, cuidadores: resultado })
  } catch (error) {
    console.error('Erro ao buscar cuidadores ativos:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
