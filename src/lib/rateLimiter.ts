/**
 * src/lib/rateLimiter.ts
 * Rate Limiter em memória para endpoints sensíveis (ex: login).
 *
 * IMPORTANTE: setInterval de top-level foi removido — ele causa crash em
 * Serverless Functions (Vercel/AWS Lambda) pois o ambiente não persiste entre
 * invocações e timers globais são inválidos nesse contexto.
 * A limpeza é feita de forma lazy dentro de checkRateLimit().
 */

interface AttemptRecord {
  count: number
  firstAttempt: number
  blocked: boolean
  blockedUntil?: number
}

const store = new Map<string, AttemptRecord>()

const MAX_ATTEMPTS = 100
const WINDOW_MS = 15 * 60 * 1000
const BLOCK_DURATION_MS = 60 * 1000 // 1 minuto

// Limpeza lazy — chamada internamente; evita setInterval no top-level
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now - record.firstAttempt > WINDOW_MS * 2) {
      store.delete(key)
    }
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds?: number
}

export function checkRateLimit(key: string): RateLimitResult {
  // Em desenvolvimento, nunca bloqueia para facilitar testes e homologação
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true, remaining: 999 }
  }

  // Limpeza lazy: executa de forma não-bloqueante com probabilidade baixa
  // para não impactar performance em produção
  if (Math.random() < 0.05) {
    cleanupExpiredEntries()
  }

  const now = Date.now()
  const record = store.get(key)

  if (!record) {
    store.set(key, { count: 1, firstAttempt: now, blocked: false })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  if (record.blocked && record.blockedUntil) {
    if (now < record.blockedUntil) {
      const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000)
      return { allowed: false, remaining: 0, retryAfterSeconds }
    } else {
      store.set(key, { count: 1, firstAttempt: now, blocked: false })
      return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
    }
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    store.set(key, { count: 1, firstAttempt: now, blocked: false })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  const newCount = record.count + 1

  if (newCount >= MAX_ATTEMPTS) {
    store.set(key, {
      count: newCount,
      firstAttempt: record.firstAttempt,
      blocked: true,
      blockedUntil: now + BLOCK_DURATION_MS,
    })
    const retryAfterSeconds = Math.ceil(BLOCK_DURATION_MS / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  store.set(key, { ...record, count: newCount })
  return { allowed: true, remaining: MAX_ATTEMPTS - newCount }
}

export function resetRateLimit(key?: string): void {
  if (key) {
    store.delete(key)
  } else {
    store.clear()
  }
}

