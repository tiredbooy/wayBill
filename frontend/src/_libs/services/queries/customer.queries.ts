import type {
  CreateCustomerReq,
  CustomerParams,
  UpdateCustomerReq,
} from "@/_libs/types/customer-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../api/customer-api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CustomersKeys = {
  all: ["customers"] as const,
  list: (params: CustomerParams) => [...CustomersKeys.all, params] as const,
};

export function useCustomers(params?: CustomerParams) {
  const normalizedParams: CustomerParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 12,
    q: params?.q?.trim() || undefined,
    sortBy: params?.sortBy?.trim() || undefined,
    orderBy: params?.orderBy?.trim() || undefined,
  };

  return useQuery({
    queryKey: CustomersKeys.list(normalizedParams),
    queryFn: () => getCustomers(normalizedParams),
    staleTime: 60 * 60 * 20, // 20 minutes
  });
}

export function useCustomer(customerId: number) {
  return useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => getCustomer(customerId),
    staleTime: 60 * 60 * 5, // 5 minutes
  });
}

export function useCreateCustomer(shouldNavigate: boolean = true) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateCustomerReq) => createCustomer(data),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: CustomersKeys.all,
      });
      toast.success("مشتری با موفقیت ساخته شد.");

      if (shouldNavigate) {
        setTimeout(() => navigate("/dashboard/customers"), 500);
      }
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}

export function useUpdateCustomer(shouldNavigate: boolean = true) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      data,
      customerId,
    }: {
      data: UpdateCustomerReq;
      customerId: number;
    }) => updateCustomer(data, customerId),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: CustomersKeys.all,
      });
      toast.success("مشتری با موفقیت ویرایش شد.");

      if (shouldNavigate) {
        setTimeout(() => navigate("/dashboard/customers"), 500);
      }
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (customerId: number) => deleteCustomer(customerId),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: CustomersKeys.all,
      });
      toast.success("مشتری با موفقیت حذف شد.");
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}
