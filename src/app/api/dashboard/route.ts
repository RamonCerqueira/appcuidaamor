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

    // 1. Busca o Responsável (Contratante)
    const responsavel = await prisma.cLIENTEs.findUnique({
      where: { CodCli: responsavelId }
    })

    if (!responsavel) {
      return NextResponse.json({ sucesso: false, mensagem: 'Responsável não encontrado' }, { status: 404 })
    }

    // 2. Busca os Pacientes Vinculados (Idosos)
    const pacientesVinculados = await prisma.cLIENTEs.findMany({
      where: { CodCli1: responsavelId },
      select: { CodCli: true, Cliente: true, Razao: true, Caminho: true }
    })

    // Se não tiver paciente vinculado, retorna aviso mas não falha
    if (pacientesVinculados.length === 0) {
      return NextResponse.json({
        sucesso: true,
        responsavel,
        pacientes: [],
        cuidadorHoje: null,
        boletosPendentes: 0
      })
    }

    // Vamos usar o primeiro paciente como principal (futuramente o app pode ter seletor)
    const pacientePrincipal = pacientesVinculados[0]

    // 3. Busca o Cuidador de Hoje (Tabela Servico -> Servico1)
    const hoje = new Date()
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)
    
    // Primeiro encontra todos os pedidos atrelados a este paciente
    const servicosDoPaciente = await prisma.servico.findMany({
      where: { Codcli: pacientePrincipal.CodCli },
      select: { Pedido: true, HoraInicio: true, HoraSaida: true }
    });

    let cuidadorHoje = null;

    if (servicosDoPaciente.length > 0) {
      const pedidosMap = new Map();
      servicosDoPaciente.forEach((s: any) => {
        pedidosMap.set(s.Pedido, { inicio: s.HoraInicio, saida: s.HoraSaida })
      });
      const pedidos = servicosDoPaciente.map((s: any) => s.Pedido);

      const plantoesHoje = await prisma.servico1.findMany({
        where: {
          Pedido: { in: pedidos },
          Data: { gte: inicioDoDia, lt: fimDoDia }
        },
        orderBy: { Data: 'asc' }
      });

      if (plantoesHoje.length > 0 && plantoesHoje[0].CodInd) {
        // Busca o nome do cuidador a partir do CodInd
        const cuidadorData = await prisma.cLIENTEs.findUnique({
          where: { CodCli: plantoesHoje[0].CodInd },
          select: { Cliente: true }
        });
        
        const horarioPedido = pedidosMap.get(plantoesHoje[0].Pedido);

        cuidadorHoje = {
          Nome: cuidadorData?.Cliente || 'Cuidador Escalado',
          HoraInicio: horarioPedido?.inicio || '00:00',
          HoraSaida: horarioPedido?.saida || '23:59',
          Status: plantoesHoje[0].Situacao || 'AGENDADO'
        }
      }
    }

    // 4. Busca Boletos Pendentes do Contratante (Onde CodCli = ID do Responsável)
    const boletosPendentes = await prisma.receber.count({
      where: {
        CodCli: responsavelId,
        OR: [
          { Status: null },
          { Status: { in: ['A', 'E'] } }
        ]
      }
    })

    return NextResponse.json({
      sucesso: true,
      responsavel,
      paciente: pacientePrincipal,
      pacientes: pacientesVinculados,
      cuidadorHoje,
      notificacoes: {
        boletosPendentes
      }
    })
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
