import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Route$9, t as toFilters, h as facetsQuery, j as productsQuery, g as categoriesQuery } from "./router-Jzlhdj0b.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { c as useSuspenseQuery, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as ProductCard } from "./ProductCard-By3ALuro.mjs";
import { f as formatINR } from "./format-Ba4izUCB.mjs";
import "../_libs/sonner.mjs";
import { F as Funnel, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./PriceBlock-Ch8f25OO.mjs";
function ProductGrid({ products }) {
  if (!products.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) });
}
function SearchPage() {
  const search = Route$9.useSearch();
  const navigate = useNavigate();
  const filters = toFilters(search);
  const {
    data: page
  } = useSuspenseQuery(productsQuery(filters));
  const {
    data: facets
  } = useSuspenseQuery(facetsQuery({
    q: filters.q,
    categoryId: filters.categoryId
  }));
  const {
    data: categories = []
  } = useQuery(categoriesQuery());
  const [mobileFiltersOpen, setMobileFiltersOpen] = reactExports.useState(false);
  const updateSearch = (patch) => {
    navigate({
      to: "/search",
      search: (prev) => ({
        ...prev,
        ...patch,
        page: patch.page ?? 1
      })
    });
  };
  const activeBrands = filters.brands ?? [];
  const toggleBrand = (brand) => {
    const set = new Set(activeBrands);
    if (set.has(brand)) set.delete(brand);
    else set.add(brand);
    updateSearch({
      brands: [...set].join(",") || void 0
    });
  };
  const clearAll = () => navigate({
    to: "/search",
    search: {
      q: filters.q
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: filters.q ? `Results for "${filters.q}"` : "All products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          page.total,
          " products"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setMobileFiltersOpen(true), className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium md:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 14 }),
          " Filters"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.sort ?? "relevance", onChange: (e) => updateSearch({
          sort: e.target.value
        }), className: "h-9 rounded-md border bg-card px-2 text-sm focus-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "relevance", children: "Relevance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popularity", children: "Popularity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newest", children: "Newest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rating", children: "Highest rated" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price_asc", children: "Price: low to high" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price_desc", children: "Price: high to low" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `${mobileFiltersOpen ? "fixed inset-0 z-40 overflow-y-auto bg-background p-4" : "hidden"} md:static md:block md:p-0`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between md:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-semibold", children: "Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileFiltersOpen(false), "aria-label": "Close filters", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { title: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `text-left ${!filters.categoryId ? "font-semibold text-[var(--primary)]" : "text-foreground hover:underline"}`, onClick: () => updateSearch({
            categoryId: void 0
          }), children: "All categories" }) }),
          categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `text-left ${filters.categoryId === c.id ? "font-semibold text-[var(--primary)]" : "text-foreground hover:underline"}`, onClick: () => updateSearch({
            categoryId: c.id
          }), children: c.name }) }, c.id))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { title: "Price", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: filters.minPrice ?? "", onChange: (e) => updateSearch({
            minPrice: e.target.value ? Number(e.target.value) : void 0
          }), placeholder: `Min ${facets.priceRange.min ? formatINR(facets.priceRange.min) : ""}`, className: "h-9 w-full rounded-md border bg-card px-2 text-sm focus-ring" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "–" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: filters.maxPrice ?? "", onChange: (e) => updateSearch({
            maxPrice: e.target.value ? Number(e.target.value) : void 0
          }), placeholder: `Max ${facets.priceRange.max ? formatINR(facets.priceRange.max) : ""}`, className: "h-9 w-full rounded-md border bg-card px-2 text-sm focus-ring" })
        ] }) }),
        facets.brands.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { title: "Brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-56 space-y-1.5 overflow-y-auto pr-1 text-sm", children: facets.brands.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: `brand-${b.name}`, type: "checkbox", checked: activeBrands.includes(b.name), onChange: () => toggleBrand(b.name), className: "h-4 w-4 rounded border-input" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `brand-${b.name}`, className: "flex-1 cursor-pointer", children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: b.count })
        ] }, b.name)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { title: "Customer rating", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 text-sm", children: [
          [4, 3, 2].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "rating", checked: filters.minRating === r, onChange: () => updateSearch({
              minRating: r
            }) }),
            r,
            "★ & above"
          ] }) }, r)),
          filters.minRating != null && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateSearch({
            minRating: void 0
          }), className: "text-xs text-[var(--primary)] hover:underline", children: "Clear" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { title: "Discount", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 text-sm", children: [
          [10, 25, 40].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "discount", checked: filters.minDiscount === d, onChange: () => updateSearch({
              minDiscount: d
            }) }),
            d,
            "% or more"
          ] }) }, d)),
          filters.minDiscount != null && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateSearch({
            minDiscount: void 0
          }), className: "text-xs text-[var(--primary)] hover:underline", children: "Clear" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { title: "Availability", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: filters.inStock ?? false, onChange: (e) => updateSearch({
            inStock: e.target.checked || void 0
          }) }),
          "In stock only"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearAll, className: "mt-2 w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted", children: "Clear all filters" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: page.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: "No products match these filters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Try widening your price range or removing brand filters." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearAll, className: "mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground", children: "Clear filters" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: page.items }),
        page.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { page: page.page, totalPages: page.totalPages, onChange: (p) => updateSearch({
          page: p
        }) })
      ] }) })
    ] })
  ] });
}
function FilterGroup({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b py-4 first:border-t-0 first:pt-0 last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
    children
  ] });
}
function Pagination({
  page,
  totalPages,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: page <= 1, onClick: () => onChange(page - 1), className: "rounded-md border px-3 py-1.5 text-sm disabled:opacity-40", children: "Prev" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 text-sm text-muted-foreground", children: [
      "Page ",
      page,
      " of ",
      totalPages
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: page >= totalPages, onClick: () => onChange(page + 1), className: "rounded-md border px-3 py-1.5 text-sm disabled:opacity-40", children: "Next" })
  ] });
}
export {
  SearchPage as component
};
