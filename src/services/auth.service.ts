import { api } from "./api-client";
import type { User } from "@/lib/types";

export const authService = {
  me: () => api.get<{ user: User | null }>("/api/v1/auth/me"),
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>("/api/v1/auth/login", { email, password }),
  register: (input: { email: string; password: string; fullName: string; phone?: string }) =>
    api.post<{ user: User; token: string }>("/api/v1/auth/register", input),
  logout: () => api.post<{ ok: true }>("/api/v1/auth/logout"),
};
