import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as useSuspenseQuery, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as categoriesQuery, j as productsQuery } from "./router-Jzlhdj0b.mjs";
import { P as ProductCard } from "./ProductCard-By3ALuro.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useScroll, c as useTransform, m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { a as ChevronRight, r as Sparkles, G as Gift, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "./format-Ba4izUCB.mjs";
import "./PriceBlock-Ch8f25OO.mjs";
function ForYouRecommendations() {
  const { data, isLoading } = useQuery(productsQuery({ pageSize: 5 }));
  if (isLoading || !data || data.items.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-16 w-full max-w-7xl mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-foreground", children: "For You" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 px-3 py-1 text-xs font-semibold text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14 }),
        " AI Recommended"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", children: data.items.slice(0, 5).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product }, product.id)) })
  ] });
}
const PRIZES = [
  { id: 1, label: "10% OFF", color: "#FF4B4B", discount: "WELCOME10" },
  { id: 2, label: "Better Luck", color: "#2D3436" },
  { id: 3, label: "FREE SHIPPING", color: "#0984E3", discount: "FREESHIP" },
  { id: 4, label: "15% OFF", color: "#00B894", discount: "SAVE15" },
  { id: 5, label: "Better Luck", color: "#2D3436" },
  { id: 6, label: "₹200 OFF", color: "#6C5CE7", discount: "FLAT200" }
];
function SpinWheel() {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [isSpinning, setIsSpinning] = reactExports.useState(false);
  const [rotation, setRotation] = reactExports.useState(0);
  const [wonPrize, setWonPrize] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const hasSpun = localStorage.getItem("hasSpunToday");
    if (!hasSpun) {
      const timer = setTimeout(() => setIsOpen(true), 5e3);
      return () => clearTimeout(timer);
    }
  }, []);
  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    const spins = 5;
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const degreesPerPrize = 360 / PRIZES.length;
    const sliceCenter = prizeIndex * degreesPerPrize + degreesPerPrize / 2;
    const targetRotation = spins * 360 - sliceCenter;
    const newRotation = rotation + targetRotation + (360 - rotation % 360);
    setRotation(newRotation);
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(PRIZES[prizeIndex]);
      localStorage.setItem("hasSpunToday", "true");
      if (PRIZES[prizeIndex].discount) {
        toast.success(`You won! Use code ${PRIZES[prizeIndex].discount}`);
      } else {
        toast("Aw, better luck next time!");
      }
    }, 5e3);
  };
  const gradientStops = PRIZES.map((prize, i) => {
    const angle = 360 / PRIZES.length;
    return `${prize.color} ${i * angle}deg ${(i + 1) * angle}deg`;
  }).join(", ");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !isOpen && !localStorage.getItem("hasSpunToday") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.button,
      {
        initial: { scale: 0, y: 50 },
        animate: { scale: 1, y: 0 },
        whileHover: { scale: 1.1 },
        onClick: () => setIsOpen(true),
        className: "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 24, className: "text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm", children: "1" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.9, y: 20 },
            animate: { scale: 1, y: 0 },
            exit: { scale: 0.9, y: 20 },
            className: "relative w-full max-w-md overflow-hidden rounded-[2rem] bg-background p-8 text-center shadow-2xl",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setIsOpen(false),
                  className: "absolute right-4 top-4 rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors",
                  disabled: isSpinning,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-2xl font-bold", children: "Daily Spin to Win!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-8 text-sm text-muted-foreground", children: "Test your luck and win exclusive discounts for your next purchase." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto w-64 h-64 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 left-1/2 z-10 h-8 w-8 -translate-x-1/2 text-primary drop-shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 21l-12-18h24z" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full w-full rounded-full border-4 border-foreground/10 shadow-inner relative overflow-hidden",
                    animate: { rotate: rotation },
                    transition: { duration: 5, ease: [0.2, 0.8, 0.2, 1] },
                    style: { background: `conic-gradient(${gradientStops})` },
                    children: PRIZES.map((prize, i) => {
                      const angle = 360 / PRIZES.length;
                      const rotateAngle = i * angle + angle / 2;
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute inset-0 flex items-start justify-center pt-6",
                          style: { transform: `rotate(${rotateAngle}deg)` },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-white font-bold text-xs",
                              style: { textShadow: "0px 1px 2px rgba(0,0,0,0.5)" },
                              children: prize.label
                            }
                          )
                        },
                        prize.id
                      );
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-foreground shadow-lg" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: wonPrize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  className: "mb-4",
                  children: wonPrize.discount ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/10 p-4 text-[var(--success)]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold mb-1", children: [
                      "Congratulations! You won ",
                      wonPrize.label
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-80 mb-2", children: "Use code at checkout:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-lg font-bold tracking-wider bg-white/50 dark:bg-black/20 py-1 rounded select-all", children: wonPrize.discount })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-muted p-4 text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-1", children: "Better luck next time!" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Come back tomorrow for another spin." })
                  ] })
                },
                "prize"
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.button,
                {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: spin,
                  disabled: isSpinning || !!localStorage.getItem("hasSpunToday"),
                  className: "w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg disabled:opacity-50 transition-all hover:shadow-xl",
                  children: isSpinning ? "SPINNING..." : "SPIN NOW"
                },
                "spin-btn"
              ) })
            ]
          }
        )
      }
    ) })
  ] });
}
function HomePage() {
  const {
    data: categories
  } = useSuspenseQuery(categoriesQuery());
  const {
    data: newest
  } = useSuspenseQuery(productsQuery({
    sort: "newest",
    pageSize: 10
  }));
  const {
    data: topRated
  } = useSuspenseQuery(productsQuery({
    sort: "rating",
    pageSize: 10
  }));
  const {
    data: deals
  } = useSuspenseQuery(productsQuery({
    minDiscount: 20,
    pageSize: 10
  }));
  const {
    data: recommended
  } = useSuspenseQuery(productsQuery({
    sort: "popularity",
    pageSize: 10
  }));
  const {
    scrollY
  } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.2]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-6 md:py-8 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "md:col-span-2 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[#1a2545] p-6 text-primary-foreground md:p-10 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none", style: {
          y: y1
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute bottom-0 left-10 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-2xl pointer-events-none", style: {
          y: useTransform(scrollY, [0, 500], [0, -50])
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { style: {
          y: useTransform(scrollY, [0, 300], [0, 50]),
          opacity
        }, className: "relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-[var(--accent)]", children: "Featured" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-2xl font-bold leading-tight md:text-4xl", children: "Everyday essentials, ready to ship" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 max-w-md text-sm text-primary-foreground/80 md:text-base", children: [
            "Browse a sample catalog of ",
            newest.total + topRated.total,
            " products across ",
            categories.length,
            " categories."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/search", className: "mt-5 inline-flex items-center gap-1 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] transition-transform hover:scale-105 active:scale-95", children: [
            "Browse all products ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Today's coupons" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 rounded-md bg-muted/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-[var(--primary)] px-2 py-1 text-xs font-bold text-primary-foreground", children: "WELCOME10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "10% off first order over ₹999" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 rounded-md bg-muted/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-[var(--primary)] px-2 py-1 text-xs font-bold text-primary-foreground", children: "FLAT200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Flat ₹200 off on orders over ₹1,999" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: "Shop by category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/c/$slug", params: {
        slug: c.slug
      }, className: "flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center transition hover:border-[var(--primary)] hover:shadow-[var(--shadow-card-hover)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--primary)] text-lg font-bold", children: c.name.charAt(0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium leading-tight", children: c.name })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForYouRecommendations, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductRow, { title: "New arrivals", items: newest.items }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductRow, { title: "Top rated", items: topRated.items }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductRow, { title: "Deals — 20% off or more", items: deals.items }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SpinWheel, {})
  ] });
}
function ProductRow({
  title,
  items
}) {
  if (!items.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search", className: "text-sm font-medium text-[var(--primary)] hover:underline", children: "View all" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", children: items.slice(0, 5).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
  ] });
}
export {
  HomePage as component
};
