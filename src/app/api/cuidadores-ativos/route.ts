import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resolverFamilia } from '@/lib/paciente'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const familia = await resolverFamilia(auth.id)
    if (!familia) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    const { codClisPacientes, todosCodClis } = familia

    const servicosDoPaciente = await prisma.servico.findMany({
      where: { Codcli: { in: todosCodClis } },
      select: { Pedido: true },
    })

    const pedidos = servicosDoPaciente
      .map((s) => s.Pedido)
      .filter((p): p is number => typeof p === 'number')

    if (pedidos.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    // Busca plantões nos últimos 30 dias até os próximos 90 dias
    const dataLimiteInicio = new Date()
    dataLimiteInicio.setDate(dataLimiteInicio.getDate() - 30)
    dataLimiteInicio.setHours(0, 0, 0, 0)

    const dataLimiteFim = new Date()
    dataLimiteFim.setDate(dataLimiteFim.getDate() + 90)
    dataLimiteFim.setHours(23, 59, 59, 999)

    let escalas = await prisma.servico1.findMany({
      where: {
        Pedido: { in: pedidos },
        CodInd: { not: null },
        Data: { gte: dataLimiteInicio, lte: dataLimiteFim },
      },
      select: { CodInd: true, Data: true },
      orderBy: { Data: 'asc' },
    })

    let codigosCuidadores = Array.from(
      new Set(escalas.map((e) => e.CodInd).filter((id): id is number => typeof id === 'number'))
    )

    // Fallback: se não houver plantões na janela de 120 dias, busca qualquer plantão dos pedidos
    if (codigosCuidadores.length === 0) {
      const qualquerEscala = await prisma.servico1.findMany({
        where: {
          Pedido: { in: pedidos },
          CodInd: { not: null },
        },
        select: { CodInd: true, Data: true },
        take: 100,
      })

      escalas = qualquerEscala
      codigosCuidadores = Array.from(
        new Set(qualquerEscala.map((e) => e.CodInd).filter((id): id is number => typeof id === 'number'))
      )
    }

    if (codigosCuidadores.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    const cuidadoresAtivos = await prisma.cLIENTEs.findMany({
      where: { CodCli: { in: codigosCuidadores } },
      select: { CodCli: true, Cliente: true, Caminho: true },
    })

    const resultado = cuidadoresAtivos.map((c) => {
      const datasBrutas = escalas
        .filter((e) => e.CodInd === c.CodCli && e.Data)
        .map((e) => (e.Data as Date).toISOString())

      const datasUnicas = Array.from(new Set(datasBrutas))

      return {
        id: c.CodCli,
        nome: c.Cliente || 'Cuidador(a)',
        avatarSrc: c.Caminho || null,
        plantoes: datasUnicas,
      }
    })

    return NextResponse.json({ sucesso: true, cuidadores: resultado })
  } catch (error) {
    console.error('[CUIDADORES ATIVOS] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
