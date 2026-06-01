import { queryOptions } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { categoriesService } from "@/services/categories.service";
import { productsService } from "@/services/products.service";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import { ordersService, addressService } from "@/services/orders.service";
import type { SearchFilters } from "@/lib/types";

export const meQuery = () =>
  queryOptions({ queryKey: ["auth", "me"], queryFn: () => authService.me() });

export const categoriesQuery = () =>
  queryOptions({ queryKey: ["categories"], queryFn: () => categoriesService.list(), staleTime: 5 * 60_000 });

export const productsQuery = (filters: SearchFilters) =>
  queryOptions({
    queryKey: ["products", filters],
    queryFn: () => productsService.search(filters),
  });

export const facetsQuery = (filters: Pick<SearchFilters, "q" | "categoryId">) =>
  queryOptions({ queryKey: ["facets", filters], queryFn: () => productsService.facets(filters) });

export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => productsService.bySlug(slug) });

export const similarProductsQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug, "similar"], queryFn: () => productsService.similar(slug) });

export const reviewsQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug, "reviews"], queryFn: () => productsService.reviews(slug) });

export const cartQuery = () =>
  queryOptions({ queryKey: ["cart"], queryFn: () => cartService.get() });

export const wishlistQuery = () =>
  queryOptions({ queryKey: ["wishlist"], queryFn: () => wishlistService.get() });

export const ordersQuery = () =>
  queryOptions({ queryKey: ["orders"], queryFn: () => ordersService.list() });

export const orderQuery = (id: string) =>
  queryOptions({ queryKey: ["order", id], queryFn: () => ordersService.byId(id) });

export const addressesQuery = () =>
  queryOptions({ queryKey: ["addresses"], queryFn: () => addressService.list() });
