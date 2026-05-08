import { create } from "zustand";

interface LocationActionStore {
  locationId: number | null;
  setLocationId: (id: number | null) => void;
}

export const useLocationActionStore = create<LocationActionStore>((set) => ({
  locationId: null,
  setLocationId: (id) => set({ locationId: id }),
}));
