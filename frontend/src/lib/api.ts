const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function getToken(): string | null {
  try {
    const auth = localStorage.getItem('neru-customer-auth');
    if (auth) return JSON.parse(auth).token ?? null;
    const admin = localStorage.getItem('neru-admin-auth');
    if (admin) return JSON.parse(admin).token ?? null;
  } catch { /* */ }
  return null;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try { message = (await res.json()).message ?? message; } catch { /* */ }
    throw new Error(message);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  get:    <T>(path: string)              => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown) => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown) => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body: unknown) => request<T>('PATCH',  path, body),
  delete: <T>(path: string)              => request<T>('DELETE', path),
};
