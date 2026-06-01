import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { productsQuery } from "@/lib/queries";

export function ForYouRecommendations() {
  const { data, isLoading } = useQuery(productsQuery({ pageSize: 5 }));

  if (isLoading || !data || data.items.length === 0) {
    return null; // Handle loading/empty state gracefully or show skeleton
  }

  return (
    <section className="mt-16 w-full max-w-7xl mx-auto px-4 md:px-6">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">For You</h2>
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles size={14} /> AI Recommended
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.items.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
