/**
 * Seed catalog for ShoppersEnd. CLEARLY LABELED AS SAMPLE DATA.
 *
 * Every product carries `isSampleData: true`. Ratings, review counts, and
 * stock levels are modest and realistic — no fabricated "10,000 reviews"
 * or "best seller" badges. Imagery uses neutral SVG placeholders so we
 * don't ship fake brand photography.
 */

import type { Category, Product, Review, Coupon } from "@/lib/types";

export const seedCategories: Category[] = [
  { id: "cat_electronics", slug: "electronics", name: "Electronics", icon: "Smartphone" },
  { id: "cat_fashion", slug: "fashion", name: "Fashion", icon: "Shirt" },
  { id: "cat_home", slug: "home-kitchen", name: "Home & Kitchen", icon: "Sofa" },
  { id: "cat_beauty", slug: "beauty", name: "Beauty & Personal Care", icon: "Sparkles" },
  { id: "cat_grocery", slug: "grocery", name: "Grocery", icon: "ShoppingBasket" },
  { id: "cat_sports", slug: "sports-fitness", name: "Sports & Fitness", icon: "Dumbbell" },
  { id: "cat_books", slug: "books", name: "Books", icon: "BookOpen" },
  { id: "cat_toys", slug: "toys", name: "Toys & Baby", icon: "Baby" },
];

function placeholderImage(label: string, bg = "1f2a4d", fg = "f4b860"): string {
  // Inline SVG data URL — no network dependency, no fake brand assets.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>
    <rect width='600' height='600' fill='#${bg}'/>
    <text x='50%' y='50%' fill='#${fg}' font-family='Inter,system-ui,sans-serif'
      font-size='28' font-weight='600' text-anchor='middle' dominant-baseline='middle'>
      ${label}
    </text>
    <text x='50%' y='58%' fill='#${fg}' opacity='0.55' font-family='Inter,system-ui,sans-serif'
      font-size='14' text-anchor='middle'>SAMPLE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeImages(label: string, count = 3) {
  const palettes: [string, string][] = [
    ["1f2a4d", "f4b860"], ["2a3a5c", "e8d5b7"], ["172240", "ffd28c"], ["263456", "fac989"],
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `img_${i}`,
    url: placeholderImage(label, palettes[i % palettes.length][0], palettes[i % palettes.length][1]),
    alt: `${label} — sample image ${i + 1}`,
  }));
}

type SeedInput = Omit<Product, "id" | "slug" | "images" | "sku" | "createdAt" | "isSampleData" | "ratingAverage" | "ratingCount"> & {
  ratingAverage?: number;
  ratingCount?: number;
};

function makeProduct(input: SeedInput, idx: number): Product {
  const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: `prod_${idx.toString().padStart(4, "0")}`,
    slug,
    sku: `SKU-${(10000 + idx).toString()}`,
    images: makeImages(input.brand),
    ratingAverage: input.ratingAverage ?? 0,
    ratingCount: input.ratingCount ?? 0,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    isSampleData: true,
    ...input,
  };
}

const raw: SeedInput[] = [
  // Electronics
  {
    name: "Aurora 7 Wireless Earbuds",
    brand: "Aurora",
    description:
      "Active noise cancellation, 32-hour total battery with case, IPX5 water resistance. Bluetooth 5.3 multipoint. Includes USB-C charging cable and three silicone tip sizes.",
    shortDescription: "ANC wireless earbuds with 32-hour battery and multipoint pairing.",
    categoryId: "cat_electronics",
    price: 3499, mrp: 4999, stock: 42,
    highlights: ["Active noise cancellation", "32-hour battery (with case)", "Bluetooth 5.3 multipoint", "IPX5 water resistant", "USB-C fast charging"],
    specifications: [
      { group: "Audio", items: [
        { label: "Driver", value: "10mm dynamic" },
        { label: "Codecs", value: "AAC, SBC, LDAC" },
        { label: "ANC", value: "Hybrid, up to 35dB" },
      ]},
      { group: "Battery", items: [
        { label: "Earbuds", value: "8 hours (ANC off)" },
        { label: "With case", value: "32 hours" },
        { label: "Charging", value: "USB-C, 10 min = 2 hours" },
      ]},
      { group: "Connectivity", items: [
        { label: "Bluetooth", value: "5.3" },
        { label: "Multipoint", value: "Yes, 2 devices" },
        { label: "Range", value: "10 m" },
      ]},
    ],
    attributes: [{ name: "Color", values: ["Midnight", "Pearl", "Sand"] }],
    tags: ["audio", "wireless", "anc"],
    ratingAverage: 4.3, ratingCount: 18,
  },
  {
    name: "Helix 14 Laptop — Core i5, 16GB, 512GB",
    brand: "Helix",
    description:
      "14-inch FHD IPS display, Intel Core i5 12th-gen, 16GB DDR4, 512GB NVMe SSD. Backlit keyboard, fingerprint reader, 1.4 kg chassis. Ships with a 1-year manufacturer warranty.",
    shortDescription: "14\" thin-and-light laptop with i5, 16GB RAM, 512GB SSD.",
    categoryId: "cat_electronics",
    price: 54990, mrp: 64990, stock: 12,
    highlights: ["Intel Core i5-1235U", "16GB DDR4 RAM", "512GB NVMe SSD", "14\" FHD IPS display", "1.4 kg", "Fingerprint reader"],
    specifications: [
      { group: "Processor", items: [
        { label: "CPU", value: "Intel Core i5-1235U" },
        { label: "Cores / Threads", value: "10 / 12" },
      ]},
      { group: "Memory & Storage", items: [
        { label: "RAM", value: "16GB DDR4-3200" },
        { label: "Storage", value: "512GB NVMe PCIe 4.0" },
      ]},
      { group: "Display", items: [
        { label: "Size", value: "14 inch" },
        { label: "Resolution", value: "1920 × 1080" },
        { label: "Panel", value: "IPS, 300 nits" },
      ]},
    ],
    attributes: [{ name: "RAM", values: ["8GB", "16GB"] }, { name: "Storage", values: ["256GB", "512GB", "1TB"] }],
    tags: ["laptop", "computing"],
    ratingAverage: 4.1, ratingCount: 9,
  },
  {
    name: "Nova M2 Smartwatch",
    brand: "Nova",
    description:
      "1.43\" AMOLED display, heart rate and SpO2, 100+ sport modes, 5 ATM water resistance, up to 10-day battery life.",
    shortDescription: "AMOLED smartwatch with SpO2 and 10-day battery.",
    categoryId: "cat_electronics",
    price: 4999, mrp: 7999, stock: 67,
    highlights: ["1.43\" AMOLED, 466×466", "Heart rate & SpO2", "100+ sport modes", "5 ATM water resistant", "10-day battery"],
    specifications: [
      { group: "Display", items: [{ label: "Type", value: "AMOLED" }, { label: "Size", value: "1.43\"" }] },
      { group: "Battery", items: [{ label: "Typical use", value: "10 days" }, { label: "GPS use", value: "20 hours" }] },
    ],
    attributes: [{ name: "Color", values: ["Graphite", "Champagne", "Navy"] }],
    tags: ["wearable", "fitness"],
    ratingAverage: 4.4, ratingCount: 24,
  },
  {
    name: "Pulse 65W GaN Charger",
    brand: "Pulse",
    description: "Compact 65W GaN-II charger with two USB-C and one USB-A port. Supports PPS, PD 3.0, and QC 4.0. Foldable pins.",
    shortDescription: "65W three-port GaN charger with PD and PPS.",
    categoryId: "cat_electronics",
    price: 1299, mrp: 1999, stock: 120,
    highlights: ["65W total output", "2× USB-C + 1× USB-A", "PD 3.0, PPS, QC 4.0", "Foldable pins", "GaN-II chipset"],
    specifications: [{ group: "Output", items: [{ label: "USB-C1", value: "Up to 65W PD" }, { label: "USB-C2", value: "Up to 30W PD" }] }],
    attributes: [],
    tags: ["accessory", "charger"],
    ratingAverage: 4.5, ratingCount: 31,
  },
  // Fashion
  {
    name: "Everyday Crew Tee — Heavyweight Cotton",
    brand: "Loomwell",
    description: "230 GSM combed cotton, double-stitched hems, pre-shrunk. Relaxed fit. Made in a Fair Trade certified facility.",
    shortDescription: "230 GSM heavyweight combed cotton crew-neck tee.",
    categoryId: "cat_fashion",
    price: 799, mrp: 1299, stock: 200,
    highlights: ["230 GSM heavyweight cotton", "Pre-shrunk and bio-washed", "Double-stitched hems", "Relaxed fit", "Fair Trade certified"],
    specifications: [{ group: "Material", items: [{ label: "Fabric", value: "100% combed cotton, 230 GSM" }, { label: "Care", value: "Machine wash cold, tumble dry low" }] }],
    attributes: [{ name: "Size", values: ["XS","S","M","L","XL","XXL"] }, { name: "Color", values: ["Black","White","Olive","Navy","Sand"] }],
    tags: ["apparel", "tee", "essentials"],
    ratingAverage: 4.2, ratingCount: 14,
  },
  {
    name: "Trailline Running Shoes",
    brand: "Stride",
    description: "EVA midsole with TPU heel counter, breathable engineered mesh upper, 8mm drop. Suitable for road and light trail.",
    shortDescription: "Cushioned road-to-trail running shoes, 8mm drop.",
    categoryId: "cat_fashion",
    price: 3299, mrp: 4499, stock: 58,
    highlights: ["EVA midsole, 8mm drop", "Engineered mesh upper", "TPU heel counter", "Removable insole"],
    specifications: [{ group: "Construction", items: [{ label: "Upper", value: "Engineered mesh" }, { label: "Midsole", value: "EVA" }, { label: "Outsole", value: "Rubber, lugged" }] }],
    attributes: [{ name: "Size", values: ["6","7","8","9","10","11"] }, { name: "Color", values: ["Black/Lime", "Grey/Coral"] }],
    tags: ["footwear", "running"],
    ratingAverage: 4.0, ratingCount: 11,
  },
  {
    name: "Cassidy Leather Belt",
    brand: "Mercer",
    description: "Full-grain leather, brushed steel buckle, hand-finished edges. 35mm width.",
    shortDescription: "Full-grain leather belt, 35mm, brushed steel buckle.",
    categoryId: "cat_fashion",
    price: 1499, mrp: 2299, stock: 75,
    highlights: ["Full-grain leather", "Brushed steel buckle", "Hand-finished edges", "35mm width"],
    specifications: [{ group: "Material", items: [{ label: "Leather", value: "Full-grain bovine" }] }],
    attributes: [{ name: "Size", values: ["30","32","34","36","38","40"] }, { name: "Color", values: ["Tan", "Black", "Brown"] }],
    tags: ["accessory", "leather"],
    ratingAverage: 4.6, ratingCount: 8,
  },
  // Home & Kitchen
  {
    name: "Brew & Pour Stainless Kettle 1.7L",
    brand: "Hearth",
    description: "1500W stainless steel kettle with auto shut-off, boil-dry protection, and a removable mesh filter.",
    shortDescription: "1.7L stainless electric kettle with auto shut-off.",
    categoryId: "cat_home",
    price: 1799, mrp: 2499, stock: 89,
    highlights: ["1500W rapid boil", "1.7L capacity", "Auto shut-off & boil-dry protection", "Removable filter", "360° swivel base"],
    specifications: [{ group: "Power", items: [{ label: "Wattage", value: "1500W" }, { label: "Voltage", value: "220-240V" }] }],
    attributes: [],
    tags: ["kitchen", "appliance"],
    ratingAverage: 4.3, ratingCount: 22,
  },
  {
    name: "Linen Throw Pillow Cover (Set of 2)",
    brand: "Aria Home",
    description: "100% washed linen, hidden YKK zipper, 18x18 inches. Sold as a set of two.",
    shortDescription: "Set of 2 washed linen pillow covers, 18x18.",
    categoryId: "cat_home",
    price: 999, mrp: 1599, stock: 130,
    highlights: ["100% washed linen", "Hidden YKK zipper", "18\" × 18\"", "Set of 2"],
    specifications: [{ group: "Material", items: [{ label: "Fabric", value: "100% linen, stonewashed" }] }],
    attributes: [{ name: "Color", values: ["Oatmeal", "Sage", "Charcoal", "Terracotta"] }],
    tags: ["home", "decor"],
    ratingAverage: 4.5, ratingCount: 16,
  },
  {
    name: "Cast Iron Skillet 26cm — Pre-Seasoned",
    brand: "Forge",
    description: "Heavy-duty cast iron skillet, pre-seasoned with flaxseed oil. Oven and induction safe.",
    shortDescription: "26cm pre-seasoned cast iron skillet.",
    categoryId: "cat_home",
    price: 1299, mrp: 1899, stock: 44,
    highlights: ["26cm diameter", "Pre-seasoned", "Induction & oven safe", "Lifetime usable with care"],
    specifications: [{ group: "Dimensions", items: [{ label: "Diameter", value: "26 cm" }, { label: "Weight", value: "2.3 kg" }] }],
    attributes: [],
    tags: ["cookware"],
    ratingAverage: 4.7, ratingCount: 19,
  },
  // Beauty
  {
    name: "Hydra-Calm Face Moisturizer 50ml",
    brand: "Verda",
    description: "Lightweight gel-cream with niacinamide 4%, panthenol, and ceramides. Fragrance-free.",
    shortDescription: "Niacinamide & ceramide gel-cream moisturizer.",
    categoryId: "cat_beauty",
    price: 749, mrp: 999, stock: 95,
    highlights: ["Niacinamide 4%", "Ceramides + panthenol", "Fragrance-free", "Non-comedogenic"],
    specifications: [{ group: "Details", items: [{ label: "Volume", value: "50 ml" }, { label: "Skin type", value: "All, including sensitive" }] }],
    attributes: [],
    tags: ["skincare"],
    ratingAverage: 4.4, ratingCount: 27,
  },
  // Grocery
  {
    name: "Cold-Brew Coffee Concentrate 500ml",
    brand: "Slowpour",
    description: "Single-origin Arabica beans, 16-hour cold extraction. Unsweetened. Refrigerate after opening.",
    shortDescription: "Unsweetened single-origin cold-brew concentrate, 500ml.",
    categoryId: "cat_grocery",
    price: 449, mrp: 549, stock: 80,
    highlights: ["100% Arabica, single-origin", "16-hour cold extraction", "Unsweetened", "Makes 10 cups"],
    specifications: [{ group: "Details", items: [{ label: "Volume", value: "500 ml" }, { label: "Shelf life", value: "14 days refrigerated after opening" }] }],
    attributes: [],
    tags: ["coffee", "beverage"],
    ratingAverage: 4.6, ratingCount: 13,
  },
  // Sports
  {
    name: "PR-2 Adjustable Dumbbell — 24kg",
    brand: "Ironform",
    description: "Adjustable from 2.5 to 24kg in 1.25kg increments. Quick-twist handle, steel weight plates.",
    shortDescription: "Quick-adjust 24kg dumbbell, 1.25kg increments.",
    categoryId: "cat_sports",
    price: 8999, mrp: 12999, stock: 18,
    highlights: ["2.5kg–24kg range", "1.25kg increments", "Quick-twist mechanism", "Steel plates with knurled handle"],
    specifications: [{ group: "Specs", items: [{ label: "Max weight", value: "24 kg" }, { label: "Increment", value: "1.25 kg" }] }],
    attributes: [],
    tags: ["fitness", "strength"],
    ratingAverage: 4.5, ratingCount: 7,
  },
  // Books
  {
    name: "The Quiet Algorithm — Paperback",
    brand: "Northbound Press",
    description: "A 320-page novel exploring memory and machine cognition. Paperback, B-format.",
    shortDescription: "Literary fiction, 320 pages, paperback.",
    categoryId: "cat_books",
    price: 399, mrp: 499, stock: 60,
    highlights: ["320 pages", "Paperback, B-format", "Published 2024"],
    specifications: [{ group: "Details", items: [{ label: "ISBN", value: "978-0-00-000000-0 (sample)" }, { label: "Language", value: "English" }] }],
    attributes: [],
    tags: ["fiction"],
    ratingAverage: 4.2, ratingCount: 5,
  },
  // Toys
  {
    name: "Wooden Building Blocks — 100 pieces",
    brand: "Brambles",
    description: "Natural beech wood blocks, water-based non-toxic finish. Includes drawstring cotton storage bag.",
    shortDescription: "100-piece beech wood block set with storage bag.",
    categoryId: "cat_toys",
    price: 1599, mrp: 2299, stock: 33,
    highlights: ["100 pieces", "Natural beech wood", "Non-toxic finish", "Cotton storage bag", "Ages 3+"],
    specifications: [{ group: "Details", items: [{ label: "Pieces", value: "100" }, { label: "Material", value: "Beech wood" }] }],
    attributes: [],
    tags: ["kids", "toys"],
    ratingAverage: 4.8, ratingCount: 12,
  },
];

export const seedProducts: Product[] = raw.map((p, i) => makeProduct(p, i + 1));

export const seedReviews: Review[] = [
  // Keep this short and clearly sample — no fake testimonials.
  {
    id: "rev_0001", productId: "prod_0001", userId: "demo", userName: "Sample reviewer",
    rating: 5, title: "Sample review", body: "This is sample review content shown for layout purposes only. Real reviews will appear once customers post them.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), verifiedPurchase: true, helpfulCount: 0,
  },
  {
    id: "rev_0002", productId: "prod_0001", userId: "demo", userName: "Sample reviewer",
    rating: 4, body: "Sample review content. Replace with real reviews from real customers.",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), verifiedPurchase: false, helpfulCount: 0,
  },
];

export const seedCoupons: Coupon[] = [
  { code: "WELCOME10", description: "10% off your first order (sample coupon)", type: "PERCENTAGE", value: 10, minOrderValue: 999, maxDiscount: 500, isActive: true },
  { code: "FLAT200", description: "Flat ₹200 off on orders over ₹1,999 (sample)", type: "FIXED", value: 200, minOrderValue: 1999, isActive: true },
];
