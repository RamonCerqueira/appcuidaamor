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

    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    const hoje = new Date()
    const year = yearParam ? parseInt(yearParam, 10) : hoje.getFullYear()
    const month = monthParam ? parseInt(monthParam, 10) : hoje.getMonth()

    if (isNaN(year) || isNaN(month) || month < 0 || month > 11 || year < 2000 || year > 2100) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'Parâmetros de data inválidos.' },
        { status: 400 }
      )
    }

    const dataInicio = new Date(year, month, 1)
    const dataFim = new Date(year, month + 1, 0, 23, 59, 59)

    const familia = await resolverFamilia(auth.id)
    if (!familia) {
      return NextResponse.json({ sucesso: false, mensagem: 'Perfil não localizado.' }, { status: 404 })
    }

    const { responsavel, paciente, codClisPacientes } = familia

    // Busca serviços dos pacientes vinculados
    const servicosDoPaciente = await prisma.servico.findMany({
      where: { Codcli: { in: codClisPacientes } },
      select: { Pedido: true, HoraInicio: true, HoraSaida: true },
    })

    if (servicosDoPaciente.length === 0) {
      return NextResponse.json({ sucesso: true, plantoes: [], responsavel: '', iniciais: '' })
    }

    const pedidosMap = new Map<number, { inicio: string | null; saida: string | null }>()
    for (const s of servicosDoPaciente) {
      if (typeof s.Pedido === 'number') {
        pedidosMap.set(s.Pedido, { inicio: s.HoraInicio, saida: s.HoraSaida })
      }
    }

    const pedidos = servicosDoPaciente.map((s) => s.Pedido).filter((p): p is number => typeof p === 'number')

    // 3. Busca plantões do mês
    const plantoesMes = await prisma.servico1.findMany({
      where: {
        Pedido: { in: pedidos },
        Data: { gte: dataInicio, lte: dataFim },
      },
      orderBy: { Data: 'asc' },
      select: {
        Lanc: true,
        Data: true,
        CodInd: true,
        Situacao: true,
        Pedido: true,
      },
    })

    const codigosCuidadores = Array.from(
      new Set(plantoesMes.map((p) => p.CodInd).filter((id): id is number => typeof id === 'number'))
    )

    const cuidadoresMap = new Map<number, string>()
    if (codigosCuidadores.length > 0) {
      const cuidadores = await prisma.cLIENTEs.findMany({
        where: { CodCli: { in: codigosCuidadores } },
        select: { CodCli: true, Cliente: true },
      })
      for (const c of cuidadores) {
        if (typeof c.CodCli === 'number') {
          cuidadoresMap.set(c.CodCli, c.Cliente || 'Cuidador Escalado')
        }
      }
    }

    // 4. Formata os plantões
    const plantoesFormatados = plantoesMes.map((plantao) => {
      const nomeCuidador = (plantao.CodInd !== null && plantao.CodInd !== undefined)
        ? (cuidadoresMap.get(plantao.CodInd) ?? 'Cuidador Escalado')
        : 'Cuidador Escalado'

      const horarioPedido = (plantao.Pedido !== null && plantao.Pedido !== undefined)
        ? pedidosMap.get(plantao.Pedido)
        : null

      return {
        id: plantao.Lanc,
        data: plantao.Data,
        horaInicio: horarioPedido?.inicio || '07:00',
        horaSaida: horarioPedido?.saida || '19:00',
        cuidador: nomeCuidador,
        status: plantao.Situacao || 'AGENDADO',
        pedido: plantao.Pedido,
      }
    })

    const nomeResponsavel = responsavel?.Cliente || responsavel?.Razao || 'Responsável'
    const iniciais = nomeResponsavel
      .split(' ')
      .filter(Boolean)
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CA'

    return NextResponse.json({
      sucesso: true,
      responsavel: nomeResponsavel,
      iniciais,
      plantoes: plantoesFormatados,
    })
  } catch (error) {
    console.error('[ESCALA] Erro ao buscar escalas:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
