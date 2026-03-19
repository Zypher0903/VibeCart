// ============================================
//  VibeCart — server.js
//  Express backend — serves frontend + ads API
//  Database: data/ads.json (JSON file, no SQL needed)
// ============================================

const express  = require('express');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');
const crypto   = require('crypto');
const multer   = require('multer');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- Paths ----
const DATA_DIR  = path.join(__dirname, 'data');
const ADS_FILE  = path.join(DATA_DIR, 'ads.json');
const IMGS_DIR  = path.join(DATA_DIR, 'uploads');
const WEB_DIR   = path.join(__dirname, '..', 'web');

// ---- Init data dir ----
if (!fs.existsSync(DATA_DIR))  fs.mkdirSync(DATA_DIR,  { recursive: true });
if (!fs.existsSync(IMGS_DIR))  fs.mkdirSync(IMGS_DIR,  { recursive: true });
if (!fs.existsSync(ADS_FILE))  fs.writeFileSync(ADS_FILE, JSON.stringify({ ads: [] }));

// ---- File DB helpers ----
function readDB()       { try { return JSON.parse(fs.readFileSync(ADS_FILE, 'utf8')); } catch { return { ads: [] }; } }
function writeDB(data)  { fs.writeFileSync(ADS_FILE, JSON.stringify(data, null, 2)); }

// ---- Multer (image uploads) ----
const storage = multer.diskStorage({
  destination: IMGS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomUUID() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },        // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg','.jpeg','.png','.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.static(WEB_DIR));                 // Serve frontend
app.use('/uploads', express.static(IMGS_DIR));    // Serve uploaded images

// ============================================
//  ADS API
// ============================================

// GET /api/ads  — list all active ads (newest first)
app.get('/api/ads', (req, res) => {
  const db = readDB();
  let ads = db.ads.filter(a => a.status === 'active');

  // Optional filters
  const { category, q, sellerId, limit } = req.query;
  if (category && category !== 'all') ads = ads.filter(a => a.category === category);
  if (q) {
    const ql = q.toLowerCase();
    ads = ads.filter(a => a.title.toLowerCase().includes(ql) || a.description.toLowerCase().includes(ql));
  }
  if (sellerId) ads = ads.filter(a => a.sellerId === sellerId);

  ads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (limit) ads = ads.slice(0, parseInt(limit));

  res.json({ ok: true, ads, total: ads.length });
});

// GET /api/ads/:id  — single ad
app.get('/api/ads/:id', (req, res) => {
  const db  = readDB();
  const ad  = db.ads.find(a => a.id === req.params.id);
  if (!ad) return res.status(404).json({ ok: false, error: 'Ad not found.' });
  res.json({ ok: true, ad });
});

// POST /api/ads  — create ad (with optional image)
app.post('/api/ads', upload.single('image'), (req, res) => {
  const { title, description, price, category, condition, sellerName, sellerEmail, sellerId, phone } = req.body;

  // Validation
  if (!title || !description || !price || !category || !sellerEmail) {
    return res.status(400).json({ ok: false, error: 'Title, description, price, category and email are required.' });
  }
  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return res.status(400).json({ ok: false, error: 'Price must be a valid positive number.' });
  }
  if (title.length > 100) {
    return res.status(400).json({ ok: false, error: 'Title must be under 100 characters.' });
  }

  const db  = readDB();
  const ad  = {
    id:          crypto.randomUUID(),
    title:       title.trim(),
    description: description.trim(),
    price:       parseFloat(parseFloat(price).toFixed(2)),
    category:    category,
    condition:   condition || 'new',
    sellerName:  (sellerName || 'Anonymous').trim(),
    sellerEmail: sellerEmail.trim().toLowerCase(),
    sellerId:    sellerId || null,
    phone:       phone ? phone.trim() : null,
    imageUrl:    req.file ? `/uploads/${req.file.filename}` : null,
    status:      'active',
    views:       0,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  db.ads.unshift(ad);
  writeDB(db);

  res.status(201).json({ ok: true, ad });
});

// PATCH /api/ads/:id  — update ad (seller only, verified by sellerId + email)
app.patch('/api/ads/:id', upload.single('image'), (req, res) => {
  const db  = readDB();
  const idx = db.ads.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'Ad not found.' });

  const ad = db.ads[idx];
  // Basic ownership check — in production use JWT tokens
  if (req.body.sellerEmail && ad.sellerEmail !== req.body.sellerEmail.toLowerCase()) {
    return res.status(403).json({ ok: false, error: 'Not authorized to edit this ad.' });
  }

  const allowed = ['title','description','price','category','condition','phone','status'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) ad[field] = field === 'price' ? parseFloat(req.body[field]) : req.body[field];
  });
  if (req.file) ad.imageUrl = `/uploads/${req.file.filename}`;
  ad.updatedAt = new Date().toISOString();

  writeDB(db);
  res.json({ ok: true, ad });
});

// DELETE /api/ads/:id  — delete ad (seller or admin)
app.delete('/api/ads/:id', (req, res) => {
  const db  = readDB();
  const idx = db.ads.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'Ad not found.' });

  const ad = db.ads[idx];
  const { sellerEmail } = req.body;
  if (sellerEmail && ad.sellerEmail !== sellerEmail.toLowerCase()) {
    return res.status(403).json({ ok: false, error: 'Not authorized to delete this ad.' });
  }

  // Soft delete
  db.ads[idx].status = 'deleted';
  db.ads[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ ok: true });
});

// POST /api/ads/:id/view  — increment view count
app.post('/api/ads/:id/view', (req, res) => {
  const db  = readDB();
  const ad  = db.ads.find(a => a.id === req.params.id);
  if (ad) { ad.views = (ad.views || 0) + 1; writeDB(db); }
  res.json({ ok: true });
});

// GET /api/stats  — quick platform stats
app.get('/api/stats', (req, res) => {
  const db   = readDB();
  const active = db.ads.filter(a => a.status === 'active');
  const cats = {};
  active.forEach(a => { cats[a.category] = (cats[a.category] || 0) + 1; });
  res.json({
    ok:         true,
    totalAds:   active.length,
    categories: cats,
    newest:     active.slice(0, 3).map(a => ({ id: a.id, title: a.title, price: a.price }))
  });
});

// Fallback — serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(WEB_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  VibeCart server running at http://localhost:${PORT}\n`);
});
