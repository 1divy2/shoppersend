import { formatINR, discountPct, cn } from "@/lib/format";

interface PriceBlockProps {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { price: "text-sm font-semibold", mrp: "text-xs", disc: "text-xs" },
  md: { price: "text-base font-semibold", mrp: "text-sm", disc: "text-sm" },
  lg: { price: "text-2xl font-bold", mrp: "text-base", disc: "text-sm" },
};

export function PriceBlock({ price, mrp, size = "md", className }: PriceBlockProps) {
  const off = discountPct(mrp, price);
  const s = sizes[size];
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={s.price}>{formatINR(price)}</span>
      {off > 0 && (
        <>
          <span className={cn("text-muted-foreground line-through", s.mrp)}>{formatINR(mrp)}</span>
          <span className={cn("font-semibold text-[var(--discount)]", s.disc)}>{off}% off</span>
        </>
      )}
    </div>
  );
}
