import type {
  CreateWaybillReq,
  WaybillDetail,
  WaybillParams,
  WaybillResponse,
  UpdateWaybillReq,
} from "@/_libs/types/waybill-types";
import type { PaginatedResponse } from "@/_libs/types/paginated-types";
import { withQuery } from "@/_libs/utils/query-helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function getWaybills(
  params: WaybillParams
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

  const res = await fetch(url, { method: "GET", credentials: "include" });
  return await res.json();
}

export async function getWaybill(waybillId: number): Promise<WaybillDetail> {
  const res = await fetch(`${API_URL}/api/v1/waybills/${waybillId}`, {
    method: "GET",
    credentials: "include",
  });
  return await res.json();
}

export async function createWaybill(reqData: CreateWaybillReq) {
  const res = await fetch(`${API_URL}/api/v1/waybills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqData),
    credentials: "include",
  });
  if (!res.ok || res.status !== 201) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return await res.json();
}

export async function updateWaybill(reqData: UpdateWaybillReq, waybillId: number) {
  const res = await fetch(`${API_URL}/api/v1/waybills/${waybillId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqData),
    credentials: "include",
  });
  if (!res.ok || res.status !== 200) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return await res.json();
}

export async function deleteWaybill(waybillId: number) {
  const res = await fetch(`${API_URL}/api/v1/waybills/${waybillId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok || res.status !== 200) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return await res.json();
}

export async function downloadWaybillsCSV(params: Record<string, string | number>) {
  const url = withQuery(`${API_URL}/api/v1/waybills/export`, params);
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("خطا در دانلود فایل");
  return res.blob();
}

export async function downloadWaybillDetailCSV(waybillId: number): Promise<Blob> {
  const url = `${API_URL}/api/v1/waybills/${waybillId}/export`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("خطا در دانلود فایل");
  return res.blob();
}