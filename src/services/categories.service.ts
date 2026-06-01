import { api } from "./api-client";
import type { Category } from "@/lib/types";

export const categoriesService = {
  list: () => api.get<Category[]>("/api/v1/catalog/categories"),
  bySlug: (slug: string) => api.get<Category>(`/api/v1/catalog/categories/${slug}`),
};
