/* ============================================
   DIYA PHARMA — Product Data & Filtering
   ============================================ */

const ProductData = [
  { id: 1, name: "DIYACET TABLET", composition: "PARACETAMOL 500mg IP", division: "PRIMA", therapeutic: "NSAID'S", form: "Tablets", packing: "Blister", packType: "10x10", mrp: 45.50, ptr: 34.67, pts: 31.20, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 2, name: "DIYACET SP TABLET", composition: "ACECLOFENAC 100mg + PARACETAMOL 325mg + SERRATIOPEPTIDASE 15mg", division: "PRIMA", therapeutic: "NSAID'S", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 96.80, ptr: 73.75, pts: 66.38, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 3, name: "DIYAMOL MR", composition: "ACECLOFENAC 100mg IP + PARACETAMOL 325mg IP + CHLORZOXAZONE 250mg", division: "PRIMA", therapeutic: "NSAID'S", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 98.00, ptr: 74.67, pts: 67.20, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 4, name: "DIYAMOL PLUS", composition: "ACECLOFENAC 100mg IP + PARACETAMOL 325mg IP", division: "PRIMA", therapeutic: "NSAID'S", form: "Tablets", packing: "Blister", packType: "10x2x10", mrp: 58.13, ptr: 44.29, pts: 39.86, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 5, name: "DIYACET RB", composition: "ACECLOFENAC 200mg IP + RABEPRAZOLE 20mg", division: "PRIMA", therapeutic: "NSAID'S", form: "Capsules", packing: "Alu Alu", packType: "10x10", mrp: 107.81, ptr: 82.14, pts: 73.93, stock: true, isNew: false, img: "images/meds/capsule.png" },
  { id: 6, name: "DIYALEVO TABLET", composition: "LEVOCETIRIZINE 5mg IP", division: "AUSPIN", therapeutic: "ANTIALLERGIC", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 47.81, ptr: 36.43, pts: 32.79, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 7, name: "DIYALEVO-M TABLET", composition: "LEVOCETIRIZINE 5mg + MONTELUKAST 10mg", division: "AUSPIN", therapeutic: "ANTIALLERGIC", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 159.00, ptr: 121.14, pts: 109.03, stock: true, isNew: true, img: "images/meds/tablet.png" },
  { id: 8, name: "DIYAMONT LC DUO", composition: "MONTELUKAST SODIUM 10mg + LEVOCETIRIZINE 5mg", division: "AUSPIN", therapeutic: "ANTIALLERGIC", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 165.00, ptr: 125.71, pts: 113.14, stock: true, isNew: true, img: "images/meds/tablet.png" },
  { id: 9, name: "ROSUDIYA 10", composition: "ROSUVASTATIN 10mg IP", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 89.00, ptr: 67.82, pts: 61.04, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 10, name: "ROSUDIYA F 10/145", composition: "ROSUVASTATIN 10mg IP + FENOFIBRATE 145mg", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 167.81, ptr: 127.85, pts: 115.07, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 11, name: "DIYAGLIM M2 FORTE", composition: "GLIMEPIRIDE 2mg IP + METFORMIN 1000mg IP SR", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 160.31, ptr: 122.14, pts: 109.93, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 12, name: "DIYAGLIM M1", composition: "GLIMEPIRIDE 1mg IP + METFORMIN 500mg IP SR", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 110.00, ptr: 83.81, pts: 75.43, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 13, name: "ACARVIB 50", composition: "ACARBOSE 50mg IP", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 139.00, ptr: 105.90, pts: 95.31, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 14, name: "DIYAPAN DSR", composition: "PANTOPRAZOLE 40mg + DOMPERIDONE 30mg SR", division: "GENVIMAX", therapeutic: "ANTI-ULCERANTS", form: "Capsules", packing: "Alu Alu", packType: "10x10", mrp: 135.00, ptr: 102.86, pts: 92.57, stock: true, isNew: false, img: "images/meds/capsule.png" },
  { id: 15, name: "DIYAPAN 40", composition: "PANTOPRAZOLE 40mg IP", division: "GENVIMAX", therapeutic: "ANTI-ULCERANTS", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 78.00, ptr: 59.43, pts: 53.49, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 16, name: "DIYARAB 20", composition: "RABEPRAZOLE 20mg IP", division: "GENVIMAX", therapeutic: "ANTI-ULCERANTS", form: "Capsules", packing: "Alu Alu", packType: "10x10", mrp: 89.50, ptr: 68.20, pts: 61.38, stock: true, isNew: false, img: "images/meds/capsule.png" },
  { id: 17, name: "DIYASPAS TABLET", composition: "MEBEVERINE 135mg IP", division: "GENVIMAX", therapeutic: "ANTISPASMODIC", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 120.00, ptr: 91.43, pts: 82.29, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 18, name: "DIYABRO SYRUP", composition: "GUAIPHENESIN 50mg + TERBUTALINE 1.25mg + BROMHEXINE 4mg + MENTHOL 2.5mg", division: "AUSPIN", therapeutic: "GENERAL", form: "Syrup", packing: "", packType: "100ml", mrp: 95.00, ptr: 72.38, pts: 65.14, stock: true, isNew: false, img: "images/meds/syrup.png" },
  { id: 19, name: "DIYABRO JUNIOR SYRUP", composition: "GUAIPHENESIN 25mg + TERBUTALINE 0.625mg + BROMHEXINE 2mg", division: "AUSPIN", therapeutic: "GENERAL", form: "Syrup", packing: "", packType: "60ml", mrp: 78.00, ptr: 59.43, pts: 53.49, stock: true, isNew: true, img: "images/meds/syrup.png" },
  { id: 20, name: "DIYACOUGH CS SYRUP", composition: "DEXTROMETHORPHAN HBr 10mg + PHENYLEPHRINE 5mg + CPM 2mg", division: "AUSPIN", therapeutic: "GENERAL", form: "Syrup", packing: "", packType: "100ml", mrp: 138.00, ptr: 105.14, pts: 94.63, stock: true, isNew: true, img: "images/meds/syrup.png" },
  { id: 21, name: "DIYASPAS S SUSPENSION", composition: "DICYCLOMINE HCL 10mg + SIMETHICONE 40mg", division: "GENVIMAX", therapeutic: "ANTISPASMODIC", form: "Suspension", packing: "", packType: "30ml", mrp: 89.06, ptr: 67.86, pts: 61.07, stock: true, isNew: false, img: "images/meds/syrup.png" },
  { id: 22, name: "DIYACEF 200", composition: "CEFIXIME 200mg IP", division: "MEDANOR", therapeutic: "ANTIBIOTICS", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 178.00, ptr: 135.62, pts: 122.06, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 23, name: "DIYACEF CV", composition: "CEFIXIME 200mg + CLAVULANIC ACID 125mg", division: "MEDANOR", therapeutic: "ANTIBIOTICS", form: "Tablets", packing: "Alu Alu", packType: "10x6", mrp: 245.00, ptr: 186.67, pts: 168.00, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 24, name: "DIYAZITH 500", composition: "AZITHROMYCIN 500mg IP", division: "MEDANOR", therapeutic: "ANTIBIOTICS", form: "Tablets", packing: "Alu Alu", packType: "10x3", mrp: 95.00, ptr: 72.38, pts: 65.14, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 25, name: "DIYAMOX CV 625", composition: "AMOXICILLIN 500mg + CLAVULANIC ACID 125mg", division: "MEDANOR", therapeutic: "ANTIBIOTICS", form: "Tablets", packing: "Alu Alu", packType: "10x6", mrp: 210.00, ptr: 160.00, pts: 144.00, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 26, name: "DIYANEURO NT", composition: "PREGABALIN 75mg + NORTRIPTYLINE 10mg", division: "MIND", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 185.00, ptr: 140.95, pts: 126.86, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 27, name: "DIYANEURO M 75", composition: "PREGABALIN 75mg + METHYLCOBALAMIN 750mcg", division: "MIND", therapeutic: "NUTRITIONAL", form: "Capsules", packing: "Alu Alu", packType: "10x10", mrp: 195.00, ptr: 148.57, pts: 133.71, stock: true, isNew: false, img: "images/meds/capsule.png" },
  { id: 28, name: "DIYACALM 0.5", composition: "CLONAZEPAM 0.5mg IP", division: "MIND", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 52.00, ptr: 39.62, pts: 35.66, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 29, name: "DIYAGABA NT", composition: "GABAPENTIN 300mg + NORTRIPTYLINE 10mg", division: "MIND", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 168.00, ptr: 128.00, pts: 115.20, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 30, name: "DIYAFLOX 200", composition: "OFLOXACIN 200mg IP", division: "MEDANOR", therapeutic: "ANTIBIOTICS", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 85.00, ptr: 64.76, pts: 58.29, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 31, name: "DIYAFLOX OZ", composition: "OFLOXACIN 200mg + ORNIDAZOLE 500mg", division: "MEDANOR", therapeutic: "ANTIBIOTICS", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 145.00, ptr: 110.48, pts: 99.43, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 32, name: "DIYASKIN CREAM", composition: "CLOBETASOL 0.05% + OFLOXACIN 0.75% + MICONAZOLE 2% + ZINC SULPHATE 1%", division: "GRACE", therapeutic: "CORTICOSTEROIDS", form: "Cream", packing: "", packType: "15gm", mrp: 89.00, ptr: 67.81, pts: 61.03, stock: true, isNew: false, img: "images/meds/ointment.png" },
  { id: 33, name: "DIYASKIN-L LOTION", composition: "CLOBETASOL 0.05% + SALICYLIC ACID 3%", division: "GRACE", therapeutic: "CORTICOSTEROIDS", form: "Lotion", packing: "", packType: "30ml", mrp: 125.00, ptr: 95.24, pts: 85.71, stock: true, isNew: false, img: "images/meds/ointment.png" },
  { id: 34, name: "DIYAGLOW FACE WASH", composition: "GLYCOLIC ACID 1% + SALICYLIC ACID 1%", division: "GRACE", therapeutic: "GENERAL", form: "Face wash", packing: "", packType: "100ml", mrp: 220.00, ptr: 167.62, pts: 150.86, stock: true, isNew: true, img: "images/meds/ointment.png" },
  { id: 35, name: "DIYAFUNG CREAM", composition: "LULICONAZOLE 1% W/W", division: "GRACE", therapeutic: "ANTIFUNGAL", form: "Cream", packing: "", packType: "20gm", mrp: 195.00, ptr: 148.57, pts: 133.71, stock: true, isNew: false, img: "images/meds/ointment.png" },
  { id: 36, name: "DIYAEYE DROPS", composition: "MOXIFLOXACIN 0.5% W/V", division: "OPTHO", therapeutic: "ANTIBIOTICS", form: "Drops", packing: "", packType: "5ml", mrp: 68.00, ptr: 51.81, pts: 46.63, stock: true, isNew: false, img: "images/meds/injection.png" },
  { id: 37, name: "DIYAEYE-D DROPS", composition: "DEXAMETHASONE 0.1% + MOXIFLOXACIN 0.5%", division: "OPTHO", therapeutic: "ANTIBIOTICS", form: "Drops", packing: "", packType: "10ml", mrp: 95.00, ptr: 72.38, pts: 65.14, stock: true, isNew: false, img: "images/meds/injection.png" },
  { id: 38, name: "DIYATEAR DROPS", composition: "CARBOXYMETHYLCELLULOSE 0.5%", division: "OPTHO", therapeutic: "GENERAL", form: "Drops", packing: "", packType: "10ml", mrp: 78.00, ptr: 59.43, pts: 53.49, stock: true, isNew: false, img: "images/meds/injection.png" },
  { id: 39, name: "DIYAVIT NUTRA", composition: "MULTIVITAMIN + MULTIMINERAL + ANTIOXIDANT SOFTGEL", division: "NURALZ", therapeutic: "NUTRITIONAL", form: "Capsules", packing: "Blister", packType: "10x10", mrp: 145.00, ptr: 110.48, pts: 99.43, stock: true, isNew: false, img: "images/meds/capsule.png" },
  { id: 40, name: "DIYACAL CT", composition: "CALCIUM CITRATE 1000mg + VITAMIN D3 200IU", division: "NURALZ", therapeutic: "NUTRITIONAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 165.00, ptr: 125.71, pts: 113.14, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 41, name: "DIYAZINC FOOD", composition: "GRAPE SEED 50mg + GREEN TEA EXTRACT 50mg + LYCOPENE 2500mcg + VITAMINS", division: "NURALZ", therapeutic: "NUTRITIONAL", form: "Capsules", packing: "Blister", packType: "10x10", mrp: 96.99, ptr: 73.90, pts: 66.51, stock: true, isNew: false, img: "images/meds/capsule.png" },
  { id: 42, name: "DIYAIRON XT", composition: "FERROUS ASCORBATE 100mg + FOLIC ACID 1.5mg + ZINC 22.5mg", division: "NURALZ", therapeutic: "NUTRITIONAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 130.00, ptr: 99.05, pts: 89.14, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 43, name: "DIYAKESH OIL", composition: "AMLA 2gm + BHRINGRAJ 2gm + BRAHMI 1gm", division: "NURALZ", therapeutic: "GENERAL", form: "Oil", packing: "", packType: "100ml", mrp: 164.06, ptr: 124.99, pts: 112.49, stock: true, isNew: false, img: "images/meds/ointment.png" },
  { id: 44, name: "DIYAPINE SYRUP", composition: "FERRIC AMMONIUM CITRATE 160mg + FOLIC ACID 0.5mg + CYANOCOBALAMIN 7.5mcg", division: "EVERMED", therapeutic: "NUTRITIONAL", form: "Syrup", packing: "", packType: "200ml", mrp: 165.00, ptr: 125.71, pts: 113.14, stock: true, isNew: true, img: "images/meds/syrup.png" },
  { id: 45, name: "DIYAGEL MPS SUSPENSION", composition: "DRIED ALUMINIUM HYDROXIDE 250mg + MAGNESIUM HYDROXIDE 250mg + SIMETHICONE 50mg", division: "GENVIMAX", therapeutic: "ANTI-ULCERANTS", form: "Suspension", packing: "", packType: "170ml", mrp: 147.00, ptr: 112.00, pts: 100.80, stock: true, isNew: true, img: "images/meds/syrup.png" },
  { id: 46, name: "DIYAVENT INHALER", composition: "LEVOSALBUTAMOL 50mcg + IPRATROPIUM 20mcg", division: "VENTILA", therapeutic: "RESPULES", form: "Inhaler", packing: "", packType: "200MD", mrp: 285.00, ptr: 217.14, pts: 195.43, stock: true, isNew: false, img: "images/meds/injection.png" },
  { id: 47, name: "DIYAVENT RESPULES", composition: "LEVOSALBUTAMOL 0.63mg + IPRATROPIUM 0.5mg", division: "VENTILA", therapeutic: "RESPULES", form: "Respules", packing: "", packType: "5x2.5ml", mrp: 72.00, ptr: 54.86, pts: 49.37, stock: true, isNew: false, img: "images/meds/injection.png" },
  { id: 48, name: "DIYABUD RESPULES", composition: "BUDESONIDE 0.5mg", division: "VENTILA", therapeutic: "RESPULES", form: "Respules", packing: "", packType: "5x2ml", mrp: 95.00, ptr: 72.38, pts: 65.14, stock: true, isNew: false, img: "images/meds/injection.png" },
  { id: 49, name: "DIYAMET 500 SR", composition: "METFORMIN 500mg IP SR", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 55.00, ptr: 41.90, pts: 37.71, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 50, name: "DIYATEL 40", composition: "TELMISARTAN 40mg IP", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 75.00, ptr: 57.14, pts: 51.43, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 51, name: "DIYATEL AM", composition: "TELMISARTAN 40mg + AMLODIPINE 5mg", division: "CURE", therapeutic: "GENERAL", form: "Tablets", packing: "Alu Alu", packType: "10x10", mrp: 110.00, ptr: 83.81, pts: 75.43, stock: true, isNew: false, img: "images/meds/tablet.png" },
  { id: 52, name: "DIYACILIN 500", composition: "AMOXICILLIN 500mg IP", division: "MEDANOR", therapeutic: "ANTIBIOTICS", form: "Capsules", packing: "Blister", packType: "10x10", mrp: 125.00, ptr: 95.24, pts: 85.71, stock: true, isNew: false, img: "images/meds/capsule.png" }
];

const Divisions = ["AUSPIN","CURE","GRACE","MIND","PRIMA","OPTHO","NURALZ","EVERMED","GENVIMAX","MEDANOR","VENTILA"];
const Forms = ["Tablets","Capsules","Syrup","Suspension","Cream","Ointment","Gel","Drops","Oil","Lotion","Inhaler","Face wash","Respules","Powder"];
const Therapeutics = ["NSAID'S","ANTIBIOTICS","ANTIALLERGIC","ANTIFUNGAL","ANTI-ULCERANTS","ANTISPASMODIC","CORTICOSTEROIDS","NUTRITIONAL","GENERAL","RESPULES"];

/* ---------- Filter Engine ---------- */
function filterProducts(filters = {}) {
  // Merge admin-added products with built-in catalog
  const adminProds = JSON.parse(localStorage.getItem('admin_products') || '[]');
  const mergedData = [...ProductData, ...adminProds.map(p => ({...p, stock: p.inStock !== false, isNew: false, composition: p.desc || '', therapeutic: p.division, packing:'', packType:'', ptr:p.mrp*0.76, pts:p.mrp*0.68}))];
  let results = [...mergedData];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(q) || p.composition.toLowerCase().includes(q));
  }
  if (filters.division) results = results.filter(p => p.division === filters.division);
  if (filters.form) results = results.filter(p => p.form === filters.form);
  if (filters.therapeutic) results = results.filter(p => p.therapeutic === filters.therapeutic);
  if (filters.packing) results = results.filter(p => p.packing === filters.packing);
  if (filters.minPrice) results = results.filter(p => p.mrp >= filters.minPrice);
  if (filters.maxPrice) results = results.filter(p => p.mrp <= filters.maxPrice);
  if (filters.inStock) results = results.filter(p => p.stock);
  if (filters.isNew) results = results.filter(p => p.isNew);

  if (filters.sort === 'price-asc') results.sort((a,b) => a.mrp - b.mrp);
  else if (filters.sort === 'price-desc') results.sort((a,b) => b.mrp - a.mrp);
  else if (filters.sort === 'name-asc') results.sort((a,b) => a.name.localeCompare(b.name));
  else if (filters.sort === 'name-desc') results.sort((a,b) => b.name.localeCompare(a.name));
  else if (filters.sort === 'newest') results.sort((a,b) => b.id - a.id);

  return results;
}

function generateProductCard(product, showWholesale = false) {
  const colorMap = { AUSPIN:'#0EA5E9', CURE:'#8B5CF6', GRACE:'#EC4899', MIND:'#F59E0B', PRIMA:'#0A6E3D', OPTHO:'#06B6D4', NURALZ:'#F97316', EVERMED:'#10B981', GENVIMAX:'#6366F1', MEDANOR:'#EF4444', VENTILA:'#14B8A6' };
  const col = colorMap[product.division] || '#0A6E3D';
  return `
    <div class="card product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
      <span class="card-badge" style="background:${col};color:#fff">${product.division}</span>
      ${product.isNew ? '<span class="card-badge badge-new" style="right:12px;left:auto;top:12px">NEW</span>' : ''}
      <div class="card-img-wrap" style="background:var(--neutral-50);padding:20px;display:flex;align-items:center;justify-content:center;overflow:hidden">
        ${product.img ? `<img src="${product.img}" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.1))">` : `<div style="width:120px;height:160px;background:linear-gradient(135deg,${col}22,${col}11);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;color:${col}">💊</div>`}
      </div>
      <div class="card-body">
        <div class="card-form">${product.form}</div>
        <h4 class="card-title">${product.name}</h4>
        <p class="card-composition">${product.composition}</p>
        <p class="card-packing">${product.packing ? product.packing + ' | ' : ''}${product.packType}</p>
        <div class="card-pricing">
          <div class="price-item"><span class="price-label">MRP: </span><span class="price-value mrp">&#8377;${product.mrp.toFixed(2)}</span></div>
          ${showWholesale ? `<div class="price-item"><span class="price-label">PTR: </span><span class="price-value">&#8377;${product.ptr.toFixed(2)}</span></div>
          <div class="price-item"><span class="price-label">PTS: </span><span class="price-value">&#8377;${product.pts.toFixed(2)}</span></div>` : ''}
        </div>
      </div>
    </div>`;
}
