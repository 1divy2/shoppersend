import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as useSuspenseQuery, a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as cartQuery, c as addressService, i as ordersService } from "./router-Jzlhdj0b.mjs";
import { f as formatINR } from "./format-Ba4izUCB.mjs";
import { M as MapPin, a as ChevronRight, e as CreditCard, c as CircleCheck, j as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/zod.mjs";
function CheckoutPage() {
  const {
    data: cart
  } = useSuspenseQuery(cartQuery());
  const {
    data: addresses
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.list
  });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = reactExports.useState(1);
  const [selectedAddress, setSelectedAddress] = reactExports.useState("");
  const [paymentMethod, setPaymentMethod] = reactExports.useState("COD");
  reactExports.useEffect(() => {
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
      qc.invalidateQueries({
        queryKey: ["addresses"]
      });
      toast.success("Address added");
    },
    onError: (e) => toast.error(e.message)
  });
  const placeOrder = useMutation({
    mutationFn: async () => {
      const order = await ordersService.place({
        addressId: selectedAddress,
        paymentMethod
      });
      if (paymentMethod !== "COD") {
        try {
          await ordersService.pay(order.id);
        } catch (err) {
          throw new Error("Payment failed: " + (err.message || "Unknown error"));
        }
      }
      return order;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["cart"]
      });
      qc.invalidateQueries({
        queryKey: ["orders"]
      });
      toast.success("Order placed and payment successful!");
      navigate({
        to: "/orders"
      });
    },
    onError: (e) => {
      qc.invalidateQueries({
        queryKey: ["cart"]
      });
      qc.invalidateQueries({
        queryKey: ["orders"]
      });
      toast.error(e.message);
      navigate({
        to: "/orders"
      });
    }
  });
  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  if (cart.items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Your cart is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", className: "mt-4 inline-block text-[var(--primary)] hover:underline", children: "Return to cart" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 ${step >= 1 ? "text-foreground" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18 }),
        " Delivery"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 ${step >= 2 ? "text-foreground" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18 }),
        " Payment"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 ${step >= 3 ? "text-foreground" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
        " Review"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_360px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border bg-card p-6 ${step !== 1 && "opacity-60 grayscale"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 text-lg font-semibold flex justify-between items-center", children: [
            "1. Delivery Address",
            step > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "text-sm text-[var(--primary)] font-normal hover:underline", children: "Edit" })
          ] }),
          step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            addresses?.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4", children: "No addresses found. You need to add a delivery address." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addAddress.mutate(), disabled: addAddress.isPending, className: "flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-primary-foreground text-sm font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                " Add Demo Address"
              ] })
            ] }),
            addresses?.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex cursor-pointer gap-4 rounded-lg border p-4 hover:bg-[var(--surface-2)] transition-colors ${selectedAddress === addr.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "address", className: "mt-1", checked: selectedAddress === addr.id, onChange: () => setSelectedAddress(addr.id) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                  addr.fullName,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground ml-2", children: addr.phone })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
                  addr.line1,
                  ", ",
                  addr.line2 && `${addr.line2}, `,
                  addr.city,
                  ", ",
                  addr.state,
                  " ",
                  addr.pincode
                ] })
              ] })
            ] }, addr.id)),
            addresses && addresses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !selectedAddress, onClick: () => setStep(2), className: "mt-4 rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50", children: "Continue to Payment" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
            addresses?.find((a) => a.id === selectedAddress)?.fullName,
            " - ",
            addresses?.find((a) => a.id === selectedAddress)?.city
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border bg-card p-6 ${step !== 2 && "opacity-60 grayscale"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 text-lg font-semibold flex justify-between items-center", children: [
            "2. Payment Method",
            step > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), className: "text-sm text-[var(--primary)] font-normal hover:underline", children: "Edit" })
          ] }),
          step === 2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            [{
              id: "UPI",
              title: "UPI (Google Pay, PhonePe, Paytm)",
              desc: "Pay seamlessly using any UPI app."
            }, {
              id: "CARD",
              title: "Credit / Debit Card",
              desc: "Visa, Mastercard, RuPay accepted."
            }, {
              id: "COD",
              title: "Cash on Delivery",
              desc: "Pay when your order arrives."
            }].map((pm) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex cursor-pointer gap-4 rounded-lg border p-4 hover:bg-[var(--surface-2)] transition-colors ${paymentMethod === pm.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "payment", className: "mt-1", checked: paymentMethod === pm.id, onChange: () => setPaymentMethod(pm.id) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: pm.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: pm.desc })
              ] })
            ] }, pm.id)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(3), className: "mt-4 rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground", children: "Review Order" })
          ] }) : step > 2 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: paymentMethod === "UPI" ? "UPI" : paymentMethod === "CARD" ? "Card" : "Cash on Delivery" }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border bg-card p-6 ${step !== 3 && "opacity-60 grayscale"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "3. Review Items" }),
          step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children: cart.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-12 w-12 items-center justify-center rounded bg-muted text-muted-foreground", children: [
              item.quantity,
              "x"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "Product ",
                item.productId.slice(0, 8)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
                formatINR(item.unitPrice),
                " each"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: formatINR(item.unitPrice * item.quantity) })
          ] }, item.productId)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "self-start rounded-xl border bg-card p-6 lg:sticky lg:top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Order Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-6 space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Items" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: cart.items.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium", children: formatINR(subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium", children: shipping === 0 ? "Free" : formatINR(shipping) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Tax (5%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium", children: formatINR(tax) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-4 border-t" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-lg font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatINR(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => placeOrder.mutate(), disabled: step !== 3 || placeOrder.isPending, className: "mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] py-3.5 text-sm font-bold text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors", children: placeOrder.isPending ? "Placing Order..." : "Place Order" })
      ] })
    ] })
  ] });
}
export {
  CheckoutPage as component
};
