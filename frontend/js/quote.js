/* ============================================
   DIYA PHARMA — Quotation System Logic
   ============================================ */

let selectedProducts = {}; // e.g. { 'medicines_1': 2, 'diapers_3': 1 }
let quoteDataCache = {
    medicines: typeof ProductData !== 'undefined' ? ProductData : [],
    diapers: []
};
let currentQuoteCategory = 'medicines';
let invoiceMode = 'combined'; // 'combined' or 'separate'

async function fetchDiapersForQuote() {
    if (quoteDataCache.diapers.length > 0) return;
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/diaper-products`);
        if (res.ok) {
            quoteDataCache.diapers = await res.json();
            // Assign mrp based on first size if available
            quoteDataCache.diapers.forEach(d => {
                let sizes = d.sizes || [];
                if (typeof sizes === 'string') {
                    try { sizes = JSON.parse(sizes); } catch(e) { sizes = []; }
                }
                const first = sizes[0] || {};
                d.mrp = first.mrp || 0;
                d.composition = d.brand || 'Diaper';
                d.packType = first.size || 'Standard';
            });
        }
    } catch (e) {
        console.error("Failed to fetch diapers", e);
    }
}

async function openQuoteModal() {
    if (!DhiyaMedical.user) {
        alert('Please login first to generate a quotation.');
        window.location.href = 'login.html';
        return;
    }
    
    // reset state
    document.getElementById('quoteSearch').value = '';
    switchQuoteCategory('medicines', true); // TRUE to render immediately
    
    document.getElementById('quoteModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // fetch diapers in background
    await fetchDiapersForQuote();
}

function closeQuoteModal() {
    document.getElementById('quoteModal').classList.remove('active');
    document.body.style.overflow = '';
    backToSelection();
}

function switchQuoteCategory(category, render = true) {
    currentQuoteCategory = category;
    
    // Update tabs UI
    document.getElementById('tabMedicines').className = category === 'medicines' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary';
    document.getElementById('tabDiapers').className = category === 'diapers' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary';
    
    if (render) {
        document.getElementById('quoteSearch').value = '';
        renderQuoteProductList(quoteDataCache[category]);
    }
}

function renderQuoteProductList(products) {
    const list = document.getElementById('quoteProductList');
    if (!products || products.length === 0) {
        list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--neutral-500)">No products found.</div>';
        return;
    }
    
    list.innerHTML = products.map(p => {
        const key = `${currentQuoteCategory}_${p.id}`;
        const isSelected = selectedProducts[key] !== undefined;
        const qty = selectedProducts[key] || 1;
        return `
        <div class="quote-product-item ${isSelected ? 'selected' : ''}" id="qp_${key}">
            <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="handleCheckboxChange('${key}', this)">
            <div class="quote-product-info" onclick="handleCardClick('${key}')">
                <h4>${p.name}</h4>
                <p>${p.composition}</p>
                <p style="color:var(--primary-600)">₹${p.mrp.toFixed(2)} | ${p.packType}</p>
            </div>
            <div class="quote-qty-controls" style="display:${isSelected ? 'flex' : 'none'}">
                <button type="button" onclick="event.stopPropagation(); changeQty('${key}', -1)" class="qty-btn">−</button>
                <span class="qty-display" id="qty_${key}">${qty}</span>
                <button type="button" onclick="event.stopPropagation(); changeQty('${key}', 1)" class="qty-btn">+</button>
            </div>
        </div>
        `;
    }).join('');
}

function handleCardClick(key) {
    const item = document.getElementById('qp_' + key);
    if (!item) return;
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    handleCheckboxChange(key, checkbox);
}

function handleCheckboxChange(key, checkbox) {
    const item = document.getElementById('qp_' + key);
    const qtyControls = item.querySelector('.quote-qty-controls');
    if (checkbox.checked) {
        selectedProducts[key] = 1;
        item.classList.add('selected');
        qtyControls.style.display = 'flex';
    } else {
        delete selectedProducts[key];
        item.classList.remove('selected');
        qtyControls.style.display = 'none';
    }
    updateSelectionUI();
}

function changeQty(key, delta) {
    if (selectedProducts[key] === undefined) return;
    let newQty = (selectedProducts[key] || 1) + delta;
    if (newQty < 1) newQty = 1;
    if (newQty > 999) newQty = 999;
    selectedProducts[key] = newQty;
    const display = document.getElementById('qty_' + key);
    if (display) display.textContent = newQty;
}

function filterQuoteProducts(query) {
    const q = query.toLowerCase();
    const data = quoteDataCache[currentQuoteCategory] || [];
    const filtered = data.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.composition && p.composition.toLowerCase().includes(q))
    );
    renderQuoteProductList(filtered);
}

function selectAllProducts() {
    const data = quoteDataCache[currentQuoteCategory] || [];
    data.forEach(p => {
        const key = `${currentQuoteCategory}_${p.id}`;
        if (selectedProducts[key] === undefined) {
            selectedProducts[key] = 1;
        }
    });
    renderQuoteProductList(data);
    document.getElementById('quoteSearch').value = '';
    updateSelectionUI();
}

function clearAllProducts() {
    const data = quoteDataCache[currentQuoteCategory] || [];
    data.forEach(p => {
        const key = `${currentQuoteCategory}_${p.id}`;
        delete selectedProducts[key];
    });
    renderQuoteProductList(data);
    document.getElementById('quoteSearch').value = '';
    updateSelectionUI();
}

function updateSelectionUI() {
    const count = Object.keys(selectedProducts).length;
    document.getElementById('selectedCount').textContent = `${count} product${count !== 1 ? 's' : ''} selected`;
    document.getElementById('btnGenerateQuote').disabled = count === 0;
}

function generateQuotation() {
    const keys = Object.keys(selectedProducts);
    const hasMeds = keys.some(k => k.startsWith('medicines_'));
    const hasDiapers = keys.some(k => k.startsWith('diapers_'));
    
    if (hasMeds && hasDiapers) {
        // Show options
        document.getElementById('quoteSelectionView').classList.add('hidden');
        document.getElementById('selectionActions').classList.add('hidden');
        document.getElementById('quoteOptionsView').classList.remove('hidden');
    } else {
        // Proceed directly
        proceedToInvoice('combined');
    }
}

function proceedToInvoice(mode) {
    invoiceMode = mode;
    const user = DhiyaMedical.user;

    // Populate User Details
    const userDetails = document.getElementById('invoiceUserDetails');
    userDetails.innerHTML = `
        <h4>Quotation For</h4>
        <p><strong>${user.name || user.email || 'Valued Customer'}</strong></p>
        <p>${user.email || ''}</p>
        <p>${user.phone || ''}</p>
        <p style="font-size:11px;color:var(--neutral-400);margin-top:8px">Date: ${new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</p>
    `;

    const keys = Object.keys(selectedProducts);
    const medKeys = keys.filter(k => k.startsWith('medicines_')).map(k => parseInt(k.replace('medicines_', '')));
    const diaperKeys = keys.filter(k => k.startsWith('diapers_')).map(k => parseInt(k.replace('diapers_', '')));
    
    const selectedMeds = quoteDataCache.medicines.filter(p => medKeys.includes(p.id)).map(p => ({...p, type: 'medicines'}));
    const selectedDiapers = quoteDataCache.diapers.filter(p => diaperKeys.includes(p.id)).map(p => ({...p, type: 'diapers'}));
    
    let itemsToRender = [];
    if (mode === 'combined') {
        itemsToRender = [...selectedMeds, ...selectedDiapers];
    } else {
        // Just show all of them sequentially in UI, but group them.
        itemsToRender = [...selectedMeds, ...selectedDiapers];
    }

    const tableBody = document.getElementById('invoiceTableBody');
    let subtotal = 0;

    tableBody.innerHTML = itemsToRender.map(p => {
        const key = `${p.type}_${p.id}`;
        const qty = selectedProducts[key] || 1;
        const lineTotal = p.mrp * qty;
        subtotal += lineTotal;
        return `
            <tr>
                <td style="font-weight:600">${p.name} <span style="font-size:10px;color:#aaa">(${p.type==='diapers'?'Diaper':'Med'})</span></td>
                <td style="font-size:12px;color:var(--neutral-600)">${p.composition}</td>
                <td>${p.packType}</td>
                <td style="text-align:center">${qty}</td>
                <td style="text-align:right">₹${p.mrp.toFixed(2)}</td>
                <td style="text-align:right;font-weight:600">₹${lineTotal.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    const tax = subtotal * 0.12;
    const grandTotal = subtotal + tax;

    document.getElementById('quoteSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('quoteTax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('quoteGrandTotal').textContent = `₹${grandTotal.toFixed(2)}`;

    // Switch Views
    document.getElementById('quoteOptionsView').classList.add('hidden');
    document.getElementById('quoteSelectionView').classList.add('hidden');
    document.getElementById('selectionActions').classList.add('hidden');
    document.getElementById('quoteInvoiceView').classList.remove('hidden');
    document.getElementById('invoiceActions').classList.remove('hidden');
    
    // Update button text if separate
    const downloadBtn = document.querySelector('#invoiceActions .btn-accent');
    if (mode === 'separate' && selectedMeds.length > 0 && selectedDiapers.length > 0) {
        downloadBtn.textContent = '📄 Download Separate PDFs (2)';
    } else {
        downloadBtn.textContent = '📄 View / Download PDF';
    }
}

function backToSelection() {
    document.getElementById('quoteOptionsView').classList.add('hidden');
    document.getElementById('quoteSelectionView').classList.remove('hidden');
    document.getElementById('selectionActions').classList.remove('hidden');
    document.getElementById('quoteInvoiceView').classList.add('hidden');
    document.getElementById('invoiceActions').classList.add('hidden');
    
    if (currentQuoteCategory === 'diapers' && quoteDataCache.diapers.length === 0) {
        fetchDiapersForQuote().then(() => renderQuoteProductList(quoteDataCache.diapers));
    } else {
        renderQuoteProductList(quoteDataCache[currentQuoteCategory]);
    }
}

function viewAndDownloadPDF() {
    const keys = Object.keys(selectedProducts);
    const medKeys = keys.filter(k => k.startsWith('medicines_')).map(k => parseInt(k.replace('medicines_', '')));
    const diaperKeys = keys.filter(k => k.startsWith('diapers_')).map(k => parseInt(k.replace('diapers_', '')));
    
    const selectedMeds = quoteDataCache.medicines.filter(p => medKeys.includes(p.id));
    const selectedDiapers = quoteDataCache.diapers.filter(p => diaperKeys.includes(p.id));

    if (invoiceMode === 'separate' && selectedMeds.length > 0 && selectedDiapers.length > 0) {
        generateSinglePDF(selectedMeds, 'medicines', 'Medicines_Quotation');
        generateSinglePDF(selectedDiapers, 'diapers', 'Diapers_Quotation');
        if (typeof showToast === 'function') showToast('Downloaded two separate PDF invoices!', 'success');
    } else {
        // Combined or only one type selected
        generateSinglePDF([...selectedMeds.map(p => ({...p, type:'medicines'})), ...selectedDiapers.map(p => ({...p, type:'diapers'}))], 'combined', 'Combined_Quotation');
        if (typeof showToast === 'function') showToast('Quotation PDF generated!', 'success');
    }
}

function generateSinglePDF(items, type, filenamePrefix) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const user = DhiyaMedical.user;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 31, 91);
    doc.text("DIYA PHARMA", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Quality Healthcare Solutions", 14, 26);
    doc.text("Quotation Date: " + new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}), 14, 32);

    // Quotation number
    doc.setFontSize(10);
    doc.setTextColor(0, 31, 91);
    doc.text("Quotation #: DPQ-" + Date.now().toString().slice(-6), 140, 20);

    // Customer Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Quotation For: " + (type === 'medicines' ? '(Medicines)' : type === 'diapers' ? '(Diapers)' : ''), 14, 45);
    doc.setFontSize(10);
    doc.text("Name: " + (user ? (user.name || user.email) : "N/A"), 14, 52);
    doc.text("Email: " + (user ? user.email : "N/A"), 14, 58);
    doc.text("Phone: " + (user ? (user.phone || "N/A") : "N/A"), 14, 64);

    // Table
    const tableData = items.map(p => {
        const key = `${p.type || type}_${p.id}`;
        const qty = selectedProducts[key] || 1;
        return [
            p.name,
            p.composition.length > 40 ? p.composition.substring(0, 40) + '...' : p.composition,
            p.packType,
            qty.toString(),
            "Rs. " + p.mrp.toFixed(2),
            "Rs. " + (p.mrp * qty).toFixed(2)
        ];
    });

    doc.autoTable({
        startY: 75,
        head: [['Product', 'Composition', 'Pack', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 31, 91], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 50 },
            3: { halign: 'center' },
            4: { halign: 'right' },
            5: { halign: 'right', fontStyle: 'bold' }
        }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    let subtotal = 0;
    items.forEach(p => { 
        const key = `${p.type || type}_${p.id}`;
        subtotal += p.mrp * (selectedProducts[key] || 1); 
    });
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    doc.setFontSize(10);
    doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`GST (12%): Rs. ${tax.toFixed(2)}`, 140, finalY + 7);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 31, 91);
    doc.text(`Grand Total: Rs. ${total.toFixed(2)}`, 140, finalY + 16);

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text("This is a computer-generated quotation for estimation purposes only. Prices are subject to change.", 14, doc.internal.pageSize.height - 15);
    doc.text("Contact: +91 82200 96233 | groupseverest@gmail.com", 14, doc.internal.pageSize.height - 10);

    // Open & Download
    var pdfBlob = doc.output('blob');
    var blobURL = URL.createObjectURL(pdfBlob);
    window.open(blobURL, '_blank');
    doc.save(`${filenamePrefix}_${new Date().toISOString().slice(0,10)}.pdf`);
}
