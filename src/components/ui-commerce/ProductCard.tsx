import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlist.service";
import { wishlistQuery } from "@/lib/queries";
import type { Product } from "@/lib/types";
import { Rating } from "./Rating";
import { PriceBlock } from "./PriceBlock";
import { cn } from "@/lib/format";
import { motion } from "framer-motion";
import { useState } from "react";
import { QuickCheckoutDrawer } from "./QuickCheckoutDrawer";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const qc = useQueryClient();
  const { data: wishlist } = useQuery(wishlistQuery());
  const isWishlisted = wishlist?.items.some((i) => i.productId === product.id) ?? false;

  const toggleWishlist = useMutation({
    mutationFn: () =>
      isWishlisted ? wishlistService.remove(product.id) : wishlistService.add(product.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={(e) => { e.preventDefault(); toggleWishlist.mutate(); }}
        className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-muted-foreground shadow-sm transition hover:text-destructive"
      >
        <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-destructive" : ""} />
      </motion.button>
      <Link to="/p/$slug" params={{ slug: product.slug }} className="flex h-full flex-col focus-ring">
        <div className="aspect-square bg-[var(--surface-2)]">
          <img src={product.images[0]?.url} alt={product.images[0]?.alt ?? product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            loading="lazy" />
        </div>
        <div className={cn("flex flex-1 flex-col gap-1.5 p-3", compact && "p-2.5")}>
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</div>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">{product.name}</h3>
          <Rating value={product.ratingAverage} count={product.ratingCount} />
          <div className="mt-auto pt-1">
            <PriceBlock price={product.price} mrp={product.mrp} size="sm" />
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <div className="text-[11px] font-medium text-[var(--warning)]">Only {product.stock} left</div>
          )}
          {product.stock === 0 && (
            <div className="text-[11px] font-medium text-destructive">Out of stock</div>
          )}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsDrawerOpen(true); }}
            className="mt-2 w-full rounded-md bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Buy Now
          </button>
        </div>
      </Link>

      <QuickCheckoutDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        product={product} 
      />
    </motion.div>
  );
}
