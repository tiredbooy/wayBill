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
  params: CustomerParams
): Promise<PaginatedResponse<CustomerDetail>> {  // 👈 Use CustomerDetail directly
  const url = withQuery(`${API_URL}/api/v1/customers`, {
    page: params.page,
    limit: params.limit,
    q: params.q,
    sortBy: params.sortBy,
    orderBy: params.orderBy,
  });

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
}

export async function getCustomer(customerId: number): Promise<CustomerDetail> {
  const res = await fetch(`${API_URL}/api/v1/customers/${customerId}`, {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
}

export async function createCustomer(reqData: CreateCustomerReq) {
  const res = await fetch(`${API_URL}/api/v1/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  const res = await fetch(`${API_URL}/api/v1/customers/${customerId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok || res.status !== 200) {
    const errTxt: { error: string } = await res.json();
    throw new Error(errTxt.error);
  }

  return await res.json();
}

export async function updateCustomer(reqData: UpdateCustomerReq, customerId: number) {
  const res = await fetch(`${API_URL}/api/v1/customers/${customerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqData),
    credentials: "include",
  });

  if (!res.ok || res.status !== 200) {
    const errTxt: { error: string } = await res.json();
    throw new Error(errTxt.error);
  }

  return await res.json();
}