import json
import os
import requests
from duckduckgo_search import DDGS
from time import sleep

def main():
    seed_path = 'backend/src/main/resources/seed.json'
    img_dir = 'public/images/products'
    
    os.makedirs(img_dir, exist_ok=True)
    
    with open(seed_path, 'r') as f:
        data = json.load(f)
        
    products = data.get('products', [])
    
    ddgs = DDGS()
    
    for i, prod in enumerate(products):
        slug = prod['slug']
        name = prod['name']
        img_filename = f"{slug}.png"
        img_path = os.path.join(img_dir, img_filename)
        
        print(f"[{i+1}/{len(products)}] Processing {name} ({slug})...")
        
        # Search for an image
        try:
            results = ddgs.images(name + " product photography", max_results=1)
            if results and len(results) > 0:
                img_url = results[0]['image']
                print(f"  Found image URL: {img_url}")
                
                # Download
                headers = {'User-Agent': 'Mozilla/5.0'}
                resp = requests.get(img_url, headers=headers, timeout=10)
                if resp.status_code == 200:
                    with open(img_path, 'wb') as img_f:
                        img_f.write(resp.content)
                    print("  Downloaded successfully.")
                    
                    # Update seed.json variant image URL
                    if prod.get('variants') and len(prod['variants']) > 0:
                        prod['variants'][0]['imageUrl'] = f"/images/products/{img_filename}"
                else:
                    print(f"  Failed to download: status {resp.status_code}")
            else:
                print("  No image found.")
        except Exception as e:
            print(f"  Error: {e}")
            
        sleep(1.5) # rate limit prevention

    # Save updated seed.json
    with open(seed_path, 'w') as f:
        json.dump(data, f, indent=2)
        
    print("All done!")

if __name__ == '__main__':
    main()
