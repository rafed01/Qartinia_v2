const TOKEN_KEY = 'qartinia_session_token';

export function getSessionToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // localStorage might be unavailable or restricted
  }
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const token = getSessionToken();
  const headers = new Headers(init?.headers);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
  });

  // If token was supplied but server returned 401 Unauthorized (except on login), clear invalid token
  if (res.status === 401 && token && !String(input).includes('/api/auth/login')) {
    setSessionToken(null);
  }

  return res;
}
