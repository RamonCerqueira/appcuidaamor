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

    const { paciente, codClisPacientes } = familia

    const codCliPaciente = paciente.CodCli
    const nomePaciente = paciente.Cliente || paciente.Razao || 'Paciente'

    const cliPaciente = await prisma.cLIENTEs.findUnique({
      where: { CodCli: codCliPaciente },
      select: {
        Peso: true,
        Altura: true,
        CodSeg: true,
      },
    })

    const pesoPaciente = cliPaciente?.Peso ? String(cliPaciente.Peso).trim() : null
    const alturaPaciente = cliPaciente?.Altura ? String(cliPaciente.Altura).trim() : null
    const codSegPaciente = cliPaciente?.CodSeg ? String(cliPaciente.CodSeg).trim() : null

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
