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
      select: {
        CodCli: true,
        Cliente: true,
        Razao: true,
        Peso: true,
        Altura: true,
        CodSeg: true,
      },
    })

    let codCliPaciente = responsavelId
    let nomePaciente = auth.nome
    let pesoPaciente: string | null = null
    let alturaPaciente: string | null = null
    let codSegPaciente: string | null = null

    if (pacientesVinculados.length > 0) {
      const p = pacientesVinculados[0]
      codCliPaciente = p.CodCli
      nomePaciente = p.Cliente || p.Razao || auth.nome
      pesoPaciente = p.Peso ? String(p.Peso).trim() : null
      alturaPaciente = p.Altura ? String(p.Altura).trim() : null
      codSegPaciente = p.CodSeg ? String(p.CodSeg).trim() : null
    } else {
      const cli = await prisma.cLIENTEs.findUnique({
        where: { CodCli: responsavelId },
        select: {
          Cliente: true,
          Razao: true,
          Peso: true,
          Altura: true,
          CodSeg: true,
        },
      })
      if (cli) {
        if (cli.Cliente || cli.Razao) nomePaciente = cli.Cliente || cli.Razao || auth.nome
        pesoPaciente = cli.Peso ? String(cli.Peso).trim() : null
        alturaPaciente = cli.Altura ? String(cli.Altura).trim() : null
        codSegPaciente = cli.CodSeg ? String(cli.CodSeg).trim() : null
      }
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
      paciente: {
        codCli: codCliPaciente,
        nome: nomePaciente,
        peso: pesoPaciente,
        altura: alturaPaciente,
        codSeg: codSegPaciente,
      },
      fichas,
    })
  } catch (error) {
    console.error('[QUADRO] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
