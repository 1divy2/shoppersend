import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as ApiException, d as authService } from "./router-Jzlhdj0b.mjs";
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
function RegisterPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = reactExports.useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [error, setError] = reactExports.useState(null);
  const register = useMutation({
    mutationFn: () => authService.register(form),
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Welcome to ShoppersEnd");
      navigate({
        to: "/"
      });
    },
    onError: (e) => setError(e instanceof ApiException ? e.message : "Registration failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-page flex justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Create your account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Demo storefront — data lives in your browser only." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      setError(null);
      register.mutate();
    }, className: "mt-6 space-y-4 rounded-lg border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: form.fullName, onChange: (e) => setForm({
        ...form,
        fullName: e.target.value
      }), className: "h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: form.email, onChange: (e) => setForm({
        ...form,
        email: e.target.value
      }), className: "h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", value: form.phone, onChange: (e) => setForm({
        ...form,
        phone: e.target.value
      }), className: "h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, minLength: 6, value: form.password, onChange: (e) => setForm({
        ...form,
        password: e.target.value
      }), className: "h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: register.isPending, className: "h-10 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50", children: register.isPending ? "Creating account…" : "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
        "Already have an account? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "font-semibold text-[var(--primary)] hover:underline", children: "Sign in" })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
export {
  RegisterPage as component
};
