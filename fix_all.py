import re, os

BASE = 'frontend'

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Saved: {os.path.basename(path)}')

# ── 1. products.js ─────────────────────────────────────────────────────────────
print('\n[1] products.js')
c = read(f'{BASE}/js/products.js')
# Fix garbled ?? placeholder icon in generateProductCard
c = c.replace('font-size:32px;color:${col}">??</div>', 
              'font-size:32px;color:${col}"><i class="fa-solid fa-pills"></i></div>')
# Safely parse mrp/ptr/pts (admin products may store as number but guard anyway)
c = c.replace('${product.mrp.toFixed(2)}', '${parseFloat(product.mrp||0).toFixed(2)}')
c = c.replace('${product.ptr.toFixed(2)}', '${parseFloat(product.ptr||0).toFixed(2)}')
c = c.replace('${product.pts.toFixed(2)}', '${parseFloat(product.pts||0).toFixed(2)}')
# Admin products: guard against undefined composition crashing .substring()
c = c.replace("${product.composition}", "${product.composition||''}")
write(f'{BASE}/js/products.js', c)

# ── 2. cart.html ───────────────────────────────────────────────────────────────
print('\n[2] cart.html')
c = read(f'{BASE}/cart.html')
# Rupee symbol - JS template strings
c = re.sub(r"(?<=>)\?(?=\$\{[a-z])", '&#8377;', c)
c = c.replace("'?'+shipping", "'&#8377;'+shipping")
c = c.replace('>?${item.mrp', '>&#8377;${item.mrp')
# Remove icon
c = re.sub(r'<span class="cart-remove" onclick="removeCartItem\(([^)]+)\)">\?</span>',
           r'<span class="cart-remove" onclick="removeCartItem(\1)"><i class="fa-solid fa-trash-can"></i></span>', c)
# Nav cart icon
c = re.sub(r'class="nav-cart"[^>]*>\?\?', 'class="nav-cart"><i class="fa-solid fa-cart-shopping"></i>', c)
# Empty cart icon
c = c.replace('"font-size:80px;margin-bottom:24px">??</div>',
              '"font-size:80px;margin-bottom:24px"><i class="fa-solid fa-cart-shopping" style="font-size:80px;color:var(--neutral-200)"></i></div>')
write(f'{BASE}/cart.html', c)

# ── 3. checkout.html ───────────────────────────────────────────────────────────
print('\n[3] checkout.html')
c = read(f'{BASE}/checkout.html')
c = re.sub(r"(?<=>)\?(?=\$\{[a-z])", '&#8377;', c)
c = c.replace("'FREE':'?'+sh", "'FREE':'&#8377;'+sh")
c = c.replace("'?'+sh", "'&#8377;'+sh")
c = re.sub(r'class="nav-cart"[^>]*>\?\?', 'class="nav-cart"><i class="fa-solid fa-cart-shopping"></i>', c)
c = c.replace('<div class="check-circle">?</div>', '<div class="check-circle"><i class="fa-solid fa-check"></i></div>')
write(f'{BASE}/checkout.html', c)

# ── 4. diapers.html ────────────────────────────────────────────────────────────
print('\n[4] diapers.html')
c = read(f'{BASE}/diapers.html')
c = re.sub(r'class="nav-cart"[^>]*>\?\?', 'class="nav-cart"><i class="fa-solid fa-cart-shopping"></i>', c)
c = c.replace('?? +91', '<i class="fa-solid fa-phone"></i> +91')
c = c.replace('?? groupseverest@gmail.com', '<i class="fa-solid fa-envelope"></i> groupseverest@gmail.com')
# Fix rupee in diaper price rendering JS
c = re.sub(r"(?<=>)\?(?=\$\{[a-z])", '&#8377;', c)
write(f'{BASE}/diapers.html', c)

# ── 5. Scan ALL html pages for remaining ?? nav-cart and ? rupee ───────────────
print('\n[5] Scanning all HTML pages...')
for fname in os.listdir(BASE):
    if not fname.endswith('.html'): continue
    path = os.path.join(BASE, fname)
    c = read(path)
    orig = c
    c = re.sub(r'class="nav-cart"[^>]*>\?\?', 'class="nav-cart"><i class="fa-solid fa-cart-shopping"></i>', c)
    c = re.sub(r"(?<=>)\?(?=\$\{[a-z])", '&#8377;', c)
    if c != orig:
        write(path, c)
        print(f'  Fixed: {fname}')

# ── 6. products.html — verify admin products section ──────────────────────────
print('\n[6] Checking products.html rendering...')
c = read(f'{BASE}/products.html')
# Check if products.html calls filterProducts
if 'filterProducts' in c:
    print('  filterProducts called - OK')
else:
    print('  WARNING: filterProducts not found in products.html')

print('\n✓ All fixes applied.')
