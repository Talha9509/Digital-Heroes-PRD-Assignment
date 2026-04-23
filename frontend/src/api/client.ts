// src/api/client.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  path: string,
  options: { method?: HttpMethod; body?: unknown } = {},
): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || text || 'Request failed');
    } catch {
      throw new Error(text || 'Request failed');
    }
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  get:  <T>(path: string)           => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),
  put:  <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),
  patch:<T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  delete:<T>(path: string)          =>
    request<T>(path, { method: 'DELETE' }),
};

export { API_URL };