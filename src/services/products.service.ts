import { api } from "./api-client";
import type { Page, Product, Review, SearchFilters } from "@/lib/types";

export interface ReviewSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface Facets {
  brands: { name: string; count: number }[];
  priceRange: { min: number; max: number };
  total: number;
}

function toQuery(filters: SearchFilters): Record<string, unknown> {
  const q: Record<string, unknown> = { ...filters };
  if (filters.brands && filters.brands.length) q.brands = filters.brands.join(",");
  else delete q.brands;
  return q;
}

export const productsService = {
  search: (filters: SearchFilters) =>
    api.get<Page<Product>>("/api/v1/catalog/products/search", { query: toQuery(filters) }),
  facets: (filters: Pick<SearchFilters, "q" | "categoryId">) =>
    api.get<Facets>("/api/v1/catalog/products/facets", { query: filters as Record<string, unknown> }),
  bySlug: (slug: string) => api.get<Product>(`/api/v1/catalog/products/${slug}`),
  similar: (slug: string) => api.get<Product[]>(`/api/v1/catalog/products/${slug}/similar`),
  reviews: (slug: string) =>
    api.get<{ items: Review[]; summary: ReviewSummary }>(`/api/v1/catalog/products/${slug}/reviews`),
  submitReview: (productId: string, data: { rating: number; title: string; comment: string }) =>
    api.post(`/api/v1/products/${productId}/reviews`, { json: data }),
};
