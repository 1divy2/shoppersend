import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MapPin, CreditCard, CheckCircle2, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { cartQuery } from "@/lib/queries";
import { addressService, ordersService } from "@/services/orders.service";
import { formatINR } from "@/lib/format";
import type { Address, PaymentMethod } from "@/lib/types";

export const Route = createFileRoute("/_shop/checkout")({
  head: () => ({ meta: [{ title: "Checkout — ShoppersEnd" }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(cartQuery());
  },
  component: CheckoutPage,
});


function CheckoutPage() {
  const { data: cart } = useSuspenseQuery(cartQuery());
  const { data: addresses } = useQuery({ queryKey: ["addresses"], queryFn: addressService.list });
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  const addAddress = useMutation({
    mutationFn: () => addressService.create({
      fullName: "Jane Doe",
      phone: "+91 9876543210",
      line1: "123 Tech Park",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      isDefault: true,
      label: "WORK"
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const placeOrder = useMutation({
    mutationFn: async () => {
      const order = await ordersService.place({ addressId: selectedAddress, paymentMethod });
      if (paymentMethod !== "COD") {
        try {
          await ordersService.pay(order.id);
        } catch (err: any) {
          // even if it fails, order is placed, but payment is failed
          throw new Error("Payment failed: " + (err.message || "Unknown error"));
        }
      }
      return order;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed and payment successful!");
      navigate({ to: "/orders" });
    },
    onError: (e: Error) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.error(e.message);
      navigate({ to: "/orders" });
    },
  });

  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-12 text-center">
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <Link to="/cart" className="mt-4 inline-block text-[var(--primary)] hover:underline">Return to cart</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-foreground" : ""}`}>
          <MapPin size={18} /> Delivery
        </div>
        <ChevronRight size={16} className="opacity-50" />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-foreground" : ""}`}>
          <CreditCard size={18} /> Payment
        </div>
        <ChevronRight size={16} className="opacity-50" />
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-foreground" : ""}`}>
          <CheckCircle2 size={18} /> Review
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Step 1: Address */}
          <div className={`rounded-xl border bg-card p-6 ${step !== 1 && "opacity-60 grayscale"}`}>
            <h2 className="mb-4 text-lg font-semibold flex justify-between items-center">
              1. Delivery Address
              {step > 1 && (
                <button onClick={() => setStep(1)} className="text-sm text-[var(--primary)] font-normal hover:underline">Edit</button>
              )}
            </h2>
            {step === 1 ? (
              <div className="space-y-4">
                {addresses?.length === 0 && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground flex flex-col items-center">
                    <p className="mb-4">No addresses found. You need to add a delivery address.</p>
                    <button
                      onClick={() => addAddress.mutate()}
                      disabled={addAddress.isPending}
                      className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-primary-foreground text-sm font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50"
                    >
                      <Plus size={16} /> Add Demo Address
                    </button>
                  </div>
                )}
                {addresses?.map(addr => (
                  <label key={addr.id} className={`flex cursor-pointer gap-4 rounded-lg border p-4 hover:bg-[var(--surface-2)] transition-colors ${selectedAddress === addr.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : ""}`}>
                    <input type="radio" name="address" className="mt-1" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} />
                    <div>
                      <div className="font-semibold">{addr.fullName} <span className="text-xs font-normal text-muted-foreground ml-2">{addr.phone}</span></div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {addr.line1}, {addr.line2 && `${addr.line2}, `}{addr.city}, {addr.state} {addr.pincode}
                      </div>
                    </div>
                  </label>
                ))}
                
                {addresses && addresses.length > 0 && (
                  <button 
                    disabled={!selectedAddress}
                    onClick={() => setStep(2)} 
                    className="mt-4 rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            ) : (
              <div className="text-sm">
                {addresses?.find(a => a.id === selectedAddress)?.fullName} - {addresses?.find(a => a.id === selectedAddress)?.city}
              </div>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={`rounded-xl border bg-card p-6 ${step !== 2 && "opacity-60 grayscale"}`}>
            <h2 className="mb-4 text-lg font-semibold flex justify-between items-center">
              2. Payment Method
              {step > 2 && (
                <button onClick={() => setStep(2)} className="text-sm text-[var(--primary)] font-normal hover:underline">Edit</button>
              )}
            </h2>
            {step === 2 ? (
              <div className="space-y-4">
                {[
                  { id: "UPI", title: "UPI (Google Pay, PhonePe, Paytm)", desc: "Pay seamlessly using any UPI app." },
                  { id: "CARD", title: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay accepted." },
                  { id: "COD", title: "Cash on Delivery", desc: "Pay when your order arrives." },
                ].map(pm => (
                  <label key={pm.id} className={`flex cursor-pointer gap-4 rounded-lg border p-4 hover:bg-[var(--surface-2)] transition-colors ${paymentMethod === pm.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : ""}`}>
                    <input type="radio" name="payment" className="mt-1" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id as PaymentMethod)} />
                    <div>
                      <div className="font-semibold">{pm.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{pm.desc}</div>
                    </div>
                  </label>
                ))}
                <button 
                  onClick={() => setStep(3)} 
                  className="mt-4 rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Review Order
                </button>
              </div>
            ) : step > 2 ? (
              <div className="text-sm font-medium">
                {paymentMethod === "UPI" ? "UPI" : paymentMethod === "CARD" ? "Card" : "Cash on Delivery"}
              </div>
            ) : null}
          </div>

          {/* Step 3: Review */}
          <div className={`rounded-xl border bg-card p-6 ${step !== 3 && "opacity-60 grayscale"}`}>
            <h2 className="text-lg font-semibold">3. Review Items</h2>
            {step === 3 && (
              <div className="mt-4 space-y-4">
                {cart.items.map(item => (
                  <div key={item.productId} className="flex items-center gap-4 text-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-muted-foreground">
                      {item.quantity}x
                    </div>
                    <div className="flex-1">
                      <div>Product {item.productId.slice(0,8)}</div>
                      <div className="text-muted-foreground">{formatINR(item.unitPrice)} each</div>
                    </div>
                    <div className="font-semibold">{formatINR(item.unitPrice * item.quantity)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="self-start rounded-xl border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Items</dt><dd>{cart.items.length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-medium">{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="font-medium">{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax (5%)</dt><dd className="font-medium">{formatINR(tax)}</dd></div>
          </dl>
          <div className="my-4 border-t" />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          
          <button
            onClick={() => placeOrder.mutate()}
            disabled={step !== 3 || placeOrder.isPending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] py-3.5 text-sm font-bold text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {placeOrder.isPending ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </div>
    </div>
  );
}
