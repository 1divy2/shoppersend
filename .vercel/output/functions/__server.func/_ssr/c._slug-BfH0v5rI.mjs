import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as Route, g as categoriesQuery } from "./router-Jzlhdj0b.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
function CategoryRedirect() {
  const {
    slug
  } = Route.useParams();
  const {
    data: categories,
    isLoading
  } = useQuery(categoriesQuery());
  if (isLoading) return null;
  const cat = categories?.find((c) => c.slug === slug);
  if (!cat) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/search", search: {
    q: slug
  } });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/search", search: {
    categoryId: cat.id
  } });
}
export {
  CategoryRedirect as component
};
