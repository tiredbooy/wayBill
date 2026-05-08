import { getToken } from "@/_libs/auth/auth";
import type {
  CreateCustomerReq,
  CustomerDetail,
  CustomerParams,
  UpdateCustomerReq,
} from "@/_libs/types/customer-types";
import type { PaginatedResponse } from "@/_libs/types/paginated-types";
import { withQuery } from "@/_libs/utils/query-helpers";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCustomers(
  params: CustomerParams,
): Promise<PaginatedResponse<CustomerDetail>> {
  const url = withQuery(`${API_URL}/api/v1/customers`, {
    page: params.page,
    limit: params.limit,
    q: params.q,
    sortBy: params.sortBy,
    orderBy: params.orderBy,
  });

  const token = await getToken(); // <-- get token

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Waybill-Token": token, // <-- inject
    },
  });

  return await res.json();
}

export async function getCustomer(customerId: number): Promise<CustomerDetail> {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/customers/${customerId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });

  return await res.json();
}

export async function createCustomer(reqData: CreateCustomerReq) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Waybill-Token": token,
    },
    body: JSON.stringify(reqData),
    credentials: "include",
  });

  if (!res.ok || res.status !== 201) {
    const errTxt: { error: string } = await res.json();
    throw new Error(errTxt.error);
  }

  return await res.json();
}

export async function deleteCustomer(customerId: number) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/customers/${customerId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-Waybill-Token": token,
    },
  });

  if (!res.ok || res.status !== 200) {
    const errTxt: { error: string } = await res.json();
    throw new Error(errTxt.error);
  }

  return await res.json();
}

export async function updateCustomer(
  reqData: UpdateCustomerReq,
  customerId: number,
) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/api/v1/customers/${customerId}`, {
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

  return await res.json();
}
