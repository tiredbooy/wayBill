import type {
  CreateLocationReq,
  LocationParams,
  UpdateLocationReq,
} from "@/_libs/types/location-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLocation,
  deleteLocation,
  getLocation,
  getLocations,
  updateLocation,
} from "../api/location-api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const LocationsKeys = {
  all: ["locations"] as const,
  list: (params: LocationParams) => [...LocationsKeys.all, params] as const,
};

export function useLocations(params?: LocationParams) {
  const normalizedParams: LocationParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 12,
    q: params?.q?.trim(),
    province: params?.province?.trim(),
    is_terminal: params?.is_terminal,
  };
  return useQuery({
    queryKey: LocationsKeys.list(normalizedParams),
    queryFn: () => getLocations(normalizedParams),
    staleTime: 60 * 60 * 20,
  });
}

export function useLocation(locationId: number) {
  return useQuery({
    queryKey: ["locations", locationId],
    queryFn: () => getLocation(locationId),
    staleTime: 60 * 60 * 5,
    enabled: !!locationId,
  });
}

export function useCreateLocation(shouldNavigate: boolean = true) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateLocationReq) => createLocation(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: LocationsKeys.all });
      toast.success("موقعیت با موفقیت ایجاد شد.");
      if (shouldNavigate) {
        setTimeout(() => navigate("/dashboard/locations"), 500);
      }
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      data,
      locationId,
    }: {
      data: UpdateLocationReq;
      locationId: number;
    }) => updateLocation(data, locationId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: LocationsKeys.all });
      toast.success("موقعیت با موفقیت به‌روزرسانی شد.");
      setTimeout(() => navigate("/dashboard/locations"), 500);
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (locationId: number) => deleteLocation(locationId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: LocationsKeys.all });
      toast.success("موقعیت با موفقیت حذف شد.");
    },
    onError: (e) => toast.error(e.message),
  });
}
