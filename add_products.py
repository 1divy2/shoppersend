import json
import random

new_products = [
    # Electronics
    {"name": "UltraVision 4K Monitor", "categoryId": "cat_electronics", "brand": "UltraVision", "price": 299.99, "mrp": 399.99, "stock": 45},
    {"name": "GamerPro Mechanical Keyboard", "categoryId": "cat_electronics", "brand": "GamerPro", "price": 89.99, "mrp": 129.99, "stock": 100},
    {"name": "SonicBoom Bluetooth Speaker", "categoryId": "cat_electronics", "brand": "SonicBoom", "price": 59.99, "mrp": 79.99, "stock": 200},
    {"name": "ErgoMouse Wireless", "categoryId": "cat_electronics", "brand": "ErgoTech", "price": 35.00, "mrp": 45.00, "stock": 150},
    {"name": "PowerBank 20000mAh", "categoryId": "cat_electronics", "brand": "ChargeMaster", "price": 49.99, "mrp": 59.99, "stock": 80},
    
    # Fashion
    {"name": "Classic Denim Jacket", "categoryId": "cat_fashion", "brand": "Levis", "price": 79.99, "mrp": 99.99, "stock": 60},
    {"name": "Vintage Sunglasses", "categoryId": "cat_fashion", "brand": "RayBan", "price": 120.00, "mrp": 150.00, "stock": 30},
    {"name": "Sneakers X-Pro", "categoryId": "cat_fashion", "brand": "Nike", "price": 110.00, "mrp": 130.00, "stock": 120},
    {"name": "Minimalist Leather Wallet", "categoryId": "cat_fashion", "brand": "Fossil", "price": 45.00, "mrp": 60.00, "stock": 90},
    {"name": "Wool Blend Beanie", "categoryId": "cat_fashion", "brand": "NorthFace", "price": 25.00, "mrp": 35.00, "stock": 200},

    # Home & Kitchen
    {"name": "Chef's Knife 8-inch", "categoryId": "cat_home", "brand": "Wusthof", "price": 129.99, "mrp": 149.99, "stock": 40},
    {"name": "Non-Stick Frying Pan", "categoryId": "cat_home", "brand": "T-fal", "price": 39.99, "mrp": 59.99, "stock": 85},
    {"name": "Ceramic Coffee Mug Set", "categoryId": "cat_home", "brand": "Le Creuset", "price": 49.99, "mrp": 65.00, "stock": 110},
    {"name": "Bamboo Cutting Board", "categoryId": "cat_home", "brand": "GreenerChef", "price": 22.50, "mrp": 30.00, "stock": 140},
    {"name": "Air Purifier HEPA", "categoryId": "cat_home", "brand": "Coway", "price": 199.99, "mrp": 249.99, "stock": 25},

    # Beauty & Personal Care
    {"name": "Vitamin C Serum", "categoryId": "cat_beauty", "brand": "TruSkin", "price": 19.99, "mrp": 29.99, "stock": 300},
    {"name": "Charcoal Face Mask", "categoryId": "cat_beauty", "brand": "Origins", "price": 26.00, "mrp": 32.00, "stock": 150},
    {"name": "Electric Toothbrush", "categoryId": "cat_beauty", "brand": "Oral-B", "price": 89.99, "mrp": 119.99, "stock": 75},
    {"name": "Argan Oil Hair Serum", "categoryId": "cat_beauty", "brand": "Moroccanoil", "price": 34.00, "mrp": 45.00, "stock": 120},
    {"name": "Matte Lipstick Set", "categoryId": "cat_beauty", "brand": "MAC", "price": 45.00, "mrp": 55.00, "stock": 200},

    # Grocery
    {"name": "Organic Olive Oil 1L", "categoryId": "cat_grocery", "brand": "California Olive Ranch", "price": 18.99, "mrp": 22.99, "stock": 90},
    {"name": "Himalayan Pink Salt", "categoryId": "cat_grocery", "brand": "Sherpa Pink", "price": 9.99, "mrp": 12.99, "stock": 400},
    {"name": "Whole Bean Espresso 1lb", "categoryId": "cat_grocery", "brand": "Lavazza", "price": 14.50, "mrp": 18.00, "stock": 250},
    {"name": "Raw Wild Honey", "categoryId": "cat_grocery", "brand": "Nature Nate's", "price": 12.99, "mrp": 15.99, "stock": 180},
    {"name": "Quinoa Organic 2lbs", "categoryId": "cat_grocery", "brand": "Lundberg", "price": 11.50, "mrp": 14.00, "stock": 130},

    # Sports & Fitness
    {"name": "Yoga Mat with Alignment Lines", "categoryId": "cat_sports", "brand": "Liforme", "price": 140.00, "mrp": 150.00, "stock": 60},
    {"name": "Resistance Bands Set", "categoryId": "cat_sports", "brand": "FitSimplify", "price": 12.99, "mrp": 19.99, "stock": 350},
    {"name": "Whey Protein Powder 5lbs", "categoryId": "cat_sports", "brand": "Optimum Nutrition", "price": 64.99, "mrp": 79.99, "stock": 90},
    {"name": "Stainless Steel Water Bottle", "categoryId": "cat_sports", "brand": "Hydro Flask", "price": 39.95, "mrp": 44.95, "stock": 110},
    {"name": "Jump Rope Tangle-Free", "categoryId": "cat_sports", "brand": "WOD Nation", "price": 15.00, "mrp": 20.00, "stock": 200},

    # Books
    {"name": "Atomic Habits", "categoryId": "cat_books", "brand": "Avery", "price": 11.98, "mrp": 16.00, "stock": 500},
    {"name": "Sapiens: A Brief History", "categoryId": "cat_books", "brand": "Harper", "price": 14.99, "mrp": 22.99, "stock": 320},
    {"name": "The Great Gatsby", "categoryId": "cat_books", "brand": "Scribner", "price": 10.50, "mrp": 15.00, "stock": 150},
    
    # Toys
    {"name": "LEGO Classic Creative Brick Box", "categoryId": "cat_toys", "brand": "LEGO", "price": 27.99, "mrp": 34.99, "stock": 80},
    {"name": "Magnetic Tiles Starter Set", "categoryId": "cat_toys", "brand": "Magna-Tiles", "price": 49.99, "mrp": 59.99, "stock": 65}
]

def generate_slug(name):
    return name.lower().replace(" ", "-").replace("'", "").replace("&", "and")

seed_file = "/Users/divydadheech/Documents/Academics/projects/commerce-hub-main/backend/src/main/resources/seed.json"
with open(seed_file, "r") as f:
    data = json.load(f)

current_count = len(data["products"])
start_id = 16

for i, prod in enumerate(new_products):
    prod_id = f"prod_{start_id + i:04d}"
    slug = generate_slug(prod["name"])
    new_product = {
        "id": prod_id,
        "slug": slug,
        "name": prod["name"],
        "brand": prod["brand"],
        "categoryId": prod["categoryId"],
        "shortDescription": f"High quality {prod['name']} by {prod['brand']}.",
        "description": f"Experience the best with the {prod['name']}. Designed for excellence and everyday use.",
        "price": prod["price"],
        "mrp": prod["mrp"],
        "stock": prod["stock"],
        "rating": round(random.uniform(3.5, 5.0), 1),
        "reviews": random.randint(10, 500),
        "images": [
            {
                "id": "img_0",
                "url": f"/images/products/{prod_id}.png",
                "alt": prod["name"]
            }
        ]
    }
    data["products"].append(new_product)

with open(seed_file, "w") as f:
    json.dump(data, f, indent=2)

print(f"Added {len(new_products)} products. Total products: {len(data['products'])}")
