import { getToken } from "@/_libs/auth/auth";
import type { PaginatedResponse } from "@/_libs/types/paginated-types";
import type {
  CreateVehicleReq,
  UpdateVehicleReq,
  VehicleParams,
  VehicleResponse,
} from "@/_libs/types/vehicle-types";
import { withQuery } from "@/_libs/utils/query-helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function createVehicle(data: CreateVehicleReq) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/vehicles`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Waybill-Token": token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) return;
  if (res.status !== 201) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

export async function getVehicles(
  params: VehicleParams,
): Promise<PaginatedResponse<VehicleResponse>> {
  const url = withQuery(`${API_URL}/api/v1/vehicles`, {
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

export async function getVehicle(vehicleID: number): Promise<VehicleResponse> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/vehicles/${vehicleID}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });

  return await res.json();
}

export async function deleteVehicle(vehicleID: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/vehicles/${vehicleID}`, {
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

export async function updateVehicle(
  reqData: UpdateVehicleReq,
  vehicleID: number,
) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/vehicles/${vehicleID}`, {
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
