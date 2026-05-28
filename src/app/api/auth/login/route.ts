import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const encoder = new TextEncoder()

export async function POST(request: NextRequest) {
  try {
    const { cpf, senha } = await request.json()

    if (!cpf || !senha) {
      return NextResponse.json({ sucesso: false, mensagem: 'CPF e senha obrigatórios' }, { status: 400 })
    }

    // Retira pontuação do CPF recebido e zeros à esquerda
    const cleanCpf = cpf.replace(/[^\d]/g, '').replace(/^0+/, '');

    // Busca o cliente pelo CPF usando partes do CPF para contornar formatações diferentes no banco (ex: pontos e traços)
    // Buscamos por clientes que tenham um trecho de 3 ou mais números do CPF
    const searchPart = cleanCpf.length > 5 ? cleanCpf.substring(1, 4) : cleanCpf;
    
    const clientes = await prisma.cLIENTEs.findMany({
      where: {
        CPF: { contains: searchPart }
      }
    })

    // Filtra exatamente o cliente removendo pontuações e zeros à esquerda dos resultados do banco
    const cliente = clientes.find(c => {
      if (!c.CPF) return false;
      const dbCpfClean = c.CPF.replace(/[^\d]/g, '').replace(/^0+/, '');
      return dbCpfClean === cleanCpf;
    })

    if (!cliente || !cliente.CodUsu) {
      return NextResponse.json({ sucesso: false, mensagem: 'Cliente não encontrado ou sem usuário vinculado' }, { status: 401 })
    }

    // Busca a senha associada ao CodUsu
    const dbSenha = await prisma.senha.findUnique({
      where: { CodUsu: cliente.CodUsu }
    })

    let senhaValida = false
    if (dbSenha && dbSenha.Senha) {
      const senhaBanco = dbSenha.Senha.trim()
      if (senhaBanco === senha || (senhaBanco.length === 4 && senha.startsWith(senhaBanco))) {
        senhaValida = true
      }
    }

    if (!senhaValida) {
      return NextResponse.json({ sucesso: false, mensagem: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = await new jose.SignJWT({ 
        id: cliente.CodCli, 
        nome: cliente.Cliente || cliente.Razao,
        codUsu: cliente.CodUsu 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(encoder.encode(JWT_SECRET))

    const response = NextResponse.json({
      sucesso: true,
      user: {
        id: cliente.CodCli,
        nome: cliente.Cliente || cliente.Razao
      }
    })

    response.cookies.set({
      name: 'mobile_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })

    return response
  } catch (error: any) {
    console.error('Erro no login mobile:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
