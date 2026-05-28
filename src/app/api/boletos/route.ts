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

    // 1. Busca os dados do Contratante para obter o CPF
    const clienteLogado = await prisma.cLIENTEs.findUnique({
      where: { CodCli: responsavelId },
      select: { CPF: true, Cliente: true }
    });

    const cpfResponsavel = clienteLogado?.CPF;

    // TODO: Integração REAL com a API da Caixa
    // Quando o cliente passar o Client_ID e o Certificado da Caixa, usaremos o cpfResponsavel
    // para bater na rota de consulta de boletos da Caixa Econômica Federal.
    // 
    // Exemplo do que será feito:
    // const responseCaixa = await fetch(`https://api.caixa.gov.br/.../boletos?cpf=${cpfResponsavel}`, { ... })
    // const dadosCaixa = await responseCaixa.json()

    // 2. MOCK: Estrutura simulando o retorno exato que a API da Caixa nos dará
    const abertos = [
      {
        Numero: '1049012345',
        Valor: 1500.00,
        Vencimento: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Vence em 5 dias
        Status: 'A',
        LinhaDigitavel: '10490.12345 67890.123456 78901.234567 8 99990000150000',
        LinkBoleto: 'https://boletos.caixa.gov.br/visualiza/boleto_mock_pdf.pdf' // Link simulado que a Caixa retorna
      }
    ];

    const historico = [
      {
        ValorPago: 1500.00,
        Vencimento: new Date(new Date().getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        Status: 'P'
      }
    ];

    return NextResponse.json({ 
      sucesso: true, 
      abertos,
      historico
    })
  } catch (error) {
    console.error('Erro ao buscar boletos:', error)
    return NextResponse.json({ sucesso: false, mensagem: 'Erro interno' }, { status: 500 })
  }
}
