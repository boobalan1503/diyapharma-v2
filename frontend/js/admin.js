// Admin Dashboard Logic

// Auth Check
if (sessionStorage.getItem('diya_admin_auth') !== 'true') {
  window.location.href = 'admin-login.html';
}

let currentEditingProduct = null;
let selectedImageFile = null;

function adminLogout() {
  sessionStorage.removeItem('diya_admin_auth');
  if (typeof DhiyaMedical !== 'undefined') {
    DhiyaMedical.logout();
  }
  window.location.href = 'login.html';
}

// Generate 15 highly realistic mock orders
const mockOrders = Array.from({length: 15}).map((_, i) => {
  const isPending = i < 4;
  const isShipped = i >= 4 && i < 8;
  const isProcessing = i >= 8 && i < 11;
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  let status = statuses[3];
  if(isPending) status = 'Pending';
  else if(isProcessing) status = 'Processing';
  else if(isShipped) status = 'Shipped';
  
  const total = Math.floor(Math.random() * 5000) + 500;
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 10));
  
  return {
    id: 1000 + i,
    customer: ['Ganesh R.', 'Rajeshwari A.', 'Dr. Sharma', 'Priya K.', 'Rahul M.', 'Anita Desai'][Math.floor(Math.random()*6)],
    itemsCount: Math.floor(Math.random() * 5) + 1,
    total: total,
    status: status,
    date: date.toISOString()
  };
});

// Mock Messages (Contact Queries)
const mockMessages = [
  { id: 1, sender: 'Apollo Pharmacy', email: 'purchase@apollo.com', subject: 'Wholesale Partnership', body: 'We are interested in bulk ordering DiyaCET tablets. What is the MOQ and wholesale discount?', date: new Date(Date.now() - 86400000*2).toISOString(), status: 'Unread' },
  { id: 2, sender: 'Vikram Singh', email: 'vikram.s@gmail.com', subject: 'Order Status Update', body: 'I placed order #1002 yesterday. When can I expect delivery in Chandigarh?', date: new Date(Date.now() - 86400000*1).toISOString(), status: 'Unread' },
  { id: 3, sender: 'City Hospital', email: 'admin@cityhospital.in', subject: 'Product Information', body: 'Do you supply adult diapers in XXL sizes for hospital use? Please share the catalog.', date: new Date(Date.now() - 86400000*3).toISOString(), status: 'Replied' },
  { id: 4, sender: 'Meera Sharma', email: 'meera99@yahoo.com', subject: 'General Inquiry', body: 'Are your face washes paraben-free?', date: new Date(Date.now() - 4000000).toISOString(), status: 'Unread' },
];

let currentReplyingMessage = null;

function initAdmin() {
  updateDashboardMetrics();
  renderOrdersTables();
  renderProductsTable();
  renderMessagesTable();
}

function adminShowPanel(panelName, linkElement) {
  document.querySelectorAll('[id^="panel-"]').forEach(p => p.style.display = 'none');
  document.getElementById('panel-' + panelName).style.display = 'block';
  
  document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
  linkElement.classList.add('active');
  
  const titles = {
    'dashboard': 'Dashboard Overview',
    'orders': 'Order Management',
    'products': 'Products & Image CMS',
    'settings': 'Site Settings'
  };
  document.getElementById('pageTitle').textContent = titles[panelName];
}

function updateDashboardMetrics() {
  const totalRev = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const pending = mockOrders.filter(o => o.status === 'Pending').length;
  
  document.getElementById('adminMetrics').innerHTML = `
    <div class="metric-card">
      <div class="metric-icon" style="background:var(--primary-100); color:var(--primary-700)"><i class="fa-solid fa-box"></i></div>
      <div class="metric-info">
        <h4>Total Orders</h4>
        <div class="metric-value">${mockOrders.length}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:var(--accent-100); color:var(--accent-500)"><i class="fa-solid fa-indian-rupee-sign"></i></div>
      <div class="metric-info">
        <h4>Total Revenue</h4>
        <div class="metric-value">&#8377;${totalRev.toLocaleString()}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:#FFF3CD; color:#856404"><i class="fa-solid fa-clock"></i></div>
      <div class="metric-info">
        <h4>Pending Orders</h4>
        <div class="metric-value">${pending}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:var(--primary-100); color:var(--primary-700)"><i class="fa-solid fa-pills"></i></div>
      <div class="metric-info">
        <h4>Total Products</h4>
        <div class="metric-value">${(typeof ProductData !== 'undefined' ? ProductData.length : 0) + getAdminProducts().length}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:#FFEBEB; color:var(--danger)"><i class="fa-solid fa-envelope"></i></div>
      <div class="metric-info">
        <h4>Unread Messages</h4>
        <div class="metric-value">${mockMessages.filter(m => m.status === 'Unread').length}</div>
      </div>
    </div>
  `;
}

function renderOrdersTables() {
  const getBadge = (status) => {
    const cls = status.toLowerCase();
    return `<span class="status-badge status-${cls}">${status}</span>`;
  };
  
  const generateRow = (o) => `
    <tr>
      <td style="font-weight:600">#${o.id}</td>
      <td>${o.customer}</td>
      <td>${new Date(o.date).toLocaleDateString()}</td>
      <td style="font-weight:700">₹${o.total.toFixed(2)}</td>
      <td>${getBadge(o.status)}</td>
      <td><button class="btn btn-sm" style="background:var(--neutral-100); color:var(--neutral-800)">Update</button></td>
    </tr>
  `;

  // Dashboard Recent (Top 5)
  document.getElementById('recentOrdersTable').innerHTML = mockOrders.slice(0, 5).map(generateRow).join('');
  
  // All Orders
  const generateAllRow = (o) => `
    <tr>
      <td style="font-weight:600">#${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.itemsCount} items</td>
      <td style="font-weight:700">₹${o.total.toFixed(2)}</td>
      <td>${getBadge(o.status)}</td>
      <td>
        <select class="form-input" style="padding:4px 8px; font-size:12px; height:auto;" onchange="updateOrderStatus(${o.id}, this.value)">
          <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
          <option value="Processing" ${o.status==='Processing'?'selected':''}>Processing</option>
          <option value="Shipped" ${o.status==='Shipped'?'selected':''}>Shipped</option>
          <option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option>
        </select>
      </td>
    </tr>
  `;
  document.getElementById('allOrdersTable').innerHTML = mockOrders.map(generateAllRow).join('');
}

function updateOrderStatus(id, newStatus) {
  const order = mockOrders.find(o => o.id === id);
  if(order) {
    order.status = newStatus;
    updateDashboardMetrics();
    renderOrdersTables();
    showToast(`Order #${id} marked as ${newStatus}`, 'success');
  }
}

// ---- Messages & Queries Logic ----
// Merge mock messages with real localStorage submissions
function getAllMessages() {
  const real = JSON.parse(localStorage.getItem('diya_messages') || '[]');
  // Merge, avoiding duplicates by id
  const allIds = new Set(real.map(m => m.id));
  const merged = [...real, ...mockMessages.filter(m => !allIds.has(m.id))];
  return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function saveMessages(arr) {
  // Only save real (non-mock) messages back
  const real = arr.filter(m => String(m.id).startsWith('msg_'));
  localStorage.setItem('diya_messages', JSON.stringify(real));
}

function renderMessagesTable() {
  const messages = getAllMessages();
  const unreadCount = messages.filter(m => m.status === 'Unread').length;
  
  document.getElementById('messageMetrics').innerHTML = `
    <div class="metric-card">
      <div class="metric-icon" style="background:var(--primary-100); color:var(--primary-700)"><i class="fa-solid fa-envelopes-bulk"></i></div>
      <div class="metric-info"><h4>Total Queries</h4><div class="metric-value">${messages.length}</div></div>
    </div>
    <div class="metric-card" style="${unreadCount > 0 ? 'border-color:var(--danger)' : ''}">
      <div class="metric-icon" style="background:#FFEBEB; color:var(--danger)"><i class="fa-solid fa-circle-exclamation"></i></div>
      <div class="metric-info"><h4>Unread</h4><div class="metric-value" style="${unreadCount > 0 ? 'color:var(--danger)' : ''}">${unreadCount}</div></div>
    </div>
  `;

  const tbody = document.getElementById('messagesTable');
  tbody.innerHTML = messages.map(m => {
    const isUnread = m.status === 'Unread';
    const statusBadge = isUnread ? 
      `<span class="status-badge status-pending">Unread</span>` : 
      `<span class="status-badge status-delivered">Replied</span>`;
    const source = m.source ? `<div style="font-size:10px;color:var(--neutral-400);margin-top:2px">${m.source}</div>` : '';
      
    return `
      <tr style="${isUnread ? 'background:rgba(13,140,77,0.03);' : ''}">
        <td>${new Date(m.date).toLocaleDateString()}<div style="font-size:11px;color:var(--neutral-400)">${new Date(m.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div></td>
        <td>
          <div style="font-weight:${isUnread ? '700' : '500'}">${m.sender}</div>
          <div style="font-size:12px; color:var(--neutral-500)">${m.email}</div>
          ${m.phone ? `<div style="font-size:11px; color:var(--neutral-400)">${m.phone}</div>` : ''}
          ${source}
        </td>
        <td style="font-weight:${isUnread ? '600' : 'normal'}">${m.subject}</td>
        <td>${statusBadge}</td>
        <td><button class="btn btn-sm ${isUnread ? 'btn-primary' : ''}" onclick="openMessageModal('${m.id}')">View &amp; Reply</button></td>
      </tr>
    `;
  }).join('');
}

function openMessageModal(id) {
  const messages = getAllMessages();
  const msg = messages.find(m => String(m.id) === String(id));
  if(!msg) return;
  currentReplyingMessage = msg;
  
  document.getElementById('modalMsgSubject').textContent = msg.subject;
  document.getElementById('modalMsgSender').textContent = msg.sender;
  document.getElementById('modalMsgEmail').textContent = msg.email;
  document.getElementById('modalMsgDate').textContent = new Date(msg.date).toLocaleString();
  document.getElementById('modalMsgBody').textContent = msg.body;
  
  document.getElementById('replyTextarea').value = '';
  document.getElementById('replyTextarea').disabled = false;
  
  const btn = document.getElementById('btnSendReply');
  btn.style.display = 'block';
  btn.textContent = 'Send Reply';
  btn.disabled = false;
  
  if (msg.status === 'Replied') {
    document.getElementById('replyTextarea').value = "✓ You have already replied to this message.";
    document.getElementById('replyTextarea').disabled = true;
    btn.style.display = 'none';
  }
  
  // Mark as read
  msg.status = 'Read';
  saveMessages(messages);
  
  document.getElementById('messageModal').classList.add('active');
}

function closeMessageModal() {
  document.getElementById('messageModal').classList.remove('active');
}

// ─── EmailJS Configuration for Admin Replies ───
// Same credentials as contact page — set these once:
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';           // ← Replace with your EmailJS Public Key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';           // ← Replace with your EmailJS Service ID
const EMAILJS_REPLY_TEMPLATE_ID = 'YOUR_REPLY_TEMPLATE_ID'; // ← Replace with your EmailJS Reply Template ID

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

function sendMessageReply() {
  const text = document.getElementById('replyTextarea').value.trim();
  if(!text) {
    showToast('Please type a reply first.', 'warning');
    return;
  }
  
  const btn = document.getElementById('btnSendReply');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const msg = currentReplyingMessage;
  const replySubject = 'Re: ' + (msg.subject || 'Your Enquiry');

  // Try EmailJS first (sends real email to customer)
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_REPLY_TEMPLATE_ID, {
      to_name: msg.sender,
      to_email: msg.email,
      subject: replySubject,
      message: text,
      reply_to: 'dhiyamedicalagency@gmail.com'
    })
    .then(() => {
      // Success — email sent via EmailJS
      markMessageAsReplied(msg);
      showToast(`Reply sent to ${msg.email} via email!`, 'success');
      btn.textContent = 'Send Reply';
      btn.disabled = false;
      closeMessageModal();
      renderMessagesTable();
      updateDashboardMetrics();
    })
    .catch(err => {
      console.warn('[Reply] EmailJS send failed, falling back to mailto:', err);
      fallbackToMailto(msg, replySubject, text, btn);
    });
  } else {
    // EmailJS not configured, use mailto fallback
    fallbackToMailto(msg, replySubject, text, btn);
  }
}

function fallbackToMailto(msg, subject, text, btn) {
  const subjectEncoded = encodeURIComponent(subject);
  const body = encodeURIComponent(
    text +
    '\n\n---\n' +
    'Dhiya Medical Agency\n' +
    'Phone: 9629622844 / 8428622844\n' +
    'Email: dhiyamedicalagency@gmail.com\n' +
    'Website: https://diyapharma-v2.github.io'
  );
  const mailtoLink = `mailto:${msg.email}?subject=${subjectEncoded}&body=${body}`;
  window.open(mailtoLink, '_blank');

  setTimeout(() => {
    markMessageAsReplied(msg);
    showToast(`Email client opened for ${msg.email}. Message marked as Replied.`, 'success');
    btn.textContent = 'Send Reply';
    btn.disabled = false;
    closeMessageModal();
    renderMessagesTable();
    updateDashboardMetrics();
  }, 1500);
}

function markMessageAsReplied(msg) {
  msg.status = 'Replied';
  const messages = getAllMessages();
  const idx = messages.findIndex(m => String(m.id) === String(msg.id));
  if (idx >= 0) messages[idx].status = 'Replied';
  saveMessages(messages);
}

// ---- Admin Product Management ----

function getAdminProducts() {
  return JSON.parse(localStorage.getItem('admin_products') || '[]');
}
function saveAdminProducts(arr) {
  localStorage.setItem('admin_products', JSON.stringify(arr));
}

function toggleAddProductForm() {
  const form = document.getElementById('addProductForm');
  const icon = document.getElementById('addFormChevron');
  const visible = form.style.display !== 'none';
  form.style.display = visible ? 'none' : 'block';
  icon.className = visible ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
}

let adminProductImageDataUrl = '';
function previewAdminProductImage(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    adminProductImageDataUrl = e.target.result;
    document.getElementById('apImgPreviewWrap').innerHTML = `<img src="${e.target.result}" style="max-height:140px;max-width:100%;border-radius:8px;object-fit:contain">`;
  };
  reader.readAsDataURL(input.files[0]);
}

function saveAdminProduct() {
  const name = document.getElementById('ap_name').value.trim();
  const division = document.getElementById('ap_division').value;
  const mrp = parseFloat(document.getElementById('ap_mrp').value);
  const inStock = document.getElementById('ap_stock').checked;
  const desc = document.getElementById('ap_desc').value.trim();
  if (!name || !division || !mrp) {
    showToast('Please fill Name, Division and MRP fields.', 'warning'); return;
  }
  const products = getAdminProducts();
  const newProduct = {
    id: 'adm_' + Date.now(),
    name, division, mrp, inStock, desc,
    img: adminProductImageDataUrl,
    form: 'Custom', addedAt: new Date().toISOString()
  };
  products.push(newProduct);
  saveAdminProducts(products);
  showToast(`"${name}" added to Products tab!`, 'success');
  // Reset form
  document.getElementById('ap_name').value = '';
  document.getElementById('ap_division').value = '';
  document.getElementById('ap_mrp').value = '';
  document.getElementById('ap_desc').value = '';
  document.getElementById('ap_stock').checked = true;
  document.getElementById('apImgPreviewWrap').innerHTML = '<i class="fa-solid fa-image" style="font-size:40px;color:var(--neutral-300)"></i><span style="font-size:13px;color:var(--neutral-400)">Click to upload image</span>';
  adminProductImageDataUrl = '';
  toggleAddProductForm();
  renderProductsTable();
}

/* ========================================================
   FULL PRODUCT EDIT & DELETE — admin.js
   ======================================================== */
let editingProductId = null;

function renderProductsTable(searchQuery = '') {
  const q = searchQuery.toLowerCase();
  const adminProds = getAdminProducts();
  const builtIn = (typeof ProductData !== 'undefined' ? ProductData : []);
  const allProducts = [
    ...adminProds.map(p => ({ ...p, _source: 'admin' })),
    ...builtIn.map(p => ({ ...p, _source: 'catalog' }))
  ].filter(p => !q || p.name.toLowerCase().includes(q) || (p.division||'').toLowerCase().includes(q));

  const tbody = document.getElementById('adminProductsTable');
  if (!tbody) return;
  if (allProducts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--neutral-400)">No products found.</td></tr>';
    return;
  }
  tbody.innerHTML = allProducts.map(p => {
    const hasImg = p.img && p.img.length > 0;
    const imgHtml = hasImg
      ? `<img src="${p.img}" style="width:40px;height:40px;object-fit:contain;border-radius:6px">`
      : `<i class="fa-solid fa-pills" style="font-size:22px;color:var(--primary-300)"></i>`;
    const stockBadge = p.inStock !== false
      ? '<span class="status-badge status-delivered">In Stock</span>'
      : '<span class="status-badge status-pending">Out of Stock</span>';
    const sourceBadge = p._source === 'admin'
      ? '<span class="status-badge status-processing">Admin Added</span>'
      : '<span class="status-badge" style="background:#f3f4f6;color:#555">Catalog</span>';
    // All products get Edit + Delete
    const pid = JSON.stringify(p.id);
    const actions = `
      <button class="btn btn-sm btn-primary" style="margin-right:4px" onclick="openEditProductModal(${pid}, '${p._source}')"
        title="Edit all fields"><i class="fa-solid fa-pen"></i> Edit</button>
      <button class="btn btn-sm" style="background:#fee2e2;color:#b91c1c" onclick="deleteProduct(${pid}, '${p._source}')"
        title="Delete product"><i class="fa-solid fa-trash"></i></button>`;
    return `<tr>
      <td><div class="prod-img-preview">${imgHtml}</div></td>
      <td><div style="font-weight:600">${p.name}</div><div style="font-size:12px;color:var(--neutral-500)">${p.division || 'Medicine'}</div></td>
      <td style="font-weight:700">&#8377;${p.mrp || '-'}</td>
      <td>${stockBadge}</td>
      <td>${sourceBadge}</td>
      <td>${actions}</td>
    </tr>`;
  }).join('');
}

function deleteProduct(id, source) {
  if (!confirm('Delete this product permanently?')) return;
  if (source === 'admin') {
    const products = getAdminProducts().filter(p => String(p.id) !== String(id));
    saveAdminProducts(products);
  } else {
    // For catalog products, mark as hidden in localStorage
    const hidden = JSON.parse(localStorage.getItem('hidden_catalog_ids') || '[]');
    hidden.push(String(id));
    localStorage.setItem('hidden_catalog_ids', JSON.stringify(hidden));
  }
  showToast('Product deleted.', 'success');
  renderProductsTable();
  updateDashboardMetrics();
}

function openEditProductModal(id, source) {
  let product;
  if (source === 'admin') {
    product = getAdminProducts().find(p => String(p.id) === String(id));
  } else {
    product = (typeof ProductData !== 'undefined' ? ProductData : []).find(p => String(p.id) === String(id));
  }
  if (!product) return;
  editingProductId = id;
  
  // Populate edit modal fields
  document.getElementById('ep_name').value = product.name || '';
  document.getElementById('ep_division').value = product.division || '';
  document.getElementById('ep_mrp').value = product.mrp || '';
  document.getElementById('ep_stock').checked = product.inStock !== false && product.stock !== false;
  document.getElementById('ep_desc').value = product.composition || product.desc || '';
  document.getElementById('ep_source').value = source;
  document.getElementById('ep_id').value = id;
  
  // Show current image
  const imgWrap = document.getElementById('epImgPreviewWrap');
  if (product.img) {
    imgWrap.innerHTML = `<img src="${product.img}" style="max-height:120px;max-width:100%;border-radius:8px;object-fit:contain">`;
  } else {
    imgWrap.innerHTML = '<i class="fa-solid fa-image" style="font-size:40px;color:var(--neutral-300)"></i><span style="font-size:13px;color:var(--neutral-400)">Click to upload image</span>';
  }
  epImageDataUrl = product.img || '';
  
  document.getElementById('editProductModal').classList.add('active');
}

let epImageDataUrl = '';
function previewEpImage(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    epImageDataUrl = e.target.result;
    document.getElementById('epImgPreviewWrap').innerHTML = `<img src="${e.target.result}" style="max-height:120px;max-width:100%;border-radius:8px;object-fit:contain">`;
  };
  reader.readAsDataURL(input.files[0]);
}

function saveEditedProduct() {
  const id = document.getElementById('ep_id').value;
  const source = document.getElementById('ep_source').value;
  const name = document.getElementById('ep_name').value.trim();
  const division = document.getElementById('ep_division').value.trim();
  const mrp = parseFloat(document.getElementById('ep_mrp').value);
  const inStock = document.getElementById('ep_stock').checked;
  const desc = document.getElementById('ep_desc').value.trim();
  
  if (!name || !division || !mrp) {
    showToast('Name, Division and MRP are required.', 'warning'); return;
  }
  
  if (source === 'admin') {
    const products = getAdminProducts();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx >= 0) {
      products[idx] = { ...products[idx], name, division, mrp, inStock, desc, img: epImageDataUrl || products[idx].img };
      saveAdminProducts(products);
    }
  } else {
    // Store catalog overrides in localStorage
    const overrides = JSON.parse(localStorage.getItem('catalog_overrides') || '{}');
    overrides[String(id)] = { name, division, mrp, inStock, desc, img: epImageDataUrl };
    localStorage.setItem('catalog_overrides', JSON.stringify(overrides));
    // Also update in-memory ProductData
    if (typeof ProductData !== 'undefined') {
      const p = ProductData.find(p => String(p.id) === String(id));
      if (p) { p.name = name; p.division = division; p.mrp = mrp; p.stock = inStock; if (epImageDataUrl) p.img = epImageDataUrl; }
    }
  }
  
  showToast(`"${name}" updated successfully!`, 'success');
  document.getElementById('editProductModal').classList.remove('active');
  renderProductsTable();
  updateDashboardMetrics();
}

function closeEditProductModal() {
  document.getElementById('editProductModal').classList.remove('active');
}

function filterAdminProducts(query) {
  renderProductsTable(query);
}

function openProductModal(id) {
  currentEditingProduct = ProductData.find(p => p.id === id);
  if(!currentEditingProduct) return;
  
  document.getElementById('modalProdTitle').textContent = `Upload Image for ${currentEditingProduct.name}`;
  
  const imgPreview = document.getElementById('modalProdImg');
  if(currentEditingProduct.img) {
    imgPreview.innerHTML = `<img src="${currentEditingProduct.img}">`;
  } else {
    imgPreview.innerHTML = `<span style="font-size:30px">💊</span>`;
  }
  
  // Reset upload state
  document.getElementById('uploadProgress').style.display = 'none';
  document.getElementById('uploadBar').style.width = '0%';
  document.getElementById('uploadPercent').textContent = '0%';
  document.getElementById('uploadIcon').textContent = '📸';
  document.getElementById('uploadText').textContent = 'Drag image here or click to browse';
  selectedImageFile = null;
  
  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
}

// Handle Drag and Drop
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if(e.dataTransfer.files.length) {
    document.getElementById('imageInput').files = e.dataTransfer.files;
    handleImageSelection(document.getElementById('imageInput'));
  }
});

function handleImageSelection(input) {
  if(input.files && input.files[0]) {
    selectedImageFile = input.files[0];
    document.getElementById('uploadIcon').textContent = '🖼️';
    document.getElementById('uploadText').textContent = selectedImageFile.name;
    
    // Preview locally
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('modalProdImg').innerHTML = `<img src="${e.target.result}">`;
    }
    reader.readAsDataURL(selectedImageFile);
  }
}

async function uploadImageToBackend() {
  if(!selectedImageFile) {
    showToast('Please select an image to upload', 'warning');
    return;
  }
  
  // Show progress bar
  const progressBlock = document.getElementById('uploadProgress');
  const bar = document.getElementById('uploadBar');
  const pct = document.getElementById('uploadPercent');
  const btn = document.getElementById('btnUploadImage');
  
  progressBlock.style.display = 'block';
  btn.disabled = true;
  btn.textContent = 'Uploading...';
  
  bar.style.width = '30%';
  pct.textContent = '30%';
  
  try {
    const formData = new FormData();
    formData.append('image', selectedImageFile);
    formData.append('productId', currentEditingProduct.id);

    // In a real environment, replace this with your actual CONFIG.API_BASE_URL
    const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE_URL) ? CONFIG.API_BASE_URL : 'http://localhost:3000/api';
    
    // Attempt real upload
    const response = await fetch(`${apiUrl}/admin/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    bar.style.width = '100%';
    pct.textContent = '100%';

    if(data.success) {
      showToast('Image successfully synced to database!', 'success');
      currentEditingProduct.img = data.url;
      closeProductModal();
      renderProductsTable(ProductData);
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    console.warn('Backend connection failed, falling back to local simulation:', error);
    
    // Simulation fallback if backend is offline
    bar.style.width = '100%';
    pct.textContent = '100%';
    
    setTimeout(() => {
      showToast('Image locally mocked! (Start backend to sync)', 'success');
      
      const reader = new FileReader();
      reader.onload = function(e) {
        currentEditingProduct.img = e.target.result;
        closeProductModal();
        renderProductsTable(ProductData);
      }
      reader.readAsDataURL(selectedImageFile);
    }, 500);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Upload & Save';
  }
}

// ---- Site Settings Upload Logic ----

function handleSettingsUpload(input, previewId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  
  // Show fake loading toast
  showToast(`Uploading ${file.name}...`, 'info');
  
  // Simulate network upload
  setTimeout(() => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewImg = document.getElementById(previewId);
      const placeholder = document.getElementById(`${previewId}-placeholder`);
      
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
      if(placeholder) placeholder.style.display = 'none';
      
      showToast('Asset uploaded successfully!', 'success');
      
      // If profile photo, update the header avatar too
      if (previewId === 'preview-profile') {
        const headerAvatar = document.querySelector('.admin-avatar');
        if (headerAvatar) {
          headerAvatar.innerHTML = '';
          headerAvatar.style.backgroundImage = `url(${e.target.result})`;
          headerAvatar.style.backgroundSize = 'cover';
          headerAvatar.style.backgroundPosition = 'center';
        }
      }
    };
    reader.readAsDataURL(file);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', initAdmin);
