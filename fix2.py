import re, os

BASE = 'frontend'

def fix(path, replacements):
    c = open(path, encoding='utf-8').read()
    orig = c
    for old, new in replacements:
        c = c.replace(old, new) if isinstance(old, str) else re.sub(old.pattern, new, c)
    if c != orig:
        open(path, 'w', encoding='utf-8').write(c)
        print(f'Fixed: {os.path.basename(path)}')
    else:
        print(f'No change: {os.path.basename(path)}')

# 1. products.js - guard composition from being undefined
fix(f'{BASE}/js/products.js', [
    ("p.composition.toLowerCase().includes(q)", "(p.composition||'').toLowerCase().includes(q)"),
])

# 2. Verify login.html has Google sign-in button
c = open(f'{BASE}/login.html', encoding='utf-8').read()
if 'google' in c.lower():
    print('login.html already has Google button')
else:
    print('WARNING: login.html missing Google button')

print('Done')
