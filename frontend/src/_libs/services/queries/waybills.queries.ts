import type {
  CreateWaybillReq,
  UpdateWaybillReq,
  WaybillParams,
} from "@/_libs/types/waybill-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWaybill, deleteWaybill, getWaybill, getWaybills, updateWaybill } from "@/_libs/services/api/waybills-api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const WaybillsKeys = {
  all: ["waybills"] as const,
  list: (params: WaybillParams) => [...WaybillsKeys.all, params] as const,
};

export function useWaybills(params?: WaybillParams) {
  const normalized: WaybillParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 12,
    search: params?.search?.trim() || undefined,
    status: params?.status?.trim() || undefined,
    payment_status: params?.payment_status?.trim() || undefined,
    sortBy: params?.sortBy?.trim() || undefined,
    orderBy: params?.orderBy?.trim() || undefined,
  };
  return useQuery({
    queryKey: WaybillsKeys.list(normalized),
    queryFn: () => getWaybills(normalized),
    staleTime: 60 * 60 * 20,
  });
}

export function useWaybill(waybillId: number) {
  return useQuery({
    queryKey: ["waybills", waybillId],
    queryFn: () => getWaybill(waybillId),
    staleTime: 60 * 60 * 5,
    enabled: !!waybillId,
  });
}

export function useCreateWaybill() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateWaybillReq) => createWaybill(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: WaybillsKeys.all });
      toast.success("بارنامه با موفقیت ایجاد شد.");
      setTimeout(() => navigate("/dashboard/waybills"), 500);
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateWaybill() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ data, waybillId }: { data: UpdateWaybillReq; waybillId: number }) =>
      updateWaybill(data, waybillId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: WaybillsKeys.all });
      toast.success("بارنامه با موفقیت به‌روزرسانی شد.");
      setTimeout(() => navigate("/dashboard/waybills"), 500);
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteWaybill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (waybillId: number) => deleteWaybill(waybillId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: WaybillsKeys.all });
      toast.success("بارنامه با موفقیت حذف شد.");
    },
    onError: (e) => toast.error(e.message),
  });
}