import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { resolverFamilia } from '@/lib/paciente'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(request)
    if (!auth) {
      return NextResponse.json({ sucesso: false, mensagem: 'Não autorizado.' }, { status: 401 })
    }

    const familia = await resolverFamilia(auth.id)
    if (!familia) {
      return NextResponse.json({ sucesso: false, mensagem: 'Perfil não localizado.' }, { status: 404 })
    }

    const { responsavel, paciente, pacientes } = familia

    let cpfMascarado = '***.***.***-**'
    if (responsavel.CPF) {
      const cleanCpf = responsavel.CPF.replace(/\D/g, '')
      if (cleanCpf.length >= 10) {
        cpfMascarado = `${cleanCpf.substring(0, 3)}.***.***-${cleanCpf.substring(cleanCpf.length - 2)}`
      }
    }

    const nomePacienteVinculado =
      paciente && paciente.CodCli !== responsavel.CodCli
        ? paciente.Cliente || paciente.Razao
        : pacientes.find((p) => p.CodCli !== responsavel.CodCli)?.Cliente || null

    return NextResponse.json({
      sucesso: true,
      perfil: {
        id: responsavel.CodCli,
        nome: responsavel.Cliente || responsavel.Razao || 'Familiar Responsável',
        pacienteVinculado: nomePacienteVinculado || paciente?.Cliente || 'Assistência Familiar',
        pacienteId: paciente.CodCli,
        cpf: cpfMascarado,
        email: responsavel.EMail || null,
        ativo: responsavel.Situacao !== 'I',
      },
    })
  } catch (error) {
    console.error('[PERFIL] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
