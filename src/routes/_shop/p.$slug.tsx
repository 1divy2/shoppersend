import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Check, Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { productQuery, similarProductsQuery, reviewsQuery, wishlistQuery, meQuery } from "@/lib/queries";
import { PriceBlock } from "@/components/ui-commerce/PriceBlock";
import { Rating } from "@/components/ui-commerce/Rating";
import { ProductCard } from "@/components/ui-commerce/ProductCard";
import { ReviewForm } from "@/components/ui-commerce/ReviewForm";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import { formatINR, discountPct } from "@/lib/format";
import { FastAverageColor } from "fast-average-color";
import { FlashSaleBanner } from "@/components/ui-commerce/FlashSaleBanner";
import { QuickCheckoutDrawer } from "@/components/ui-commerce/QuickCheckoutDrawer";
import { SubscriptionSelector } from "@/components/ui-commerce/SubscriptionSelector";
import { VideoReviewGrid } from "@/components/ui-commerce/VideoReviewGrid";
import { AiReviewSummary } from "@/components/ui-commerce/AiReviewSummary";

export const Route = createFileRoute("/_shop/p/$slug")({
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(productQuery(params.slug));
    } catch {
      throw notFound();
    }
    context.queryClient.ensureQueryData(similarProductsQuery(params.slug));
    context.queryClient.ensureQueryData(reviewsQuery(params.slug));
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — ShoppersEnd` },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: similar } = useSuspenseQuery(similarProductsQuery(slug));
  const { data: reviews } = useSuspenseQuery(reviewsQuery(slug));
  const { data: wishlist } = useQuery(wishlistQuery());
  const { data: me } = useQuery(meQuery());
  const qc = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.attributes.map((a) => [a.name, a.values[0]])),
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<string | null>(null);

  const isWishlisted = wishlist?.items.some((i) => i.productId === product.id) ?? false;
  const off = discountPct(product.mrp, product.price);

  const addToCart = useMutation({
    mutationFn: () => cartService.add(product.id, qty, undefined, subscriptionFrequency),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Added ${qty} × ${product.name.slice(0, 40)} to cart`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleWishlist = useMutation({
    mutationFn: () =>
      isWishlisted ? wishlistService.remove(product.id) : wishlistService.add(product.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const [bgColor, setBgColor] = useState("transparent");
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef) return;
    const fac = new FastAverageColor();
    fac.getColorAsync(imageRef, { crossOrigin: "anonymous" })
      .then(color => {
        setBgColor(color.rgba);
      })
      .catch(e => console.error("FAC error:", e));
    return () => fac.destroy();
  }, [imageRef, activeImage, product.images]);

  return (
    <div className="container-page py-4 md:py-6 relative overflow-hidden transition-colors duration-1000">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 -z-10 opacity-15 dark:opacity-20 transition-colors duration-1000 pointer-events-none blur-3xl scale-150 rounded-full" 
        style={{ background: `radial-gradient(circle at top right, ${bgColor}, transparent 60%)` }} 
      />

      <nav className="mb-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/search" className="hover:underline">All products</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] lg:gap-10">
        {/* Gallery */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="aspect-square overflow-hidden rounded-lg border bg-[var(--surface-2)]">
            <img 
              ref={setImageRef}
              src={product.images[activeImage]?.url} 
              alt={product.images[activeImage]?.alt} 
              className="h-full w-full object-cover" 
              crossOrigin="anonymous"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${activeImage === i ? "border-[var(--primary)]" : "border-transparent opacity-70"}`}
              >
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <SubscriptionSelector onSelect={setSubscriptionFrequency} />

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => addToCart.mutate()}
              disabled={product.stock === 0 || addToCart.isPending}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-primary-foreground transition hover:bg-[var(--primary-hover)] disabled:opacity-50"
            >
              <ShoppingCart size={16} /> {addToCart.isPending ? "Adding…" : "Add to cart"}
            </button>
            <button
              onClick={() => toggleWishlist.mutate()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border-2 px-4 text-sm font-semibold hover:bg-muted"
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-destructive" : ""} />
              {isWishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>
          <div className="mt-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              disabled={product.stock === 0}
              className="flex w-full h-11 items-center justify-center gap-2 rounded-md bg-black text-white font-bold transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50"
            >
              <Zap size={16} className="fill-current" /> Buy Now
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</div>
          <h1 className="mt-1 text-xl font-semibold leading-tight md:text-2xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.ratingAverage} count={product.ratingCount} size="md" />
            <span className="text-xs text-muted-foreground">SKU {product.sku}</span>
          </div>
          <div className="mt-4">
            <FlashSaleBanner 
              endTime={product.flashSaleEndTime} 
              stockLeft={product.flashSaleStock || (Math.floor(Math.random() * 50) + 5)} 
            />
          </div>

          <div className="mt-4 rounded-lg border bg-card p-4">
            <PriceBlock price={product.price} mrp={product.mrp} size="lg" />
            {off > 0 && (
              <div className="mt-1 text-sm text-[var(--discount)]">You save {formatINR(product.mrp - product.price)}</div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">Inclusive of all taxes</div>
          </div>

          {product.attributes.length > 0 && (
            <div className="mt-5 space-y-4">
              {product.attributes.map((attr) => (
                <div key={attr.name}>
                  <div className="mb-2 text-sm">
                    <span className="font-semibold">{attr.name}:</span>{" "}
                    <span className="text-muted-foreground">{selectedAttrs[attr.name]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedAttrs((s) => ({ ...s, [attr.name]: v }))}
                        className={`rounded-md border px-3 py-1.5 text-sm transition ${
                          selectedAttrs[attr.name] === v
                            ? "border-[var(--primary)] bg-[var(--primary)]/5 font-semibold text-[var(--primary)]"
                            : "hover:border-foreground/40"
                        }`}
                      >{v}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <div className="inline-flex items-center rounded-md border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 hover:bg-muted">−</button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="h-9 w-9 hover:bg-muted">+</button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          {/* Highlights */}
          <div className="mt-6 rounded-lg border bg-card p-4">
            <div className="mb-2 text-sm font-semibold">Highlights</div>
            <ul className="space-y-1.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="mt-0.5 flex-shrink-0 text-[var(--success)]" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust strip */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <TrustItem icon={<Truck size={16} />} label="Free delivery" sub="On orders over ₹999" />
            <TrustItem icon={<RotateCcw size={16} />} label="7-day returns" sub="Easy returns" />
            <TrustItem icon={<ShieldCheck size={16} />} label="Secure payment" sub="UPI · cards · COD" />
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">About this item</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{product.description}</p>
          </section>

          <VideoReviewGrid />

          {/* Specifications */}
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Specifications</h2>
            <div className="space-y-4">
              {product.specifications.map((g) => (
                <div key={g.group} className="overflow-hidden rounded-lg border">
                  <div className="bg-muted px-3 py-2 text-sm font-semibold">{g.group}</div>
                  <table className="w-full text-sm">
                    <tbody>
                      {g.items.map((row) => (
                        <tr key={row.label} className="border-t">
                          <td className="w-1/3 bg-muted/30 px-3 py-2 text-muted-foreground">{row.label}</td>
                          <td className="px-3 py-2">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Ratings & reviews</h2>
        
        {reviews.summary.count > 0 && (
          <div className="mb-8">
            <AiReviewSummary productName={product.name} />
          </div>
        )}

        {reviews.summary.count === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            No reviews yet. Be the first to review this product once you've purchased it.
            {me?.user && <ReviewForm productId={product.id} slug={slug} />}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[260px_1fr]">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-3xl font-bold">{reviews.summary.average.toFixed(1)}<span className="text-base font-normal text-muted-foreground">/5</span></div>
              <div className="mt-1 text-xs text-muted-foreground">{reviews.summary.count} ratings</div>
              <div className="mt-3 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const c = reviews.summary.distribution[star as 1 | 2 | 3 | 4 | 5] ?? 0;
                  const pct = reviews.summary.count ? Math.round((c / reviews.summary.count) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-6">{star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-[var(--rating)]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{c}</span>
                    </div>
                  );
                })}
              </div>
              {me?.user && <ReviewForm productId={product.id} slug={slug} />}
            </div>
            <div className="space-y-3">
              {reviews.items.map((r) => (
                <div key={r.id} className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Rating value={r.rating} showCount={false} />
                    {r.title && <span className="text-sm font-semibold">{r.title}</span>}
                  </div>
                  <p className="mt-2 text-sm">{r.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{r.userName}</span>
                    {r.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[var(--success)]">
                        <Star size={12} fill="currentColor" strokeWidth={0} /> Verified purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-lg font-semibold">Similar products</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {similar.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <QuickCheckoutDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        product={product} 
        quantity={qty}
      />
    </div>
  );
}

function TrustItem({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-card p-2">
      <div className="text-[var(--primary)]">{icon}</div>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
