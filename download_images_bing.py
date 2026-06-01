import json
import os
import shutil
import ssl
from bing_image_downloader import downloader

ssl._create_default_https_context = ssl._create_unverified_context

def main():
    seed_path = 'backend/src/main/resources/seed.json'
    img_dir = 'public/images/products'
    temp_dir = 'temp_dataset'
    
    os.makedirs(img_dir, exist_ok=True)
    
    with open(seed_path, 'r') as f:
        data = json.load(f)
        
    products = data.get('products', [])
    
    for i, prod in enumerate(products):
        slug = prod['slug']
        name = prod['name']
        img_filename = f"{slug}.png"
        img_path = os.path.join(img_dir, img_filename)
        
        print(f"\n[{i+1}/{len(products)}] Processing {name} ({slug})...")
        
        query = f"{name} high quality product photography white background"
        try:
            downloader.download(query, limit=1, output_dir=temp_dir, adult_filter_off=True, force_replace=False, timeout=60, verbose=False)
            
            # Find the downloaded file
            query_dir = os.path.join(temp_dir, query)
            if os.path.exists(query_dir):
                files = os.listdir(query_dir)
                if len(files) > 0:
                    downloaded_file = os.path.join(query_dir, files[0])
                    # Move and rename to .png (or keep original extension)
                    # Let's rename to the slug regardless of extension, the browser will figure it out or we keep extension
                    ext = os.path.splitext(downloaded_file)[1]
                    if ext.lower() not in ['.png', '.jpg', '.jpeg', '.webp']:
                        ext = '.jpg'
                    final_filename = f"{slug}{ext}"
                    final_path = os.path.join(img_dir, final_filename)
                    
                    shutil.copy(downloaded_file, final_path)
                    print(f"  Moved to {final_path}")
                    
                    if prod.get('variants') and len(prod['variants']) > 0:
                        prod['variants'][0]['imageUrl'] = f"/images/products/{final_filename}"
                else:
                    print("  No files downloaded in directory.")
            else:
                print("  Download directory not created.")
                
        except Exception as e:
            print(f"  Error: {e}")

    # Save updated seed.json
    with open(seed_path, 'w') as f:
        json.dump(data, f, indent=2)
        
    # Cleanup temp
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
        
    print("All done!")

if __name__ == '__main__':
    main()
