import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { ApiException } from "@/services/api-client";

export const Route = createFileRoute("/_shop/register")({
  head: () => ({ meta: [{ title: "Create account — ShoppersEnd" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const register = useMutation({
    mutationFn: () => authService.register(form),
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Welcome to ShoppersEnd");
      navigate({ to: "/" });
    },
    onError: (e) => setError(e instanceof ApiException ? e.message : "Registration failed"),
  });

  return (
    <div className="container-page flex justify-center py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Demo storefront — data lives in your browser only.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); setError(null); register.mutate(); }}
          className="mt-6 space-y-4 rounded-lg border bg-card p-5"
        >
          <Field label="Full name">
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" />
          </Field>
          <Field label="Phone (optional)">
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" />
          </Field>
          <Field label="Password">
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" />
          </Field>
          {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}
          <button
            type="submit"
            disabled={register.isPending}
            className="h-10 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {register.isPending ? "Creating account…" : "Create account"}
          </button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-semibold text-[var(--primary)] hover:underline">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
