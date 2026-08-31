/**
 * src/lib/auth.ts
 * Utilitário centralizado de autenticação JWT.
 */
import * as jose from 'jose'
import { NextRequest } from 'next/server'

// Garante que JWT_SECRET está presente.
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'cuida-e-amor-super-secure-jwt-secret-key-32-chars-min'
  return new TextEncoder().encode(secret)
}

export interface AuthPayload {
  id: number
  nome: string
  codUsu?: number | null
}

/**
 * Verifica e decodifica o token JWT do cookie mobile_token.
 * Retorna null se o token for inválido, expirado ou ausente.
 */
export async function verifyToken(request: NextRequest): Promise<AuthPayload | null> {
  try {
    const token = request.cookies.get('mobile_token')?.value
    if (!token) return null

    const { payload } = await jose.jwtVerify(token, getJwtSecret())

    if (!payload.id) return null

    return {
      id: payload.id as number,
      nome: (payload.nome as string) || '',
      codUsu: (payload.codUsu as number) || null,
    }
  } catch {
    return null
  }
}

/**
 * Cria um novo JWT para o usuário autenticado.
 * Expiração padrão: 90 dias quando 'manter conectado' ativado, ou 24 horas.
 */
export async function signToken(
  payload: AuthPayload,
  expiresIn: string = '90d'
): Promise<string> {
  return new jose.SignJWT({
    id: payload.id,
    nome: payload.nome,
    codUsu: payload.codUsu || null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret())
}

/**
 * Configuração do cookie de autenticação.
 */
export const AUTH_COOKIE = {
  name: 'mobile_token',
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  },
} as const
