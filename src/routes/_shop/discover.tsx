import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/queries";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, ShoppingCart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/_shop/discover")({
  head: () => ({
    meta: [{ title: "Discover — ShoppersEnd" }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery({ sort: "popularity", pageSize: 20 }));
  },
  component: DiscoverPage,
});

function DiscoverPage() {
  const { data } = useSuspenseQuery(productsQuery({ sort: "popularity", pageSize: 20 }));
  const products = data.items;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <Link to="/" className="p-2 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Discover</h1>
        <div className="w-10"></div> {/* Placeholder for centering */}
      </div>

      {/* Snap Scrolling Container */}
      <div 
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map((product) => (
          <DiscoverCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function DiscoverCard({ product }: { product: any }) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.6 } // Needs to be 60% visible to be considered active
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef} 
      className="relative h-full w-full snap-center snap-always flex items-center justify-center bg-zinc-900 overflow-hidden"
    >
      {/* Product Image */}
      <motion.img 
        src={product.images[0]?.url} 
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        initial={{ scale: 1.1 }}
        animate={{ scale: isActive ? 1 : 1.1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />

      {/* Product Details (Bottom Left) */}
      <div className="absolute bottom-6 left-4 right-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-block px-2 py-1 mb-2 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded">
            {product.brand}
          </div>
          <h2 className="text-2xl font-bold mb-1 leading-tight">{product.name}</h2>
          <p className="text-sm text-gray-300 line-clamp-2 mb-3">{product.shortDescription}</p>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-sm line-through text-gray-400">₹{product.mrp}</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Interaction Column (Right) */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col items-center gap-6">
        <ActionButton icon={<Heart size={28} />} label={Math.floor(Math.random() * 500) + 100} />
        <ActionButton icon={<MessageCircle size={28} />} label={Math.floor(Math.random() * 50) + 5} />
        <ActionButton icon={<Share2 size={28} />} label="Share" />
        <Link to={`/p/${product.slug}`}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <ShoppingCart size={24} />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string | number }) {
  return (
    <motion.button 
      className="flex flex-col items-center gap-1 text-white hover:text-gray-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
        {icon}
      </div>
      <span className="text-xs font-semibold drop-shadow-md">{label}</span>
    </motion.button>
  );
}
