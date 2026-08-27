/**
 * src/lib/prisma.ts
 *
 * Singleton do PrismaClient com log de queries lentas em desenvolvimento.
 *
 * P2.7 FIX: Log de queries configurado para detectar gargalos de banco.
 * Em produção: apenas errors são logados para não poluir logs.
 */
import { PrismaClient } from '../generated/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'development') {
    return new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    })
  }

  return new PrismaClient({
    log: [{ emit: 'stdout', level: 'error' }],
  })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma

  // Log de queries que demoram mais de 500ms em desenvolvimento
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(prisma as any).$on?.('query', (e: { duration: number; query: string }) => {
    if (e.duration > 500) {
      console.warn(`[PRISMA SLOW QUERY] ${e.duration}ms:\n${e.query}`)
    }
  })
}
