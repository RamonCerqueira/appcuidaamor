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

    // Busca os Pacientes Vinculados (Idosos)
    const pacientesVinculados = await prisma.cLIENTEs.findMany({
      where: { CodCli1: responsavelId },
      select: { CodCli: true }
    })

    if (pacientesVinculados.length === 0) {
      return NextResponse.json({ sucesso: true, ficha: null, medicamentos: [] })
    }

    const codCliPaciente = pacientesVinculados[0].CodCli

    // Busca todas as fichas de anamnese do paciente para montar o histórico de evolução
    const fichas = await prisma.fichaAnamnese.findMany({
      where: { CodCli: codCliPaciente },
      orderBy: { DataCriacao: 'desc' },
      include: {
        FichaAnamnese_Medicamento: true
      }
    })

    return NextResponse.json({ 
      sucesso: true, 
      fichas: fichas
    })
  } catch (error) {
    console.error('Erro ao buscar quadro de saúde:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
