import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, LogOut, Package, Search, ShoppingCart, User as UserIcon, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { cartQuery, meQuery, wishlistQuery } from "@/lib/queries";
import { authService } from "@/services/auth.service";

export function Header() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cart } = useQuery(cartQuery());
  const { data: wishlist } = useQuery(wishlistQuery());
  const { data: meData } = useQuery(meQuery());
  const user = meData?.user;

  const routerState = useRouterState();
  const initialQ =
    routerState.location.pathname === "/search"
      ? (routerState.location.search as { q?: string }).q ?? ""
      : "";
  const [q, setQ] = useState(initialQ);
  useEffect(() => { setQ(initialQ); }, [initialQ]);

  const cartCount = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.items.length ?? 0;

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      qc.invalidateQueries();
      navigate({ to: "/" });
    },
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: q.trim() || undefined } });
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-[var(--primary)] text-primary-foreground">
      <div className="container-page flex h-14 items-center gap-3 md:h-16 md:gap-6">
        <Link to="/" className="flex items-baseline gap-1 focus-ring">
          <span className="text-lg font-bold tracking-tight md:text-xl">ShoppersEnd</span>
          <span className="hidden text-[10px] font-medium text-[var(--accent)] md:inline">demo</span>
        </Link>

        <form onSubmit={onSearch} className="relative flex flex-1 items-center">
          <Search size={16} className="absolute left-3 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, brands and more"
            className="h-9 w-full rounded-md bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-ring md:h-10"
          />
        </form>

        <nav className="flex items-center gap-1 md:gap-2">
          <Link to="/discover" className="hidden md:flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--accent)] hover:bg-white/10">
            Discover
          </Link>
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="group relative">
              <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-white/10 md:px-3">
                <UserIcon size={16} />
                <span className="hidden md:inline">{user.fullName.split(" ")[0]}</span>
              </button>
              <div className="invisible absolute right-0 top-full z-20 mt-1 w-52 rounded-md border bg-popover py-1 text-popover-foreground opacity-0 shadow-[var(--shadow-pop)] transition-all group-hover:visible group-hover:opacity-100">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                  <UserIcon size={14} /> My Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                  <Package size={14} /> My orders
                </Link>
                <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                  <Heart size={14} /> Wishlist
                </Link>
                <button onClick={() => logout.mutate()} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted">
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/10">Sign in</Link>
          )}

          <Link to="/wishlist" className="relative inline-flex h-9 items-center rounded-md px-2 hover:bg-white/10" aria-label="Wishlist">
            <Heart size={18} />
            {wishlistCount > 0 && <CounterBadge count={wishlistCount} />}
          </Link>
          <Link to="/cart" className="relative inline-flex h-9 items-center gap-1.5 rounded-md px-2 hover:bg-white/10 md:px-3">
            <ShoppingCart size={18} />
            <span className="hidden text-sm md:inline">Cart</span>
            {cartCount > 0 && <CounterBadge count={cartCount} />}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function CounterBadge({ count }: { count: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--accent-foreground)]">
      {count > 99 ? "99+" : count}
    </span>
  );
}
