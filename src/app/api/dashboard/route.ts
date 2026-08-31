/**
 * GET /api/dashboard
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const responsavelId = auth.id

    // Busca responsável e pacientes em paralelo
    const [responsavel, pacientesVinculados] = await Promise.all([
      prisma.cLIENTEs.findUnique({
        where: { CodCli: responsavelId },
        select: { CodCli: true, CodCli1: true, Cliente: true, Razao: true, Situacao: true, Caminho: true },
      }),
      prisma.cLIENTEs.findMany({
        where: { CodCli1: responsavelId },
        select: { CodCli: true, Cliente: true, Razao: true, Caminho: true },
      }),
    ])

    if (!responsavel) {
      return NextResponse.json({ sucesso: false, mensagem: 'Perfil não encontrado.' }, { status: 404 })
    }

    const pacientePrincipal = pacientesVinculados.length > 0 ? pacientesVinculados[0] : responsavel
    const listaPacientes = pacientesVinculados.length > 0 ? pacientesVinculados : [responsavel]

    const hoje = new Date()
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)

    // Busca serviços, boletos pendentes e ficha mais recente do paciente em paralelo
    const [servicosDoPaciente, boletosPendentes, fichaRecente] = await Promise.all([
      prisma.servico.findMany({
        where: { Codcli: pacientePrincipal.CodCli },
        select: { Pedido: true, HoraInicio: true, HoraSaida: true },
      }),
      prisma.receber.count({
        where: {
          CodCli: responsavelId,
          OR: [{ Status: null }, { Status: { in: ['A', 'E'] } }],
        },
      }),
      prisma.fichaAnamnese.findFirst({
        where: { CodCli: pacientePrincipal.CodCli },
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
      paciente: pacientePrincipal,
      pacientes: listaPacientes,
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
