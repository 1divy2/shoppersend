import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { productsQuery, facetsQuery, categoriesQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/ui-commerce/ProductGrid";
import type { SearchFilters } from "@/lib/types";
import { formatINR } from "@/lib/format";

const searchSchema = z.object({
  q: z.string().optional(),
  categoryId: z.string().optional(),
  brands: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  minDiscount: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(["relevance", "newest", "price_asc", "price_desc", "rating", "popularity"]).optional(),
  page: z.coerce.number().optional(),
});

export const Route = createFileRoute("/_shop/search")({
  validateSearch: searchSchema,
  head: ({ params: _p, match }) => {
    const s = (match.search as z.infer<typeof searchSchema>) ?? {};
    const title = s.q ? `Search: ${s.q} — ShoppersEnd` : "All products — ShoppersEnd";
    return { meta: [{ title }, { name: "description", content: "Browse and filter products on ShoppersEnd." }] };
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    const filters = toFilters(deps);
    context.queryClient.ensureQueryData(productsQuery(filters));
    context.queryClient.ensureQueryData(facetsQuery({ q: filters.q, categoryId: filters.categoryId }));
  },
  component: SearchPage,
});

function toFilters(s: z.infer<typeof searchSchema>): SearchFilters {
  return {
    q: s.q,
    categoryId: s.categoryId,
    brands: s.brands ? s.brands.split(",").filter(Boolean) : undefined,
    minPrice: s.minPrice,
    maxPrice: s.maxPrice,
    minRating: s.minRating,
    inStock: s.inStock,
    minDiscount: s.minDiscount,
    sort: s.sort ?? "relevance",
    page: s.page ?? 1,
    pageSize: 24,
  };
}

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const filters = toFilters(search);
  const { data: page } = useSuspenseQuery(productsQuery(filters));
  const { data: facets } = useSuspenseQuery(facetsQuery({ q: filters.q, categoryId: filters.categoryId }));
  const { data: categories = [] } = useQuery(categoriesQuery());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateSearch = (patch: Partial<z.infer<typeof searchSchema>>) => {
    navigate({
      to: "/search",
      search: (prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }),
    });
  };

  const activeBrands = filters.brands ?? [];
  const toggleBrand = (brand: string) => {
    const set = new Set(activeBrands);
    if (set.has(brand)) set.delete(brand); else set.add(brand);
    updateSearch({ brands: [...set].join(",") || undefined });
  };

  const clearAll = () => navigate({ to: "/search", search: { q: filters.q } });

  return (
    <div className="container-page py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            {filters.q ? `Results for "${filters.q}"` : "All products"}
          </h1>
          <div className="text-sm text-muted-foreground">{page.total} products</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium md:hidden"
          >
            <Filter size={14} /> Filters
          </button>
          <select
            value={filters.sort ?? "relevance"}
            onChange={(e) => updateSearch({ sort: e.target.value as SearchFilters["sort"] })}
            className="h-9 rounded-md border bg-card px-2 text-sm focus-ring"
          >
            <option value="relevance">Relevance</option>
            <option value="popularity">Popularity</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest rated</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside
          className={`${mobileFiltersOpen ? "fixed inset-0 z-40 overflow-y-auto bg-background p-4" : "hidden"} md:static md:block md:p-0`}
        >
          <div className="mb-3 flex items-center justify-between md:hidden">
            <span className="text-base font-semibold">Filters</span>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
              <X size={20} />
            </button>
          </div>

          <FilterGroup title="Category">
            <ul className="space-y-1.5 text-sm">
              <li>
                <button
                  className={`text-left ${!filters.categoryId ? "font-semibold text-[var(--primary)]" : "text-foreground hover:underline"}`}
                  onClick={() => updateSearch({ categoryId: undefined })}
                >All categories</button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    className={`text-left ${filters.categoryId === c.id ? "font-semibold text-[var(--primary)]" : "text-foreground hover:underline"}`}
                    onClick={() => updateSearch({ categoryId: c.id })}
                  >{c.name}</button>
                </li>
              ))}
            </ul>
          </FilterGroup>

          <FilterGroup title="Price">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.minPrice ?? ""}
                onChange={(e) => updateSearch({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder={`Min ${facets.priceRange.min ? formatINR(facets.priceRange.min) : ""}`}
                className="h-9 w-full rounded-md border bg-card px-2 text-sm focus-ring"
              />
              <span className="text-muted-foreground">–</span>
              <input
                type="number"
                value={filters.maxPrice ?? ""}
                onChange={(e) => updateSearch({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder={`Max ${facets.priceRange.max ? formatINR(facets.priceRange.max) : ""}`}
                className="h-9 w-full rounded-md border bg-card px-2 text-sm focus-ring"
              />
            </div>
          </FilterGroup>

          {facets.brands.length > 0 && (
            <FilterGroup title="Brand">
              <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1 text-sm">
                {facets.brands.map((b) => (
                  <li key={b.name} className="flex items-center gap-2">
                    <input
                      id={`brand-${b.name}`}
                      type="checkbox"
                      checked={activeBrands.includes(b.name)}
                      onChange={() => toggleBrand(b.name)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <label htmlFor={`brand-${b.name}`} className="flex-1 cursor-pointer">{b.name}</label>
                    <span className="text-xs text-muted-foreground">{b.count}</span>
                  </li>
                ))}
              </ul>
            </FilterGroup>
          )}

          <FilterGroup title="Customer rating">
            <ul className="space-y-1.5 text-sm">
              {[4, 3, 2].map((r) => (
                <li key={r}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === r}
                      onChange={() => updateSearch({ minRating: r })}
                    />
                    {r}★ & above
                  </label>
                </li>
              ))}
              {filters.minRating != null && (
                <li>
                  <button onClick={() => updateSearch({ minRating: undefined })}
                    className="text-xs text-[var(--primary)] hover:underline">Clear</button>
                </li>
              )}
            </ul>
          </FilterGroup>

          <FilterGroup title="Discount">
            <ul className="space-y-1.5 text-sm">
              {[10, 25, 40].map((d) => (
                <li key={d}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="discount"
                      checked={filters.minDiscount === d}
                      onChange={() => updateSearch({ minDiscount: d })}
                    />
                    {d}% or more
                  </label>
                </li>
              ))}
              {filters.minDiscount != null && (
                <li>
                  <button onClick={() => updateSearch({ minDiscount: undefined })}
                    className="text-xs text-[var(--primary)] hover:underline">Clear</button>
                </li>
              )}
            </ul>
          </FilterGroup>

          <FilterGroup title="Availability">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.inStock ?? false}
                onChange={(e) => updateSearch({ inStock: e.target.checked || undefined })}
              />
              In stock only
            </label>
          </FilterGroup>

          <button
            onClick={clearAll}
            className="mt-2 w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Clear all filters
          </button>
        </aside>

        <div>
          {page.items.length === 0 ? (
            <div className="rounded-lg border bg-card p-10 text-center">
              <h3 className="text-base font-semibold">No products match these filters</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try widening your price range or removing brand filters.</p>
              <button onClick={clearAll} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={page.items} />
              {page.totalPages > 1 && (
                <Pagination page={page.page} totalPages={page.totalPages} onChange={(p) => updateSearch({ page: p })} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b py-4 first:border-t-0 first:pt-0 last:border-b-0">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
      >Prev</button>
      <span className="px-3 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
      >Next</button>
    </div>
  );
}
