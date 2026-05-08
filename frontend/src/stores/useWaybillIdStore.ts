import { create } from "zustand";

interface WaybillActionStore {
  waybillId: number | null;
  setWaybillId: (id: number | null) => void;
}

export const useWaybillActionStore = create<WaybillActionStore>((set) => ({
  waybillId: null,
  setWaybillId: (id) => set({ waybillId: id }),
}));