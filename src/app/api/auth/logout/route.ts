import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ sucesso: true, mensagem: 'Logout realizado com sucesso' })
  
  response.cookies.set({
    name: 'mobile_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  })

  return response
}
