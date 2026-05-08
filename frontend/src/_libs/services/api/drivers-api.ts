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

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
}

export async function getDriver(driverID: number): Promise<DriverDetail> {
  const res = await fetch(`${API_URL}/api/v1/drivers/${driverID}`, {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
}

export async function createDriver(reqData: CreateDriverReq) {
  const res = await fetch(`${API_URL}/api/v1/drivers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqData),
    credentials: "include",
  });

  if (!res.ok || res.status !== 201) {
    const errTxt: { error: string } = await res.json();
    throw new Error(errTxt.error);
  }

  const data = await res.json();

  return data;
}

export async function deleteDriver(driverID: number) {
  const res = await fetch(`${API_URL}/api/v1/drivers/${driverID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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
  const res = await fetch(`${API_URL}/api/v1/drivers/${driverID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
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
