/**
 * GET /api/notificacoes
 *
 * Gera a central de notificações dinâmica calculada em tempo real com base nos
 * dados reais do paciente/contratante (Plantões, Escala, Prontuário, Pedidos, Faturas).
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface NotificacaoItem {
  id: string
  tipo: 'cuidado' | 'escala' | 'saude' | 'pedidos' | 'financeiro' | 'geral'
  titulo: string
  descricao: string
  data: string
  tempoRelativo: string
  prioridade: 'urgente' | 'alta' | 'normal'
  link: string
  lida?: boolean
}

function formatTempoRelativo(data: Date): string {
  const agora = new Date()
  const diffMs = agora.getTime() - data.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMin < 5) return 'Agora mesmo'
  if (diffMin < 60) return `Há ${diffMin} min`
  if (diffHoras < 24) return `Hoje às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  if (diffDias === 1) return `Ontem às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  if (diffDias < 7) return `Há ${diffDias} dias`
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const responsavelId = auth.id

    // 1. Localiza o contratante e seus pacientes assistidos
    const [responsavel, pacientesVinculados] = await Promise.all([
      prisma.cLIENTEs.findUnique({
        where: { CodCli: responsavelId },
        select: { CodCli: true, Cliente: true, Razao: true },
      }),
      prisma.cLIENTEs.findMany({
        where: { CodCli1: responsavelId },
        select: { CodCli: true, Cliente: true, Razao: true },
      }),
    ])

    const pacientePrincipal = pacientesVinculados.length > 0 ? pacientesVinculados[0] : responsavel
    const pacienteCodCli = pacientePrincipal?.CodCli || responsavelId
    const nomePaciente = pacientePrincipal?.Cliente || 'seu familiar'

    const agora = new Date()
    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0)
    const fimHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59)

    // 2. Busca paralela de todos os dados do ecossistema
    const [servicos, fichasAnamnese, pedidosVale, solicitacoesCupom, boletosReceber] = await Promise.all([
      // Serviços do paciente
      prisma.servico.findMany({
        where: { Codcli: pacienteCodCli },
        select: { Pedido: true, HoraInicio: true, HoraSaida: true },
      }),
      // Prontuários médicos
      prisma.fichaAnamnese.findMany({
        where: { CodCli: pacienteCodCli },
        orderBy: { DataCriacao: 'desc' },
        take: 3,
        include: {
          FichaAnamnese_Medicamento: {
            select: { MedicamentoId: true, Nome: true, Dose: true, Horarios: true },
          },
        },
      }),
      // Solicitações gerais do app (Vale1)
      prisma.vale1.findMany({
        where: {
          Grupo: 'APP_CLIENTE',
          Observacao: { contains: `CodCli: ${responsavelId}` },
        },
        orderBy: { DataSolicitacao: 'desc' },
        take: 5,
        select: {
          Lanc: true,
          Descricao: true,
          Status: true,
          DataSolicitacao: true,
        },
      }),
      // Solicitações de escala (Cupom)
      prisma.cupom.findMany({
        where: { Indice: responsavelId },
        orderBy: { Data: 'desc' },
        take: 5,
        select: {
          Lanc: true,
          Cupom: true,
          Status: true,
          Data: true,
          RespostaAdmin: true,
        },
      }),
      // Faturas pendentes
      prisma.receber.findMany({
        where: {
          CodCli: responsavelId,
          OR: [{ Status: null }, { Status: { in: ['A', 'E'] } }],
        },
        take: 3,
        select: {
          Lanc: true,
          Valor: true,
          Vencimento: true,
          Status: true,
        },
      }),
    ])

    const notificacoes: NotificacaoItem[] = []

    // ─── A. NOTIFICAÇÕES DE CUIDADO E PLANTÃO DE HOJE ───────────────────
    if (servicos.length > 0) {
      const pedidosIds = servicos
        .map((s) => s.Pedido)
        .filter((p): p is number => typeof p === 'number')

      const pedidosMap = new Map<number, { inicio: string | null; saida: string | null }>()
      for (const s of servicos) {
        if (typeof s.Pedido === 'number') {
          pedidosMap.set(s.Pedido, { inicio: s.HoraInicio, saida: s.HoraSaida })
        }
      }

      // Plantão de hoje
      const plantoesHoje = await prisma.servico1.findMany({
        where: {
          Pedido: { in: pedidosIds },
          Data: { gte: inicioHoje, lte: fimHoje },
          CodInd: { not: null },
        },
        select: { Lanc: true, CodInd: true, Situacao: true, Pedido: true, Data: true },
        take: 2,
      })

      if (plantoesHoje.length > 0 && typeof plantoesHoje[0].CodInd === 'number') {
        const cuidador = await prisma.cLIENTEs.findUnique({
          where: { CodCli: plantoesHoje[0].CodInd },
          select: { Cliente: true },
        })

        const horario = typeof plantoesHoje[0].Pedido === 'number'
          ? pedidosMap.get(plantoesHoje[0].Pedido)
          : null

        const nomeCuidador = cuidador?.Cliente || 'Cuidador(a) Escalado(a)'
        const inicioStr = horario?.inicio || '07:00'
        const saidaStr = horario?.saida || '19:00'

        notificacoes.push({
          id: `plantao-hoje-${plantoesHoje[0].Lanc}`,
          tipo: 'cuidado',
          titulo: 'Plantão em Andamento Hoje',
          descricao: `${nomeCuidador} está prestando assistência a ${nomePaciente} no horário das ${inicioStr} às ${saidaStr}.`,
          data: (plantoesHoje[0].Data || agora).toISOString(),
          tempoRelativo: formatTempoRelativo(plantoesHoje[0].Data || agora),
          prioridade: 'alta',
          link: '/',
        })
      }

      // Próximos plantões futuros (a partir de amanhã)
      const dataAmanha = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 0, 0, 0)
      const dataLimite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 7, 23, 59, 59)

      const proximosPlantoes = await prisma.servico1.findMany({
        where: {
          Pedido: { in: pedidosIds },
          Data: { gte: dataAmanha, lte: dataLimite },
          CodInd: { not: null },
        },
        orderBy: { Data: 'asc' },
        select: { Lanc: true, CodInd: true, Data: true, Situacao: true, Pedido: true },
        take: 2,
      })

      if (proximosPlantoes.length > 0 && typeof proximosPlantoes[0].CodInd === 'number') {
        const cuidadorProximo = await prisma.cLIENTEs.findUnique({
          where: { CodCli: proximosPlantoes[0].CodInd },
          select: { Cliente: true },
        })

        const dataFormatada = proximosPlantoes[0].Data
          ? new Date(proximosPlantoes[0].Data).toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            })
          : 'próximo dia'

        notificacoes.push({
          id: `plantao-proximo-${proximosPlantoes[0].Lanc}`,
          tipo: 'escala',
          titulo: 'Próximo Plantão Confirmado',
          descricao: `Plantão agendado para ${dataFormatada} com ${cuidadorProximo?.Cliente || 'Cuidador Escalado'}.`,
          data: (proximosPlantoes[0].Data || agora).toISOString(),
          tempoRelativo: formatTempoRelativo(proximosPlantoes[0].Data || agora),
          prioridade: 'normal',
          link: '/escala',
        })
      }
    }

    // ─── B. NOTIFICAÇÕES DE PRONTUÁRIO & SAÚDE ─────────────────────────
    if (fichasAnamnese.length > 0) {
      const fichaMaisRecente = fichasAnamnese[0]
      const dataFicha = fichaMaisRecente.DataCriacao ? new Date(fichaMaisRecente.DataCriacao) : agora
      const score = fichaMaisRecente.ScoreSaude || 85
      const medCount = fichaMaisRecente.FichaAnamnese_Medicamento?.length || 0

      notificacoes.push({
        id: `prontuario-${fichaMaisRecente.AnamneseId}`,
        tipo: 'saude',
        titulo: 'Boletim de Saúde Atualizado',
        descricao: `Prontuário de ${nomePaciente} atualizado pela equipe de enfermagem. Vitalidade: ${score}% (${medCount} medicamentos ativos).`,
        data: dataFicha.toISOString(),
        tempoRelativo: formatTempoRelativo(dataFicha),
        prioridade: 'normal',
        link: '/quadro',
      })
    }

    // ─── C. NOTIFICAÇÕES DE SOLICITAÇÕES DO APP ────────────────────────
    for (const pedido of pedidosVale) {
      const dataPed = pedido.DataSolicitacao ? new Date(pedido.DataSolicitacao) : agora
      const statusDesc = pedido.Status || 'Em análise'

      notificacoes.push({
        id: `pedido-vale-${pedido.Lanc}`,
        tipo: 'pedidos',
        titulo: `Solicitação #${pedido.Lanc}`,
        descricao: `Seu pedido "${pedido.Descricao}" está com status: ${statusDesc}.`,
        data: dataPed.toISOString(),
        tempoRelativo: formatTempoRelativo(dataPed),
        prioridade: statusDesc.toLowerCase().includes('conclu') ? 'alta' : 'normal',
        link: '/pedidos',
      })
    }

    for (const cupom of solicitacoesCupom) {
      const dataCupom = cupom.Data ? new Date(cupom.Data) : agora
      const statusCupom = cupom.Status || 'Em Análise'
      const nomeCupom = cupom.Cupom || 'Escala'

      notificacoes.push({
        id: `pedido-cupom-${cupom.Lanc}`,
        tipo: 'pedidos',
        titulo: `Solicitação de Escala: ${nomeCupom}`,
        descricao: cupom.RespostaAdmin
          ? `Resposta da equipe: "${cupom.RespostaAdmin}"`
          : `Solicitação de ${nomeCupom.toLowerCase()} registrada com sucesso (${statusCupom}).`,
        data: dataCupom.toISOString(),
        tempoRelativo: formatTempoRelativo(dataCupom),
        prioridade: cupom.RespostaAdmin ? 'alta' : 'normal',
        link: '/pedidos',
      })
    }

    // ─── D. NOTIFICAÇÕES FINANCEIRAS ───────────────────────────────────
    if (boletosReceber.length > 0) {
      const fatura = boletosReceber[0]
      const dataVenc = fatura.Vencimento ? new Date(fatura.Vencimento) : null
      const valorFormatado = typeof fatura.Valor === 'number'
        ? fatura.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : 'Disponível'

      const vencimentoTexto = dataVenc
        ? `com vencimento em ${dataVenc.toLocaleDateString('pt-BR')}`
        : 'disponível para conferência'

      notificacoes.push({
        id: `financeiro-${fatura.Lanc}`,
        tipo: 'financeiro',
        titulo: 'Fatura Mensal Disponível',
        descricao: `Fatura no valor de ${valorFormatado} ${vencimentoTexto}. Acesse para consultar detalhes.`,
        data: agora.toISOString(),
        tempoRelativo: 'Hoje',
        prioridade: 'alta',
        link: '/boletos',
      })
    } else {
      // Notificação de conformidade financeira
      notificacoes.push({
        id: 'financeiro-ok',
        tipo: 'financeiro',
        titulo: 'Situação Financeira em Dia',
        descricao: 'Nenhuma pendência financeira encontrada para seu contrato de assistência.',
        data: agora.toISOString(),
        tempoRelativo: 'Recente',
        prioridade: 'normal',
        link: '/boletos',
      })
    }

    // ─── E. COMUNICADO INSTITUCIONAL DE ACOLHIMENTO ────────────────────
    notificacoes.push({
      id: 'comunicado-suporte-24h',
      tipo: 'geral',
      titulo: 'Suporte e Supervisão de Enfermagem 24h',
      descricao: 'Nossa central de coordenação técnica está à sua disposição 24 horas por dia para esclarecer dúvidas.',
      data: agora.toISOString(),
      tempoRelativo: 'Permanente',
      prioridade: 'normal',
      link: '/suporte',
    })

    // Ordenação por relevância e data
    const prioridadePeso = { urgente: 3, alta: 2, normal: 1 }
    notificacoes.sort((a, b) => {
      const pesoDiff = prioridadePeso[b.prioridade] - prioridadePeso[a.prioridade]
      if (pesoDiff !== 0) return pesoDiff
      return new Date(b.data).getTime() - new Date(a.data).getTime()
    })

    return NextResponse.json({
      sucesso: true,
      total: notificacoes.length,
      notificacoes,
    })
  } catch (error) {
    console.error('[NOTIFICACOES] Erro ao carregar:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro ao processar notificações.' }, { status: 500 })
  }
}
