export interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiCall<T>(url: string, options: FetchOptions = {}): Promise<{ data: T | null; error: string | null }> {
  const { params, ...fetchOptions } = options;
  let finalUrl = url;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    finalUrl = `${url}?${qs}`;
  }
  try {
    const res = await fetch(finalUrl, {
      ...fetchOptions,
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
