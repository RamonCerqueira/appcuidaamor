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
      return NextResponse.json({ sucesso: false, mensagem: 'Perfil não encontrado.' }, { status: 404 })
    }

    const { responsavel, paciente, pacientes, codClisPacientes, codClisResponsaveis } = familia

    const hoje = new Date()
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)

    // Busca serviços, boletos pendentes e ficha mais recente do paciente em paralelo
    const [servicosDoPaciente, boletosPendentes, fichaRecente] = await Promise.all([
      prisma.servico.findMany({
        where: { Codcli: { in: codClisPacientes } },
        select: { Pedido: true, HoraInicio: true, HoraSaida: true },
      }),
      prisma.receber.count({
        where: {
          CodCli: { in: codClisResponsaveis },
          OR: [{ Status: null }, { Status: { in: ['A', 'E'] } }],
        },
      }),
      prisma.fichaAnamnese.findFirst({
        where: { CodCli: { in: codClisPacientes } },
        orderBy: { DataCriacao: 'desc' },
        select: { ScoreSaude: true, DataCriacao: true },
      }),
    ])

    let cuidadorHoje = null

    if (servicosDoPaciente.length > 0) {
      const pedidosMap = new Map<number, { inicio: string | null; saida: string | null }>()
      for (const s of servicosDoPaciente) {
        if (typeof s.Pedido === 'number') {
          pedidosMap.set(s.Pedido, { inicio: s.HoraInicio, saida: s.HoraSaida })
        }
      }
      const pedidos = servicosDoPaciente.map((s) => s.Pedido).filter((p): p is number => typeof p === 'number')

      const plantoesHoje = await prisma.servico1.findMany({
        where: {
          Pedido: { in: pedidos },
          Data: { gte: inicioDoDia, lt: fimDoDia },
          CodInd: { not: null },
        },
        orderBy: { Data: 'asc' },
        select: { CodInd: true, Situacao: true, Pedido: true },
        take: 1,
      })

      if (plantoesHoje.length > 0 && typeof plantoesHoje[0].CodInd === 'number') {
        const cuidadorData = await prisma.cLIENTEs.findUnique({
          where: { CodCli: plantoesHoje[0].CodInd },
          select: { Cliente: true },
        })

        const horarioPedido = typeof plantoesHoje[0].Pedido === 'number'
          ? pedidosMap.get(plantoesHoje[0].Pedido)
          : null

        cuidadorHoje = {
          Nome: cuidadorData?.Cliente || 'Cuidador Escalado',
          HoraInicio: horarioPedido?.inicio || '07:00',
          HoraSaida: horarioPedido?.saida || '19:00',
          Status: plantoesHoje[0].Situacao || 'AGENDADO',
        }
      }
    }

    // Score de Vitalidade e data da última evolução clínica
    const scoreVitalidade = fichaRecente?.ScoreSaude ?? null
    const ultimaEvolucao = fichaRecente?.DataCriacao
      ? fichaRecente.DataCriacao.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }) + ' às ' + fichaRecente.DataCriacao.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : null

    return NextResponse.json({
      sucesso: true,
      responsavel,
      paciente,
      pacientes,
      cuidadorHoje,
      notificacoes: { boletosPendentes },
      scoreVitalidade,
      ultimaEvolucao,
    })
  } catch (error) {
    console.error('[DASHBOARD] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
