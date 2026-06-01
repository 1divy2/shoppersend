import { api } from "./api-client";
import type { Wishlist } from "@/lib/types";

export const wishlistService = {
  get: () => api.get<Wishlist>("/api/v1/wishlist"),
  add: (productId: string) => api.post<Wishlist>("/api/v1/wishlist/items", { productId }),
  remove: (productId: string) => api.delete<Wishlist>(`/api/v1/wishlist/items/${productId}`),
};
