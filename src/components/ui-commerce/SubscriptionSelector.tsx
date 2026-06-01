import { useState } from "react";
import { Check, Info, Repeat } from "lucide-react";
import { cn } from "@/lib/format";

interface SubscriptionSelectorProps {
  onSelect: (frequency: string | null) => void;
}

export function SubscriptionSelector({ onSelect }: SubscriptionSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: "1_month", label: "Every 1 month", discount: 15 },
    { id: "2_months", label: "Every 2 months", discount: 10 },
    { id: "3_months", label: "Every 3 months", discount: 5 },
  ];

  const handleSelect = (id: string | null) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-[var(--surface-2)] p-4 shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-[0.03]">
        <Repeat size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Repeat size={16} />
          </div>
          <div>
            <h3 className="font-bold text-base leading-none">Subscribe & Save</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Info size={12} /> Save up to 15% on repeat deliveries
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {/* One-time purchase option */}
          <button
            onClick={() => handleSelect(null)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-all",
              selected === null
                ? "border-primary bg-primary/5"
                : "border-transparent bg-background hover:bg-muted"
            )}
          >
            <span className="font-medium">One-time purchase</span>
            {selected === null && <Check size={18} className="text-primary" />}
          </button>

          {/* Subscription options */}
          <div className="grid grid-cols-3 gap-2">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border-2 p-2 text-center transition-all",
                  selected === option.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-background hover:bg-muted"
                )}
              >
                <span className="text-[10px] font-semibold text-primary mb-0.5">SAVE {option.discount}%</span>
                <span className="text-xs font-medium">{option.label}</span>
                {selected === option.id && (
                  <div className="absolute top-1 right-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
