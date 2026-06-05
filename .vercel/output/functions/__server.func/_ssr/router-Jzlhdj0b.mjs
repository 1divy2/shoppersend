import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { I as notFound } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import { u as useMotionValue, b as useSpring, m as motion } from "../_libs/framer-motion.mjs";
import { q as ShoppingCart } from "../_libs/lucide-react.mjs";
import { o as objectType, c as coerce, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
let transport;
class ApiException extends Error {
  code;
  status;
  details;
  constructor(error, status = 400) {
    super(error.message);
    this.code = error.code;
    this.status = status;
    this.details = error.details;
  }
}
const api = {
  get: (path, opts = {}) => transport.request(path, { ...opts, method: "GET" }),
  post: (path, body, opts = {}) => transport.request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts = {}) => transport.request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts = {}) => transport.request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts = {}) => transport.request(path, { ...opts, method: "DELETE" })
};
const httpTransport = {
  async request(path, { method = "GET", body, query, headers }) {
    const isBrowser = typeof window !== "undefined";
    const baseUrl = isBrowser ? window.location.origin : "http://localhost:8081";
    const url = new URL(path, baseUrl);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v != null) url.searchParams.set(k, String(v));
      }
    }
    const token = isBrowser ? localStorage.getItem("shoppersend_auth_token") : null;
    const fetchHeaders = {
      "Content-Type": "application/json",
      ...headers
    };
    if (token) {
      fetchHeaders["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(url.toString(), {
      method,
      headers: fetchHeaders,
      body: body ? JSON.stringify(body) : void 0
    });
    if (!res.ok) {
      let errData;
      try {
        errData = await res.json();
      } catch (e) {
        if (res.status === 401 || res.status === 403) {
          errData = { message: "Please log in to continue", code: "unauthorized" };
          if (typeof window !== "undefined") {
            localStorage.removeItem("shoppersend_auth_token");
          }
        } else {
          errData = { message: "Server error", code: "error" };
        }
      }
      throw new ApiException(errData, res.status);
    }
    let json = await res.json();
    if (json && typeof json === "object" && "success" in json && "data" in json) {
      json = json.data;
    }
    if (json && typeof json === "object" && "content" in json && "totalElements" in json) {
      json.items = json.content;
      json.total = json.totalElements;
    }
    if (path.includes("/auth/login") || path.includes("/auth/register")) {
      if (json && json.access_token) {
        json.token = json.access_token;
      }
      if (json && json.token && typeof window !== "undefined") {
        localStorage.setItem("shoppersend_auth_token", json.token);
      }
    } else if (path.includes("/auth/logout")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("shoppersend_auth_token");
      }
    }
    return json;
  }
};
transport = httpTransport;
const CITIES = [
  "New York",
  "London",
  "Tokyo",
  "Seattle",
  "Austin",
  "Berlin",
  "Sydney",
  "Toronto",
  "Paris",
  "Seoul",
  "Mumbai",
  "Dubai"
];
function LiveToasts() {
  reactExports.useEffect(() => {
    let timeout;
    const showRandomPurchase = async () => {
      try {
        const result = await api.get("/api/v1/catalog/products/search?size=20");
        const products = result.data.content;
        if (products.length > 0) {
          const product = products[Math.floor(Math.random() * products.length)];
          const city = CITIES[Math.floor(Math.random() * CITIES.length)];
          toast(
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 18 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  "Someone in ",
                  city,
                  " just bought"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: product.name })
              ] })
            ] }),
            {
              duration: 4e3,
              position: "bottom-left"
            }
          );
        }
      } catch (err) {
      }
      const nextDelay = Math.random() * 3e4 + 15e3;
      timeout = setTimeout(showRandomPurchase, nextDelay);
    };
    timeout = setTimeout(showRandomPurchase, 5e3);
    return () => clearTimeout(timeout);
  }, []);
  return null;
}
function CustomCursor() {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [isHovering, setIsHovering] = reactExports.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 });
  reactExports.useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("a") || target.closest("button") || target.closest("[role='button']")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);
  if (!isVisible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-primary/50 mix-blend-difference",
        style: {
          x: springX,
          y: springY,
          width: isHovering ? 48 : 24,
          height: isHovering ? 48 : 24,
          translateX: "-50%",
          translateY: "-50%"
        },
        animate: {
          scale: isHovering ? 1.5 : 1,
          opacity: 1,
          backgroundColor: isHovering ? "rgba(var(--primary), 0.2)" : "transparent"
        },
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "pointer-events-none fixed top-0 left-0 z-[10000] h-2 w-2 rounded-full bg-primary mix-blend-difference",
        style: {
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%"
        },
        animate: {
          scale: isHovering ? 0 : 1
        }
      }
    )
  ] });
}
const appCss = "/assets/styles-T4MuRl57.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$d = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ShoppersEnd — Demo Commerce Storefront" },
      { name: "description", content: "ShoppersEnd is a demonstration e-commerce storefront with a swappable service layer. All catalog content is sample data." },
      { name: "author", content: "ShoppersEnd" },
      { property: "og:title", content: "ShoppersEnd — Demo Commerce Storefront" },
      { property: "og:description", content: "Demo storefront with cart, wishlist, search, filters, and checkout flow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$d.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CustomCursor, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", richColors: true, closeButton: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LiveToasts, {})
  ] });
}
const $$splitComponentImporter$c = () => import("../_shop-DmODmcmS.mjs");
const Route$c = createFileRoute("/_shop")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const authService = {
  me: () => api.get("/api/v1/auth/me"),
  login: (email, password) => api.post("/api/v1/auth/login", { email, password }),
  register: (input) => api.post("/api/v1/auth/register", input),
  logout: () => api.post("/api/v1/auth/logout")
};
const categoriesService = {
  list: () => api.get("/api/v1/catalog/categories"),
  bySlug: (slug) => api.get(`/api/v1/catalog/categories/${slug}`)
};
function toQuery(filters) {
  const q = { ...filters };
  if (filters.brands && filters.brands.length) q.brands = filters.brands.join(",");
  else delete q.brands;
  return q;
}
const productsService = {
  search: (filters) => api.get("/api/v1/catalog/products/search", { query: toQuery(filters) }),
  facets: (filters) => api.get("/api/v1/catalog/products/facets", { query: filters }),
  bySlug: (slug) => api.get(`/api/v1/catalog/products/${slug}`),
  similar: (slug) => api.get(`/api/v1/catalog/products/${slug}/similar`),
  reviews: (slug) => api.get(`/api/v1/catalog/products/${slug}/reviews`),
  submitReview: (productId, data) => api.post(`/api/v1/products/${productId}/reviews`, { json: data })
};
const cartService = {
  get: () => api.get("/api/v1/cart"),
  add: (productId, quantity = 1, variantId, subscriptionFrequency) => api.post("/api/v1/cart/items", { productId, quantity, variantId, subscriptionFrequency }),
  update: (productId, quantity, variantId) => api.patch(`/api/v1/cart/items/${productId}`, { quantity, variantId }),
  remove: (productId) => api.delete(`/api/v1/cart/items/${productId}`),
  clear: () => api.post("/api/v1/cart/clear"),
  applyCoupon: (code, subtotal) => api.post(
    "/api/v1/coupons/apply",
    { code, subtotal }
  )
};
const wishlistService = {
  get: () => api.get("/api/v1/wishlist"),
  add: (productId) => api.post("/api/v1/wishlist/items", { productId }),
  remove: (productId) => api.delete(`/api/v1/wishlist/items/${productId}`)
};
const ordersService = {
  list: () => api.get("/api/v1/orders"),
  byId: (id) => api.get(`/api/v1/orders/${id}`),
  place: (input) => api.post("/api/v1/orders", input),
  pay: (id) => api.post(`/api/v1/orders/${id}/pay`)
};
const addressService = {
  list: () => api.get("/api/v1/addresses"),
  create: (input) => api.post("/api/v1/addresses", input),
  remove: (id) => api.delete(`/api/v1/addresses/${id}`)
};
const meQuery = () => queryOptions({ queryKey: ["auth", "me"], queryFn: () => authService.me() });
const categoriesQuery = () => queryOptions({ queryKey: ["categories"], queryFn: () => categoriesService.list(), staleTime: 5 * 6e4 });
const productsQuery = (filters) => queryOptions({
  queryKey: ["products", filters],
  queryFn: () => productsService.search(filters)
});
const facetsQuery = (filters) => queryOptions({ queryKey: ["facets", filters], queryFn: () => productsService.facets(filters) });
const productQuery = (slug) => queryOptions({ queryKey: ["product", slug], queryFn: () => productsService.bySlug(slug) });
const similarProductsQuery = (slug) => queryOptions({ queryKey: ["product", slug, "similar"], queryFn: () => productsService.similar(slug) });
const reviewsQuery = (slug) => queryOptions({ queryKey: ["product", slug, "reviews"], queryFn: () => productsService.reviews(slug) });
const cartQuery = () => queryOptions({ queryKey: ["cart"], queryFn: () => cartService.get() });
const wishlistQuery = () => queryOptions({ queryKey: ["wishlist"], queryFn: () => wishlistService.get() });
const ordersQuery = () => queryOptions({ queryKey: ["orders"], queryFn: () => ordersService.list() });
const $$splitComponentImporter$b = () => import("./index-CwXLhsUD.mjs");
const Route$b = createFileRoute("/_shop/")({
  head: () => ({
    meta: [{
      title: "ShoppersEnd — Shop everyday essentials"
    }, {
      name: "description",
      content: "Browse electronics, fashion, home, beauty, grocery, and more on ShoppersEnd. Demo storefront with sample catalog."
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.ensureQueryData(categoriesQuery());
    context.queryClient.ensureQueryData(productsQuery({
      sort: "newest",
      pageSize: 10
    }));
    context.queryClient.ensureQueryData(productsQuery({
      sort: "rating",
      pageSize: 10
    }));
    context.queryClient.ensureQueryData(productsQuery({
      minDiscount: 20,
      pageSize: 10
    }));
    context.queryClient.ensureQueryData(productsQuery({
      sort: "popularity",
      pageSize: 10
    }));
  },
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./wishlist-pQ3PLxfU.mjs");
const Route$a = createFileRoute("/_shop/wishlist")({
  head: () => ({
    meta: [{
      title: "Your wishlist — ShoppersEnd"
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.ensureQueryData(wishlistQuery());
  },
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
function toFilters(s) {
  return {
    q: s.q,
    categoryId: s.categoryId,
    brands: s.brands ? s.brands.split(",").filter(Boolean) : void 0,
    minPrice: s.minPrice,
    maxPrice: s.maxPrice,
    minRating: s.minRating,
    inStock: s.inStock,
    minDiscount: s.minDiscount,
    sort: s.sort ?? "relevance",
    page: s.page ?? 1,
    pageSize: 24
  };
}
const $$splitComponentImporter$9 = () => import("./search-wlEFMt8a.mjs");
const searchSchema = objectType({
  q: stringType().optional(),
  categoryId: stringType().optional(),
  brands: stringType().optional(),
  minPrice: coerce.number().optional(),
  maxPrice: coerce.number().optional(),
  minRating: coerce.number().optional(),
  minDiscount: coerce.number().optional(),
  inStock: coerce.boolean().optional(),
  sort: enumType(["relevance", "newest", "price_asc", "price_desc", "rating", "popularity"]).optional(),
  page: coerce.number().optional()
});
const Route$9 = createFileRoute("/_shop/search")({
  validateSearch: searchSchema,
  head: ({
    params: _p,
    match
  }) => {
    const s = match.search ?? {};
    const title = s.q ? `Search: ${s.q} — ShoppersEnd` : "All products — ShoppersEnd";
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: "Browse and filter products on ShoppersEnd."
      }]
    };
  },
  loaderDeps: ({
    search
  }) => search,
  loader: ({
    context,
    deps
  }) => {
    const filters = toFilters(deps);
    context.queryClient.ensureQueryData(productsQuery(filters));
    context.queryClient.ensureQueryData(facetsQuery({
      q: filters.q,
      categoryId: filters.categoryId
    }));
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./register-OyA8KUbf.mjs");
const Route$8 = createFileRoute("/_shop/register")({
  head: () => ({
    meta: [{
      title: "Create account — ShoppersEnd"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./profile-CNfAkROz.mjs");
const Route$7 = createFileRoute("/_shop/profile")({
  head: () => ({
    meta: [{
      title: "My Profile — ShoppersEnd"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./orders-Qwp4Wj1T.mjs");
const Route$6 = createFileRoute("/_shop/orders")({
  head: () => ({
    meta: [{
      title: "Your orders — ShoppersEnd"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./login-BtmnCQRE.mjs");
const Route$5 = createFileRoute("/_shop/login")({
  head: () => ({
    meta: [{
      title: "Sign in — ShoppersEnd"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./discover-DkN60gWp.mjs");
const Route$4 = createFileRoute("/_shop/discover")({
  head: () => ({
    meta: [{
      title: "Discover — ShoppersEnd"
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.ensureQueryData(productsQuery({
      sort: "popularity",
      pageSize: 20
    }));
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./checkout-DYmJY-fo.mjs");
const Route$3 = createFileRoute("/_shop/checkout")({
  head: () => ({
    meta: [{
      title: "Checkout — ShoppersEnd"
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.ensureQueryData(cartQuery());
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./cart-CSSsVP27.mjs");
const Route$2 = createFileRoute("/_shop/cart")({
  head: () => ({
    meta: [{
      title: "Your cart — ShoppersEnd"
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.ensureQueryData(cartQuery());
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./p._slug-CJXXWZjS.mjs");
const Route$1 = createFileRoute("/_shop/p/$slug")({
  loader: async ({
    context,
    params
  }) => {
    try {
      await context.queryClient.ensureQueryData(productQuery(params.slug));
    } catch {
      throw notFound();
    }
    context.queryClient.ensureQueryData(similarProductsQuery(params.slug));
    context.queryClient.ensureQueryData(reviewsQuery(params.slug));
  },
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.slug.replace(/-/g, " ")} — ShoppersEnd`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./c._slug-BfH0v5rI.mjs");
const Route = createFileRoute("/_shop/c/$slug")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ShopRoute = Route$c.update({
  id: "/_shop",
  getParentRoute: () => Route$d
});
const ShopIndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => ShopRoute
});
const ShopWishlistRoute = Route$a.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => ShopRoute
});
const ShopSearchRoute = Route$9.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => ShopRoute
});
const ShopRegisterRoute = Route$8.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => ShopRoute
});
const ShopProfileRoute = Route$7.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => ShopRoute
});
const ShopOrdersRoute = Route$6.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => ShopRoute
});
const ShopLoginRoute = Route$5.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => ShopRoute
});
const ShopDiscoverRoute = Route$4.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => ShopRoute
});
const ShopCheckoutRoute = Route$3.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => ShopRoute
});
const ShopCartRoute = Route$2.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => ShopRoute
});
const ShopPSlugRoute = Route$1.update({
  id: "/p/$slug",
  path: "/p/$slug",
  getParentRoute: () => ShopRoute
});
const ShopCSlugRoute = Route.update({
  id: "/c/$slug",
  path: "/c/$slug",
  getParentRoute: () => ShopRoute
});
const ShopRouteChildren = {
  ShopCartRoute,
  ShopCheckoutRoute,
  ShopDiscoverRoute,
  ShopLoginRoute,
  ShopOrdersRoute,
  ShopProfileRoute,
  ShopRegisterRoute,
  ShopSearchRoute,
  ShopWishlistRoute,
  ShopIndexRoute,
  ShopCSlugRoute,
  ShopPSlugRoute
};
const ShopRouteWithChildren = ShopRoute._addFileChildren(ShopRouteChildren);
const rootRouteChildren = {
  ShopRoute: ShopRouteWithChildren
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 3e4, refetchOnWindowFocus: false, retry: 1 }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent"
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ApiException as A,
  Route$9 as R,
  Route$1 as a,
  Route as b,
  addressService as c,
  authService as d,
  cartQuery as e,
  cartService as f,
  categoriesQuery as g,
  facetsQuery as h,
  ordersService as i,
  productsQuery as j,
  productsService as k,
  router as l,
  meQuery as m,
  wishlistService as n,
  ordersQuery as o,
  productQuery as p,
  reviewsQuery as r,
  similarProductsQuery as s,
  toFilters as t,
  wishlistQuery as w
};
