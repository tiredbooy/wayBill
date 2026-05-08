import { getToken } from "@/_libs/auth/auth";
import type {
  CreateLocationReq,
  LocationDetail,
  LocationParams,
  UpdateLocationReq,
} from "@/_libs/types/location-types";
import { withQuery } from "@/_libs/utils/query-helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function getLocations(
  params: LocationParams,
): Promise<LocationDetail[]> {
  const url = withQuery(`${API_URL}/api/v1/locations`, {
    page: params.page,
    limit: params.limit,
    q: params.q,
    province: params.province,
    is_terminal: params.is_terminal,
  });
  const token = await getToken();
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });
  return await res.json();
}

export async function getLocation(locationId: number): Promise<LocationDetail> {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/locations/${locationId}`, {
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });
  return await res.json();
}

export async function createLocation(reqData: CreateLocationReq) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Waybill-Token": token,
    },
    body: JSON.stringify(reqData),
    credentials: "include",
  });
  if (!res.ok || res.status !== 201) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return await res.json();
}

export async function updateLocation(
  reqData: UpdateLocationReq,
  locationId: number,
) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/locations/${locationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Waybill-Token": token,
    },
    body: JSON.stringify(reqData),
    credentials: "include",
  });
  if (!res.ok || res.status !== 200) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return await res.json();
}

export async function deleteLocation(locationId: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/v1/locations/${locationId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });
  if (!res.ok || res.status !== 200) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return await res.json();
}
