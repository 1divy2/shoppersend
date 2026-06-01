import os
import urllib.request
import json
import psycopg2
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

keywords = [
    "earbuds,headphones",
    "laptop,computer",
    "smartwatch,watch",
    "charger,adapter",
    "tshirt,clothing",
    "shoes,sneakers",
    "belt,leather",
    "kettle,kitchen",
    "pillow,home",
    "skillet,pan",
    "moisturizer,cream",
    "coffee,drink",
    "dumbbell,fitness",
    "book,paperback",
    "toy,blocks"
]

def main():
    img_dir = "public/images/products"
    os.makedirs(img_dir, exist_ok=True)
    
    # Download 15 good images
    print("Downloading 15 high-quality images...")
    for i, kw in enumerate(keywords):
        img_id = f"prod_{i+1:04d}"
        url = f"https://loremflickr.com/800/800/{kw}/all"
        path = os.path.join(img_dir, f"{img_id}.png")
        try:
            urllib.request.urlretrieve(url, path)
            print(f"Downloaded {img_id}.png for {kw}")
        except Exception as e:
            print(f"Failed to download {img_id}: {e}")
            
    # Connect to DB and update all 50 products to use these 15 images round-robin
    print("Updating database to reuse these 15 images...")
    conn = psycopg2.connect(
        dbname="shoppersend_db",
        user="shoppersend",
        password="password",
        host="localhost"
    )
    cur = conn.cursor()
    
    with open('backend/src/main/resources/seed.json', 'r') as f:
        data = json.load(f)
        
    for idx, prod in enumerate(data.get('products', [])):
        slug = prod['slug']
        # Round robin 1 to 15
        img_index = (idx % 15) + 1
        img_url = f"/images/products/prod_{img_index:04d}.png"
        
        # Update seed.json
        if 'images' in prod and len(prod['images']) > 0:
            prod['images'][0]['url'] = img_url
        else:
            prod['images'] = [{"id": "img_0", "url": img_url, "alt": prod['name']}]
            
        # Update DB
        cur.execute("SELECT id FROM products WHERE slug = %s", (slug,))
        row = cur.fetchone()
        if row:
            prod_id = row[0]
            cur.execute("UPDATE product_images SET url = %s WHERE product_id = %s", (img_url, prod_id))
            
    conn.commit()
    cur.close()
    conn.close()
    
    with open('backend/src/main/resources/seed.json', 'w') as f:
        json.dump(data, f, indent=2)
        
    print("Done! Restored 15 beautiful images and assigned them to all 50 products.")

if __name__ == '__main__':
    main()
