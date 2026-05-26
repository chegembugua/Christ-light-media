import { authFetch } from './authFetch';

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string>;
  body?: BodyInit | Record<string, unknown> | null;
}

export async function apiCall<T>(url: string, options: FetchOptions = {}): Promise<{ data: T | null; error: string | null }> {
  const { params, body, ...fetchOptions } = options;

  let finalUrl = url;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    finalUrl = `${url}?${qs}`;
  }

  // Auto-serialize plain objects to JSON
  let serializedBody: BodyInit | null | undefined = undefined;
  if (body !== undefined && body !== null) {
    if (
      typeof body === 'object' &&
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer)
    ) {
      serializedBody = JSON.stringify(body as Record<string, unknown>);
    } else {
      serializedBody = body as BodyInit;
    }
  }

  try {
    // authFetch attaches the Supabase Bearer token when a session is active,
    // falling back to plain fetch for unauthenticated endpoints.
    const res = await authFetch(finalUrl, {
      ...fetchOptions,
      body: serializedBody,
      headers: { 'Content-Type': 'application/json', ...(fetchOptions.headers || {}) },
    });
    if (!res.ok) {
      const err = await res.text();
      return { data: null, error: err || res.statusText };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}
