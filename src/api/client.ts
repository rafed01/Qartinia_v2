let activeSessionToken: string | null = null;

export function getSessionToken(): string | null {
  return activeSessionToken;
}

export function setSessionToken(token: string | null): void {
  activeSessionToken = token;
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const token = getSessionToken();
  const headers = new Headers(init?.headers);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    credentials: 'include',
    headers,
  });

  // If server returned 401 Unauthorized (except on login), clear in-memory token
  if (res.status === 401 && !String(input).includes('/api/auth/login')) {
    setSessionToken(null);
  }

  return res;
}
