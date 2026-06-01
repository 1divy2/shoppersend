import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { ApiException } from "@/services/api-client";

export const Route = createFileRoute("/_shop/login")({
  head: () => ({ meta: [{ title: "Sign in — ShoppersEnd" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = useMutation({
    mutationFn: () => authService.login(email, password),
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Signed in");
      navigate({ to: "/" });
    },
    onError: (e) => setError(e instanceof ApiException ? e.message : "Sign-in failed"),
  });

  return (
    <div className="container-page flex justify-center py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">Sign in to ShoppersEnd</h1>
        <p className="mt-1 text-sm text-muted-foreground">Demo storefront — accounts are stored in your browser.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); setError(null); login.mutate(); }}
          className="mt-6 space-y-4 rounded-lg border bg-card p-5"
        >
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" />
          </Field>
          <Field label="Password">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus-ring" />
          </Field>
          {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}
          <button
            type="submit"
            disabled={login.isPending}
            className="h-10 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {login.isPending ? "Signing in…" : "Sign in"}
          </button>
          <div className="text-center text-sm text-muted-foreground">
            New here? <Link to="/register" className="font-semibold text-[var(--primary)] hover:underline">Create an account</Link>
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
