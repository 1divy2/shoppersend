import { Star } from "lucide-react";
import { cn } from "@/lib/format";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showCount?: boolean;
  className?: string;
}

export function Rating({ value, count, size = "sm", showCount = true, className }: RatingProps) {
  const iconSize = size === "sm" ? 12 : 14;
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center gap-0.5 rounded-sm bg-[var(--rating)] px-1.5 py-0.5 text-xs font-semibold text-white">
        {value.toFixed(1)}
        <Star size={iconSize} fill="currentColor" strokeWidth={0} />
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground">
          {count > 0 ? `(${count.toLocaleString("en-IN")})` : "No reviews yet"}
        </span>
      )}
    </div>
  );
}
