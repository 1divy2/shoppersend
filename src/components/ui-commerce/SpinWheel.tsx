import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";

const PRIZES = [
  { id: 1, label: "10% OFF", color: "#FF4B4B", discount: "WELCOME10" },
  { id: 2, label: "Better Luck", color: "#2D3436" },
  { id: 3, label: "FREE SHIPPING", color: "#0984E3", discount: "FREESHIP" },
  { id: 4, label: "15% OFF", color: "#00B894", discount: "SAVE15" },
  { id: 5, label: "Better Luck", color: "#2D3436" },
  { id: 6, label: "₹200 OFF", color: "#6C5CE7", discount: "FLAT200" },
];

export function SpinWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<typeof PRIZES[0] | null>(null);

  // Show floating button after a delay if they haven't spun yet today
  useEffect(() => {
    const hasSpun = localStorage.getItem("hasSpunToday");
    if (!hasSpun) {
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Calculate spin
    const spins = 5; // number of full rotations
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const degreesPerPrize = 360 / PRIZES.length;
    
    // The center of the slice is halfway through its angle
    const sliceCenter = prizeIndex * degreesPerPrize + (degreesPerPrize / 2);
    const targetRotation = (spins * 360) - sliceCenter;

    // Add previous rotation so it always spins forward continuously
    const newRotation = rotation + targetRotation + (360 - (rotation % 360));

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(PRIZES[prizeIndex]);
      localStorage.setItem("hasSpunToday", "true");
      
      if (PRIZES[prizeIndex].discount) {
        toast.success(`You won! Use code ${PRIZES[prizeIndex].discount}`);
      } else {
        toast("Aw, better luck next time!");
      }
    }, 5000); // 5 seconds spin duration
  };

  const gradientStops = PRIZES.map((prize, i) => {
    const angle = 360 / PRIZES.length;
    return `${prize.color} ${i * angle}deg ${(i + 1) * angle}deg`;
  }).join(", ");

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && !localStorage.getItem("hasSpunToday") && (
        <motion.button
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-xl"
        >
          <Gift size={24} className="text-white" />
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">1</span>
        </motion.button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-background p-8 text-center shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
                disabled={isSpinning}
              >
                <X size={20} />
              </button>

              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles size={24} className="text-primary" />
              </div>

              <h2 className="mb-2 text-2xl font-bold">Daily Spin to Win!</h2>
              <p className="mb-8 text-sm text-muted-foreground">Test your luck and win exclusive discounts for your next purchase.</p>

              <div className="relative mx-auto w-64 h-64 mb-8">
                {/* Pointer */}
                <div className="absolute -top-4 left-1/2 z-10 h-8 w-8 -translate-x-1/2 text-primary drop-shadow-md">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21l-12-18h24z" />
                  </svg>
                </div>

                {/* Wheel */}
                <motion.div
                  className="h-full w-full rounded-full border-4 border-foreground/10 shadow-inner relative overflow-hidden"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 5, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ background: `conic-gradient(${gradientStops})` }}
                >
                  {PRIZES.map((prize, i) => {
                    const angle = 360 / PRIZES.length;
                    const rotateAngle = i * angle + angle / 2;
                    return (
                      <div
                        key={prize.id}
                        className="absolute inset-0 flex items-start justify-center pt-6"
                        style={{ transform: `rotate(${rotateAngle}deg)` }}
                      >
                        <span 
                          className="text-white font-bold text-xs" 
                          style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.5)" }}
                        >
                          {prize.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
                
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-foreground shadow-lg" />
              </div>

              <AnimatePresence mode="wait">
                {wonPrize ? (
                  <motion.div
                    key="prize"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    {wonPrize.discount ? (
                      <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/10 p-4 text-[var(--success)]">
                        <div className="text-sm font-semibold mb-1">Congratulations! You won {wonPrize.label}</div>
                        <div className="text-xs opacity-80 mb-2">Use code at checkout:</div>
                        <div className="font-mono text-lg font-bold tracking-wider bg-white/50 dark:bg-black/20 py-1 rounded select-all">
                          {wonPrize.discount}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border bg-muted p-4 text-muted-foreground">
                        <div className="font-medium mb-1">Better luck next time!</div>
                        <div className="text-sm">Come back tomorrow for another spin.</div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.button
                    key="spin-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={spin}
                    disabled={isSpinning || !!localStorage.getItem("hasSpunToday")}
                    className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg disabled:opacity-50 transition-all hover:shadow-xl"
                  >
                    {isSpinning ? "SPINNING..." : "SPIN NOW"}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
