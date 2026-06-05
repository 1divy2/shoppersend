import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as useSuspenseQuery, a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as cartQuery, f as cartService, j as productsQuery } from "./router-Jzlhdj0b.mjs";
import { f as formatINR } from "./format-Ba4izUCB.mjs";
import { p as ShoppingBag, w as Trash2 } from "../_libs/lucide-react.mjs";
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
function CartPage() {
  const {
    data: cart
  } = useSuspenseQuery(cartQuery());
  const {
    data: productsPage
  } = useQuery(productsQuery({
    pageSize: 100
  }));
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: ({
      productId,
      quantity
    }) => cartService.update(productId, quantity),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["cart"]
    })
  });
  const remove = useMutation({
    mutationFn: (productId) => cartService.remove(productId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["cart"]
      });
      toast.success("Removed from cart");
    }
  });
  const lines = cart.items.map((item) => {
    const product = productsPage?.items.find((p) => p.id === item.productId);
    return {
      item,
      product
    };
  });
  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  if (cart.items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-page py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 48, className: "text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-xl font-semibold", children: "Your cart is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Browse the catalog and add items to get started." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-5 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]", children: "Continue shopping" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mb-4 text-xl font-semibold", children: [
      "Shopping cart ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground", children: [
        "(",
        cart.items.length,
        " ",
        cart.items.length === 1 ? "item" : "items",
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: lines.map(({
        item,
        product
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 rounded-lg border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/p/$slug", params: {
          slug: product?.slug ?? ""
        }, className: "h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-[var(--surface-2)]", children: product && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.images[0]?.url, alt: product.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: product?.brand }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/p/$slug", params: {
                slug: product?.slug ?? ""
              }, className: "line-clamp-2 text-sm font-medium hover:text-[var(--primary)]", children: product?.name ?? "Product" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove.mutate(item.productId), className: "text-muted-foreground hover:text-destructive", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm font-semibold", children: [
            formatINR(item.unitPrice),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "each" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center rounded-md border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update.mutate({
                productId: item.productId,
                quantity: item.quantity - 1
              }), className: "h-8 w-8 hover:bg-muted", children: "−" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 text-center text-sm font-semibold", children: item.quantity }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update.mutate({
                productId: item.productId,
                quantity: item.quantity + 1
              }), disabled: product ? item.quantity >= product.stock : false, className: "h-8 w-8 hover:bg-muted disabled:opacity-40", children: "+" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: formatINR(item.unitPrice * item.quantity) })
          ] })
        ] })
      ] }, item.productId)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "self-start rounded-lg border bg-card p-5 lg:sticky lg:top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Order summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Subtotal", value: formatINR(subtotal) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Estimated shipping", value: shipping === 0 ? "Free" : formatINR(shipping) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Estimated tax (5%)", value: formatINR(tax) }),
          shipping === 0 && subtotal >= 999 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-[var(--success)]/10 px-2 py-1.5 text-xs text-[var(--success)]", children: "You qualified for free shipping" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-4 border-t" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-semibold", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold", children: formatINR(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout", className: "mt-5 block rounded-md bg-[var(--accent)] py-3 text-center text-sm font-bold text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]", children: "Proceed to checkout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-2 block text-center text-sm text-[var(--primary)] hover:underline", children: "Continue shopping" })
      ] })
    ] })
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium", children: value })
  ] });
}
export {
  CartPage as component
};
