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
        if 'images' in prod and len(prod['images']) > 0:
            img_url = prod['images'][0].get('url')
            if img_url:
                # Get product ID
                cur.execute("SELECT id FROM products WHERE slug = %s", (slug,))
                row = cur.fetchone()
                if row:
                    prod_id = row[0]
                    # Update image
                    cur.execute("UPDATE product_images SET url = %s WHERE product_id = %s", (img_url, prod_id))
    
    conn.commit()
    cur.close()
    conn.close()
    print("Images updated successfully!")

if __name__ == '__main__':
    main()
