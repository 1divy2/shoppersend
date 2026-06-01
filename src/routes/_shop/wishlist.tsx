import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { wishlistQuery, productsQuery } from "@/lib/queries";
import { wishlistService } from "@/services/wishlist.service";
import { cartService } from "@/services/cart.service";
import { PriceBlock } from "@/components/ui-commerce/PriceBlock";

export const Route = createFileRoute("/_shop/wishlist")({
  head: () => ({ meta: [{ title: "Your wishlist — ShoppersEnd" }] }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(wishlistQuery());
  },
  component: WishlistPage,
});

function WishlistPage() {
  const { data: wl } = useSuspenseQuery(wishlistQuery());
  const { data: page } = useQuery(productsQuery({ pageSize: 100 }));
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: (id: string) => wishlistService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
  const move = useMutation({
    mutationFn: async (productId: string) => {
      await cartService.add(productId);
      await wishlistService.remove(productId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Moved to cart");
    },
  });

  const items = wl.items
    .map((i) => page?.items.find((p) => p.id === i.productId))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <Heart size={48} className="text-muted-foreground" />
          <h1 className="mt-4 text-xl font-semibold">Your wishlist is empty</h1>
          <p className="mt-1 text-sm text-muted-foreground">Save items you love to find them later.</p>
          <Link to="/" className="mt-5 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const shareLink = `${window.location.origin}/wishlist/shared/u_${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Wishlist link copied to clipboard!");
  };

  return (
    <div className="container-page py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Wishlist <span className="text-sm font-normal text-muted-foreground">({items.length})</span></h1>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((p) => (
          <div key={p.id} className="flex gap-4 rounded-lg border bg-card p-3">
            <Link to="/p/$slug" params={{ slug: p.slug }} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-[var(--surface-2)]">
              <img src={p.images[0]?.url} alt={p.name} className="h-full w-full object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="text-xs text-muted-foreground">{p.brand}</div>
              <Link to="/p/$slug" params={{ slug: p.slug }} className="line-clamp-2 text-sm font-medium hover:text-[var(--primary)]">{p.name}</Link>
              <div className="mt-1"><PriceBlock price={p.price} mrp={p.mrp} size="sm" /></div>
              <div className="mt-auto flex gap-2 pt-2">
                <button
                  onClick={() => move.mutate(p.id)}
                  disabled={p.stock === 0}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--primary)] py-2 text-xs font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-40"
                >
                  <ShoppingCart size={12} /> Move to cart
                </button>
                <button
                  onClick={() => remove.mutate(p.id)}
                  className="inline-flex items-center justify-center rounded-md border px-3 hover:bg-muted"
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
