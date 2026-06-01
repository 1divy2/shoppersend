import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, CreditCard, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/format";

interface QuickCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  quantity?: number;
}

export function QuickCheckoutDrawer({ isOpen, onClose, product, quantity = 1 }: QuickCheckoutDrawerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Payment successful!");
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  const total = (product?.price || 0) * quantity;
  const image = product?.images?.[0]?.url || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[101] flex flex-col rounded-t-3xl bg-[var(--surface)] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] md:left-auto md:right-4 md:top-4 md:bottom-auto md:w-[400px] md:rounded-3xl"
          >
            {!isSuccess ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="text-green-500" /> Secure Checkout
                  </h2>
                  <button 
                    onClick={onClose}
                    disabled={isProcessing}
                    className="rounded-full bg-muted p-2 hover:bg-muted-foreground/20 disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-6 flex items-center gap-4 rounded-xl border p-3 bg-card">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {image && <img src={image} alt="Product" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate font-medium">{product?.name}</h3>
                    <div className="text-sm text-muted-foreground">Qty: {quantity}</div>
                    <div className="font-bold">{formatINR(total)}</div>
                  </div>
                </div>

                <div className="mb-6 space-y-3 rounded-xl border p-4 bg-card">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatINR(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black px-4 py-4 text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent"
                        />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-base font-bold tracking-wide">
                        Buy with Apple Pay <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                  >
                    <CreditCard size={18} /> Pay with Card
                  </button>
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 }}
                >
                  <CheckCircle2 size={80} className="text-green-500 mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground">Your order is being processed.</p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
