import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { cartQuery, productsQuery } from "@/lib/queries";
import { cartService } from "@/services/cart.service";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/_shop/cart")({
  head: () => ({ meta: [{ title: "Your cart — ShoppersEnd" }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(cartQuery());
  },
  component: CartPage,
});

function CartPage() {
  const { data: cart } = useSuspenseQuery(cartQuery());
  // We need product details — fetch all products and join client-side (mock simplicity).
  const { data: productsPage } = useQuery(productsQuery({ pageSize: 100 }));
  const qc = useQueryClient();

  const update = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.update(productId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
  const remove = useMutation({
    mutationFn: (productId: string) => cartService.remove(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },
  });

  const lines = cart.items.map((item) => {
    const product = productsPage?.items.find((p) => p.id === item.productId);
    return { item, product };
  });
  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <ShoppingBag size={48} className="text-muted-foreground" />
          <h1 className="mt-4 text-xl font-semibold">Your cart is empty</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse the catalog and add items to get started.</p>
          <Link to="/" className="mt-5 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="mb-4 text-xl font-semibold">Shopping cart <span className="text-sm font-normal text-muted-foreground">({cart.items.length} {cart.items.length === 1 ? "item" : "items"})</span></h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {lines.map(({ item, product }) => (
            <div key={item.productId} className="flex gap-4 rounded-lg border bg-card p-4">
              <Link to="/p/$slug" params={{ slug: product?.slug ?? "" }} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-[var(--surface-2)]">
                {product && <img src={product.images[0]?.url} alt={product.name} className="h-full w-full object-cover" />}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{product?.brand}</div>
                    <Link to="/p/$slug" params={{ slug: product?.slug ?? "" }} className="line-clamp-2 text-sm font-medium hover:text-[var(--primary)]">
                      {product?.name ?? "Product"}
                    </Link>
                  </div>
                  <button onClick={() => remove.mutate(item.productId)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-2 text-sm font-semibold">{formatINR(item.unitPrice)} <span className="text-xs font-normal text-muted-foreground">each</span></div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center rounded-md border">
                    <button
                      onClick={() => update.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
                      className="h-8 w-8 hover:bg-muted"
                    >−</button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => update.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                      disabled={product ? item.quantity >= product.stock : false}
                      className="h-8 w-8 hover:bg-muted disabled:opacity-40"
                    >+</button>
                  </div>
                  <div className="text-sm font-semibold">{formatINR(item.unitPrice * item.quantity)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="self-start rounded-lg border bg-card p-5 lg:sticky lg:top-24">
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order summary</div>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            <Row label="Estimated shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
            <Row label="Estimated tax (5%)" value={formatINR(tax)} />
            {shipping === 0 && subtotal >= 999 && (
              <div className="rounded-md bg-[var(--success)]/10 px-2 py-1.5 text-xs text-[var(--success)]">
                You qualified for free shipping
              </div>
            )}
          </dl>
          <div className="my-4 border-t" />
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold">Total</span>
            <span className="text-2xl font-bold">{formatINR(total)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-5 block rounded-md bg-[var(--accent)] py-3 text-center text-sm font-bold text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]"
          >
            Proceed to checkout
          </Link>
          <Link to="/" className="mt-2 block text-center text-sm text-[var(--primary)] hover:underline">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
