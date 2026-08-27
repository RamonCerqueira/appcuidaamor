/**
 * GET /api/quadro
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
      select: { CodCli: true, Cliente: true },
    })

    let codCliPaciente = responsavelId
    let nomePaciente = auth.nome

    if (pacientesVinculados.length > 0) {
      codCliPaciente = pacientesVinculados[0].CodCli
      nomePaciente = pacientesVinculados[0].Cliente || auth.nome
    } else {
      const cli = await prisma.cLIENTEs.findUnique({
        where: { CodCli: responsavelId },
        select: { Cliente: true },
      })
      if (cli?.Cliente) nomePaciente = cli.Cliente
    }

    const fichas = await prisma.fichaAnamnese.findMany({
      where: { CodCli: codCliPaciente },
      orderBy: { DataCriacao: 'desc' },
      include: {
        FichaAnamnese_Medicamento: {
          select: {
            MedicamentoId: true,
            AnamneseId: true,
            Nome: true,
            Dose: true,
            Horarios: true,
            Motivo: true,
          },
        },
      },
      take: 10,
    })

    return NextResponse.json({
      sucesso: true,
      paciente: { nome: nomePaciente },
      fichas,
    })
  } catch (error) {
    console.error('[QUADRO] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
