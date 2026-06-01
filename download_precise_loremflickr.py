import os
import urllib.request
import json
import psycopg2
import ssl
import time

ssl._create_default_https_context = ssl._create_unverified_context

def get_precise_keyword(name):
    n = name.lower()
    if 'earbud' in n: return "earbuds,isolated"
    if 'laptop' in n: return "laptop,computer,isolated"
    if 'smartwatch' in n: return "smartwatch,watch,isolated"
    if 'charger' in n: return "charger,adapter,isolated"
    if 'tee' in n or 'shirt' in n: return "tshirt,clothing,isolated"
    if 'shoe' in n or 'sneaker' in n: return "shoes,sneakers,isolated"
    if 'belt' in n: return "belt,leather,isolated"
    if 'kettle' in n: return "kettle,kitchen,isolated"
    if 'pillow' in n: return "pillow,home,isolated"
    if 'skillet' in n or 'pan' in n: return "skillet,pan,isolated"
    if 'moisturizer' in n or 'serum' in n or 'mask' in n: return "skincare,cosmetics,isolated"
    if 'coffee' in n or 'espresso' in n: return "coffee,drink,isolated"
    if 'dumbbell' in n: return "dumbbell,fitness,isolated"
    if 'book' in n or 'algorithm' in n or 'habits' in n or 'sapiens' in n or 'gatsby' in n: return "book,paperback,isolated"
    if 'blocks' in n or 'lego' in n or 'tiles' in n: return "toy,blocks,isolated"
    if 'monitor' in n: return "monitor,screen,isolated"
    if 'keyboard' in n: return "keyboard,mechanical,isolated"
    if 'speaker' in n: return "speaker,audio,isolated"
    if 'mouse' in n: return "computermouse,wireless,isolated"
    if 'powerbank' in n: return "powerbank,battery,isolated"
    if 'jacket' in n: return "jacket,clothing,isolated"
    if 'sunglass' in n: return "sunglasses,eyewear,isolated"
    if 'wallet' in n: return "wallet,leather,isolated"
    if 'beanie' in n: return "beanie,hat,isolated"
    if 'knife' in n: return "knife,kitchen,isolated"
    if 'mug' in n: return "mug,coffee,isolated"
    if 'board' in n: return "cuttingboard,kitchen,isolated"
    if 'purifier' in n: return "airpurifier,home,isolated"
    if 'toothbrush' in n: return "toothbrush,electric,isolated"
    if 'lipstick' in n: return "lipstick,makeup,isolated"
    if 'oil' in n: return "oliveoil,bottle,isolated"
    if 'salt' in n: return "salt,pinksalt,isolated"
    if 'honey' in n: return "honey,jar,isolated"
    if 'quinoa' in n: return "quinoa,grain,isolated"
    if 'mat' in n: return "yogamat,fitness,isolated"
    if 'bands' in n: return "resistancebands,fitness,isolated"
    if 'protein' in n: return "proteinpowder,supplement,isolated"
    if 'bottle' in n: return "waterbottle,flask,isolated"
    if 'rope' in n: return "jumprope,fitness,isolated"
    return "product,isolated,whitebackground"

def main():
    img_dir = "public/images/products"
    os.makedirs(img_dir, exist_ok=True)
    
    with open('backend/src/main/resources/seed.json', 'r') as f:
        data = json.load(f)
        
    print("Downloading 50 highly precise images from LoremFlickr...")
    
    conn = psycopg2.connect(dbname="shoppersend_db", user="shoppersend", password="password", host="localhost")
    cur = conn.cursor()
    
    for idx, prod in enumerate(data.get('products', [])):
        img_id = prod['id']
        name = prod['name']
        kw = get_precise_keyword(name)
        
        url = f"https://loremflickr.com/800/800/{kw}/all?lock={idx}"
        path = os.path.join(img_dir, f"{img_id}.png")
        
        try:
            urllib.request.urlretrieve(url, path)
            print(f"[{idx+1}/50] Downloaded {img_id}.png for {name} ({kw})")
        except Exception as e:
            print(f"[{idx+1}/50] Failed to download {img_id}: {e}")
            
        # Ensure DB maps linearly
        img_url = f"/images/products/{img_id}.png"
        if 'images' in prod and len(prod['images']) > 0:
            prod['images'][0]['url'] = img_url
        else:
            prod['images'] = [{"id": "img_0", "url": img_url, "alt": name}]
            
        cur.execute("SELECT id FROM products WHERE slug = %s", (prod['slug'],))
        row = cur.fetchone()
        if row:
            db_id = row[0]
            cur.execute("UPDATE product_images SET url = %s WHERE product_id = %s", (img_url, db_id))
            
    conn.commit()
    cur.close()
    conn.close()
    
    with open('backend/src/main/resources/seed.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    main()
