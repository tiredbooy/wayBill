import type {
  CreateDriverReq,
  DriverParams,
  UpdateDriverReq,
} from "@/_libs/types/driver-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDriver,
  deleteDriver,
  getDriver,
  getDrivers,
  updateDriver,
} from "../api/drivers-api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DriversKeys = {
  all: ["drivers"] as const,
  list: (params: DriverParams) => [...DriversKeys.all, params] as const,
};

export function useDrivers(params?: DriverParams) {
  const normalizedParams: DriverParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 12,
    status: params?.status?.trim() || undefined,
    q: params?.q?.trim() || undefined,
    sortBy: params?.sortBy?.trim() || undefined,
    orderBy: params?.orderBy?.trim() || undefined,
  };

  return useQuery({
    queryKey: DriversKeys.list(normalizedParams),
    queryFn: () => getDrivers(normalizedParams),
    staleTime: 60 * 60 * 20,
  });
}

export function useDriver(driverID: number) {
  return useQuery({
    queryKey: ["drivers", driverID],
    queryFn: () => getDriver(driverID),
    staleTime: 60 * 60 * 5,
  });
}

export function useCreateDriver(shouldNavigate: boolean = true) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateDriverReq) => createDriver(data),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: DriversKeys.all,
      });
      toast.success("راننده با موفقیت ساخته شد.");

      if (shouldNavigate) {
        setTimeout(() => navigate("/dashboard/drivers"), 500);
      }
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}

export function useUpdateDriver(shouldNavigate: boolean = true) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      data,
      driverID,
    }: {
      data: UpdateDriverReq;
      driverID: number;
    }) => updateDriver(data, driverID),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: DriversKeys.all,
      });
      toast.success("راننده با موفقیت ویرایش شد.");

      if (shouldNavigate) {
        setTimeout(() => navigate("/dashboard/drivers"), 500);
      }
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}

export function useDeleteDriver() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (driverID: number) => deleteDriver(driverID),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: DriversKeys.all,
      });
      toast.success("راننده با موفقیت حذف شد شد.");
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}
