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

    const contratante = await prisma.cLIENTEs.findUnique({
      where: { CodCli: responsavelId },
      select: {
        CodCli: true,
        Cliente: true,
        Razao: true,
        CPF: true,
        EMail: true,
        Situacao: true
      }
    })

    if (!contratante) {
      return NextResponse.json({ sucesso: false, mensagem: 'Perfil não localizado.' }, { status: 404 })
    }

    const pacientes = await prisma.cLIENTEs.findMany({
      where: { CodCli1: responsavelId },
      select: { Cliente: true }
    })
    
    return NextResponse.json({
      sucesso: true,
      perfil: {
        id: contratante.CodCli,
        nome: contratante.Cliente || contratante.Razao || 'Família Silva',
        pacienteVinculado: pacientes.length > 0 ? pacientes[0].Cliente : 'Nenhum paciente vinculado',
        cpf: contratante.CPF || '***.***.***-**',
        email: contratante.EMail || 'atendimento@cuidaeamor.com.br',
        ativo: contratante.Situacao !== 'I' // Situação ativa se não for inativo
      }
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
