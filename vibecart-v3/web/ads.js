// ============================================
//  VibeCart — ads.js
//  Frontend API client for the ads backend
//  Used by: shop.html, sell.html, account.html, marketplace.html
// ============================================

const AdsAPI = (() => {
  // Auto-detect base URL — works both locally and deployed
  const BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.host}`
    : window.location.origin;

  async function request(method, path, body, isFormData = false) {
    const opts = {
      method,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
    };
    try {
      const res = await fetch(BASE + path, opts);
      return await res.json();
    } catch (err) {
      return { ok: false, error: 'Could not reach server. Make sure the server is running.' };
    }
  }

  return {
    // Get all ads, with optional filters
    list(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return request('GET', `/api/ads${qs ? '?' + qs : ''}`);
    },

    // Get single ad by ID
    get(id) {
      return request('GET', `/api/ads/${id}`);
    },

    // Create new ad — accepts FormData (for image upload)
    create(formData) {
      return request('POST', '/api/ads', formData, true);
    },

    // Update ad
    update(id, formData) {
      return request('PATCH', `/api/ads/${id}`, formData, true);
    },

    // Delete ad
    delete(id, sellerEmail) {
      return request('DELETE', `/api/ads/${id}`, { sellerEmail });
    },

    // Increment view
    view(id) {
      return request('POST', `/api/ads/${id}/view`);
    },

    // Platform stats
    stats() {
      return request('GET', '/api/stats');
    },

    // Helper: format price
    formatPrice(p) {
      return '$' + parseFloat(p).toFixed(2);
    },

    // Helper: time ago
    timeAgo(dateStr) {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 7) return `${days}d ago`;
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    // Render a single ad card (returns HTML string)
    renderCard(ad, opts = {}) {
      const { showSeller = true, compact = false } = opts;
      const condColors = { new: '#16a34a', used: '#d97706', refurbished: '#2563eb' };
      const condColor  = condColors[ad.condition] || '#6b6460';
      const imgHtml = ad.imageUrl
        ? `<img src="${ad.imageUrl}" alt="${ad.title}" class="ad-card-img" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="ad-card-img-fallback" style="display:none">🛍️</div>`
        : `<div class="ad-card-img-fallback">🛍️</div>`;

      return `
        <div class="ad-card" data-id="${ad.id}">
          <div class="ad-card-image">
            ${imgHtml}
            <span class="ad-card-cond" style="background:${condColor}">${ad.condition}</span>
            <span class="ad-card-badge">Ad</span>
          </div>
          <div class="ad-card-body">
            <p class="ad-card-category">${categoryLabel(ad.category)}</p>
            <h3 class="ad-card-title">${ad.title}</h3>
            ${showSeller ? `<p class="ad-card-seller">by ${ad.sellerName}</p>` : ''}
            <div class="ad-card-footer">
              <span class="ad-card-price">${AdsAPI.formatPrice(ad.price)}</span>
              <span class="ad-card-time">${AdsAPI.timeAgo(ad.createdAt)}</span>
            </div>
          </div>
        </div>
      `;
    }
  };
})();

// Category label helper (shared)
function categoryLabel(cat) {
  const map = { electronics:'Electronics', home:'Home & Living', apparel:'Apparel', beauty:'Beauty', accessories:'Accessories', other:'Other' };
  return map[cat] || cat;
}
