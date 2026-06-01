import { api } from "./api-client";
import type { Cart } from "@/lib/types";

export const cartService = {
  get: () => api.get<Cart>("/api/v1/cart"),
  add: (productId: string, quantity = 1, variantId?: string, subscriptionFrequency?: string | null) =>
    api.post<Cart>("/api/v1/cart/items", { productId, quantity, variantId, subscriptionFrequency }),
  update: (productId: string, quantity: number, variantId?: string) =>
    api.patch<Cart>(`/api/v1/cart/items/${productId}`, { quantity, variantId }),
  remove: (productId: string) => api.delete<Cart>(`/api/v1/cart/items/${productId}`),
  clear: () => api.post<Cart>("/api/v1/cart/clear"),
  applyCoupon: (code: string, subtotal: number) =>
    api.post<{ coupon: { code: string; description: string }; discount: number }>(
      "/api/v1/coupons/apply",
      { code, subtotal },
    ),
};
