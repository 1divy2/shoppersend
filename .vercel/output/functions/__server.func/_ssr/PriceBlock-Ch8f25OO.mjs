import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as formatINR, c as cn, d as discountPct } from "./format-Ba4izUCB.mjs";
const sizes = {
  sm: { price: "text-sm font-semibold", mrp: "text-xs", disc: "text-xs" },
  md: { price: "text-base font-semibold", mrp: "text-sm", disc: "text-sm" },
  lg: { price: "text-2xl font-bold", mrp: "text-base", disc: "text-sm" }
};
function PriceBlock({ price, mrp, size = "md", className }) {
  const off = discountPct(mrp, price);
  const s = sizes[size];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-wrap items-baseline gap-2", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s.price, children: formatINR(price) }),
    off > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-muted-foreground line-through", s.mrp), children: formatINR(mrp) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-semibold text-[var(--discount)]", s.disc), children: [
        off,
        "% off"
      ] })
    ] })
  ] });
}
export {
  PriceBlock as P
};
