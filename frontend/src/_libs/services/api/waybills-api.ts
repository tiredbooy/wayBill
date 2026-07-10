import type {
  CreateWaybillReq,
  WaybillDetail,
  WaybillParams,
  WaybillResponse,
  UpdateWaybillReq,
} from "@/_libs/types/waybill-types";
import type { PaginatedResponse } from "@/_libs/types/paginated-types";
import { withQuery } from "@/_libs/utils/query-helpers";
import { getToken } from "@/_libs/auth/auth";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Safely parses a fetch Response as JSON.
 * Prevents "Unexpected end of JSON input" crashes when the server
 * (or a proxy in between) returns an empty body.
 */
async function parseJSON<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new Error(
      res.ok
        ? "پاسخ سرور خالی بود."
        : `خطای سرور (کد ${res.status}) بدون پیام مشخص.`,
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("پاسخ سرور معتبر نبود.");
  }
}

async function request<T>(
  url: string,
  init: RequestInit,
  okStatus?: number,
): Promise<T> {
  const token = await getToken();
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      "X-Waybill-Token": token,
      ...init.headers,
    },
  });

  if (!res.ok || (okStatus !== undefined && res.status !== okStatus)) {
    const err = await parseJSON<{ error?: string }>(res);
    throw new Error(err.error || "خطای ناشناخته رخ داد.");
  }

  return parseJSON<T>(res);
}

export async function getWaybills(
  params: WaybillParams,
): Promise<PaginatedResponse<WaybillResponse>> {
  const url = withQuery(`${API_URL}/api/v1/waybills`, {
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    payment_status: params.payment_status,
    sortBy: params.sortBy,
    orderBy: params.orderBy,
  });
  return request(url, { method: "GET" });
}

export async function getWaybill(waybillId: number): Promise<WaybillDetail> {
  return request(`${API_URL}/api/v1/waybills/${waybillId}`, { method: "GET" });
}

export async function createWaybill(reqData: CreateWaybillReq) {
  return request(
    `${API_URL}/api/v1/waybills`,
    { method: "POST", body: JSON.stringify(reqData) },
    201,
  );
}

export async function updateWaybill(
  reqData: UpdateWaybillReq,
  waybillId: number,
) {
  return request(
    `${API_URL}/api/v1/waybills/${waybillId}`,
    { method: "PATCH", body: JSON.stringify(reqData) },
    200,
  );
}

export async function deleteWaybill(waybillId: number) {
  return request(
    `${API_URL}/api/v1/waybills/${waybillId}`,
    { method: "DELETE" },
    200,
  );
}

export async function downloadWaybillsCSV(
  params: Record<string, string | number>,
) {
  const token = await getToken();
  const url = withQuery(`${API_URL}/api/v1/waybills/export`, params);
  const res = await fetch(url, {
    credentials: "include",
    headers: { "X-Waybill-Token": token },
  });
  if (!res.ok) throw new Error("خطا در دانلود فایل");
  return res.blob();
}

export async function downloadWaybillDetailCSV(
  waybillId: number,
): Promise<Blob> {
  const token = await getToken();
  const url = `${API_URL}/api/v1/waybills/${waybillId}/export`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "X-Waybill-Token": token },
  });
  if (!res.ok) throw new Error("خطا در دانلود فایل");
  return res.blob();
}
