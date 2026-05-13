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
  renderProductsTable(ProductData);
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
      <div class="metric-icon" style="background:var(--primary-100); color:var(--primary-700)">📦</div>
      <div class="metric-info">
        <h4>Total Orders</h4>
        <div class="metric-value">${mockOrders.length}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:var(--accent-100); color:var(--accent-500)">💰</div>
      <div class="metric-info">
        <h4>Total Revenue</h4>
        <div class="metric-value">₹${totalRev.toLocaleString()}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:#FFF3CD; color:#856404">⏳</div>
      <div class="metric-info">
        <h4>Pending Actions</h4>
        <div class="metric-value">${pending}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:#FFF3CD; color:#856404">⏳</div>
      <div class="metric-info">
        <h4>Pending Actions</h4>
        <div class="metric-value">${pending}</div>
      </div>
    </div>
    <div class="metric-card">
      <div class="metric-icon" style="background:var(--primary-100); color:var(--primary-700)">💬</div>
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

function renderMessagesTable() {
  const unreadCount = mockMessages.filter(m => m.status === 'Unread').length;
  
  // Update Message Metrics panel
  document.getElementById('messageMetrics').innerHTML = `
    <div class="metric-card">
      <div class="metric-icon" style="background:var(--primary-100); color:var(--primary-700)">📬</div>
      <div class="metric-info">
        <h4>Total Queries</h4>
        <div class="metric-value">${mockMessages.length}</div>
      </div>
    </div>
    <div class="metric-card" style="${unreadCount > 0 ? 'border-color:var(--danger)' : ''}">
      <div class="metric-icon" style="background:#FFEBEB; color:var(--danger)">🔴</div>
      <div class="metric-info">
        <h4>Unread</h4>
        <div class="metric-value" style="${unreadCount > 0 ? 'color:var(--danger)' : ''}">${unreadCount}</div>
      </div>
    </div>
  `;

  const tbody = document.getElementById('messagesTable');
  tbody.innerHTML = mockMessages.sort((a,b) => new Date(b.date) - new Date(a.date)).map(m => {
    const isUnread = m.status === 'Unread';
    const statusBadge = isUnread ? 
      `<span class="status-badge status-pending">Unread</span>` : 
      `<span class="status-badge status-delivered">Replied</span>`;
      
    return `
      <tr style="${isUnread ? 'background:rgba(13,140,77,0.03);' : ''}">
        <td>${new Date(m.date).toLocaleDateString()}</td>
        <td>
          <div style="font-weight:${isUnread ? '700' : '500'}">${m.sender}</div>
          <div style="font-size:12px; color:var(--neutral-500)">${m.email}</div>
        </td>
        <td style="font-weight:${isUnread ? '600' : 'normal'}">${m.subject}</td>
        <td>${statusBadge}</td>
        <td><button class="btn btn-sm ${isUnread ? 'btn-primary' : ''}" onclick="openMessageModal(${m.id})">View & Reply</button></td>
      </tr>
    `;
  }).join('');
}

function openMessageModal(id) {
  const msg = mockMessages.find(m => m.id === id);
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
  
  document.getElementById('messageModal').classList.add('active');
}

function closeMessageModal() {
  document.getElementById('messageModal').classList.remove('active');
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
  
  // Simulate sending email
  setTimeout(() => {
    currentReplyingMessage.status = 'Replied';
    showToast(`Reply sent successfully to ${currentReplyingMessage.email}`, 'success');
    closeMessageModal();
    renderMessagesTable();
    updateDashboardMetrics(); // update the top unread count
  }, 1000);
}

// ---- CMS Image Upload Logic ----

function renderProductsTable(products) {
  const tbody = document.getElementById('adminProductsTable');
  tbody.innerHTML = products.map(p => {
    const hasImage = p.img && p.img.length > 0;
    const imgHtml = hasImage ? `<img src="${p.img}">` : `<span>💊</span>`;
    
    return `
      <tr>
        <td><div class="prod-img-preview">${imgHtml}</div></td>
        <td>
          <div style="font-weight:600">${p.name}</div>
          <div style="font-size:12px; color:var(--neutral-500)">${p.division || 'Medicine'} • ${p.form || 'Unknown'}</div>
        </td>
        <td>
          ${hasImage ? '<span class="status-badge status-delivered">Image Uploaded</span>' : '<span class="status-badge status-pending">Needs Image</span>'}
        </td>
        <td><button class="btn btn-sm btn-primary" onclick="openProductModal(${p.id})">Upload Image</button></td>
      </tr>
    `;
  }).join('');
}

function filterAdminProducts(query) {
  const q = query.toLowerCase();
  const filtered = ProductData.filter(p => p.name.toLowerCase().includes(q) || p.division.toLowerCase().includes(q));
  renderProductsTable(filtered);
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
