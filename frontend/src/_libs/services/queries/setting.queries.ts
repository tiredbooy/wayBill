import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSettings,
  getSettings,
  updateSettings,
} from "../api/setting-api";
import type { SettingInput } from "@/_libs/types/setting-types";

export const SettingKey = {
  all: ["setting"] as const,
};

export function useSetting() {
  return useQuery({
    queryKey: SettingKey.all,
    queryFn: () => getSettings(),
  });
}

export function useCreateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SettingInput) => createSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SettingKey.all });
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SettingInput) => updateSettings(data),
    onSuccess: (updatedSetting) => {
      queryClient.setQueryData(SettingKey.all, updatedSetting);
      queryClient.invalidateQueries({ queryKey: SettingKey.all });
    },
  });
}
