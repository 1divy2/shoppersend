import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { categoriesQuery, productsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/ui-commerce/ProductCard";
import { ForYouRecommendations } from "@/components/ui-commerce/ForYouRecommendations";
import { SpinWheel } from "@/components/ui-commerce/SpinWheel";
import { motion, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/_shop/")({
  head: () => ({
    meta: [
      { title: "ShoppersEnd — Shop everyday essentials" },
      { name: "description", content: "Browse electronics, fashion, home, beauty, grocery, and more on ShoppersEnd. Demo storefront with sample catalog." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(categoriesQuery());
    context.queryClient.ensureQueryData(productsQuery({ sort: "newest", pageSize: 10 }));
    context.queryClient.ensureQueryData(productsQuery({ sort: "rating", pageSize: 10 }));
    context.queryClient.ensureQueryData(productsQuery({ minDiscount: 20, pageSize: 10 }));
    context.queryClient.ensureQueryData(productsQuery({ sort: "popularity", pageSize: 10 }));
  },
  component: HomePage,
});

function HomePage() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const { data: newest } = useSuspenseQuery(productsQuery({ sort: "newest", pageSize: 10 }));
  const { data: topRated } = useSuspenseQuery(productsQuery({ sort: "rating", pageSize: 10 }));
  const { data: deals } = useSuspenseQuery(productsQuery({ minDiscount: 20, pageSize: 10 }));
  const { data: recommended } = useSuspenseQuery(productsQuery({ sort: "popularity", pageSize: 10 }));

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.2]);

  return (
    <div className="container-page py-6 md:py-8 overflow-hidden">
      {/* Hero strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <motion.div 
          className="md:col-span-2 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[#1a2545] p-6 text-primary-foreground md:p-10 relative overflow-hidden"
        >
          {/* Parallax Background Elements */}
          <motion.div 
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"
            style={{ y: y1 }}
          />
          <motion.div 
            className="absolute bottom-0 left-10 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-2xl pointer-events-none"
            style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }}
          />

          <motion.div style={{ y: useTransform(scrollY, [0, 300], [0, 50]), opacity }} className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Featured</div>
            <h1 className="mt-2 text-2xl font-bold leading-tight md:text-4xl">Everyday essentials, ready to ship</h1>
            <p className="mt-2 max-w-md text-sm text-primary-foreground/80 md:text-base">
              Browse a sample catalog of {newest.total + topRated.total} products across {categories.length} categories.
            </p>
            <Link to="/search" className="mt-5 inline-flex items-center gap-1 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] transition-transform hover:scale-105 active:scale-95">
              Browse all products <ChevronRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
        <div className="rounded-xl border bg-surface p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's coupons</div>
          <ul className="mt-3 space-y-3">
            <li className="flex items-start gap-3 rounded-md bg-muted/60 p-3">
              <span className="rounded bg-[var(--primary)] px-2 py-1 text-xs font-bold text-primary-foreground">WELCOME10</span>
              <span className="text-sm">10% off first order over ₹999</span>
            </li>
            <li className="flex items-start gap-3 rounded-md bg-muted/60 p-3">
              <span className="rounded bg-[var(--primary)] px-2 py-1 text-xs font-bold text-primary-foreground">FLAT200</span>
              <span className="text-sm">Flat ₹200 off on orders over ₹1,999</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Category tiles */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Shop by category</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/c/$slug"
              params={{ slug: c.slug }}
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center transition hover:border-[var(--primary)] hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--primary)] text-lg font-bold">
                {c.name.charAt(0)}
              </div>
              <div className="text-xs font-medium leading-tight">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <ForYouRecommendations />

      <ProductRow title="New arrivals" items={newest.items} />
      <ProductRow title="Top rated" items={topRated.items} />
      <ProductRow title="Deals — 20% off or more" items={deals.items} />

      <SpinWheel />
    </div>
  );
}

function ProductRow({ title, items }: { title: string; items: Awaited<ReturnType<typeof Object>>[] | any[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link to="/search" className="text-sm font-medium text-[var(--primary)] hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
