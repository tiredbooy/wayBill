import { create } from "zustand";

interface CustomerActionStore {
  customerId: number | null;
  setCustomerId: (id: number | null) => void;
}

export const useCustomerActionStore = create<CustomerActionStore>((set) => ({
  customerId: null,
  setCustomerId: (id) => set({ customerId: id }),
}));