let token: string | null = null;

async function fetchToken(): Promise<string> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/token`);
  if (!res.ok) throw new Error("Failed to obtain token");
  const data = await res.json();
  token = data.token;
  return String(token);
}

export async function getToken(): Promise<string> {
  if (token) return token;

  const stored = sessionStorage.getItem("waybill_token");
  if (stored) {
    token = stored;
    return token;
  }

  token = await fetchToken();
  sessionStorage.setItem("waybill_token", token);
  return token;
}
