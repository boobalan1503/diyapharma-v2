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
            const data = await res.json();
            if (data && data.length > 0) {
                quoteDataCache.diapers = data;
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
                if (currentQuoteCategory === 'diapers') {
                    renderQuoteProductList(quoteDataCache.diapers);
                }
                return;
            }
        }
        throw new Error('API returned empty or failed');
    } catch (e) {
        console.error("Failed to fetch diapers, using fallback", e);
        quoteDataCache.diapers = [
            { id:1, name:'Friends Easy Adult Diaper Pants', brand:'FRIENDS', mrp:399, composition:'FRIENDS', packType:'M' },
            { id:2, name:'Friends Classic Adult Tape Diaper', brand:'FRIENDS', mrp:499, composition:'FRIENDS', packType:'M' },
            { id:3, name:'KareIn Adult Diaper Pants', brand:'KAREIN', mrp:399, composition:'KAREIN', packType:'M' },
            { id:4, name:'KareIn Premium Underpads', brand:'KAREIN', mrp:349, composition:'KAREIN', packType:'60x90cm' },
            { id:5, name:'Friends Premium Pull-Up Pants', brand:'FRIENDS', mrp:549, composition:'FRIENDS', packType:'L' },
            { id:6, name:'Dignity Premium Adult Diaper', brand:'DIGNITY', mrp:649, composition:'DIGNITY', packType:'M' }
        ];
        if (currentQuoteCategory === 'diapers') {
            renderQuoteProductList(quoteDataCache.diapers);
        }
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
    const user = DhiyaMedical ? DhiyaMedical.user : null;

    // Populate User Details
    const userDetails = document.getElementById('invoiceUserDetails');
    userDetails.innerHTML = `
        <h4>Quotation For</h4>
        <p><strong>${user ? (user.name || user.email || 'Valued Customer') : 'Valued Customer'}</strong></p>
        <p>${user ? (user.email || '') : ''}</p>
        <p>${user ? (user.phone || '') : ''}</p>
        <p style="font-size:11px;color:var(--neutral-400);margin-top:8px">Date: ${new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</p>
    `;

    const keys = Object.keys(selectedProducts);
    const medKeys = keys.filter(k => k.startsWith('medicines_')).map(k => k.replace('medicines_', ''));
    const diaperKeys = keys.filter(k => k.startsWith('diapers_')).map(k => k.replace('diapers_', ''));
    
    const selectedMeds = quoteDataCache.medicines
        .filter(p => medKeys.includes(String(p.id)))
        .map(p => ({...p, type: 'medicines'}));
    const selectedDiapers = quoteDataCache.diapers
        .filter(p => diaperKeys.includes(String(p.id)))
        .map(p => ({...p, type: 'diapers'}));
    
    const itemsToRender = [...selectedMeds, ...selectedDiapers];

    const tableBody = document.getElementById('invoiceTableBody');
    let subtotal = 0;

    if (itemsToRender.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--neutral-400)">No products selected.</td></tr>';
    } else {
        tableBody.innerHTML = itemsToRender.map(p => {
            const key = `${p.type}_${p.id}`;
            const qty = selectedProducts[key] || 1;
            const mrp = parseFloat(p.mrp) || 0;
            const lineTotal = mrp * qty;
            subtotal += lineTotal;
            const comp = p.composition || p.desc || '';
            const pack = p.packType || '';
            return `
                <tr>
                    <td style="font-weight:600">${p.name} <span style="font-size:10px;color:#aaa">(${p.type==='diapers'?'Diaper':'Med'})</span></td>
                    <td style="font-size:12px;color:var(--neutral-600)">${comp}</td>
                    <td>${pack}</td>
                    <td style="text-align:center">${qty}</td>
                    <td style="text-align:right">₹${mrp.toFixed(2)}</td>
                    <td style="text-align:right;font-weight:600">₹${lineTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    }

    const tax = subtotal * 0.12;
    const grandTotal = subtotal + tax;

    document.getElementById('quoteSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('quoteTax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('quoteGrandTotal').textContent = `₹${grandTotal.toFixed(2)}`;

    // Switch Views — hide all, show invoice
    const selView = document.getElementById('quoteSelectionView');
    const optView = document.getElementById('quoteOptionsView');
    const invView = document.getElementById('quoteInvoiceView');
    const selAct  = document.getElementById('selectionActions');
    const invAct  = document.getElementById('invoiceActions');

    if (selView) { selView.classList.add('hidden'); }
    if (optView) { optView.classList.add('hidden'); }
    if (selAct)  { selAct.classList.add('hidden'); }
    if (invView) { invView.classList.remove('hidden'); }
    if (invAct)  { invAct.classList.remove('hidden'); }
    
    // Update button text if separate
    const downloadBtn = document.querySelector('#invoiceActions .btn-accent');
    if (downloadBtn) {
        if (mode === 'separate' && selectedMeds.length > 0 && selectedDiapers.length > 0) {
            downloadBtn.textContent = '📄 Download Separate PDFs (2)';
        } else {
            downloadBtn.textContent = '📄 View / Download PDF';
        }
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

    // ── LOGO: Navy badge with gold "D" + company name ──
    const lx = 14, ly = 8;

    // Navy rounded square badge (logo background)
    doc.setFillColor(3, 3, 88);
    doc.roundedRect(lx, ly, 22, 22, 3, 3, 'F');

    // Gold "D" letter inside badge
    doc.setFontSize(17);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(248, 162, 23);
    doc.text("D", lx + 5.5, ly + 15.5);

    // Gold horizontal stripe accent in badge (bottom of badge)
    doc.setFillColor(248, 162, 23);
    doc.rect(lx, ly + 17, 22, 4, 'F');

    // Company name
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(3, 3, 88);
    doc.text("DHIYA MEDICAL AGENCY", lx + 26, ly + 10);

    // Gold tagline bar
    doc.setFillColor(248, 162, 23);
    doc.rect(lx + 26, ly + 13, 80, 7, 'F');

    // Tagline text on gold bar
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(3, 3, 88);
    doc.text("Empowering Health, Every Day", lx + 28, ly + 18);

    // ── License & GST (right side of header) ──
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80);
    doc.text("D.L.No: TN/TUT/01100/20B", 148, ly + 6);
    doc.text("         TN/TUT/01100/21B", 148, ly + 11);
    doc.text("GSTIN: 33CBVPN8913R1ZJ", 148, ly + 16);

    // Divider line
    doc.setDrawColor(3, 3, 88);
    doc.setLineWidth(0.5);
    doc.line(14, 34, 196, 34);

    // Quotation number
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(3, 3, 88);
    doc.text("Quotation #: DMQ-" + Date.now().toString().slice(-6), 148, 40);

    // Date & Type
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80);
    doc.text("Quotation Date: " + new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}), 14, 40);
    doc.text("Type: " + (type === 'medicines' ? 'Medicines' : type === 'diapers' ? 'Diapers' : 'Combined'), 14, 46);

    // Customer Details
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text("Quotation For:", 14, 54);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text("Name:  " + (user ? (user.name || user.email) : "N/A"), 14, 60);
    doc.text("Email: " + (user ? user.email : "N/A"), 14, 66);
    doc.text("Phone: " + (user ? (user.phone || "N/A") : "N/A"), 14, 72);

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
        startY: 78,
        head: [['Product', 'Composition', 'Pack', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [3, 3, 88], fontSize: 8, textColor: [255,255,255] },
        bodyStyles: { fontSize: 7 },
        alternateRowStyles: { fillColor: [240, 240, 250] },
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

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`GST (12%): Rs. ${tax.toFixed(2)}`, 140, finalY + 7);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(3, 3, 88);
    doc.text(`Grand Total: Rs. ${total.toFixed(2)}`, 140, finalY + 16);

    // Footer line
    const pageH = doc.internal.pageSize.height;
    doc.setDrawColor(248, 162, 23);
    doc.setLineWidth(1);
    doc.line(14, pageH - 20, 196, pageH - 20);

    // Footer text
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(120);
    doc.text("This is a computer-generated quotation for estimation purposes only. Prices are subject to change.", 14, pageH - 14);
    doc.setTextColor(3, 3, 88);
    doc.setFont(undefined, 'bold');
    doc.text("DHIYA MEDICAL AGENCY", 14, pageH - 8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80);
    doc.text(" | 9629622844 / 8428622844 | dhiyamedicalagency@gmail.com | GSTIN: 33CBVPN8913R1ZJ", 57, pageH - 8);

    // Open & Download
    var pdfBlob = doc.output('blob');
    var blobURL = URL.createObjectURL(pdfBlob);
    window.open(blobURL, '_blank');
    doc.save(`${filenamePrefix}_${new Date().toISOString().slice(0,10)}.pdf`);
}

