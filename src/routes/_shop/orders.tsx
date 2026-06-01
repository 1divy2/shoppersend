import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, CheckCircle2, Circle, Clock } from "lucide-react";
import { ordersQuery, meQuery } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/_shop/orders")({
  head: () => ({ meta: [{ title: "Your orders — ShoppersEnd" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { data: meData } = useQuery(meQuery());
  const { data: orders = [], isLoading } = useQuery({ ...ordersQuery(), enabled: !!meData?.user });

  if (!meData?.user) {
    return (
      <div className="container-page py-12 text-center">
        <h1 className="text-xl font-semibold">Sign in to see your orders</h1>
        <Link to="/login" className="mt-4 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) return <div className="container-page py-10 text-sm text-muted-foreground">Loading orders…</div>;

  if (orders.length === 0) {
    return (
      <div className="container-page py-12 text-center">
        <Package size={48} className="mx-auto text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">No orders yet</h1>
        <p className="mt-1 text-sm text-muted-foreground">When you place an order, it will appear here.</p>
        <Link to="/" className="mt-5 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="mb-4 text-xl font-semibold">Your orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Order #{o.orderNumber}</div>
                <div className="text-sm font-semibold">{new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
                {o.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-4 pb-4 overflow-x-auto">
              <OrderStepper status={o.status as OrderStatus} />
            </div>
            
            <div className="mt-3 flex gap-3 overflow-x-auto border-t pt-4">
              {o.items.slice(0, 4).map((it) => (
                <div key={it.productId} className="flex w-48 flex-shrink-0 gap-2">
                  <img src={it.productImage || "https://placehold.co/100"} alt={it.productName} className="h-14 w-14 flex-shrink-0 rounded-md bg-[var(--surface-2)] object-cover" />
                  <div>
                    <div className="line-clamp-2 text-xs">{it.productName}</div>
                    <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-base font-bold">{formatINR(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderStepper({ status }: { status: OrderStatus }) {
  const steps = [
    { id: "PENDING", label: "Placed" },
    { id: "PROCESSING", label: "Processing" },
    { id: "SHIPPED", label: "Shipped" },
    { id: "DELIVERED", label: "Delivered" },
  ];

  const isCancelled = status === "CANCELLED";
  
  if (isCancelled) {
    return (
      <div className="flex items-center text-sm font-medium text-red-500 gap-2">
        <CheckCircle2 size={16} /> Order Cancelled
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.id === status);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="flex items-center min-w-[300px]">
      {steps.map((step, idx) => {
        const isCompleted = idx < activeIdx;
        const isCurrent = idx === activeIdx;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.id} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-2 relative">
              {isCompleted ? (
                <div className="h-6 w-6 rounded-full bg-[var(--primary)] text-primary-foreground flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </div>
              ) : isCurrent ? (
                <div className="h-6 w-6 rounded-full bg-[var(--primary)] text-primary-foreground flex items-center justify-center ring-4 ring-[var(--primary)]/20">
                  <Clock size={14} />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-muted bg-card text-muted-foreground flex items-center justify-center">
                  <Circle size={10} className="opacity-0" />
                </div>
              )}
              <span className={`text-[10px] font-medium absolute -bottom-5 whitespace-nowrap ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-1 flex-1 mx-2 rounded-full ${isCompleted ? "bg-[var(--primary)]" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
