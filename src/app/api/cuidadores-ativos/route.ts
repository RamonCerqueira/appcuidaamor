/**
 * GET /api/cuidadores-ativos
 *
 * CORREÇÕES APLICADAS:
 * - P3.1: Usa verifyToken() centralizado
 * - P3.3: Select explícito
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

    const pacientesVinculados = await prisma.cLIENTEs.findMany({
      where: { CodCli1: responsavelId },
      select: { CodCli: true },
    })

    if (pacientesVinculados.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    const pacientePrincipal = pacientesVinculados[0]

    const servicosDoPaciente = await prisma.servico.findMany({
      where: { Codcli: pacientePrincipal.CodCli },
      select: { Pedido: true },
    })

    const pedidos = servicosDoPaciente.map((s) => s.Pedido)

    if (pedidos.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    // Busca escalas futuras com CodInd definido
    const escalasFuturas = await prisma.servico1.findMany({
      where: {
        Pedido: { in: pedidos },
        Data: { gte: hoje },
        CodInd: { not: null },
      },
      select: { CodInd: true, Data: true },
      orderBy: { Data: 'asc' },
      take: 200, // Limita para não sobrecarregar
    })

    const codigosCuidadores = Array.from(
      new Set(escalasFuturas.map((e) => e.CodInd).filter((id): id is number => id !== null))
    )

    if (codigosCuidadores.length === 0) {
      return NextResponse.json({ sucesso: true, cuidadores: [] })
    }

    const cuidadoresAtivos = await prisma.cLIENTEs.findMany({
      where: { CodCli: { in: codigosCuidadores } },
      select: { CodCli: true, Cliente: true },
    })

    const resultado = cuidadoresAtivos.map((c) => {
      const datasBrutas = escalasFuturas
        .filter((e) => e.CodInd === c.CodCli && e.Data)
        .map((e) => (e.Data as Date).toISOString())

      const datasUnicas = Array.from(new Set(datasBrutas))

      return {
        id: c.CodCli,
        nome: c.Cliente,
        plantoes: datasUnicas,
      }
    })

    return NextResponse.json({ sucesso: true, cuidadores: resultado })
  } catch (error) {
    console.error('[CUIDADORES ATIVOS] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
