import { useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "@/lib/queries";
import { api } from "@/services/api-client";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

const CITIES = [
  "New York", "London", "Tokyo", "Seattle", "Austin", "Berlin", 
  "Sydney", "Toronto", "Paris", "Seoul", "Mumbai", "Dubai"
];

export function LiveToasts() {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const showRandomPurchase = async () => {
      try {
        // Fetch a small batch of random products to pick from
        const result = await api.get<{ data: { content: Product[] } }>("/api/v1/catalog/products/search?size=20");
        const products = result.data.content;
        
        if (products.length > 0) {
          const product = products[Math.floor(Math.random() * products.length)];
          const city = CITIES[Math.floor(Math.random() * CITIES.length)];
          
          toast(
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                <ShoppingCart size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Someone in {city} just bought</span>
                <span className="text-sm font-semibold text-foreground">{product.name}</span>
              </div>
            </div>,
            {
              duration: 4000,
              position: "bottom-left",
            }
          );
        }
      } catch (err) {
        // Silently ignore if API fails
      }

      // Schedule next toast between 15s and 45s
      const nextDelay = Math.random() * 30000 + 15000;
      timeout = setTimeout(showRandomPurchase, nextDelay);
    };

    // Initial timeout before first toast (5s)
    timeout = setTimeout(showRandomPurchase, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
