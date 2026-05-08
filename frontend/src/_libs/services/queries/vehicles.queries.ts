import type {
  CreateVehicleReq,
  UpdateVehicleReq,
  VehicleParams,
} from "@/_libs/types/vehicle-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "../api/vehicles-api";
import { DriversKeys } from "./drivers.queries";

export const VehicleKeys = {
  all: ["vehicles"] as const,
  list: (params: VehicleParams) => [...VehicleKeys.all, params] as const,
};

export function useCreateVehicle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleReq) => createVehicle(data),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: VehicleKeys.all,
      });
      toast.success("وسیله نقلیه با موفقیت ساخته شد");
    },
  });
}

export function useVehicles(params?: VehicleParams) {
  const normalizedParams: VehicleParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 12,
    status: params?.status || undefined,
    q: params?.q?.trim() || undefined,
    sortBy: params?.sortBy?.trim() || undefined,
    orderBy: params?.orderBy?.trim() || undefined,
  };

  return useQuery({
    queryKey: VehicleKeys.list(normalizedParams),
    queryFn: () => getVehicles(normalizedParams),
    staleTime: 60 * 60 * 20,
    placeholderData: (prev) => prev,
  });
}

export function useVehicle(vehicleID: number) {
  return useQuery({
    queryKey: ["vehicles", vehicleID],
    queryFn: () => getVehicle(vehicleID),
    staleTime: 60 * 60 * 5,
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vehicleID: number) => deleteVehicle(vehicleID),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: VehicleKeys.all,
      });
      toast.success("خودرو با موفقیت حذف شد شد.");
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      data,
      vehicleID,
    }: {
      data: UpdateVehicleReq;
      vehicleID: number;
    }) => updateVehicle(data, vehicleID),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: [DriversKeys.all, VehicleKeys.all],
      });
      toast.success("خودرو با موفقیت ویرایش شد.");

      setTimeout(() => navigate("/dashboard/vehicles"), 500);
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });
}
