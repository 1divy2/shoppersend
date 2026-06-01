import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Zap } from "lucide-react";

export function FlashSaleBanner({ endTime, stockLeft }: { endTime?: string, stockLeft?: number }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    // If no real end time is provided from the backend, we mock it to 2 hours from now for the demo
    const targetDate = endTime ? new Date(endTime).getTime() : Date.now() + 2 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!timeLeft) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-3 text-white shadow-lg overflow-hidden relative">
      {/* Animated background glow */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full bg-white opacity-20"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Zap size={20} className="fill-white" />
          FLASH DROP
        </div>
        
        <div className="flex items-center gap-4">
          {stockLeft !== undefined && (
            <div className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
              Only <span className="font-bold text-yellow-300">{stockLeft}</span> left
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Timer size={18} />
            <div className="flex items-center gap-1 font-mono font-bold text-lg">
              <span className="bg-black/30 rounded px-2 py-0.5">{timeLeft.hours.toString().padStart(2, '0')}</span>:
              <span className="bg-black/30 rounded px-2 py-0.5">{timeLeft.minutes.toString().padStart(2, '0')}</span>:
              <span className="bg-black/30 rounded px-2 py-0.5 text-yellow-200">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar (Mocked to 15% remaining) */}
      <div className="relative z-10 w-full h-1.5 bg-black/30 rounded-full mt-3 overflow-hidden">
        <motion.div 
          className="h-full bg-yellow-400"
          initial={{ width: "100%" }}
          animate={{ width: "15%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
