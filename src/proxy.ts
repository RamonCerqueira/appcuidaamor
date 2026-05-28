import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('mobile_token')?.value
  const path = request.nextUrl.pathname

  // Rotas públicas que não precisam de login
  const publicPaths = ['/splash', '/onboarding', '/login', '/esqueci-senha', '/verificacao', '/nova-senha']
  
  const isPublicPath = publicPaths.includes(path) || path.startsWith('/api/auth') || path.startsWith('/_next') || path.startsWith('/logo') || path.includes('.svg') || path.includes('.png')

  // Se não tem token e não está em rota pública, redireciona para a Splash
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/splash', request.url))
  }

  // Se tem token e tenta acessar login/splash, redireciona pro Dashboard
  if (token && (path === '/splash' || path === '/login' || path === '/onboarding')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
