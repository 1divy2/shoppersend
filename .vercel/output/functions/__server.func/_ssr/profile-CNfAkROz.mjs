import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { o as ordersQuery, w as wishlistQuery, d as authService, m as meQuery, c as addressService } from "./router-Jzlhdj0b.mjs";
import "../_libs/sonner.mjs";
import { U as User, P as Package, M as MapPin, e as CreditCard, l as Settings, a as ChevronRight, L as LogOut, H as Heart, n as Shield, h as PenLine } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
function ProfilePage() {
  const {
    data: meData,
    isLoading
  } = useQuery(meQuery());
  const {
    data: orders
  } = useQuery({
    ...ordersQuery(),
    enabled: !!meData?.user
  });
  const {
    data: wishlist
  } = useQuery({
    ...wishlistQuery(),
    enabled: !!meData?.user
  });
  const {
    data: addresses
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.list,
    enabled: !!meData?.user
  });
  const user = meData?.user;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      qc.invalidateQueries();
      navigate({
        to: "/"
      });
    }
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-page py-10 text-sm text-muted-foreground", children: "Loading profile…" });
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Sign in to view your profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "mt-4 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]", children: "Sign in" })
    ] });
  }
  const TABS = [{
    id: "overview",
    label: "Profile Overview",
    icon: User
  }, {
    id: "orders",
    label: "My Orders",
    icon: Package
  }, {
    id: "addresses",
    label: "Manage Addresses",
    icon: MapPin
  }, {
    id: "payments",
    label: "Payment Methods",
    icon: CreditCard
  }, {
    id: "settings",
    label: "Account Settings",
    icon: Settings
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[var(--surface-2)] min-h-[calc(100vh-140px)] py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-6 md:gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-full md:w-64 lg:w-72 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border p-5 mb-6 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-bold text-primary-foreground", children: user.fullName.charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Hello," }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-base truncate", children: user.fullName })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "bg-card rounded-xl border overflow-hidden", children: [
        TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(tab.id), className: `w-full flex items-center justify-between px-5 py-4 text-sm font-medium transition-colors border-b last:border-b-0
                      ${isActive ? "bg-[var(--primary)]/5 text-[var(--primary)] border-l-4 border-l-[var(--primary)]" : "text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground border-l-4 border-l-transparent"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: isActive ? "text-[var(--primary)]" : "text-muted-foreground" }),
              tab.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: `transition-transform ${isActive ? "text-[var(--primary)]" : "opacity-40"}` })
          ] }, tab.id);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => logout.mutate(), className: "w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors border-l-4 border-l-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 18 }),
          "Sign Out"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6", children: [
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Profile Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: orders?.length || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider", children: "Total Orders" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: wishlist?.items.length || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider", children: "Wishlist" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: addresses?.length || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider", children: "Addresses" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold capitalize", children: user.role.toLowerCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider", children: "Account Role" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b px-6 py-4 flex items-center justify-between bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-lg", children: "Personal Information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("settings"), className: "text-sm font-medium text-[var(--primary)] hover:underline", children: "Edit" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid sm:grid-cols-2 gap-y-6 gap-x-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: "Full Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-base", children: user.fullName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: "Email Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-base", children: user.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: "Phone Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-base", children: user.phone || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Not provided" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: "Member Since" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-base", children: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric"
              }) : "Recently" })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "My Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", className: "text-sm font-medium text-[var(--primary)] hover:underline", children: "View All" })
        ] }),
        orders && orders.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: orders.slice(0, 5).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b pb-4 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
                "Order #",
                o.orderNumber
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Placed on ",
                new Date(o.placedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)] uppercase tracking-wider", children: o.status.replace(/_/g, " ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2 overflow-hidden", children: [
              o.items.slice(0, 3).map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.productImage, alt: it.productName, className: "inline-block h-10 w-10 rounded-full ring-2 ring-card bg-[var(--surface-2)] object-cover" }, idx)),
              o.items.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-card bg-muted text-xs font-medium text-muted-foreground", children: [
                "+",
                o.items.length - 3
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", className: "text-sm font-medium text-[var(--primary)] hover:underline", children: "Track Order" })
          ] })
        ] }, o.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-10 text-center flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 48, className: "text-muted-foreground/50 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No orders yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Looks like you haven't placed an order recently." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]", children: "Start Shopping" })
        ] })
      ] }),
      activeTab === "addresses" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Manage Addresses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }),
            " Add New"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          addresses?.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border rounded-xl p-5 hover:border-[var(--primary)]/50 transition-colors group", children: [
            addr.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-5 right-5 rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700", children: "Default" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-base mb-1 pr-16", children: addr.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: addr.line1 }),
              addr.line2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: addr.line2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                addr.city,
                ", ",
                addr.state,
                " ",
                addr.pincode
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Phone: ",
                addr.phone
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t flex items-center gap-4 text-sm font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "hover:text-[var(--primary)] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 14 }),
                " Edit"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "hover:text-destructive flex items-center gap-1", children: "Remove" })
            ] })
          ] }, addr.id)),
          (!addresses || addresses.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full bg-card border border-dashed rounded-xl p-10 text-center flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 48, className: "text-muted-foreground/50 mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No saved addresses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Add a delivery address for faster checkout." })
          ] })
        ] })
      ] }),
      activeTab === "payments" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-4", children: "Payment Methods" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-10 text-center flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 48, className: "text-muted-foreground/50 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-1", children: "No saved cards" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Save your credit or debit cards for faster checkout." })
        ] })
      ] }),
      activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-4", children: "Account Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold mb-4", children: "Change Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "max-w-md space-y-4", onSubmit: (e) => e.preventDefault(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-muted-foreground mb-1", children: "Current Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", disabled: true, className: "w-full h-10 rounded-md border bg-muted/50 px-3 text-sm", placeholder: "••••••••" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-muted-foreground mb-1", children: "New Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", disabled: true, className: "w-full h-10 rounded-md border bg-muted/50 px-3 text-sm", placeholder: "••••••••" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "rounded-md bg-[var(--primary)] px-6 py-2 text-sm font-semibold text-primary-foreground opacity-50 cursor-not-allowed", children: "Update Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Password updates are disabled in this demo." })
          ] })
        ] })
      ] })
    ] })
  ] }) }) });
}
export {
  ProfilePage as component
};
