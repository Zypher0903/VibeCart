// ============================================
//  VibeCart Store — script.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== GRAIN CANVAS =====
  const grain = document.getElementById('grain');
  if (grain) {
    const ctx = grain.getContext('2d');
    function resize() {
      grain.width = window.innerWidth;
      grain.height = window.innerHeight;
    }
    function drawGrain() {
      const w = grain.width, h = grain.height;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i+1] = d[i+2] = v;
        d[i+3] = 20;
      }
      ctx.putImageData(img, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    let grainFrame;
    function animateGrain() {
      drawGrain();
      grainFrame = requestAnimationFrame(animateGrain);
    }
    animateGrain();
  }


  // ===== STICKY HEADER SHADOW =====
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });


  // ===== SEARCH TOGGLE =====
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) {
      setTimeout(() => searchInput.focus(), 200);
    }
  });
  searchClose.addEventListener('click', () => {
    searchBar.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') searchBar.classList.remove('open');
  });


  // ===== MOBILE DRAWER =====
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }
  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('visible');
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }

  hamburger.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);


  // ===== CATEGORY PILLS =====
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });


  // ===== CART COUNT DEMO =====
  // Simulates a cart badge — in a real store this would be driven by state
  const cartCount = document.querySelector('.cart-count');
  let count = 0;
  // Just show 0 unless something is added
  cartCount.textContent = count;
  if (count === 0) cartCount.style.display = 'none';

  // Expose a global function so "Add to cart" buttons (future) can use it
  window.addToCart = function() {
    count++;
    cartCount.textContent = count;
    cartCount.style.display = 'flex';
    cartCount.style.transform = 'scale(1.4)';
    setTimeout(() => { cartCount.style.transform = ''; }, 200);
  };


  // ===== HERO ENTRANCE ANIMATION =====
  const heroEls = [
    document.querySelector('.hero-eyebrow'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-body'),
    document.querySelector('.hero-actions'),
    document.querySelector('.hero-trust'),
    document.querySelector('.hero-visual'),
  ];

  heroEls.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 120 + i * 110);
  });


  // ===== SMOOTH SCROLL CUE =====
  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    window.addEventListener('scroll', () => {
      scrollCue.style.opacity = window.scrollY > 80 ? '0' : '1';
      scrollCue.style.transition = 'opacity 0.4s';
    });
  }


  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    const btn = newsletterForm.querySelector('button');
    const input = newsletterForm.querySelector('input');
    btn.addEventListener('click', () => {
      if (input.value && input.value.includes('@')) {
        btn.textContent = '✓';
        btn.style.background = '#22c55e';
        input.value = '';
        input.placeholder = 'Thanks for subscribing!';
        setTimeout(() => {
          btn.textContent = '→';
          btn.style.background = '';
          input.placeholder = 'your@email.com';
        }, 3000);
      } else {
        input.style.outline = '2px solid #ef4444';
        setTimeout(() => input.style.outline = '', 1000);
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
    });
  }


  // ===== ANNOUNCE BAR MARQUEE =====
  // Duplicate content for seamless looping (CSS handles the animation,
  // this just ensures enough content for wide screens)
  const announceBar = document.querySelector('.announce-bar');
  if (announceBar) {
    const inner = announceBar.innerHTML;
    // Only duplicate if the bar looks short — rough check
    if (window.innerWidth > 1200) {
      announceBar.innerHTML = inner + '<span class="divider">|</span>' + inner;
    }
  }

});

// ===== CART BADGE SYNC (from localStorage) =====
document.addEventListener('DOMContentLoaded', () => {
  // Sync cart count from localStorage on index page
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    try {
      const savedCart = JSON.parse(localStorage.getItem('vibecart_cart')) || [];
      const total = savedCart.reduce((s, i) => s + i.qty, 0);
      cartCountEl.textContent = total;
      cartCountEl.style.display = total > 0 ? 'flex' : 'none';
    } catch {}

    // Animate cart bump
    cartCountEl.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Override global addToCart for index.html (no cart drawer on index)
    window.addToCart = function() {
      try {
        const savedCart = JSON.parse(localStorage.getItem('vibecart_cart')) || [];
        const total = savedCart.reduce((s, i) => s + i.qty, 0);
        cartCountEl.textContent = total + 1;
        cartCountEl.style.display = 'flex';
        cartCountEl.style.transform = 'scale(1.4)';
        setTimeout(() => { cartCountEl.style.transform = ''; }, 200);
      } catch {}
    };
  }
});

