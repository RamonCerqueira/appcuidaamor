/**
 * src/lib/fetchWithAuth.ts
 *
 * Wrapper de fetch que trata automaticamente respostas 401/403.
 * Se o token expirar durante o uso, o usuário é redirecionado para /login.
 *
 * P2.3 FIX: Evita que o usuário fique preso em uma tela de loading infinito
 * quando a sessão expirar.
 */

export interface FetchResult<T> {
  data: T | null;
  error: string | null;
  unauthorized: boolean;
}

export async function fetchWithAuth<T>(
  url: string,
  options?: RequestInit
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'same-origin',
    });

    if (response.status === 401 || response.status === 403) {
      // Sessão expirada — redireciona para login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return { data: null, error: 'Sessão expirada.', unauthorized: true };
    }

    const json = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: json?.mensagem || `Erro ${response.status}`,
        unauthorized: false,
      };
    }

    return { data: json as T, error: null, unauthorized: false };
  } catch (err) {
    return {
      data: null,
      error: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      unauthorized: false,
    };
  }
}
