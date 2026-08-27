/**
 * src/lib/rateLimiter.ts
 * Rate Limiter em memória para endpoints sensíveis (ex: login).
 */

interface AttemptRecord {
  count: number
  firstAttempt: number
  blocked: boolean
  blockedUntil?: number
}

const store = new Map<string, AttemptRecord>()

const MAX_ATTEMPTS = 100 // Limite ampliado para permitir testes fluidos
const WINDOW_MS = 15 * 60 * 1000
const BLOCK_DURATION_MS = 60 * 1000 // 1 minuto apenas em vez de 15 minutos

// Limpeza periódica
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now - record.firstAttempt > WINDOW_MS * 2) {
      store.delete(key)
    }
  }
}, 30 * 1000)

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
