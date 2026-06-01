/**
 * Mock request router. Each handler returns the same shape a real backend
 * would return. Replace by pointing `setTransport` at an HTTP transport.
 */

import { ApiException, type RequestOptions } from "../api-client";
import { db, persist, uid } from "./db";
import type {
  Address, Cart, Category, Coupon, Order, OrderItem, OrderStatus,
  Page, Product, Review, SearchFilters, User, Wishlist,
} from "@/lib/types";

type Handler = (params: Record<string, string>, opts: RequestOptions) => Promise<unknown> | unknown;
type RouteDef = { method: string; pattern: RegExp; keys: string[]; handler: Handler };

const routes: RouteDef[] = [];

function route(method: string, pattern: string, handler: Handler) {
  const keys: string[] = [];
  const regex = new RegExp(
    "^" +
      pattern.replace(/:[A-Za-z_]+/g, (m) => {
        keys.push(m.slice(1));
        return "([^/]+)";
      }) +
      "$",
  );
  routes.push({ method, pattern: regex, keys, handler });
}

export async function handle(path: string, opts: RequestOptions): Promise<unknown> {
  const method = (opts.method ?? "GET").toUpperCase();
  const cleanPath = path.split("?")[0];
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = cleanPath.match(r.pattern);
    if (!m) continue;
    const params: Record<string, string> = {};
    r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
    return r.handler(params, opts);
  }
  throw new ApiException({ code: "not_found", message: `No mock route for ${method} ${path}` }, 404);
}

// ---------- Helpers ----------

function currentUser(): User | null {
  const d = db();
  return d.users.find((u) => u.id === d.sessionUserId) ?? null;
}

function requireUser(): User {
  const u = currentUser();
  if (!u) throw new ApiException({ code: "unauthorized", message: "Sign in to continue" }, 401);
  return u;
}

function getOrCreateCart(userId: string | null): Cart {
  const d = db();
  let cart = d.carts.find((c) => c.userId === userId);
  if (!cart) {
    cart = { id: uid("cart"), userId, items: [], updatedAt: new Date().toISOString() };
    d.carts.push(cart);
  }
  return cart;
}

function getOrCreateWishlist(userId: string | null): Wishlist {
  const d = db();
  let wl = d.wishlists.find((w) => w.userId === userId);
  if (!wl) {
    wl = { id: uid("wl"), userId, items: [] };
    d.wishlists.push(wl);
  }
  return wl;
}

// ---------- Auth ----------

route("POST", "/auth/register", async (_p, opts) => {
  const { email, password, fullName, phone } = (opts.body as { email: string; password: string; fullName: string; phone?: string }) ?? ({} as never);
  if (!email || !password || !fullName) {
    throw new ApiException({ code: "validation_error", message: "Email, password, and full name are required" }, 400);
  }
  const d = db();
  if (d.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new ApiException({ code: "email_exists", message: "An account with this email already exists" }, 409);
  }
  const user: User = {
    id: uid("user"), email, fullName, phone, role: "CUSTOMER",
    createdAt: new Date().toISOString(),
  };
  d.users.push(user);
  d.passwords[user.id] = password; // mock-only
  d.sessionUserId = user.id;
  persist();
  return { user, token: `mock.${user.id}` };
});

route("POST", "/auth/login", async (_p, opts) => {
  const { email, password } = (opts.body as { email: string; password: string }) ?? ({} as never);
  const d = db();
  const user = d.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
  if (!user || d.passwords[user.id] !== password) {
    throw new ApiException({ code: "invalid_credentials", message: "Invalid email or password" }, 401);
  }
  d.sessionUserId = user.id;
  persist();
  return { user, token: `mock.${user.id}` };
});

route("POST", "/auth/logout", () => {
  const d = db();
  d.sessionUserId = null;
  persist();
  return { ok: true };
});

route("GET", "/auth/me", () => {
  return { user: currentUser() };
});

// ---------- Categories ----------

route("GET", "/categories", () => db().categories);
route("GET", "/categories/:slug", (p) => {
  const cat = db().categories.find((c) => c.slug === p.slug);
  if (!cat) throw new ApiException({ code: "not_found", message: "Category not found" }, 404);
  return cat;
});

// ---------- Products ----------

function matchesFilters(p: Product, f: SearchFilters): boolean {
  if (f.q) {
    const q = f.q.toLowerCase();
    if (
      !p.name.toLowerCase().includes(q) &&
      !p.brand.toLowerCase().includes(q) &&
      !p.tags.some((t) => t.toLowerCase().includes(q))
    ) return false;
  }
  if (f.categoryId && p.categoryId !== f.categoryId) return false;
  if (f.brands && f.brands.length && !f.brands.includes(p.brand)) return false;
  if (f.minPrice != null && p.price < f.minPrice) return false;
  if (f.maxPrice != null && p.price > f.maxPrice) return false;
  if (f.minRating != null && p.ratingAverage < f.minRating) return false;
  if (f.inStock && p.stock <= 0) return false;
  if (f.minDiscount != null) {
    const discount = p.mrp > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
    if (discount < f.minDiscount) return false;
  }
  return true;
}

function sortProducts(items: Product[], sort: SearchFilters["sort"]): Product[] {
  const arr = [...items];
  switch (sort) {
    case "newest": return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price_asc": return arr.sort((a, b) => a.price - b.price);
    case "price_desc": return arr.sort((a, b) => b.price - a.price);
    case "rating": return arr.sort((a, b) => b.ratingAverage - a.ratingAverage);
    case "popularity": return arr.sort((a, b) => b.ratingCount - a.ratingCount);
    default: return arr;
  }
}

route("GET", "/products", (_p, opts) => {
  const q = (opts.query ?? {}) as Record<string, string | string[] | undefined>;
  const filters: SearchFilters = {
    q: q.q as string | undefined,
    categoryId: q.categoryId as string | undefined,
    brands: q.brands ? (Array.isArray(q.brands) ? q.brands : String(q.brands).split(",")).filter(Boolean) : undefined,
    minPrice: q.minPrice != null ? Number(q.minPrice) : undefined,
    maxPrice: q.maxPrice != null ? Number(q.maxPrice) : undefined,
    minRating: q.minRating != null ? Number(q.minRating) : undefined,
    inStock: q.inStock === "true",
    minDiscount: q.minDiscount != null ? Number(q.minDiscount) : undefined,
    sort: (q.sort as SearchFilters["sort"]) ?? "relevance",
    page: q.page != null ? Number(q.page) : 1,
    pageSize: q.pageSize != null ? Number(q.pageSize) : 24,
  };
  const all = db().products.filter((p) => matchesFilters(p, filters));
  const sorted = sortProducts(all, filters.sort);
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);
  const result: Page<Product> = {
    items, total: all.length, page, pageSize,
    totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
  };
  return result;
});

route("GET", "/products/facets", (_p, opts) => {
  const q = (opts.query ?? {}) as Record<string, string | undefined>;
  const categoryId = q.categoryId;
  const search = q.q?.toLowerCase();
  const pool = db().products.filter((p) => {
    if (categoryId && p.categoryId !== categoryId) return false;
    if (search && !p.name.toLowerCase().includes(search) && !p.brand.toLowerCase().includes(search)) return false;
    return true;
  });
  const brandCounts = new Map<string, number>();
  let minPrice = Infinity, maxPrice = 0;
  for (const p of pool) {
    brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
    minPrice = Math.min(minPrice, p.price);
    maxPrice = Math.max(maxPrice, p.price);
  }
  return {
    brands: [...brandCounts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    priceRange: { min: pool.length ? Math.floor(minPrice) : 0, max: pool.length ? Math.ceil(maxPrice) : 0 },
    total: pool.length,
  };
});

route("GET", "/products/:slug", (p) => {
  const prod = db().products.find((x) => x.slug === p.slug);
  if (!prod) throw new ApiException({ code: "not_found", message: "Product not found" }, 404);
  return prod;
});

route("GET", "/products/:slug/similar", (p) => {
  const d = db();
  const prod = d.products.find((x) => x.slug === p.slug);
  if (!prod) return [] as Product[];
  return d.products.filter((x) => x.categoryId === prod.categoryId && x.id !== prod.id).slice(0, 8);
});

route("GET", "/products/:slug/reviews", (p) => {
  const d = db();
  const prod = d.products.find((x) => x.slug === p.slug);
  if (!prod) return { items: [] as Review[], summary: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } };
  const items = d.reviews.filter((r) => r.productId === prod.id);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  for (const r of items) distribution[Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5]++;
  return {
    items,
    summary: { average: prod.ratingAverage, count: prod.ratingCount, distribution },
  };
});

// ---------- Cart ----------

route("GET", "/cart", () => getOrCreateCart(currentUser()?.id ?? null));

route("POST", "/cart/items", (_p, opts) => {
  const body = (opts.body as { productId: string; quantity?: number; variantId?: string }) ?? ({} as never);
  const d = db();
  const product = d.products.find((p) => p.id === body.productId);
  if (!product) throw new ApiException({ code: "not_found", message: "Product not found" }, 404);
  const cart = getOrCreateCart(currentUser()?.id ?? null);
  const qty = Math.max(1, body.quantity ?? 1);
  const existing = cart.items.find((i) => i.productId === body.productId && i.variantId === body.variantId);
  if (existing) {
    existing.quantity = Math.min(product.stock, existing.quantity + qty);
  } else {
    cart.items.push({
      productId: product.id, variantId: body.variantId, quantity: Math.min(product.stock, qty),
      unitPrice: product.price, addedAt: new Date().toISOString(),
    });
  }
  cart.updatedAt = new Date().toISOString();
  persist();
  return cart;
});

route("PATCH", "/cart/items/:productId", (p, opts) => {
  const body = (opts.body as { quantity: number; variantId?: string }) ?? ({} as never);
  const cart = getOrCreateCart(currentUser()?.id ?? null);
  const item = cart.items.find((i) => i.productId === p.productId && i.variantId === body.variantId);
  if (!item) throw new ApiException({ code: "not_found", message: "Item not in cart" }, 404);
  if (body.quantity <= 0) {
    cart.items = cart.items.filter((i) => i !== item);
  } else {
    item.quantity = body.quantity;
  }
  cart.updatedAt = new Date().toISOString();
  persist();
  return cart;
});

route("DELETE", "/cart/items/:productId", (p) => {
  const cart = getOrCreateCart(currentUser()?.id ?? null);
  cart.items = cart.items.filter((i) => i.productId !== p.productId);
  cart.updatedAt = new Date().toISOString();
  persist();
  return cart;
});

route("POST", "/cart/clear", () => {
  const cart = getOrCreateCart(currentUser()?.id ?? null);
  cart.items = [];
  cart.updatedAt = new Date().toISOString();
  persist();
  return cart;
});

// ---------- Wishlist ----------

route("GET", "/wishlist", () => getOrCreateWishlist(currentUser()?.id ?? null));

route("POST", "/wishlist/items", (_p, opts) => {
  const { productId } = (opts.body as { productId: string }) ?? ({} as never);
  const wl = getOrCreateWishlist(currentUser()?.id ?? null);
  if (!wl.items.some((i) => i.productId === productId)) {
    wl.items.push({ productId, addedAt: new Date().toISOString() });
  }
  persist();
  return wl;
});

route("DELETE", "/wishlist/items/:productId", (p) => {
  const wl = getOrCreateWishlist(currentUser()?.id ?? null);
  wl.items = wl.items.filter((i) => i.productId !== p.productId);
  persist();
  return wl;
});

// ---------- Coupons ----------

route("POST", "/coupons/apply", (_p, opts) => {
  const { code, subtotal } = (opts.body as { code: string; subtotal: number }) ?? ({} as never);
  const coupon = db().coupons.find((c) => c.code.toUpperCase() === code?.toUpperCase() && c.isActive);
  if (!coupon) throw new ApiException({ code: "invalid_coupon", message: "Coupon is invalid or expired" }, 400);
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw new ApiException({
      code: "min_order_not_met",
      message: `Minimum order of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required for this coupon`,
    }, 400);
  }
  let discount = coupon.type === "PERCENTAGE" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return { coupon, discount };
});

// ---------- Addresses ----------

route("GET", "/addresses", () => {
  const user = requireUser();
  return db().addresses.filter((a) => a.userId === user.id);
});

route("POST", "/addresses", (_p, opts) => {
  const user = requireUser();
  const input = opts.body as Omit<Address, "id" | "userId">;
  const addr: Address = { ...input, id: uid("addr"), userId: user.id };
  const d = db();
  if (addr.isDefault) d.addresses.forEach((a) => { if (a.userId === user.id) a.isDefault = false; });
  d.addresses.push(addr);
  persist();
  return addr;
});

route("DELETE", "/addresses/:id", (p) => {
  const user = requireUser();
  const d = db();
  d.addresses = d.addresses.filter((a) => !(a.id === p.id && a.userId === user.id));
  persist();
  return { ok: true };
});

// ---------- Orders ----------

route("GET", "/orders", () => {
  const user = requireUser();
  return db().orders.filter((o) => o.userId === user.id).sort((a, b) => b.placedAt.localeCompare(a.placedAt));
});

route("GET", "/orders/:id", (p) => {
  const user = requireUser();
  const order = db().orders.find((o) => o.id === p.id && o.userId === user.id);
  if (!order) throw new ApiException({ code: "not_found", message: "Order not found" }, 404);
  return order;
});

route("POST", "/orders", (_p, opts) => {
  const user = requireUser();
  const body = (opts.body as {
    addressId: string; paymentMethod: Order["paymentMethod"]; couponCode?: string;
  }) ?? ({} as never);
  const d = db();
  const address = d.addresses.find((a) => a.id === body.addressId && a.userId === user.id);
  if (!address) throw new ApiException({ code: "address_required", message: "Shipping address not found" }, 400);
  const cart = getOrCreateCart(user.id);
  if (!cart.items.length) throw new ApiException({ code: "empty_cart", message: "Your cart is empty" }, 400);

  const items: OrderItem[] = cart.items.map((ci) => {
    const product = d.products.find((p) => p.id === ci.productId)!;
    return {
      productId: ci.productId, variantId: ci.variantId,
      productName: product.name, productImage: product.images[0]?.url ?? "",
      quantity: ci.quantity, unitPrice: ci.unitPrice,
      lineTotal: ci.unitPrice * ci.quantity,
    };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shippingFee = subtotal >= 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  let discount = 0;
  if (body.couponCode) {
    const coupon = d.coupons.find((c) => c.code.toUpperCase() === body.couponCode!.toUpperCase() && c.isActive);
    if (coupon && (!coupon.minOrderValue || subtotal >= coupon.minOrderValue)) {
      discount = coupon.type === "PERCENTAGE" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }
  }
  const total = subtotal + shippingFee + tax - discount;
  const now = new Date();
  const initialStatus: OrderStatus = "CONFIRMED";
  const order: Order = {
    id: uid("ord"),
    orderNumber: "SS" + Date.now().toString().slice(-9),
    userId: user.id,
    items, subtotal, shippingFee, tax, discount, total,
    status: initialStatus,
    shippingAddress: address,
    paymentMethod: body.paymentMethod,
    paymentStatus: body.paymentMethod === "COD" ? "PENDING" : "PAID",
    placedAt: now.toISOString(),
    timeline: [
      { status: "PENDING", at: now.toISOString() },
      { status: "CONFIRMED", at: now.toISOString(), note: "Order confirmed" },
    ],
    expectedDeliveryAt: new Date(now.getTime() + 5 * 86400000).toISOString(),
  };
  d.orders.push(order);
  cart.items = [];
  cart.updatedAt = now.toISOString();
  persist();
  return order;
});
