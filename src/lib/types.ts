// Domain types for ShoppersEnd.
// These mirror what a real backend (e.g. Spring Boot + Postgres) would return.

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  label?: "HOME" | "WORK" | "OTHER";
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId?: string | null;
  icon?: string;
  imageUrl?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductSpecification {
  group: string;
  items: { label: string; value: string }[];
}

export interface ProductVariantOption {
  name: string; // e.g. "Color", "Storage"
  value: string; // e.g. "Black", "256GB"
}

export interface ProductVariant {
  id: string;
  sku: string;
  options: ProductVariantOption[];
  price: number;
  mrp: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  subcategoryId?: string;
  images: ProductImage[];
  price: number;
  mrp: number;
  stock: number;
  sku: string;
  ratingAverage: number;
  ratingCount: number;
  specifications: ProductSpecification[];
  highlights: string[];
  variants?: ProductVariant[];
  attributes: { name: string; values: string[] }[];
  tags: string[];
  createdAt: string;
  /** Sample/demo flag — never inflate real metrics */
  isSampleData: boolean;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  /** Snapshot at add-time so price changes don't silently alter cart total */
  unitPrice: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
  updatedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string | null;
  items: WishlistItem[];
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  placedAt: string;
  timeline: { status: OrderStatus; at: string; note?: string }[];
  expectedDeliveryAt?: string;
}

export type PaymentMethod =
  | "UPI"
  | "CARD"
  | "NET_BANKING"
  | "COD";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  body: string;
  images?: string[];
  createdAt: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Coupon {
  code: string;
  description: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface SearchFilters {
  q?: string;
  categoryId?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  minDiscount?: number;
  sort?: "relevance" | "newest" | "price_asc" | "price_desc" | "rating" | "popularity";
  page?: number;
  pageSize?: number;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
