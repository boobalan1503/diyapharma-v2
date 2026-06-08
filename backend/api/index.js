const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Load environment variables (mostly for local development, Vercel manages them automatically)
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For production, replace with your Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');



// ==========================================
// API Routes
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Diya Pharma API is running' });
});

// Admin Image Upload
app.post('/api/admin/upload', upload.single('image'), async (req, res) => {
  try {
    const { productId } = req.body;
    const file = req.file;
    
    if (!file) return res.status(400).json({ error: 'No image file provided' });
    if (!productId) return res.status(400).json({ error: 'Product ID required' });

    // 1. Upload to Supabase Storage Bucket 'product-images'
    const fileName = `product_${productId}_${Date.now()}.${file.originalname.split('.').pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    // 3. Update Database
    const { data: updateData, error: dbError } = await supabase
      .from('products')
      .update({ img: publicUrl })
      .eq('id', productId)
      .select();

    if (dbError) throw dbError;

    res.json({ success: true, url: publicUrl, product: updateData });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all divisions with logos
app.get('/api/divisions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('divisions')
      .select('name, logo_url, display_order')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching divisions:', error.message);
    res.status(500).json({ error: 'Failed to fetch divisions' });
  }
});

// ===== DIAPER API ROUTES =====

// Get all diaper categories
app.get('/api/diaper-categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diaper_categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching diaper categories:', error.message);
    res.status(500).json({ error: 'Failed to fetch diaper categories' });
  }
});

// Get all diaper products (optional ?category_id=1 or ?brand=Friends filter)
app.get('/api/diaper-products', async (req, res) => {
  try {
    let query = supabase
      .from('diaper_products')
      .select('*, diaper_categories(name, slug)')
      .order('brand', { ascending: true });

    if (req.query.category_id) {
      query = query.eq('category_id', req.query.category_id);
    }
    if (req.query.brand) {
      query = query.eq('brand', req.query.brand);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching diaper products:', error.message);
    res.status(500).json({ error: 'Failed to fetch diaper products' });
  }
});

// Get single diaper product by ID
app.get('/api/diaper-products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diaper_products')
      .select('*, diaper_categories(name, slug)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching diaper product:', error.message);
    res.status(500).json({ error: 'Failed to fetch diaper product' });
  }
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, type, license } = req.body;
  
  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Insert extra user details into public.users
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name,
            email,
            phone,
            type: type || 'retail',
            license
          }
        ]);
      
      if (dbError) throw dbError;
    }

    res.status(201).json({ message: 'User registered successfully', user: authData.user });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 is not found
        console.error('User profile fetch error', userError);
    }

    res.json({
      message: 'Login successful',
      session: authData.session,
      user: userData || { id: authData.user.id, email: authData.user.email }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://diyapharma.netlify.app/login.html'
    });

    if (error) throw error;

    res.json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Orders Routes
app.post('/api/orders', async (req, res) => {
  const { userId, items, shippingAddress, paymentMethod, total } = req.body;

  try {
    // Insert Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total,
        status: 'Processing',
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert Order Items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.qty,
      price: item.mrp // or pts/ptr depending on logic
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.status(201).json({ message: 'Order placed successfully', orderId: orderData.id });
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*, products (name))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Fetch orders error:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ===== ENQUIRY / CONTACT FORM ROUTES =====

// Receive contact form submission & store in DB
// (Email notification is handled via EmailJS on the frontend)
app.post('/api/enquiry', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  console.log(`[Enquiry] Received from ${name} <${email}> — Subject: ${subject}`);

  // Store in Supabase (enquiries table)
  let dbSaved = false;
  try {
    const { error: dbError } = await supabase
      .from('enquiries')
      .insert([{
        sender_name: name,
        sender_email: email,
        sender_phone: phone || '',
        subject: subject || 'General Inquiry',
        body: message,
        status: 'Unread',
        source: 'Contact Page'
      }]);
    if (dbError) {
      console.warn('[Enquiry] DB save failed (table may not exist):', dbError.message);
    } else {
      dbSaved = true;
      console.log('[Enquiry] Saved to database successfully.');
    }
  } catch (e) {
    console.warn('[Enquiry] DB save error:', e.message);
  }

  res.status(201).json({
    success: true,
    message: 'Enquiry received successfully.',
    dbSaved
  });
});

// Update enquiry status (called after EmailJS sends the reply)
app.post('/api/enquiry/status', async (req, res) => {
  const { enquiryId, status } = req.body;

  if (!enquiryId) {
    return res.status(400).json({ error: 'Enquiry ID is required.' });
  }

  try {
    await supabase
      .from('enquiries')
      .update({ status: status || 'Replied' })
      .eq('id', enquiryId);
    res.json({ success: true });
  } catch (e) {
    console.warn('[Enquiry] DB status update failed:', e.message);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// Export the Express API
module.exports = app;
