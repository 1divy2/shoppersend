import json
import os
import hashlib
from PIL import Image, ImageDraw, ImageFont

def get_color(text, offset=0):
    m = hashlib.md5((text + str(offset)).encode())
    return tuple(m.digest()[:3])

def create_gradient(width, height, color1, color2):
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            mask_data.append(int(255 * (y / height)))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_text_centered(draw, text, font, width, height, y_offset=0, fill="white"):
    # Try to calculate text size
    try:
        left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
        text_w = right - left
        text_h = bottom - top
    except AttributeError:
        # Fallback for older PIL
        text_w, text_h = draw.textsize(text, font=font)
        
    x = (width - text_w) / 2
    y = (height - text_h) / 2 + y_offset
    draw.text((x, y), text, font=font, fill=fill)

def main():
    seed_path = 'backend/src/main/resources/seed.json'
    img_dir = 'public/images/products'
    
    os.makedirs(img_dir, exist_ok=True)
    
    with open(seed_path, 'r') as f:
        data = json.load(f)
        
    products = data.get('products', [])
    
    # Try to load a default font, otherwise fallback
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    except IOError:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    for i, prod in enumerate(products):
        slug = prod['slug']
        name = prod['name']
        brand = prod.get('brand', '')
        
        # Determine colors based on slug
        c1 = get_color(slug)
        c2 = get_color(slug, 1)
        
        # Generate image
        width, height = 800, 800
        img = create_gradient(width, height, c1, c2)
        draw = ImageDraw.Draw(img)
        
        # Draw Brand and Name
        if brand:
            draw_text_centered(draw, brand.upper(), font_small, width, height, -40, "rgba(255,255,255,180)")
        
        # Handle long names by splitting
        if len(name) > 25:
            parts = name.split(' ')
            mid = len(parts) // 2
            n1 = ' '.join(parts[:mid])
            n2 = ' '.join(parts[mid:])
            draw_text_centered(draw, n1, font_large, width, height, 10, "white")
            draw_text_centered(draw, n2, font_large, width, height, 70, "white")
        else:
            draw_text_centered(draw, name, font_large, width, height, 20, "white")
            
        img_filename = f"{prod['id']}.png"
        img_path = os.path.join(img_dir, img_filename)
        img.save(img_path)
        
        print(f"Generated {img_path}")
        
        # Update seed.json images
        if 'images' in prod and len(prod['images']) > 0:
            prod['images'][0]['url'] = f"/images/products/{img_filename}"
        else:
            prod['images'] = [{"id": "img_0", "url": f"/images/products/{img_filename}", "alt": name}]
            
    # Save updated seed.json
    with open(seed_path, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    main()
