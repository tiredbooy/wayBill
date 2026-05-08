import { getToken } from "@/_libs/auth/auth";
import type {
  CreateDriverReq,
  DriverDetail,
  DriverParams,
  DriverResponse,
  UpdateDriverReq,
} from "@/_libs/types/driver-types";
import type { PaginatedResponse } from "@/_libs/types/paginated-types";
import { withQuery } from "@/_libs/utils/query-helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function getDrivers(
  params: DriverParams,
): Promise<PaginatedResponse<DriverResponse>> {
  const url = withQuery(`${API_URL}/api/v1/drivers`, {
    page: params.page,
    limit: params.limit,
    q: params.q,
    status: params.status,
    sortBy: params.sortBy,
    orderBy: params.orderBy,
  });

  const token = await getToken();

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });

  return await res.json();
}

export async function getDriver(driverID: number): Promise<DriverDetail> {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/drivers/${driverID}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });

  return await res.json();
}

export async function createDriver(reqData: CreateDriverReq) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/drivers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Waybill-Token": token,
    },
    body: JSON.stringify(reqData),
    credentials: "include",
  });

  if (!res.ok || res.status !== 201) {
    const errData = await res.json();
    const message =
      typeof errData.error === "string"
        ? errData.error
        : JSON.stringify(errData.error) || res.statusText;
    throw new Error(message);
  }

  const data = await res.json();
  return data;
}

export async function deleteDriver(driverID: number) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/drivers/${driverID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Waybill-Token": token,
    },
    credentials: "include",
  });

  if (!res.ok || res.status !== 200) {
    const errTxt: { error: string } = await res.json();
    throw new Error(errTxt.error);
  }

  const data = await res.json();
  return data;
}

export async function updateDriver(reqData: UpdateDriverReq, driverID: number) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/drivers/${driverID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Waybill-Token": token,
    },
    body: JSON.stringify(reqData),
    credentials: "include",
  });

  if (!res.ok || res.status !== 200) {
    const errTxt: { error: string } = await res.json();
    throw new Error(errTxt.error);
  }

  const data = await res.json();
  return data;
}
