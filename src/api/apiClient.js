const API_BASE = import.meta.env.VITE_API_BASE_URL; 

function withQuery(url, params) {
  const u = new URL(url, url.startsWith("http") ? undefined : window.location.origin);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
  });
  // Return relative if original was relative
  if (!url.startsWith("http")) return u.pathname + u.search;
  return u.toString();
}

/**
 * Create an API client with access to token/dateRange and a 401 handler.
 * You pass getters so the client always uses latest state.
 */
export function createApiClient({ getToken, getDateRange, onUnauthorized }) {

  async function request(path, options = {}) {
    const {
      method = "GET",
      body,
      headers = {},
      includeDateRange = true,
    } = options;

    const token = getToken?.();
    const range = getDateRange?.();

    let url = `${API_BASE}${path}`;

    if (includeDateRange && range?.startDate && range?.endDate) {
      url = withQuery(url, { startDate: range.startDate, endDate: range.endDate });
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      onUnauthorized?.();
      const err = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        message = data?.message || message;
      } catch {}
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }

    // handle empty 204
    if (res.status === 204) return null;

    return res.json();
  }

  return { request };
}
