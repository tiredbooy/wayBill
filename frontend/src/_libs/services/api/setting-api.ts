import type { Setting, SettingInput } from "@/_libs/types/setting-types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getSettings(): Promise<Setting> {
  const res = await fetch(`${API_URL}/api/v1/settings`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}

export async function createSettings(
  data: SettingInput,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/v1/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create settings");
  }
  return await res.json();
}

export async function updateSettings(data: SettingInput): Promise<Setting> {
  const res = await fetch(`${API_URL}/api/v1/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update settings");
  }
  return await res.json();
}
