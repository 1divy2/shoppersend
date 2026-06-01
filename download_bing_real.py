import json
import os
import shutil
import ssl
from bing_image_downloader import downloader

ssl._create_default_https_context = ssl._create_unverified_context

def main():
    seed_path = 'backend/src/main/resources/seed.json'
    img_dir = 'public/images/products'
    temp_dir = 'temp_dataset2'
    
    os.makedirs(img_dir, exist_ok=True)
    
    with open(seed_path, 'r') as f:
        data = json.load(f)
        
    products = data.get('products', [])
    
    for i, prod in enumerate(products):
        prod_id = prod['id']
        name = prod['name']
        img_filename = f"{prod_id}.png"
        final_path = os.path.join(img_dir, img_filename)
        
        print(f"\n[{i+1}/{len(products)}] Processing {name}...")
        
        query = f"{name} product photography white background"
        try:
            downloader.download(query, limit=1, output_dir=temp_dir, adult_filter_off=True, force_replace=False, timeout=10, verbose=False)
            
            query_dir = os.path.join(temp_dir, query)
            if os.path.exists(query_dir):
                files = os.listdir(query_dir)
                if len(files) > 0:
                    downloaded_file = os.path.join(query_dir, files[0])
                    
                    # Convert or copy to .png
                    from PIL import Image
                    try:
                        with Image.open(downloaded_file) as im:
                            im.convert('RGB').save(final_path, 'PNG')
                        print(f"  Saved to {final_path}")
                    except Exception as e:
                        print(f"  Pillow conversion failed: {e}, falling back to copy")
                        shutil.copy(downloaded_file, final_path)
                else:
                    print("  No files downloaded.")
            else:
                print("  Download directory not created.")
                
        except Exception as e:
            print(f"  Error: {e}")

    # Cleanup temp
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
        
    print("All done downloading realistic images!")

if __name__ == '__main__':
    main()
