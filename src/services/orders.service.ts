import { api } from "./api-client";
import type { Address, Order } from "@/lib/types";

export const ordersService = {
  list: () => api.get<Order[]>("/api/v1/orders"),
  byId: (id: string) => api.get<Order>(`/api/v1/orders/${id}`),
  place: (input: { addressId: string; paymentMethod: Order["paymentMethod"]; couponCode?: string }) =>
    api.post<Order>("/api/v1/orders", input),
  pay: (id: string) => api.post<{ message: string; status: string }>(`/api/v1/orders/${id}/pay`),
};

export const addressService = {
  list: () => api.get<Address[]>("/api/v1/addresses"),
  create: (input: Omit<Address, "id" | "userId">) => api.post<Address>("/api/v1/addresses", input),
  remove: (id: string) => api.delete<{ ok: true }>(`/api/v1/addresses/${id}`),
};
