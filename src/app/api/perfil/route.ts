/**
 * GET /api/perfil
 *
 * CORREÇÕES APLICADAS:
 * - P3.1: Usa verifyToken() centralizado
 * - P3.3: Select explícito — evita retornar dados desnecessários do banco
 * - Segurança: CPF mascarado é feito no servidor, não no cliente
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

    // Busca contratante e pacientes em paralelo
    const [contratante, pacientes] = await Promise.all([
      prisma.cLIENTEs.findUnique({
        where: { CodCli: responsavelId },
        select: {
          CodCli: true,
          Cliente: true,
          Razao: true,
          CPF: true,
          EMail: true,
          Situacao: true,
        },
      }),
      prisma.cLIENTEs.findMany({
        where: { CodCli1: responsavelId },
        select: { Cliente: true },
      }),
    ])

    if (!contratante) {
      return NextResponse.json({ sucesso: false, mensagem: 'Perfil não localizado.' }, { status: 404 })
    }

    // Máscara do CPF realizada no servidor (P0.6 mitigação parcial)
    let cpfMascarado = '***.***.***-**'
    if (contratante.CPF) {
      const cleanCpf = contratante.CPF.replace(/\D/g, '')
      if (cleanCpf.length >= 10) {
        cpfMascarado = `${cleanCpf.substring(0, 3)}.***.***-${cleanCpf.substring(cleanCpf.length - 2)}`
      }
    }

    return NextResponse.json({
      sucesso: true,
      perfil: {
        id: contratante.CodCli,
        nome: contratante.Cliente || contratante.Razao || '',
        pacienteVinculado: pacientes.length > 0 ? pacientes[0].Cliente : null,
        cpf: cpfMascarado,
        email: contratante.EMail || null,
        ativo: contratante.Situacao !== 'I',
      },
    })
  } catch (error) {
    console.error('[PERFIL] Erro:', error instanceof Error ? error.message : error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno do servidor.' }, { status: 500 })
  }
}
