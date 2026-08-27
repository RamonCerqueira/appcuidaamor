import { NextResponse } from 'next/server'
import { AUTH_COOKIE } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ sucesso: true, mensagem: 'Sessão encerrada com segurança.' })

  response.cookies.set({
    name: AUTH_COOKIE.name,
    value: '',
    ...AUTH_COOKIE.options,
    maxAge: 0,
  })

  return response
}
