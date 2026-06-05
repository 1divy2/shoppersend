import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as wishlistService, w as wishlistQuery } from "./router-Jzlhdj0b.mjs";
import { c as cn, f as formatINR } from "./format-Ba4izUCB.mjs";
import { P as PriceBlock } from "./PriceBlock-Ch8f25OO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as Star, H as Heart, o as ShieldCheck, X, a as ChevronRight, e as CreditCard, c as CircleCheck } from "../_libs/lucide-react.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
function Rating({ value, count, size = "sm", showCount = true, className }) {
  const iconSize = size === "sm" ? 12 : 14;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("inline-flex items-center gap-1", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-sm bg-[var(--rating)] px-1.5 py-0.5 text-xs font-semibold text-white", children: [
      value.toFixed(1),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: iconSize, fill: "currentColor", strokeWidth: 0 })
    ] }),
    showCount && count !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: count > 0 ? `(${count.toLocaleString("en-IN")})` : "No reviews yet" })
  ] });
}
function QuickCheckoutDrawer({ isOpen, onClose, product, quantity = 1 }) {
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [isSuccess, setIsSuccess] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);
  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Payment successful!");
      setTimeout(() => {
        onClose();
      }, 2e3);
    }, 1500);
  };
  const total = (product?.price || 0) * quantity;
  const image = product?.images?.[0]?.url || "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: !isProcessing ? onClose : void 0,
        className: "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring", damping: 25, stiffness: 200 },
        className: "fixed bottom-0 left-0 right-0 z-[101] flex flex-col rounded-t-3xl bg-[var(--surface)] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] md:left-auto md:right-4 md:top-4 md:bottom-auto md:w-[400px] md:rounded-3xl",
        children: !isSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "text-green-500" }),
              " Secure Checkout"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                disabled: isProcessing,
                className: "rounded-full bg-muted p-2 hover:bg-muted-foreground/20 disabled:opacity-50",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-4 rounded-xl border p-3 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted", children: image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image, alt: "Product", className: "h-full w-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-medium", children: product?.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                "Qty: ",
                quantity
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: formatINR(total) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 space-y-3 rounded-xl border p-4 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(total) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shipping" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "Free" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-3 flex justify-between font-bold text-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(total) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleCheckout,
                disabled: isProcessing,
                className: "group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black px-4 py-4 text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black",
                children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: { rotate: 360 },
                      transition: { repeat: Infinity, duration: 1, ease: "linear" },
                      className: "h-5 w-5 rounded-full border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent"
                    }
                  ),
                  "Processing..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-base font-bold tracking-wide", children: [
                  "Buy with Apple Pay ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18, className: "transition-transform group-hover:translate-x-1" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleCheckout,
                disabled: isProcessing,
                className: "flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18 }),
                  " Pay with Card"
                ]
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: "flex flex-col items-center justify-center py-10 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { type: "spring", damping: 12, delay: 0.1 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 80, className: "text-green-500 mb-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: "Payment Successful!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Your order is being processed." })
            ]
          }
        )
      }
    )
  ] }) });
}
function ProductCard({ product, compact = false }) {
  const [isDrawerOpen, setIsDrawerOpen] = reactExports.useState(false);
  const qc = useQueryClient();
  const { data: wishlist } = useQuery(wishlistQuery());
  const isWishlisted = wishlist?.items.some((i) => i.productId === product.id) ?? false;
  const toggleWishlist = useMutation({
    mutationFn: () => isWishlisted ? wishlistService.remove(product.id) : wishlistService.add(product.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      whileHover: { y: -6, scale: 1.01 },
      transition: { type: "spring", stiffness: 300, damping: 20 },
      className: "group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            type: "button",
            whileTap: { scale: 0.85 },
            whileHover: { scale: 1.1 },
            "aria-label": isWishlisted ? "Remove from wishlist" : "Add to wishlist",
            onClick: (e) => {
              e.preventDefault();
              toggleWishlist.mutate();
            },
            className: "absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-muted-foreground shadow-sm transition hover:text-destructive",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, fill: isWishlisted ? "currentColor" : "none", className: isWishlisted ? "text-destructive" : "" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/p/$slug", params: { slug: product.slug }, className: "flex h-full flex-col focus-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-[var(--surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.images[0]?.url,
              alt: product.images[0]?.alt ?? product.name,
              className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-1 flex-col gap-1.5 p-3", compact && "p-2.5"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground", children: product.brand }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "line-clamp-2 text-sm font-medium leading-snug text-foreground", children: product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Rating, { value: product.ratingAverage, count: product.ratingCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PriceBlock, { price: product.price, mrp: product.mrp, size: "sm" }) }),
            product.stock > 0 && product.stock <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-medium text-[var(--warning)]", children: [
              "Only ",
              product.stock,
              " left"
            ] }),
            product.stock === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium text-destructive", children: "Out of stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDrawerOpen(true);
                },
                className: "mt-2 w-full rounded-md bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
                children: "Buy Now"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuickCheckoutDrawer,
          {
            isOpen: isDrawerOpen,
            onClose: () => setIsDrawerOpen(false),
            product
          }
        )
      ]
    }
  );
}
export {
  ProductCard as P,
  QuickCheckoutDrawer as Q,
  Rating as R
};
