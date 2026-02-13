export async function apiFetch(url, { token, method = "GET", body, headers } = {}) {
    const res = await fetch(url, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
  
    if (!res.ok) {
      const err = new Error((data && data.message) || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
  
    return data;
  }
  