/**
 * POST /api/auth/login
 *
 * SUPORTE A AUTENTICAÇÃO DUPLA ULTRA RESILIENTE:
 * 1. Senha cadastrada na tabela Senha (ERP)
 * 2. Data de Nascimento do Idoso / Paciente / Contratante (ex: 27/12/1940, 27121940, 27/12/40)
 *
 * Suporta anos com 4 dígitos (1940) ou 2 dígitos (40).
 * Suporta busca por CPF do Contratante ou do Idoso/Paciente.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken, AUTH_COOKIE } from '@/lib/auth'
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimiter'

function parseDateInput(input: string): { day: number; month: number; year: number; year2Digits: number } | null {
  if (!input) return null
  const trimmed = input.trim()

  // 1. Tenta dividir por delimitadores como "/", "-", ".", " " (ex: "27/12/1940", "5/3/62", "27.12.1940")
  const parts = trimmed.split(/[/.\-\s]+/).map((p) => p.trim()).filter(Boolean)
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      const day = parseInt(parts[2], 10)
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        return { day, month, year, year2Digits: year % 100 }
      }
    } else {
      // DD/MM/YYYY ou DD/MM/YY
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      let year = parseInt(parts[2], 10)
      if (year < 100) {
        year = year > 30 ? 1900 + year : 2000 + year
      }
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        return { day, month, year, year2Digits: year % 100 }
      }
    }
  }

  // 2. Extrai apenas dígitos contínuos (ignorando completamente barras e qualquer outro caractere)
  const clean = trimmed.replace(/\D/g, '')

  if (clean.length === 8) {
    // DDMMAAAA (ex: 27121940)
    const day = parseInt(clean.slice(0, 2), 10)
    const month = parseInt(clean.slice(2, 4), 10)
    const year = parseInt(clean.slice(4, 8), 10)
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return { day, month, year, year2Digits: year % 100 }
    }
  }

  if (clean.length === 7) {
    // D-MM-AAAA (ex: 5031962 -> 05/03/1962) ou DD-M-AAAA (ex: 2731962 -> 27/03/1962)
    // Tenta 1 dígito dia + 2 dígitos mês + 4 dígitos ano
    const d1 = parseInt(clean.slice(0, 1), 10)
    const m1 = parseInt(clean.slice(1, 3), 10)
    const y1 = parseInt(clean.slice(3, 7), 10)
    if (d1 >= 1 && d1 <= 9 && m1 >= 1 && m1 <= 12) {
      return { day: d1, month: m1, year: y1, year2Digits: y1 % 100 }
    }

    // Tenta 2 dígitos dia + 1 dígito mês + 4 dígitos ano
    const d2 = parseInt(clean.slice(0, 2), 10)
    const m2 = parseInt(clean.slice(2, 3), 10)
    const y2 = parseInt(clean.slice(3, 7), 10)
    if (d2 >= 1 && d2 <= 31 && m2 >= 1 && m2 <= 9) {
      return { day: d2, month: m2, year: y2, year2Digits: y2 % 100 }
    }
  }

  if (clean.length === 6) {
    // DDMMAA (ex: 271240)
    const day = parseInt(clean.slice(0, 2), 10)
    const month = parseInt(clean.slice(2, 4), 10)
    let year2Digits = parseInt(clean.slice(4, 6), 10)
    let fullYear = year2Digits > 30 ? 1900 + year2Digits : 2000 + year2Digits
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return { day, month, year: fullYear, year2Digits }
    }
  }

  if (clean.length === 4) {
    // DDMM (sem ano)
    const day = parseInt(clean.slice(0, 2), 10)
    const month = parseInt(clean.slice(2, 4), 10)
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return { day, month, year: 0, year2Digits: 0 }
    }
  }

  return null
}

function matchesBirthDate(
  dbDia: number | null | undefined,
  dbMes: number | null | undefined,
  dbAno: number | null | undefined,
  parsed: { day: number; month: number; year: number; year2Digits: number }
): boolean {
  if (!dbDia || !dbMes) return false
  if (dbDia !== parsed.day || dbMes !== parsed.month) return false

  // Se o banco não tem ano gravado ou o usuário não informou ano (year === 0), dia e mês são suficientes
  if (!dbAno || parsed.year === 0) return true

  const dbAnoNum = typeof dbAno === 'number' ? dbAno : parseInt(String(dbAno), 10)
  const dbAno2Digits = dbAnoNum % 100

  // Compara ano com 4 dígitos ou 2 dígitos (ex: 1940 vs 40)
  return (
    dbAnoNum === parsed.year ||
    dbAnoNum === parsed.year2Digits ||
    dbAno2Digits === parsed.year2Digits ||
    dbAnoNum + 1900 === parsed.year ||
    dbAnoNum + 2000 === parsed.year ||
    (dbAnoNum > 1900 && dbAnoNum - 1900 === parsed.year2Digits) ||
    (dbAnoNum > 2000 && dbAnoNum - 2000 === parsed.year2Digits)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cpf, senha } = body

    if (!cpf || !senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: 'CPF e data de nascimento ou senha são obrigatórios.' },
        { status: 400 }
      )
    }

    const rawDigits = String(cpf).replace(/\D/g, '')
    const cleanCpfWithZeros = rawDigits.padStart(11, '0')
    const cleanCpfNoZeros = rawDigits.replace(/^0+/, '')

    const rateLimitKey = `login:${cleanCpfWithZeros}`
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
      const minutos = Math.ceil((rateLimit.retryAfterSeconds || 900) / 60)
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: `Muitas tentativas de acesso. Aguarde ${minutos} minuto(s) e tente novamente.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 900),
          },
        }
      )
    }

    const parsedDate = parseDateInput(String(senha).trim())

    // Gera múltiplos fragmentos de busca para cobrir CPFs com 9, 10 ou 11 dígitos no banco
    const searchTokens: string[] = []
    if (cleanCpfNoZeros.length >= 5) searchTokens.push(cleanCpfNoZeros)
    if (cleanCpfWithZeros.length === 11) searchTokens.push(cleanCpfWithZeros)
    if (rawDigits.length >= 6) {
      searchTokens.push(rawDigits.slice(0, 6))
      searchTokens.push(rawDigits.slice(-6))
    }

    const orClauses: any[] = searchTokens.map((token) => ({
      CPF: { contains: token },
    }))

    // Se temos uma data de nascimento, inclui também busca direta pela data
    if (parsedDate) {
      orClauses.push({
        AND: [
          { Dia_Nasc: parsedDate.day },
          { Mes_Nasc: parsedDate.month },
        ],
      })
    }

    const candidatos = await prisma.cLIENTEs.findMany({
      where: {
        OR: orClauses,
      },
      select: {
        CodCli: true,
        CodCli1: true,
        Cliente: true,
        Razao: true,
        CPF: true,
        CodUsu: true,
        Dia_Nasc: true,
        Mes_Nasc: true,
        Ano_Nasc: true,
      },
      take: 50,
    })

    console.log(`[LOGIN ATTEMPT] CPF: ${cpf}, Senha/Data: ${senha}, Candidatos encontrados: ${candidatos.length}`)

    let clienteEncontrado: (typeof candidatos)[0] | null = null
    let credencialValida = false

    for (const c of candidatos) {
      const dbDigits = (c.CPF || '').replace(/\D/g, '')
      const dbNoZeros = dbDigits.replace(/^0+/, '')

      // Verifica se o CPF bate
      const cpfBate =
        dbDigits === rawDigits ||
        dbDigits === cleanCpfWithZeros ||
        dbNoZeros === cleanCpfNoZeros ||
        (rawDigits.length >= 6 && dbDigits.includes(rawDigits.slice(0, 6))) ||
        (cleanCpfNoZeros.length >= 6 && dbNoZeros.includes(cleanCpfNoZeros.slice(0, 6)))

      // 1. Testa validação por data de nascimento no próprio candidato
      if (parsedDate && matchesBirthDate(c.Dia_Nasc, c.Mes_Nasc, c.Ano_Nasc, parsedDate)) {
        if (cpfBate || candidatos.length <= 5) {
          clienteEncontrado = c
          credencialValida = true
          break
        }
      }

      // 2. Se o CPF bateu, testa se os pacientes vinculados têm essa data de nascimento
      if (cpfBate && parsedDate) {
        const vinculados = await prisma.cLIENTEs.findMany({
          where: {
            OR: [
              { CodCli1: c.CodCli },
              ...(c.CodCli1 ? [{ CodCli: c.CodCli1 }] : []),
            ],
          },
          select: {
            CodCli: true,
            Cliente: true,
            Dia_Nasc: true,
            Mes_Nasc: true,
            Ano_Nasc: true,
          },
        })

        for (const v of vinculados) {
          if (matchesBirthDate(v.Dia_Nasc, v.Mes_Nasc, v.Ano_Nasc, parsedDate)) {
            clienteEncontrado = c
            credencialValida = true
            break
          }
        }

        if (credencialValida) break
      }

      // 3. Validação por senha tradicional no ERP
      if (cpfBate && c.CodUsu) {
        const dbSenha = await prisma.senha.findUnique({
          where: { CodUsu: c.CodUsu },
          select: { Senha: true },
        })

        if (dbSenha?.Senha) {
          const senhaBanco = dbSenha.Senha.trim()
          const senhaEnviada = String(senha).trim()
          const cleanBanco = senhaBanco.replace(/\D/g, '')
          const cleanEnviada = senhaEnviada.replace(/\D/g, '')

          if (
            senhaBanco === senhaEnviada ||
            (cleanBanco.length >= 4 && cleanEnviada.length >= 4 && cleanBanco === cleanEnviada) ||
            (senhaBanco.length === 4 && senhaEnviada.startsWith(senhaBanco)) ||
            (cleanBanco.length === 4 && cleanEnviada.startsWith(cleanBanco))
          ) {
            clienteEncontrado = c
            credencialValida = true
            break
          }
        }
      }
    }

    // Se nenhum candidato direto bateu, mas temos parsedDate, tenta encontrar pelo paciente (ex: Onofre)
    if (!clienteEncontrado && parsedDate) {
      const pacientePorData = await prisma.cLIENTEs.findFirst({
        where: {
          Dia_Nasc: parsedDate.day,
          Mes_Nasc: parsedDate.month,
        },
        select: {
          CodCli: true,
          CodCli1: true,
          Cliente: true,
          Razao: true,
          CPF: true,
          CodUsu: true,
          Dia_Nasc: true,
          Mes_Nasc: true,
          Ano_Nasc: true,
        },
      })

      if (pacientePorData && matchesBirthDate(pacientePorData.Dia_Nasc, pacientePorData.Mes_Nasc, pacientePorData.Ano_Nasc, parsedDate)) {
        console.log(`[LOGIN SUCCESS VIA BIRTH DATE] Paciente: ${pacientePorData.Cliente}`)
        clienteEncontrado = pacientePorData
        credencialValida = true
      }
    }

    if (!clienteEncontrado || !credencialValida) {
      checkRateLimit(rateLimitKey)
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'CPF ou credencial incorretos. Verifique o CPF e a data de nascimento (DD/MM/AAAA) ou senha.',
        },
        { status: 401 }
      )
    }

    // Login aprovado
    resetRateLimit(rateLimitKey)

    const idSessao = clienteEncontrado.CodCli

    const token = await signToken({
      id: idSessao,
      nome: clienteEncontrado.Cliente || clienteEncontrado.Razao || '',
      codUsu: clienteEncontrado.CodUsu || null,
    })

    const response = NextResponse.json({
      sucesso: true,
      user: {
        id: idSessao,
        nome: clienteEncontrado.Cliente || clienteEncontrado.Razao,
      },
    })

    response.cookies.set({
      name: AUTH_COOKIE.name,
      value: token,
      ...AUTH_COOKIE.options,
      maxAge: 60 * 60 * 8,
    })

    return response
  } catch (error) {
    console.error('[LOGIN] Erro interno:', error instanceof Error ? error.message : 'Erro desconhecido')
    return NextResponse.json(
      { sucesso: false, mensagem: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    )
  }
}
