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
    headers,
  });

  // If token was supplied but server returned 401 Unauthorized (except on login), clear invalid token
  if (res.status === 401 && token && !String(input).includes('/api/auth/login')) {
    setSessionToken(null);
  }

  return res;
}
