import os
import urllib.request
import json
import psycopg2
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def get_keyword_for_product(name):
    name = name.lower()
    if 'earbud' in name or 'headphone' in name: return 'headphones'
    if 'laptop' in name: return 'laptop'
    if 'watch' in name: return 'smartwatch'
    if 'charger' in name or 'powerbank' in name: return 'charger'
    if 'monitor' in name or 'screen' in name: return 'monitor'
    if 'keyboard' in name: return 'keyboard'
    if 'mouse' in name: return 'computermouse'
    if 'speaker' in name: return 'speaker'
    if 'jacket' in name or 'tee' in name or 'beanie' in name: return 'clothing'
    if 'shoe' in name or 'sneaker' in name: return 'shoes'
    if 'belt' in name or 'wallet' in name or 'sunglass' in name: return 'accessories'
    if 'kettle' in name or 'skillet' in name or 'pan' in name or 'knife' in name: return 'kitchenware'
    if 'coffee' in name or 'espresso' in name: return 'coffee'
    if 'moisturizer' in name or 'serum' in name or 'mask' in name or 'lipstick' in name: return 'cosmetics'
    if 'dumbbell' in name or 'mat' in name or 'jump rope' in name or 'bands' in name: return 'fitness'
    if 'book' in name or 'habits' in name or 'sapiens' in name or 'gatsby' in name or 'algorithm' in name: return 'book'
    if 'lego' in name or 'tiles' in name or 'blocks' in name: return 'toy'
    if 'oil' in name or 'salt' in name or 'honey' in name or 'quinoa' in name or 'whey' in name: return 'food'
    return 'product'

def main():
    img_dir = "public/images/products"
    os.makedirs(img_dir, exist_ok=True)
    
    with open('backend/src/main/resources/seed.json', 'r') as f:
        data = json.load(f)
        
    print("Downloading 50 real photos from LoremFlickr based on product categories...")
    
    for idx, prod in enumerate(data.get('products', [])):
        img_id = prod['id'] # e.g. prod_0001
        name = prod['name']
        kw = get_keyword_for_product(name)
        
        url = f"https://loremflickr.com/800/800/{kw}/all"
        path = os.path.join(img_dir, f"{img_id}.png")
        
        try:
            # We want unique images even if the keyword is the same, so we add a random seed?
            # loremflickr caches based on URL. To get a different image for the same keyword, we can append a query param like ?lock=idx
            url_locked = f"{url}?lock={idx}"
            urllib.request.urlretrieve(url_locked, path)
            print(f"[{idx+1}/50] Downloaded {img_id}.png for {name} (Keyword: {kw})")
        except Exception as e:
            print(f"[{idx+1}/50] Failed to download {img_id}: {e}")

if __name__ == '__main__':
    main()
