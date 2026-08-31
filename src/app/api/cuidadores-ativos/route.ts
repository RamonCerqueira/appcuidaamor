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

    // Início do dia de hoje (00:00:00)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const dataLimiteFim = new Date()
    dataLimiteFim.setDate(dataLimiteFim.getDate() + 90)
    dataLimiteFim.setHours(23, 59, 59, 999)

    // Busca apenas plantões vigentes e futuros (Data >= hoje)
    let escalasFuturas = await prisma.servico1.findMany({
      where: {
        Pedido: { in: pedidos },
        CodInd: { not: null },
        Data: { gte: hoje, lte: dataLimiteFim },
      },
      select: { CodInd: true, Data: true, Pedido: true },
      orderBy: { Data: 'asc' },
    })

    // Se não houver no range de 90 dias, tenta buscar qualquer plantão futuro
    if (escalasFuturas.length === 0) {
      escalasFuturas = await prisma.servico1.findMany({
        where: {
          Pedido: { in: pedidos },
          CodInd: { not: null },
          Data: { gte: hoje },
        },
        select: { CodInd: true, Data: true, Pedido: true },
        orderBy: { Data: 'asc' },
        take: 100,
      })
    }

    // Fallback de segurança: se a base não tiver datas futuras (ex: homologação com dados estáticos),
    // carrega os plantões mais recentes para a tela não ficar estéril
    if (escalasFuturas.length === 0) {
      escalasFuturas = await prisma.servico1.findMany({
        where: {
          Pedido: { in: pedidos },
          CodInd: { not: null },
        },
        select: { CodInd: true, Data: true, Pedido: true },
        orderBy: { Data: 'desc' },
        take: 60,
      })
    }

    const codigosCuidadores = Array.from(
      new Set(escalasFuturas.map((e) => e.CodInd).filter((id): id is number => typeof id === 'number'))
    )

    if (codigosCuidadores.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [], mapaPlantoes: [] })
    }

    const cuidadoresDb = await prisma.cLIENTEs.findMany({
      where: { CodCli: { in: codigosCuidadores } },
      select: { CodCli: true, Cliente: true, Caminho: true },
    })

    const cuidadoresMap = new Map(cuidadoresDb.map((c) => [c.CodCli, c]))

    const cuidadoresResultado = cuidadoresDb.map((c) => {
      const datasBrutas = escalasFuturas
        .filter((e) => e.CodInd === c.CodCli && e.Data)
        .map((e) => (e.Data as Date).toISOString())

      const datasUnicas = Array.from(new Set(datasBrutas))

      return {
        id: c.CodCli,
        nome: c.Cliente || 'Cuidador(a)',
        avatarSrc: c.Caminho || null,
        plantoes: datasUnicas,
        proximoPlantao: datasUnicas[0] || null,
      }
    })

    // Mapa dia a dia para auto-seleção rápida: dataKey (YYYY-MM-DD) -> Cuidador
    const mapaPlantoes = escalasFuturas
      .filter((e) => e.Data && e.CodInd && cuidadoresMap.has(e.CodInd))
      .map((e) => {
        const d = e.Data as Date
        const dataKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const cuidador = cuidadoresMap.get(e.CodInd!)!
        return {
          dataIso: d.toISOString(),
          dataKey,
          cuidadorId: cuidador.CodCli,
          cuidadorNome: cuidador.Cliente || 'Cuidador(a)',
          avatarSrc: cuidador.Caminho || null,
        }
      })

    return NextResponse.json({
      sucesso: true,
      cuidadores: cuidadoresResultado,
      mapaPlantoes,
    })
  } catch (error) {
    console.error('[CUIDADORES ATIVOS] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
