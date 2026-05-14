const fs = require('fs');

// Fix products.js - admin product compatibility
let c = fs.readFileSync('frontend/js/products.js','utf8');
c = c.replace('font-size:32px;color:${col}">??</div>', 'font-size:32px;color:${col}"><i class="fa-solid fa-pills"></i></div>');
c = c.replace(/\$\{product\.mrp\.toFixed\(2\)\}/g, '${parseFloat(product.mrp||0).toFixed(2)}');
c = c.replace(/\$\{product\.ptr\.toFixed\(2\)\}/g, '${parseFloat(product.ptr||0).toFixed(2)}');
c = c.replace(/\$\{product\.pts\.toFixed\(2\)\}/g, '${parseFloat(product.pts||0).toFixed(2)}');
fs.writeFileSync('frontend/js/products.js', c, 'utf8');
console.log('products.js done');

// Fix cart.html - rupee, remove icon, nav cart icon
c = fs.readFileSync('frontend/cart.html','utf8');
c = c.replace(/>\?(\$\{[a-z])/g, '>&#8377;$1');
c = c.replace("'?'+shipping", "'&#8377;'+shipping");
// Fix remove button ? -> FA icon
c = c.replace(/>\?<\/span>(<\/td>)/g, '><i class="fa-solid fa-trash-can"></i></span>$1');
c = c.replace('class="nav-cart" style="color:var(--primary-600)">??', 'class="nav-cart" style="color:var(--primary-600)"><i class="fa-solid fa-cart-shopping"></i>');
c = c.replace('class="nav-cart">??', 'class="nav-cart"><i class="fa-solid fa-cart-shopping"></i>');
// Fix empty cart icon
c = c.replace('<div style="font-size:80px;margin-bottom:24px">??</div>', '<div style="font-size:80px;margin-bottom:24px"><i class="fa-solid fa-cart-shopping" style="font-size:80px;color:var(--neutral-200)"></i></div>');
// Fix inline ?${item.mrp
c = c.replace('>?${item.mrp', '>&#8377;${item.mrp');
fs.writeFileSync('frontend/cart.html', c, 'utf8');
console.log('cart.html done');

// Fix checkout.html
c = fs.readFileSync('frontend/checkout.html','utf8');
c = c.replace(/>\?(\$\{[a-z])/g, '>&#8377;$1');
c = c.replace("'FREE':'?'+sh", "'FREE':'&#8377;'+sh");
c = c.replace("'?'+sh", "'&#8377;'+sh");
c = c.replace('class="nav-cart">??', 'class="nav-cart"><i class="fa-solid fa-cart-shopping"></i>');
c = c.replace('<div class="check-circle">?</div>', '<div class="check-circle"><i class="fa-solid fa-check"></i></div>');
// Fix ??  product icon fallback spans
c = c.replace('style="font-size:24px;display:none">??</span>', 'style="display:none"><i class="fa-solid fa-pills" style="font-size:20px;color:#ccc"></i></span>');
c = c.replace('<span style="font-size:24px">??</span>', '<span><i class="fa-solid fa-pills" style="font-size:20px;color:#ccc"></i></span>');
// Fix ${i.name} ? ${i.qty}
c = c.replace('${i.name} ? ${i.qty}', '${i.name} &times; ${i.qty}');
fs.writeFileSync('frontend/checkout.html', c, 'utf8');
console.log('checkout.html done');

// Fix diapers.html
c = fs.readFileSync('frontend/diapers.html','utf8');
c = c.replace('class="nav-cart">??', 'class="nav-cart"><i class="fa-solid fa-cart-shopping"></i>');
c = c.replace('?? +91', '<i class="fa-solid fa-phone"></i> +91');
c = c.replace('?? groupseverest@gmail.com', '<i class="fa-solid fa-envelope"></i> groupseverest@gmail.com');
fs.writeFileSync('frontend/diapers.html', c, 'utf8');
console.log('diapers.html done');

console.log('All icon fixes applied!');
