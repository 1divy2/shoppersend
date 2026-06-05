import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as useSuspenseQuery, a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { w as wishlistQuery, f as cartService, n as wishlistService, j as productsQuery } from "./router-Jzlhdj0b.mjs";
import { P as PriceBlock } from "./PriceBlock-Ch8f25OO.mjs";
import { H as Heart, m as Share2, q as ShoppingCart, w as Trash2 } from "../_libs/lucide-react.mjs";
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
import "./format-Ba4izUCB.mjs";
function WishlistPage() {
  const {
    data: wl
  } = useSuspenseQuery(wishlistQuery());
  const {
    data: page
  } = useQuery(productsQuery({
    pageSize: 100
  }));
  const qc = useQueryClient();
  const remove = useMutation({
    mutationFn: (id) => wishlistService.remove(id),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["wishlist"]
    })
  });
  const move = useMutation({
    mutationFn: async (productId) => {
      await cartService.add(productId);
      await wishlistService.remove(productId);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["wishlist"]
      });
      qc.invalidateQueries({
        queryKey: ["cart"]
      });
      toast.success("Moved to cart");
    }
  });
  const items = wl.items.map((i) => page?.items.find((p) => p.id === i.productId)).filter((p) => !!p);
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-page py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 48, className: "text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-xl font-semibold", children: "Your wishlist is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Save items you love to find them later." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-5 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]", children: "Browse products" })
    ] }) });
  }
  const handleShare = () => {
    const shareLink = `${window.location.origin}/wishlist/shared/u_${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Wishlist link copied to clipboard!");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-semibold", children: [
        "Wishlist ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground", children: [
          "(",
          items.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleShare, className: "flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 16 }),
        " Share"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 rounded-lg border bg-card p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/p/$slug", params: {
        slug: p.slug
      }, className: "h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-[var(--surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.images[0]?.url, alt: p.name, className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: p.brand }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/p/$slug", params: {
          slug: p.slug
        }, className: "line-clamp-2 text-sm font-medium hover:text-[var(--primary)]", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PriceBlock, { price: p.price, mrp: p.mrp, size: "sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => move.mutate(p.id), disabled: p.stock === 0, className: "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--primary)] py-2 text-xs font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 12 }),
            " Move to cart"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove.mutate(p.id), className: "inline-flex items-center justify-center rounded-md border px-3 hover:bg-muted", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
        ] })
      ] })
    ] }, p.id)) })
  ] });
}
export {
  WishlistPage as component
};
