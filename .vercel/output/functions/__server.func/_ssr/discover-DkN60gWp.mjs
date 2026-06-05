import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { j as productsQuery } from "./router-Jzlhdj0b.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, H as Heart, f as MessageCircle, m as Share2, q as ShoppingCart } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function DiscoverPage() {
  const {
    data
  } = useSuspenseQuery(productsQuery({
    sort: "popularity",
    pageSize: 20
  }));
  const products = data.items;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 bg-black text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "p-2 rounded-full hover:bg-white/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Discover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" }),
      " "
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar", style: {
      scrollBehavior: "smooth"
    }, children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(DiscoverCard, { product }, product.id)) })
  ] });
}
function DiscoverCard({
  product
}) {
  const [isActive, setIsActive] = reactExports.useState(false);
  const cardRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold: 0.6
      }
      // Needs to be 60% visible to be considered active
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: cardRef, className: "relative h-full w-full snap-center snap-always flex items-center justify-center bg-zinc-900 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.img, { src: product.images[0]?.url, alt: product.name, className: "absolute inset-0 w-full h-full object-cover opacity-80", initial: {
      scale: 1.1
    }, animate: {
      scale: isActive ? 1 : 1.1
    }, transition: {
      duration: 4,
      ease: "easeOut"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-6 left-4 right-16 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: isActive ? 1 : 0,
      y: isActive ? 0 : 20
    }, transition: {
      delay: 0.2
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block px-2 py-1 mb-2 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded", children: product.brand }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-1 leading-tight", children: product.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300 line-clamp-2 mb-3", children: product.shortDescription }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold", children: [
          "₹",
          product.price
        ] }),
        product.mrp > product.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm line-through text-gray-400", children: [
          "₹",
          product.mrp
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 right-4 z-10 flex flex-col items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 28 }), label: Math.floor(Math.random() * 500) + 100 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 28 }), label: Math.floor(Math.random() * 50) + 5 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 28 }), label: "Share" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/p/${product.slug}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.button, { whileHover: {
        scale: 1.1
      }, whileTap: {
        scale: 0.9
      }, className: "mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 24 }) }) })
    ] })
  ] });
}
function ActionButton({
  icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { className: "flex flex-col items-center gap-1 text-white hover:text-gray-300", whileHover: {
    scale: 1.1
  }, whileTap: {
    scale: 0.9
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold drop-shadow-md", children: label })
  ] });
}
export {
  DiscoverPage as component
};
