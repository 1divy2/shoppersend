import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { O as Outlet, u as useNavigate, e as useRouterState, L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { d as authService, e as cartQuery, w as wishlistQuery, m as meQuery, g as categoriesQuery } from "./_ssr/router-Jzlhdj0b.mjs";
import "./_libs/sonner.mjs";
import { S as Search, t as Sun, g as Moon, U as User, P as Package, H as Heart, L as LogOut, q as ShoppingCart } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/zod.mjs";
function Header() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cart } = useQuery(cartQuery());
  const { data: wishlist } = useQuery(wishlistQuery());
  const { data: meData } = useQuery(meQuery());
  const user = meData?.user;
  const routerState = useRouterState();
  const initialQ = routerState.location.pathname === "/search" ? routerState.location.search.q ?? "" : "";
  const [q, setQ] = reactExports.useState(initialQ);
  reactExports.useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);
  const cartCount = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.items.length ?? 0;
  const [isDark, setIsDark] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });
  reactExports.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);
  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      qc.invalidateQueries();
      navigate({ to: "/" });
    }
  });
  const onSearch = (e) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: q.trim() || void 0 } });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 border-b bg-[var(--primary)] text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page flex h-14 items-center gap-3 md:h-16 md:gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-baseline gap-1 focus-ring", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold tracking-tight md:text-xl", children: "ShoppersEnd" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-[10px] font-medium text-[var(--accent)] md:inline", children: "demo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onSearch, className: "relative flex flex-1 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "search",
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Search for products, brands and more",
          className: "h-9 w-full rounded-md bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-ring md:h-10"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-1 md:gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/discover", className: "hidden md:flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--accent)] hover:bg-white/10", children: "Discover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setIsDark(!isDark),
          className: "flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10",
          "aria-label": "Toggle dark mode",
          children: isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 18 })
        }
      ),
      user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-white/10 md:px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: user.fullName.split(" ")[0] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invisible absolute right-0 top-full z-20 mt-1 w-52 rounded-md border bg-popover py-1 text-popover-foreground opacity-0 shadow-[var(--shadow-pop)] transition-all group-hover:visible group-hover:opacity-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/profile", className: "flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14 }),
            " My Profile"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/orders", className: "flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14 }),
            " My orders"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/wishlist", className: "flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14 }),
            " Wishlist"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => logout.mutate(), className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 14 }),
            " Sign out"
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/10", children: "Sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/wishlist", className: "relative inline-flex h-9 items-center rounded-md px-2 hover:bg-white/10", "aria-label": "Wishlist", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 18 }),
        wishlistCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CounterBadge, { count: wishlistCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "relative inline-flex h-9 items-center gap-1.5 rounded-md px-2 hover:bg-white/10 md:px-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-sm md:inline", children: "Cart" }),
        cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CounterBadge, { count: cartCount })
      ] })
    ] })
  ] }) });
}
function CounterBadge({ count }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--accent-foreground)]", children: count > 99 ? "99+" : count });
}
function CategoryNav() {
  const { data: categories = [] } = useQuery(categoriesQuery());
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-page flex h-11 items-center gap-1 overflow-x-auto", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/c/$slug",
      params: { slug: c.slug },
      className: "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted",
      activeProps: { className: "bg-muted" },
      children: c.name
    },
    c.id
  )) }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-16 border-t bg-[var(--primary)] text-primary-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page grid gap-8 py-10 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold tracking-tight", children: "ShoppersEnd" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-primary-foreground/70", children: "A demonstration e-commerce frontend built on a swappable service layer. All catalog content shown is sample data." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Shop", links: ["All products", "Categories", "Deals", "New arrivals"] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Help", links: ["Order tracking", "Returns & refunds", "Shipping", "Contact us"] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Company", links: ["About", "Careers", "Press", "Privacy"] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-4 text-xs text-primary-foreground/60", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " ShoppersEnd demo. No real transactions are processed."
    ] }) })
  ] });
}
function FooterCol({ title, links }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-primary-foreground/70", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-default text-primary-foreground/85", children: l }) }, l)) })
  ] });
}
function ShopLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const SplitComponent = ShopLayout;
export {
  SplitComponent as component
};
