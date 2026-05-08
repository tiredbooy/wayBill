// WAYBILL TOKEN EXAMPLE ( (X-Waybill-Token): j6QVdpTlhPYdHgj+oTSpydLzdBq25VYRM8iP4oIR66A  )

const API_URL = import.meta.env.VITE_API_URL;

export async function GetSession({
  credentials = undefined,
}: {
  credentials: RequestCredentials | undefined;
}) {
  const res = await fetch(`${API_URL}/api/v1/token`, {
    method: "GET",
    credentials,
  });
  if (!res.ok) return;

  const data = await res.json();

  if (!data.token) {
    return;
  }

  if (credentials == undefined) {
    return data?.token;
  }
}
