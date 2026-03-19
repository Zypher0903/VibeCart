// ============================================
//  VibeCart — shop.js  (Enhanced)
//  Products, filters, cart, quick view, pagination
//  + localStorage persistence, real images, improved UX
// ============================================

// ===== PRODUCT DATA =====
const PRODUCTS = [
  { id: 1,  name: 'Wireless ANC Earbuds Pro', category: 'electronics', price: 49.99, originalPrice: 79.99, rating: 4.8, reviews: 1243, img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', badges: ['sale','hot'], tags: ['trending','bestseller'], inStock: true, desc: 'Industry-leading noise cancellation with 30hr battery life and crystal-clear audio. Water resistant IPX5.' },
  { id: 2,  name: 'RGB Ambient Desk Lamp', category: 'home', price: 34.99, originalPrice: null, rating: 4.6, reviews: 832, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80', badges: ['new'], tags: ['new','trending'], inStock: true, desc: 'Fully customizable RGB lighting with 16 million colors. Touch controls, USB-C charging port built in.' },
  { id: 3,  name: 'Slim Smart Watch Series X', category: 'electronics', price: 79.99, originalPrice: 119.99, rating: 4.7, reviews: 2104, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', badges: ['sale'], tags: ['bestseller'], inStock: true, desc: 'Health tracking, GPS, sleep monitoring, 7-day battery. Compatible with iOS & Android.' },
  { id: 4,  name: 'Minimalist Canvas Backpack', category: 'apparel', price: 89.00, originalPrice: null, rating: 4.9, reviews: 567, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', badges: ['bestseller'], tags: ['bestseller','eco'], inStock: true, desc: '100% recycled canvas, padded laptop sleeve, 28L capacity. Water-resistant coating.' },
  { id: 5,  name: 'Portable Espresso Maker', category: 'home', price: 44.99, originalPrice: 59.99, rating: 4.5, reviews: 389, img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80', badges: ['sale'], tags: ['trending'], inStock: true, desc: 'Barista-quality espresso anywhere. 18-bar pressure, works with any ground coffee.' },
  { id: 6,  name: 'Leather Card Wallet', category: 'accessories', price: 29.99, originalPrice: null, rating: 4.7, reviews: 1895, img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80', badges: ['new'], tags: ['new','bestseller'], inStock: true, desc: 'Full-grain Italian leather, holds 8 cards + cash, RFID blocking. Slim 4mm profile.' },
  { id: 7,  name: 'Retinol Night Serum', category: 'beauty', price: 38.00, originalPrice: 52.00, rating: 4.6, reviews: 743, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', badges: ['sale'], tags: ['trending','eco'], inStock: true, desc: 'Clinical-strength 1% retinol with hyaluronic acid. Reduces fine lines in 4 weeks.' },
  { id: 8,  name: 'Mechanical Keyboard TKL', category: 'electronics', price: 119.00, originalPrice: null, rating: 4.8, reviews: 432, img: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600&q=80', badges: ['new'], tags: ['new','limited'], inStock: true, desc: 'Hot-swap brown switches, per-key RGB, aluminum case. 87-key tenkeyless layout.' },
  { id: 9,  name: 'Linen Blend Joggers', category: 'apparel', price: 54.99, originalPrice: 74.99, rating: 4.4, reviews: 621, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', badges: ['sale'], tags: ['sale','eco'], inStock: true, desc: '55% linen, 45% cotton. Breathable, tapered fit. Available in 6 neutral tones.' },
  { id: 10, name: 'Aromatherapy Diffuser', category: 'home', price: 39.99, originalPrice: null, rating: 4.7, reviews: 1102, img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80', badges: ['bestseller'], tags: ['bestseller','eco'], inStock: true, desc: '500ml capacity, 7-color mood light, auto shut-off, whisper-quiet ultrasonic motor.' },
  { id: 11, name: 'Polarized Sunglasses', category: 'accessories', price: 64.99, originalPrice: 89.99, rating: 4.5, reviews: 298, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', badges: ['sale'], tags: ['sale','trending'], inStock: true, desc: 'UV400 polarized lenses, TR90 lightweight frame. Includes hard case and cleaning cloth.' },
  { id: 12, name: 'Vitamin C Glow Moisturizer', category: 'beauty', price: 42.00, originalPrice: null, rating: 4.8, reviews: 912, img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80', badges: ['new'], tags: ['new'], inStock: true, desc: 'SPF 30 + 15% vitamin C complex. Brightens, hydrates, and protects. Fragrance-free.' },
  { id: 13, name: 'USB-C Docking Station', category: 'electronics', price: 89.99, originalPrice: 129.99, rating: 4.6, reviews: 674, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', badges: ['sale'], tags: ['sale'], inStock: false, desc: '12-in-1 hub: dual 4K HDMI, 100W PD, USB 3.2, SD card reader, ethernet.' },
  { id: 14, name: 'Oversized Linen Shirt', category: 'apparel', price: 69.00, originalPrice: null, rating: 4.3, reviews: 445, img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80', badges: ['new'], tags: ['new','eco'], inStock: true, desc: 'Premium stonewashed linen. Boxy relaxed fit. 100% OEKO-TEX certified fabric.' },
  { id: 15, name: 'Stainless Tumbler 40oz', category: 'home', price: 32.99, originalPrice: 44.99, rating: 4.9, reviews: 3214, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80', badges: ['bestseller','sale'], tags: ['bestseller'], inStock: true, desc: 'Double-wall vacuum insulated. Keeps cold 24h, hot 12h. Dishwasher safe.' },
  { id: 16, name: 'Gold Hoop Earrings Set', category: 'accessories', price: 22.99, originalPrice: null, rating: 4.6, reviews: 1567, img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', badges: ['new'], tags: ['new','trending'], inStock: true, desc: '18k gold-plated hypoallergenic hoops in 3 sizes. Tarnish-resistant, nickel-free.' },
  { id: 17, name: 'Clay Mask Trio', category: 'beauty', price: 28.00, originalPrice: 39.99, rating: 4.5, reviews: 532, img: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&q=80', badges: ['sale'], tags: ['sale'], inStock: true, desc: 'Kaolin, bentonite, and pink clay blends. Deep-cleanses pores, balances oil.' },
  { id: 18, name: 'Wireless Charging Pad', category: 'electronics', price: 24.99, originalPrice: null, rating: 4.4, reviews: 887, img: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f9f?w=600&q=80', badges: ['new'], tags: ['new'], inStock: true, desc: '15W fast charge, Qi-compatible. Works with any wireless-enabled device.' },
  { id: 19, name: 'Wide-Leg Trousers', category: 'apparel', price: 78.00, originalPrice: 110.00, rating: 4.6, reviews: 329, img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80', badges: ['sale'], tags: ['sale','trending'], inStock: true, desc: 'High-waisted wide leg. Stretch-blend fabric for all-day comfort. Machine washable.' },
  { id: 20, name: 'Bamboo Desk Organizer', category: 'home', price: 44.00, originalPrice: null, rating: 4.7, reviews: 743, img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', badges: ['new','eco'], tags: ['new','eco'], inStock: true, desc: '100% sustainable bamboo, 6-compartment design. Reduces desk clutter beautifully.' },
  { id: 21, name: 'Silk Hair Scrunchie Pack', category: 'accessories', price: 18.99, originalPrice: 26.99, rating: 4.8, reviews: 2341, img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', badges: ['sale','hot'], tags: ['bestseller','sale'], inStock: true, desc: 'Pure mulberry silk, 5-pack assorted colors. Gentle on hair, no breakage.' },
  { id: 22, name: 'Hyaluronic Lip Gloss', category: 'beauty', price: 16.00, originalPrice: null, rating: 4.4, reviews: 461, img: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80', badges: ['new'], tags: ['new'], inStock: true, desc: 'Plumping hyaluronic formula, non-sticky, 8 wearable shades. Vegan and cruelty-free.' },
  { id: 23, name: 'Noise-Cancelling Headphones', category: 'electronics', price: 159.99, originalPrice: 229.99, rating: 4.9, reviews: 4102, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', badges: ['sale','limited'], tags: ['trending','limited'], inStock: true, desc: 'Studio-quality sound, 40hr battery, foldable design. Industry-best ANC performance.' },
  { id: 24, name: 'Oversized Knit Cardigan', category: 'apparel', price: 94.00, originalPrice: null, rating: 4.7, reviews: 278, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', badges: ['new'], tags: ['new'], inStock: true, desc: 'Premium merino-blend knit. Relaxed drop-shoulder silhouette. 4 seasonal tones.' },
];

// ===== STORAGE BACKEND =====
const Storage = {
  CART_KEY: 'vibecart_cart',
  WISHLIST_KEY: 'vibecart_wishlist',

  getCart() {
    try { return JSON.parse(localStorage.getItem(this.CART_KEY)) || []; }
    catch { return []; }
  },
  saveCart(cart) {
    try { localStorage.setItem(this.CART_KEY, JSON.stringify(cart)); } catch {}
  },
  getWishlist() {
    try { return new Set(JSON.parse(localStorage.getItem(this.WISHLIST_KEY)) || []); }
    catch { return new Set(); }
  },
  saveWishlist(set) {
    try { localStorage.setItem(this.WISHLIST_KEY, JSON.stringify([...set])); } catch {}
  }
};

// ===== STATE =====
const state = {
  products: [...PRODUCTS],
  filtered: [...PRODUCTS],
  cart: Storage.getCart(),
  wishlist: Storage.getWishlist(),
  page: 1,
  perPage: 12,
  view: 'grid',
  sort: 'featured',
  filters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 300,
    rating: 0,
    tags: new Set(),
    search: '',
    inStock: false,
    onSale: false,
  }
};

// ===== DOM REFS =====
const productGrid = document.getElementById('productGrid');
const productCount = document.getElementById('productCount');
const noResults = document.getElementById('noResults');
const pagination = document.getElementById('pagination');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartItemCount = document.getElementById('cartItemCount');
const modalOverlay = document.getElementById('modalOverlay');
const modalInner = document.getElementById('modalInner');
const toast = document.getElementById('toast');
const activeFilters = document.getElementById('activeFilters');
const activeFilterTags = document.getElementById('activeFilterTags');
const filterBadge = document.getElementById('filterBadge');

// ===== RENDER PRODUCTS =====
function renderProducts() {
  productGrid.innerHTML = Array(6).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line w-40"></div>
        <div class="skeleton skeleton-line w-80"></div>
        <div class="skeleton skeleton-line w-60"></div>
      </div>
    </div>
  `).join('');

  setTimeout(() => {
    const start = (state.page - 1) * state.perPage;
    const paged = state.filtered.slice(start, start + state.perPage);

    if (paged.length === 0) {
      productGrid.innerHTML = '';
      noResults.style.display = 'block';
      pagination.style.display = 'none';
      productCount.innerHTML = 'Showing <strong>0</strong> products';
      return;
    }

    noResults.style.display = 'none';
    pagination.style.display = 'flex';
    productCount.innerHTML = `Showing <strong>${state.filtered.length}</strong> product${state.filtered.length !== 1 ? 's' : ''}`;
    productGrid.innerHTML = paged.map(p => renderCard(p)).join('');
    renderPagination();

    productGrid.querySelectorAll('.product-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, i * 40);
    });

    bindCardEvents();
  }, 280);
}

function renderCard(p) {
  const discount = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : null;

  const badges = p.badges.map(b => {
    const labels = { new: 'New', sale: 'Sale', hot: '🔥 Hot', bestseller: '⭐ Best', limited: 'Limited' };
    return `<span class="card-badge badge-${b}">${labels[b] || b}</span>`;
  }).join('');

  const starsHtml = renderStars(p.rating);
  const wishlisted = state.wishlist.has(p.id);

  return `
    <div class="product-card" data-id="${p.id}">
      <button class="card-wishlist ${wishlisted ? 'active' : ''}" data-id="${p.id}" aria-label="Wishlist">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="${wishlisted ? '#e11d48' : 'none'}" stroke="${wishlisted ? '#e11d48' : 'currentColor'}" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="card-image" data-id="${p.id}">
        <div class="card-badges">${badges}</div>
        <img src="${p.img}" alt="${p.name}" class="card-img" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="card-img-fallback" style="display:none;font-size:3.5rem;width:100%;height:100%;align-items:center;justify-content:center;background:var(--cream);">🛍️</div>
        ${!p.inStock ? '<div class="card-oos">OUT OF STOCK</div>' : ''}
        <div class="card-quick-view">Quick View</div>
      </div>
      <div class="card-body">
        <p class="card-category">${categoryLabel(p.category)}</p>
        <h3 class="card-name">${p.name}</h3>
        <div class="card-rating">
          <span class="card-stars">${starsHtml}</span>
          <span class="card-rating-count">${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="card-footer">
          <div class="card-price">
            <span class="price-current">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span><span class="price-discount">-${discount}%</span>` : ''}
          </div>
          <button class="btn-add-cart" data-id="${p.id}" ${!p.inStock ? 'disabled' : ''}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '<span style="color:#f59e0b">★</span>';
    else if (i === full && half) html += '<span style="color:#f59e0b">½</span>';
    else html += '<span style="color:#d1cfcc">★</span>';
  }
  return html;
}

function categoryLabel(cat) {
  const map = { electronics: 'Electronics', home: 'Home & Living', apparel: 'Apparel', beauty: 'Beauty', accessories: 'Accessories' };
  return map[cat] || cat;
}

function bindCardEvents() {
  productGrid.querySelectorAll('.card-image, .card-name').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.closest('[data-id]').dataset.id);
      openQuickView(id);
    });
  });

  productGrid.querySelectorAll('.card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      if (state.wishlist.has(id)) {
        state.wishlist.delete(id);
        showToast('Removed from wishlist');
      } else {
        state.wishlist.add(id);
        showToast('Added to wishlist ❤️');
      }
      Storage.saveWishlist(state.wishlist);
      renderProducts();
    });
  });

  productGrid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      addToCart(id, btn);
    });
  });
}

// ===== PAGINATION =====
function renderPagination() {
  const total = Math.ceil(state.filtered.length / state.perPage);
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageNums = document.getElementById('pageNumbers');

  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= total;
  pageNums.innerHTML = '';

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement('button');
    btn.className = `page-num ${i === state.page ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => { state.page = i; renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    pageNums.appendChild(btn);
  }

  prevBtn.onclick = () => { state.page--; renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  nextBtn.onclick = () => { state.page++; renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  pagination.style.display = total <= 1 ? 'none' : 'flex';
}

// ===== FILTERING =====
function applyFilters() {
  let result = [...PRODUCTS];

  if (state.filters.search) {
    const q = state.filters.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || categoryLabel(p.category).toLowerCase().includes(q));
  }
  if (state.filters.category !== 'all') result = result.filter(p => p.category === state.filters.category);
  result = result.filter(p => p.price >= state.filters.minPrice && p.price <= state.filters.maxPrice);
  if (state.filters.rating > 0) result = result.filter(p => p.rating >= state.filters.rating);
  if (state.filters.tags.size > 0) result = result.filter(p => [...state.filters.tags].some(t => p.tags.includes(t) || p.badges.includes(t)));
  if (state.filters.inStock) result = result.filter(p => p.inStock);
  if (state.filters.onSale) result = result.filter(p => p.originalPrice !== null);

  switch (state.sort) {
    case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
    case 'newest':     result.sort((a, b) => (b.badges.includes('new') ? 1 : 0) - (a.badges.includes('new') ? 1 : 0)); break;
    case 'popular':    result.sort((a, b) => b.reviews - a.reviews); break;
    default: break;
  }

  state.filtered = result;
  state.page = 1;
  updateActiveFilterTags();
  renderProducts();
  updateURLParams();
}

function updateURLParams() {
  const params = new URLSearchParams();
  if (state.filters.category !== 'all') params.set('cat', state.filters.category);
  if (state.filters.tags.size > 0) params.set('filter', [...state.filters.tags][0]);
  if (state.filters.search) params.set('q', state.filters.search);
  const newUrl = params.toString() ? `${window.location.pathname}?${params}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

function updateActiveFilterTags() {
  const tags = [];
  if (state.filters.category !== 'all') tags.push({ label: categoryLabel(state.filters.category), key: 'category' });
  if (state.filters.minPrice > 0 || state.filters.maxPrice < 300) tags.push({ label: `$${state.filters.minPrice}–$${state.filters.maxPrice}`, key: 'price' });
  if (state.filters.rating > 0) tags.push({ label: `${state.filters.rating}★ & up`, key: 'rating' });
  if (state.filters.inStock) tags.push({ label: 'In stock', key: 'inStock' });
  if (state.filters.onSale) tags.push({ label: 'On sale', key: 'onSale' });
  state.filters.tags.forEach(t => tags.push({ label: t.charAt(0).toUpperCase() + t.slice(1), key: `tag:${t}` }));

  if (tags.length > 0) {
    activeFilters.style.display = 'flex';
    filterBadge.textContent = tags.length;
    filterBadge.style.display = 'flex';
    activeFilterTags.innerHTML = tags.map(t => `
      <span class="active-filter-tag">
        ${t.label}
        <button data-key="${t.key}" aria-label="Remove filter">✕</button>
      </span>
    `).join('');
    activeFilterTags.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => removeFilter(btn.dataset.key));
    });
  } else {
    activeFilters.style.display = 'none';
    filterBadge.style.display = 'none';
  }
}

function removeFilter(key) {
  if (key === 'category') { state.filters.category = 'all'; document.querySelector('input[name="category"][value="all"]').checked = true; updateCategoryLabels(); }
  else if (key === 'price') { state.filters.minPrice = 0; state.filters.maxPrice = 300; document.getElementById('priceMin').value = 0; document.getElementById('priceMax').value = 300; updatePriceRange(); }
  else if (key === 'rating') { state.filters.rating = 0; document.querySelector('input[name="rating"][value="0"]').checked = true; }
  else if (key === 'inStock') { state.filters.inStock = false; document.getElementById('inStockOnly').checked = false; }
  else if (key === 'onSale') { state.filters.onSale = false; document.getElementById('onSaleOnly').checked = false; }
  else if (key.startsWith('tag:')) { const tag = key.replace('tag:', ''); state.filters.tags.delete(tag); document.querySelector(`.tag-btn[data-tag="${tag}"]`)?.classList.remove('active'); }
  applyFilters();
}

function resetFilters() {
  state.filters = { category: 'all', minPrice: 0, maxPrice: 300, rating: 0, tags: new Set(), search: '', inStock: false, onSale: false };
  document.querySelector('input[name="category"][value="all"]').checked = true;
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  document.getElementById('priceMin').value = 0;
  document.getElementById('priceMax').value = 300;
  document.getElementById('inStockOnly').checked = false;
  document.getElementById('onSaleOnly').checked = false;
  document.getElementById('productSearch').value = '';
  document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
  updateCategoryLabels();
  updatePriceRange();
  applyFilters();
}

function updateCategoryLabels() {
  document.querySelectorAll('[data-filter="category"]').forEach(label => {
    label.classList.toggle('active-check', label.querySelector('input').checked);
  });
}

// ===== PRICE RANGE =====
function updatePriceRange() {
  const min = parseInt(document.getElementById('priceRangeMin').value);
  const max = parseInt(document.getElementById('priceRangeMax').value);
  const total = 300;
  const fill = document.getElementById('priceRangeFill');
  fill.style.left = (min / total * 100) + '%';
  fill.style.right = ((total - max) / total * 100) + '%';
  document.getElementById('priceMin').value = min;
  document.getElementById('priceMax').value = max;
  state.filters.minPrice = min;
  state.filters.maxPrice = max;
}

// ===== CART =====
function addToCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = state.cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else state.cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });

  Storage.saveCart(state.cart);

  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add';
    }, 1800);
  }

  updateCartUI();
  showToast(`${product.name.slice(0, 22)}… added to cart 🛍️`);
  openCartDrawer();
}

function updateCartUI() {
  const totalItems = state.cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  cartItemCount.textContent = `(${totalItems})`;

  if (state.cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartItems.style.display = 'flex';
  cartFooter.style.display = 'flex';

  cartItems.innerHTML = state.cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'" />
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        <div class="cart-item-controls">
          <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

  cartItems.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = state.cart.find(i => i.id === id);
      if (item.qty > 1) item.qty--;
      else state.cart.splice(state.cart.indexOf(item), 1);
      Storage.saveCart(state.cart);
      updateCartUI();
    });
  });
  cartItems.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      state.cart.find(i => i.id === id).qty++;
      Storage.saveCart(state.cart);
      updateCartUI();
    });
  });
  cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      state.cart = state.cart.filter(i => i.id !== id);
      Storage.saveCart(state.cart);
      updateCartUI();
      showToast('Item removed from cart');
    });
  });
}

function openCartDrawer() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

document.getElementById('cartDrawerClose').addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', closeCartDrawer);
document.querySelector('.cart-btn').addEventListener('click', (e) => { e.preventDefault(); openCartDrawer(); });

// ===== QUICK VIEW =====
function openQuickView(id) {
  const p = PRODUCTS.find(pr => pr.id === id);
  if (!p) return;
  const starsHtml = renderStars(p.rating);
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null;

  modalInner.innerHTML = `
    <div class="modal-image">
      <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'" />
    </div>
    <div class="modal-details">
      <p class="modal-category">${categoryLabel(p.category)}</p>
      <h2 class="modal-name">${p.name}</h2>
      <div class="modal-rating">
        <span>${starsHtml}</span>
        <span style="color:var(--ink-muted);font-size:0.8rem">${p.rating} · ${p.reviews.toLocaleString()} reviews</span>
      </div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-price">
        <span class="price-current">$${p.price.toFixed(2)}</span>
        ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span><span class="price-discount">-${discount}%</span>` : ''}
      </div>
      <div class="modal-actions">
        <button class="btn-add-cart" id="modalAddCart" style="border-radius:var(--radius-pill);justify-content:center;padding:12px;width:100%" ${!p.inStock ? 'disabled style="opacity:0.5"' : ''}>
          ${p.inStock ? '+ Add to Cart' : 'Out of Stock'}
        </button>
        <a href="#" class="btn-line" style="display:flex;justify-content:center;font-size:0.875rem">View Full Details →</a>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('modalAddCart').addEventListener('click', () => {
    addToCart(id, document.getElementById('modalAddCart'));
    setTimeout(closeModal, 600);
  });
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeCartDrawer(); } });

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ===== FILTER GROUP ACCORDIONS =====
document.querySelectorAll('.filter-group-header').forEach(btn => {
  const target = document.getElementById(btn.dataset.target);
  if (!target) return;
  btn.classList.add('open');
  target.classList.add('open');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    target.classList.toggle('open');
  });
});

// ===== FILTER EVENTS =====
document.querySelectorAll('input[name="category"]').forEach(input => {
  input.addEventListener('change', () => { state.filters.category = input.value; updateCategoryLabels(); });
});
document.querySelectorAll('input[name="rating"]').forEach(input => {
  input.addEventListener('change', () => { state.filters.rating = parseFloat(input.value); });
});

const rangeMin = document.getElementById('priceRangeMin');
const rangeMax = document.getElementById('priceRangeMax');
rangeMin.addEventListener('input', () => {
  if (parseInt(rangeMin.value) > parseInt(rangeMax.value) - 10) rangeMin.value = parseInt(rangeMax.value) - 10;
  updatePriceRange();
});
rangeMax.addEventListener('input', () => {
  if (parseInt(rangeMax.value) < parseInt(rangeMin.value) + 10) rangeMax.value = parseInt(rangeMin.value) + 10;
  updatePriceRange();
});
document.getElementById('priceMin').addEventListener('change', (e) => { rangeMin.value = e.target.value; updatePriceRange(); });
document.getElementById('priceMax').addEventListener('change', (e) => { rangeMax.value = e.target.value; updatePriceRange(); });

document.querySelectorAll('.tag-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tag = btn.dataset.tag;
    if (state.filters.tags.has(tag)) { state.filters.tags.delete(tag); btn.classList.remove('active'); }
    else { state.filters.tags.add(tag); btn.classList.add('active'); }
  });
});

document.getElementById('inStockOnly').addEventListener('change', (e) => { state.filters.inStock = e.target.checked; });
document.getElementById('onSaleOnly').addEventListener('change', (e) => { state.filters.onSale = e.target.checked; });
document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', resetFilters);
document.getElementById('noResultsReset').addEventListener('click', resetFilters);
document.getElementById('clearAllFilters').addEventListener('click', resetFilters);

let searchDebounce;
document.getElementById('productSearch').addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => { state.filters.search = e.target.value.trim(); applyFilters(); }, 320);
});

document.getElementById('sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; applyFilters(); });

// ===== VIEW TOGGLE =====
document.getElementById('gridView').addEventListener('click', () => {
  state.view = 'grid';
  productGrid.classList.remove('list-view');
  document.getElementById('gridView').classList.add('active');
  document.getElementById('listView').classList.remove('active');
});
document.getElementById('listView').addEventListener('click', () => {
  state.view = 'list';
  productGrid.classList.add('list-view');
  document.getElementById('listView').classList.add('active');
  document.getElementById('gridView').classList.remove('active');
});

// ===== MOBILE FILTER SIDEBAR =====
const shopSidebar = document.getElementById('shopSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

document.getElementById('filterToggle').addEventListener('click', () => {
  shopSidebar.classList.add('open');
  sidebarOverlay.style.display = 'block';
  setTimeout(() => sidebarOverlay.style.opacity = '1', 10);
  document.body.style.overflow = 'hidden';
});

function closeSidebar() {
  shopSidebar.classList.remove('open');
  sidebarOverlay.style.opacity = '0';
  setTimeout(() => sidebarOverlay.style.display = 'none', 350);
  document.body.style.overflow = '';
}
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
document.getElementById('applyFilters').addEventListener('click', () => {
  if (window.innerWidth <= 900) closeSidebar();
});

// ===== READ URL PARAMS =====
function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const filter = params.get('filter');
  const q = params.get('q');

  if (cat && ['electronics','apparel','home','beauty','accessories'].includes(cat)) {
    state.filters.category = cat;
    const radio = document.querySelector(`input[name="category"][value="${cat}"]`);
    if (radio) { radio.checked = true; updateCategoryLabels(); }
  }
  if (filter) {
    if (['new','sale','bestseller','trending','limited','eco'].includes(filter)) {
      state.filters.tags.add(filter);
      document.querySelector(`.tag-btn[data-tag="${filter}"]`)?.classList.add('active');
    }
    if (filter === 'sale') { state.filters.onSale = true; const cb = document.getElementById('onSaleOnly'); if (cb) cb.checked = true; }
  }
  if (q) {
    state.filters.search = q;
    document.getElementById('productSearch').value = q;
  }

  const titleEl = document.querySelector('.shop-title');
  const crumbEl = document.querySelector('.breadcrumb-current');
  if (cat) {
    const label = { electronics:'Electronics', apparel:'Apparel', home:'Home & Living', beauty:'Beauty', accessories:'Accessories' };
    titleEl.textContent = label[cat] || 'All Products';
    crumbEl.textContent = label[cat] || 'Shop';
  } else if (filter === 'sale') { titleEl.textContent = 'Sale Items'; crumbEl.textContent = 'Deals'; }
  else if (filter === 'new') { titleEl.textContent = 'New Arrivals'; crumbEl.textContent = 'New Arrivals'; }
  else if (filter === 'bestseller') { titleEl.textContent = 'Best Sellers'; crumbEl.textContent = 'Best Sellers'; }
}

// ===== INIT =====
updatePriceRange();
readURLParams();
applyFilters();
updateCartUI();


// ===== CHECKOUT — saves order to localStorage =====
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.cart-drawer-footer .btn-fill');
  if (!btn) return;
  e.preventDefault();

  if (state.cart.length === 0) return;

  // Check if logged in
  try {
    const session = JSON.parse(localStorage.getItem('vibecart_session'));
    if (!session) {
      window.location.href = 'login.html?next=shop.html';
      return;
    }

    // Save order
    const orders = JSON.parse(localStorage.getItem('vibecart_orders') || '[]');
    const orderId = 'VC-2026-' + String(Date.now()).slice(-4);
    const itemNames = state.cart.map(i => i.name).join(', ');
    const total = state.cart.reduce((s,i) => s + i.price * i.qty, 0);
    orders.unshift({
      id: orderId,
      items: itemNames.length > 60 ? itemNames.slice(0,60)+'…' : itemNames,
      total: parseFloat(total.toFixed(2)),
      date: new Date().toISOString().split('T')[0],
      status: 'processing'
    });
    localStorage.setItem('vibecart_orders', JSON.stringify(orders));

    // Clear cart
    state.cart = [];
    Storage.saveCart([]);
    updateCartUI();
    closeCartDrawer();
    showToast('Order placed! Check your account for details. 🎉');
  } catch {
    showToast('Please log in to complete your order.');
    window.location.href = 'login.html?next=shop.html';
  }
});
