"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartPlan = "personal" | "team" | "static";

type CartState = {
  plan: CartPlan;
  materialSlug?: string;
  email?: string;
  setPlan: (plan: CartPlan) => void;
  setMaterial: (slug: string | undefined) => void;
  setEmail: (email: string) => void;
  clear: () => void;
};

const defaults = {
  plan: "personal" as CartPlan,
  materialSlug: undefined as string | undefined,
  email: undefined as string | undefined,
};

export function isCartPlan(value: string | undefined): value is CartPlan {
  return value === "personal" || value === "team" || value === "static";
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...defaults,
      setPlan: (plan) => set({ plan }),
      setMaterial: (materialSlug) => set({ materialSlug }),
      setEmail: (email) => set({ email }),
      clear: () => set({ ...defaults }),
    }),
    {
      name: "frameline-cart",
      partialize: (state) => ({
        plan: state.plan,
        materialSlug: state.materialSlug,
        email: state.email,
      }),
    },
  ),
);
