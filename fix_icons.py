import re

# ---- Fix products.js ----
with open('frontend/js/products.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix garbled ?? placeholder icon
c = c.replace('font-size:32px;color:${col}">??</div>', 'font-size:32px;color:${col}"><i class="fa-solid fa-pills"></i></div>')
# Make mrp/ptr/pts safe with parseFloat
c = c.replace('${product.mrp.toFixed(2)}', '${parseFloat(product.mrp||0).toFixed(2)}')
c = c.replace('${product.ptr.toFixed(2)}', '${parseFloat(product.ptr||0).toFixed(2)}')
c = c.replace('${product.pts.toFixed(2)}', '${parseFloat(product.pts||0).toFixed(2)}')

with open('frontend/js/products.js', 'w', encoding='utf-8') as f:
    f.write(c)
print('products.js done')

# ---- Fix cart.html ----
with open('frontend/cart.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix rupee in JS template literals
c = re.sub(r'>\?(\$\{[a-z])', r'>&#8377;\1', c)
c = c.replace("'?'+shipping", "'&#8377;'+shipping")
c = c.replace('>?${subtotal', '>&#8377;${subtotal')
c = c.replace('>?${gst', '>&#8377;${gst')
c = c.replace('>?${total', '>&#8377;${total')
# Fix remove icon ? -> FA trash
c = re.sub(r'<span class="cart-remove" onclick="removeCartItem\(([^)]+)\)">\?</span>', 
           r'<span class="cart-remove" onclick="removeCartItem(\1)"><i class="fa-solid fa-trash-can"></i></span>', c)

with open('frontend/cart.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('cart.html done')

# ---- Fix checkout.html ----
with open('frontend/checkout.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'>\?(\$\{[a-z])', r'>&#8377;\1', c)
c = c.replace("'FREE':'?'+sh", "'FREE':'&#8377;'+sh")
c = c.replace("'?'+sh", "'&#8377;'+sh")

with open('frontend/checkout.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('checkout.html done')

# ---- Scan ALL html files for remaining garbled rupee patterns in JS strings ----
import glob, os
for path in glob.glob('frontend/*.html'):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    orig = c
    c = re.sub(r'>\?(\$\{[a-z])', r'>&#8377;\1', c)
    if c != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f'Fixed: {os.path.basename(path)}')

print('All done')
