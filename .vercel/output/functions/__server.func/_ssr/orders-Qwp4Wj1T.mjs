import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as ordersQuery, m as meQuery } from "./router-Jzlhdj0b.mjs";
import { f as formatINR } from "./format-Ba4izUCB.mjs";
import "../_libs/sonner.mjs";
import { P as Package, c as CircleCheck, d as Clock, b as Circle } from "../_libs/lucide-react.mjs";
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
function OrdersPage() {
  const {
    data: meData
  } = useQuery(meQuery());
  const {
    data: orders = [],
    isLoading
  } = useQuery({
    ...ordersQuery(),
    enabled: !!meData?.user
  });
  if (!meData?.user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Sign in to see your orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "mt-4 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]", children: "Sign in" })
    ] });
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-page py-10 text-sm text-muted-foreground", children: "Loading orders…" });
  if (orders.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 48, className: "mx-auto text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-xl font-semibold", children: "No orders yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "When you place an order, it will appear here." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-5 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]", children: "Start shopping" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-4 text-xl font-semibold", children: "Your orders" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Order #",
            o.orderNumber
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: new Date(o.placedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]", children: o.status.replace(/_/g, " ") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pb-4 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStepper, { status: o.status }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-3 overflow-x-auto border-t pt-4", children: o.items.slice(0, 4).map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-48 flex-shrink-0 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.productImage || "https://placehold.co/100", alt: it.productName, className: "h-14 w-14 flex-shrink-0 rounded-md bg-[var(--surface-2)] object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line-clamp-2 text-xs", children: it.productName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Qty ",
            it.quantity
          ] })
        ] })
      ] }, it.productId)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between border-t pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold", children: formatINR(o.total) })
      ] })
    ] }, o.id)) })
  ] });
}
function OrderStepper({
  status
}) {
  const steps = [{
    id: "PENDING",
    label: "Placed"
  }, {
    id: "PROCESSING",
    label: "Processing"
  }, {
    id: "SHIPPED",
    label: "Shipped"
  }, {
    id: "DELIVERED",
    label: "Delivered"
  }];
  const isCancelled = status === "CANCELLED";
  if (isCancelled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm font-medium text-red-500 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
      " Order Cancelled"
    ] });
  }
  const currentIdx = steps.findIndex((s) => s.id === status);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center min-w-[300px]", children: steps.map((step, idx) => {
    const isCompleted = idx < activeIdx;
    const isCurrent = idx === activeIdx;
    const isLast = idx === steps.length - 1;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center ${isLast ? "" : "flex-1"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 relative", children: [
        isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full bg-[var(--primary)] text-primary-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 }) }) : isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full bg-[var(--primary)] text-primary-foreground flex items-center justify-center ring-4 ring-[var(--primary)]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full border-2 border-muted bg-card text-muted-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { size: 10, className: "opacity-0" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-medium absolute -bottom-5 whitespace-nowrap ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`, children: step.label })
      ] }),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 flex-1 mx-2 rounded-full ${isCompleted ? "bg-[var(--primary)]" : "bg-muted"}` })
    ] }, step.id);
  }) });
}
export {
  OrdersPage as component
};
