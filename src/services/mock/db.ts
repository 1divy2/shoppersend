/**
 * In-memory mock database for the storefront. Persists to localStorage so
 * cart, wishlist, orders, and the demo session survive reloads.
 *
 * This is a placeholder for a real backend. Every record returned by the
 * mock is identical in shape to what the production API would return.
 */

import type {
  Cart, Order, Product, Review, User, Wishlist, Address, Category, Coupon,
} from "@/lib/types";
import { seedCategories, seedProducts, seedReviews, seedCoupons } from "./seed";

interface DbShape {
  users: User[];
  // password is mock-only — real backend never stores plaintext
  passwords: Record<string, string>;
  addresses: Address[];
  categories: Category[];
  products: Product[];
  reviews: Review[];
  carts: Cart[];
  wishlists: Wishlist[];
  orders: Order[];
  coupons: Coupon[];
  sessionUserId: string | null;
}

const STORAGE_KEY = "shopsphere.db.v1";

function emptyDb(): DbShape {
  return {
    users: [],
    passwords: {},
    addresses: [],
    categories: seedCategories,
    products: seedProducts,
    reviews: seedReviews,
    carts: [],
    wishlists: [],
    orders: [],
    coupons: seedCoupons,
    sessionUserId: null,
  };
}

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function load(): DbShape {
  if (!isBrowser()) return emptyDb();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDb();
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    // Always refresh seed data so updates to seed files take effect.
    return {
      ...emptyDb(),
      ...parsed,
      categories: seedCategories,
      products: seedProducts,
      reviews: seedReviews,
      coupons: seedCoupons,
    };
  } catch {
    return emptyDb();
  }
}

let dbInstance: DbShape | null = null;

export function db(): DbShape {
  if (!dbInstance) dbInstance = load();
  return dbInstance;
}

export function persist() {
  if (!isBrowser() || !dbInstance) return;
  try {
    const { categories: _c, products: _p, reviews: _r, coupons: _co, ...persistable } = dbInstance;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // ignore quota / privacy errors
  }
}

export function resetDb() {
  dbInstance = emptyDb();
  if (isBrowser()) localStorage.removeItem(STORAGE_KEY);
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
