import json
import psycopg2

def main():
    conn = psycopg2.connect(
        dbname="shoppersend_db",
        user="shoppersend",
        password="password",
        host="localhost"
    )
    cur = conn.cursor()
    
    with open('backend/src/main/resources/seed.json', 'r') as f:
        data = json.load(f)
        
    for prod in data.get('products', []):
        slug = prod['slug']
        prod_id = prod['id']
        img_url = f"/images/products/{prod_id}.png"
        
        # Update seed.json
        if 'images' in prod and len(prod['images']) > 0:
            prod['images'][0]['url'] = img_url
        else:
            prod['images'] = [{"id": "img_0", "url": img_url, "alt": prod['name']}]
            
        # Update DB
        cur.execute("SELECT id FROM products WHERE slug = %s", (slug,))
        row = cur.fetchone()
        if row:
            db_id = row[0]
            cur.execute("UPDATE product_images SET url = %s WHERE product_id = %s", (img_url, db_id))
            
    conn.commit()
    cur.close()
    conn.close()
    
    with open('backend/src/main/resources/seed.json', 'w') as f:
        json.dump(data, f, indent=2)
        
    print("Database updated! Each product now strictly points to its own unique image.")

if __name__ == '__main__':
    main()
