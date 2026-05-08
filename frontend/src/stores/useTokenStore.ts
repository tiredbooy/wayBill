import { create } from "zustand";

export type TokenState = {
  token: string;
};

export type TokenStore = TokenState & {
  setToken: (v: string) => void;
  reset: () => void;
};

const initial: TokenState = {
  token: "",
};

export const useTokenStore = create<TokenStore>()((set) => ({
  ...initial,

  setToken: (v) => set({ token: v }),
  reset: () => set(initial),
}));
