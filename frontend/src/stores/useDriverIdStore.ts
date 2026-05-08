import { create } from "zustand";

export type DriverActionState = {
  driverID: number | null;
};

export type DriverActionStore = DriverActionState & {
  setDriverID: (v: number) => void;
  reset: () => void;
};

const initial: DriverActionState = {
  driverID: null,
};

export const useDriverActionStore = create<DriverActionStore>()((set) => ({
  ...initial,

  setDriverID: (v) => set({ driverID: v }),
  reset: () => set(initial),
}));
