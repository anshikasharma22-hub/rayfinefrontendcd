/* ═══════════════════════════════════════════════════════════════
   PREMIUM LUXURY STORE — app.js
   Sections: Shop by Occasion · Categories · Trending · Bestsellers
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   CURRENCY CONFIG
   ───────────────────────────────────────── */
const CURRENCIES = {
  INR: { symbol: '₹', rate: 1,       label: 'INR' },
  USD: { symbol: '$', rate: 0.012,   label: 'USD' },
  GBP: { symbol: '£', rate: 0.0094,  label: 'GBP' },
  EUR: { symbol: '€', rate: 0.011,   label: 'EUR' },
  AED: { symbol: 'د.إ', rate: 0.044, label: 'AED' },
  SAR: { symbol: 'ر.س', rate: 0.045, label: 'SAR' },
  SGD: { symbol: 'S$', rate: 0.016,  label: 'SGD' },
  CAD: { symbol: 'C$', rate: 0.016,  label: 'CAD' },
  AUD: { symbol: 'A$', rate: 0.018,  label: 'AUD' },
  MYR: { symbol: 'RM', rate: 0.056,  label: 'MYR' },
  QAR: { symbol: 'ر.ق', rate: 0.044, label: 'QAR' },
  KWD: { symbol: 'د.ك', rate: 0.0037,label: 'KWD' },
};

let currentCurrency = 'INR';

function convertPrice(inrPrice) {
  const c = CURRENCIES[currentCurrency];
  const converted = inrPrice * c.rate;
  return c.symbol + (converted < 10
    ? converted.toFixed(2)
    : Math.round(converted).toLocaleString());
}

function formatINR(price) {
  return '₹' + Math.round(price).toLocaleString('en-IN');
}

/* ─────────────────────────────────────────
   PRODUCT DATA
   ───────────────────────────────────────── */
const PRODUCTS = [
  // ── Trending ──
  {
    id: 1, name: 'Kundan Polki Necklace Set',
    price: 4850, originalPrice: 6200,
    category: 'Necklaces', occasion: 'Bridal',
    section: 'trending',
    badge: 'Trending',
    desc: 'Handcrafted Kundan polki with meenakari work, 22k gold plating',
    img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80',
  },
  {
    id: 2, name: 'Emerald Drop Earrings',
    price: 2150, originalPrice: 2800,
    category: 'Earrings', occasion: 'Festive',
    section: 'trending',
    badge: 'New',
    desc: 'Statement emerald drops with diamond-cut bezel setting',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
  },
  {
    id: 3, name: 'Pearl Choker with Pendant',
    price: 1890, originalPrice: 2400,
    category: 'Necklaces', occasion: 'Casual',
    section: 'trending',
    badge: 'Sale',
    desc: 'South Sea pearls hand-strung with sterling silver pendant',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
  },
  {
    id: 4, name: 'Jadau Bangles Set of 4',
    price: 3600, originalPrice: 4500,
    category: 'Bangles', occasion: 'Bridal',
    section: 'trending',
    badge: 'Hot',
    desc: 'Traditional Jadau work bangles with ruby & emerald inserts',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
  },
  {
    id: 5, name: 'Antique Gold Maang Tikka',
    price: 1350, originalPrice: 1800,
    category: 'Hair Accessories', occasion: 'Bridal',
    section: 'trending',
    badge: 'Trending',
    desc: 'Rajasthani antique gold finish with uncut diamonds',
    img: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80',
  },
  {
    id: 6, name: 'Sapphire Tennis Bracelet',
    price: 2750, originalPrice: 3400,
    category: 'Bracelets', occasion: 'Party',
    section: 'trending',
    badge: 'New',
    desc: 'Ceylon blue sapphires in a continuous prong setting',
    img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b1?w=500&q=80',
  },
  {
    id: 7, name: 'Temple Jewellery Haram',
    price: 5200, originalPrice: 6800,
    category: 'Necklaces', occasion: 'Festive',
    section: 'trending',
    badge: 'Exclusive',
    desc: 'South Indian temple-style haram with deity motifs',
    img: 'https://images.unsplash.com/photo-1601121141461-9d6647bef0e3?w=500&q=80',
  },
  {
    id: 8, name: 'Diamond Nose Ring',
    price: 980, originalPrice: 1200,
    category: 'Nose Pins', occasion: 'Daily Wear',
    section: 'trending',
    badge: 'Sale',
    desc: 'Solitaire diamond nose pin in 18k white gold setting',
    img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80',
  },

  // ── Bestsellers ──
  {
    id: 9, name: 'Bridal Kundan Choker',
    price: 6500, originalPrice: 8500,
    category: 'Necklaces', occasion: 'Bridal',
    section: 'bestseller',
    badge: '#1 Bestseller',
    desc: 'Our signature bridal piece — ordered 2,400+ times',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
  },
  {
    id: 10, name: 'Gold Jhumka Earrings',
    price: 1650, originalPrice: 2100,
    category: 'Earrings', occasion: 'Festive',
    section: 'bestseller',
    badge: 'Top Seller',
    desc: 'Classic jhumkas with ghungroo detailing — a wardrobe staple',
    img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80',
  },
  {
    id: 11, name: 'Polki Diamond Ring',
    price: 3200, originalPrice: 4100,
    category: 'Rings', occasion: 'Engagement',
    section: 'bestseller',
    badge: 'Top Seller',
    desc: 'Uncut polki diamonds in a vintage-inspired halo setting',
    img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
  },
  {
    id: 12, name: 'Meenakari Kada Pair',
    price: 2900, originalPrice: 3700,
    category: 'Bangles', occasion: 'Festive',
    section: 'bestseller',
    badge: '#2 Bestseller',
    desc: 'Vibrant Rajasthani meenakari on 22k gold-plated brass',
    img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b1?w=500&q=80',
  },
  {
    id: 13, name: 'Layered Mangalsutra',
    price: 2200, originalPrice: 2800,
    category: 'Necklaces', occasion: 'Daily Wear',
    section: 'bestseller',
    badge: 'Top Seller',
    desc: 'Contemporary layered mangalsutra in oxidised silver and gold',
    img: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80',
  },
  {
    id: 14, name: 'Antique Silver Payal',
    price: 1100, originalPrice: 1500,
    category: 'Anklets', occasion: 'Casual',
    section: 'bestseller',
    badge: '#3 Bestseller',
    desc: 'Oxidised silver anklets with ghungroo bells — loved by thousands',
    img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80',
  },
  {
    id: 15, name: 'Ruby Chandbali Set',
    price: 3850, originalPrice: 5000,
    category: 'Earrings', occasion: 'Bridal',
    section: 'bestseller',
    badge: 'Top Seller',
    desc: 'Deep red rubies set in chandbali style with pearl drops',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
  },
  {
    id: 16, name: 'Tanzanite Cocktail Ring',
    price: 4200, originalPrice: 5500,
    category: 'Rings', occasion: 'Party',
    section: 'bestseller',
    badge: 'Fan Favourite',
    desc: 'Statement tanzanite in a pavé diamond cocktail setting',
    img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80',
  },
];

/* ─────────────────────────────────────────
   CART STATE
   ───────────────────────────────────────── */
let cart = [];
let wishlist = [];

// Safe localStorage access (SSR / build safe)
function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; }
}
function saveCart() { try { localStorage.setItem('luxCart', JSON.stringify(cart)); } catch {} }
function saveWishlist() { try { localStorage.setItem('luxWishlist', JSON.stringify(wishlist)); } catch {} }

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += 1; } else { cart.push({ ...product, qty: 1 }); }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) { removeFromCart(productId); return; }
  saveCart();
  updateCartUI();
  renderCartItems();
}

function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx === -1) { wishlist.push(productId); } else { wishlist.splice(idx, 1); }
  saveWishlist();
  document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', wishlist.includes(productId));
    btn.textContent = wishlist.includes(productId) ? '♥' : '♡';
  });
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
  const wishCount = wishlist.length;
  document.querySelectorAll('.wishlist-count').forEach(el => {
    el.textContent = wishCount;
    el.style.display = wishCount > 0 ? 'flex' : 'none';
  });
}

/* ─────────────────────────────────────────
   TOAST
   ───────────────────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.lux-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'lux-toast';
  toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> ${message}`;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '100px', left: '50%',
    transform: 'translateX(-50%)',
    background: type === 'success' ? '#2C2418' : '#B07A5A',
    color: '#fff', padding: '12px 28px', borderRadius: '2px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
    letterSpacing: '1.5px', zIndex: '99999',
    boxShadow: '0 12px 40px rgba(44,36,24,0.25)',
    animation: 'slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    whiteSpace: 'nowrap',
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 2200);
  setTimeout(() => toast.remove(), 2500);
}

/* ─────────────────────────────────────────
   ANNOUNCEMENT BAR
   ───────────────────────────────────────── */
const ANNOUNCEMENTS = [
  'Free Shipping on orders above ₹999',
  'Authentic Handcrafted Jewellery',
  'Easy Returns within 7 Days',
  'COD Available Across India',
  'BIS Hallmarked Gold Jewellery',
];
let announcementIndex = 0;

function initAnnouncement() {
  const el = document.querySelector('.announcement-text');
  if (!el) return;
  el.textContent = ANNOUNCEMENTS[announcementIndex];
  setInterval(() => {
    announcementIndex = (announcementIndex + 1) % ANNOUNCEMENTS.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = ANNOUNCEMENTS[announcementIndex];
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '1';
    }, 300);
  }, 3500);
}

/* ─────────────────────────────────────────
   WORLDWIDE MARQUEE
   ───────────────────────────────────────── */
function initMarquee() {
  const track = document.querySelector('.worldwide-track');
  if (!track) return;
  const cities = [
    '🇮🇳 Mumbai','🇮🇳 Delhi','🇮🇳 Jaipur','🇮🇳 Hyderabad',
    '🇦🇪 Dubai','🇸🇬 Singapore','🇺🇸 New York','🇬🇧 London',
    '🇨🇦 Toronto','🇦🇺 Sydney','🇩🇪 Berlin','🇫🇷 Paris',
    '🇶🇦 Doha','🇰🇼 Kuwait City','🇲🇾 Kuala Lumpur','🇸🇦 Riyadh',
  ];
  const double = [...cities, ...cities];
  track.innerHTML = double.map(c => `<span>${c}</span>`).join('');
}

/* ─────────────────────────────────────────
   HERO SLIDER
   ───────────────────────────────────────── */
const HERO_SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1601121141461-9d6647bef0e3?w=1400&q=90',
    sub: 'Bridal 2025 Collection',
    title: 'Where Every<br><span>Jewel</span> Tells<br>a Story',
    desc: 'Handcrafted heritage jewellery for the woman who carries tradition forward.',
    btn1: 'Shop Bridal', btn2: 'Explore All',
  },
  {
    bg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=90',
    sub: 'Festive Glow',
    title: 'Adorn Your<br>Most <span>Radiant</span><br>Moments',
    desc: 'Curated festive sets in Kundan, Polki and 22k gold-plated brass.',
    btn1: 'Shop Festive', btn2: 'New Arrivals',
  },
  {
    bg: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=90',
    sub: 'Everyday Luxury',
    title: 'Fine Craft<br>for <span>Daily</span><br>Elegance',
    desc: 'Lightweight, wearable jewellery that moves with you, every single day.',
    btn1: 'Shop Daily Wear', btn2: 'View Lookbook',
  },
];
let heroIndex = 0;
let heroInterval;

function renderHeroSlides() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  HERO_SLIDES.forEach((slide, i) => {
    const bg = document.createElement('div');
    bg.className = `hero-bg ${i === 0 ? 'active' : 'inactive'}`;
    bg.style.backgroundImage = `url('${slide.bg}')`;
    hero.insertBefore(bg, hero.firstChild);
  });
  const overlay = hero.querySelector('.hero-overlay');
  if (overlay) updateHeroOverlay(overlay, HERO_SLIDES[0]);
  const dotsWrap = hero.querySelector('.hero-dots');
  if (dotsWrap) {
    dotsWrap.innerHTML = HERO_SLIDES.map((_, i) =>
      `<div class="dot ${i === 0 ? 'active' : ''}" data-i="${i}"></div>`
    ).join('');
    dotsWrap.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(+dot.dataset.i));
    });
  }
}

function updateHeroOverlay(overlay, slide) {
  const h1 = overlay.querySelector('h1');
  const desc = overlay.querySelector('.hero-desc');
  const sub = overlay.querySelector('.hero-sub');
  const btns = overlay.querySelectorAll('.hero-btns a, .hero-btns button');
  if (h1) { h1.style.opacity = '0'; setTimeout(() => { h1.innerHTML = slide.title; h1.style.opacity = '1'; h1.style.transition = 'opacity 0.6s'; }, 200); }
  if (desc) { desc.style.opacity = '0'; setTimeout(() => { desc.textContent = slide.desc; desc.style.opacity = '1'; desc.style.transition = 'opacity 0.6s'; }, 300); }
  if (sub) { sub.textContent = slide.sub; }
  if (btns[0]) btns[0].textContent = slide.btn1;
  if (btns[1]) btns[1].textContent = slide.btn2;
}

function goToSlide(idx) {
  const bgs = document.querySelectorAll('.hero-bg');
  const dots = document.querySelectorAll('.hero-dots .dot');
  const overlay = document.querySelector('.hero-overlay');
  bgs.forEach((bg, i) => { bg.className = `hero-bg ${i === idx ? 'active' : 'inactive'}`; });
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  if (overlay) updateHeroOverlay(overlay, HERO_SLIDES[idx]);
  heroIndex = idx;
  clearInterval(heroInterval);
  heroInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
  goToSlide((heroIndex + 1) % HERO_SLIDES.length);
}

/* ─────────────────────────────────────────
   CURRENCY SELECTOR
   ───────────────────────────────────────── */
function initCurrencySelector() {
  const actions = document.querySelector('.nav-actions');
  if (!actions) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'currency-wrapper';
  wrapper.style.cssText = `position:relative;`;
  const btn = document.createElement('button');
  btn.className = 'nav-icon currency-btn';
  btn.innerHTML = `<span class="currency-label">${currentCurrency}</span> <span style="font-size:9px;opacity:0.6">▾</span>`;
  btn.title = 'Select currency';
  const dropdown = document.createElement('div');
  dropdown.className = 'currency-dropdown';
  dropdown.style.cssText = `
    display:none; position:absolute; top:calc(100% + 8px); right:0;
    background:#fff; border:1px solid var(--border-light);
    border-radius:4px; min-width:160px; z-index:9999;
    box-shadow:var(--shadow-3d); padding:6px 0;
    max-height:320px; overflow-y:auto;
  `;
  Object.entries(CURRENCIES).forEach(([code, { symbol }]) => {
    const item = document.createElement('button');
    item.style.cssText = `
      display:flex; align-items:center; justify-content:space-between;
      width:100%; padding:9px 16px; background:none; border:none;
      font-family:'DM Sans',sans-serif; font-size:12px; cursor:pointer;
      color:var(--text-muted); letter-spacing:1px; transition:all 0.15s; gap:10px;
    `;
    item.innerHTML = `<span style="font-weight:600;color:var(--text)">${code}</span><span style="opacity:0.6">${symbol}</span>`;
    item.addEventListener('mouseenter', () => item.style.background = 'var(--cream)');
    item.addEventListener('mouseleave', () => item.style.background = 'none');
    item.addEventListener('click', () => {
      currentCurrency = code;
      btn.querySelector('.currency-label').textContent = code;
      dropdown.style.display = 'none';
      refreshPrices();
      showToast(`Currency set to ${code}`, 'info');
    });
    dropdown.appendChild(item);
  });
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', () => { dropdown.style.display = 'none'; });
  wrapper.appendChild(btn);
  wrapper.appendChild(dropdown);
  actions.insertBefore(wrapper, actions.firstChild);
}

function refreshPrices() {
  document.querySelectorAll('[data-inr-price]').forEach(el => {
    const inr = +el.dataset.inrPrice;
    el.textContent = convertPrice(inr);
  });
  renderCartItems();
}

/* ─────────────────────────────────────────
   PRODUCT CARD BUILDER
   ───────────────────────────────────────── */
function buildProductCard(product) {
  const isWished = wishlist.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id;
  card.innerHTML = `
    <div class="product-img-wrap">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      ${product.badge ? `<div class="sale-badge">${product.badge}</div>` : ''}
      <button class="wishlist-btn ${isWished ? 'active' : ''}" data-id="${product.id}" title="Save to wishlist" aria-label="Add to wishlist">${isWished ? '♥' : '♡'}</button>
      <div class="product-category-tag">${product.category}</div>
    </div>
    <div class="product-info">
      <h4>${product.name}</h4>
      <p class="product-desc">${product.desc}</p>
      <div class="price-wrap">
        <span class="price-current" data-inr-price="${product.price}">${convertPrice(product.price)}</span>
        <span class="price-original">${formatINR(product.originalPrice)}</span>
        <span class="price-usd discount-pill">-${discount}%</span>
      </div>
      <button class="btn-add-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  `;
  card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  });
  card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    btn.classList.add('added');
    btn.textContent = '✓ Added';
    addToCart(product.id);
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = 'Add to Cart'; }, 1800);
  });
  return card;
}

/* ─────────────────────────────────────────
   RENDER SECTIONS
   ───────────────────────────────────────── */
function renderTrending() {
  const grid = document.getElementById('trending-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.filter(p => p.section === 'trending').forEach(p => grid.appendChild(buildProductCard(p)));
}

function renderBestsellers() {
  const grid = document.getElementById('bestsellers-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.filter(p => p.section === 'bestseller').forEach(p => grid.appendChild(buildProductCard(p)));
}

/* ─────────────────────────────────────────
   SHOP BY OCCASION SECTION
   ───────────────────────────────────────── */
const OCCASIONS = [
  { name: 'Bridal',      emoji: '💍', img: 'https://images.unsplash.com/photo-1601121141461-9d6647bef0e3?w=500&q=80' },
  { name: 'Festive',     emoji: '🪔', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80' },
  { name: 'Party',       emoji: '✨', img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b1?w=500&q=80' },
  { name: 'Casual',      emoji: '🌸', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' },
  { name: 'Daily Wear',  emoji: '☀️', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80' },
  { name: 'Engagement',  emoji: '💎', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80' },
  { name: 'Anniversary', emoji: '🌹', img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80' },
  { name: 'Gifting',     emoji: '🎁', img: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80' },
];

function buildOccasionSection() {
  const section = document.createElement('section');
  section.className = 'categories-section occasion-section';
  section.id = 'occasion';
  section.style.background = 'var(--bg2)';
  section.innerHTML = `
    <p class="section-subtitle">Dressed for Every Moment</p>
    <h2 class="section-title">Shop by Occasion</h2>
    <div class="section-divider">
      <div class="section-divider-line"></div>
      <div class="section-divider-diamond"></div>
      <div class="section-divider-line"></div>
    </div>
    <div class="occasion-grid" style="
      display:grid; grid-template-columns:repeat(8,1fr);
      gap:14px; max-width:1240px; margin:0 auto; padding:0 24px;
    "></div>
  `;
  const grid = section.querySelector('.occasion-grid');
  OCCASIONS.forEach(occ => {
    const card = document.createElement('a');
    card.href = '#';
    card.className = 'occasion-card';
    card.style.cssText = `
      display:flex; flex-direction:column; align-items:center; gap:12px;
      cursor:pointer; text-decoration:none;
      transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    `;
    card.innerHTML = `
      <div style="
        width:100%; aspect-ratio:1; border-radius:50%; overflow:hidden;
        border:2px solid var(--border-light); position:relative;
        box-shadow:0 6px 20px rgba(176,122,90,0.12);
        transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
        background:var(--cream);
      " class="occ-img-wrap">
        <img src="${occ.img}" alt="${occ.name}" loading="lazy" style="
          width:100%; height:100%; object-fit:cover;
          transition:transform 0.5s ease, filter 0.4s ease;
          filter:brightness(0.85) saturate(0.9);
        ">
        <div style="
          position:absolute; inset:0; background:rgba(176,122,90,0);
          display:flex; align-items:center; justify-content:center;
          transition:background 0.3s; font-size:24px; opacity:0;
        " class="occ-emoji">${occ.emoji}</div>
      </div>
      <span style="
        font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:2px;
        text-transform:uppercase; color:var(--text-muted); text-align:center;
        transition:color 0.25s;
      " class="occ-label">${occ.name}</span>
    `;
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.querySelector('.occ-img-wrap').style.boxShadow = '0 16px 40px rgba(176,122,90,0.25)';
      card.querySelector('.occ-img-wrap').style.borderColor = 'var(--primary)';
      card.querySelector('img').style.transform = 'scale(1.12)';
      card.querySelector('img').style.filter = 'brightness(0.7) saturate(1.1)';
      card.querySelector('.occ-emoji').style.opacity = '1';
      card.querySelector('.occ-emoji').style.background = 'rgba(176,122,90,0.2)';
      card.querySelector('.occ-label').style.color = 'var(--primary)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.querySelector('.occ-img-wrap').style.boxShadow = '0 6px 20px rgba(176,122,90,0.12)';
      card.querySelector('.occ-img-wrap').style.borderColor = 'var(--border-light)';
      card.querySelector('img').style.transform = 'scale(1)';
      card.querySelector('img').style.filter = 'brightness(0.85) saturate(0.9)';
      card.querySelector('.occ-emoji').style.opacity = '0';
      card.querySelector('.occ-label').style.color = 'var(--text-muted)';
    });
    card.addEventListener('click', (e) => {
      e.preventDefault();
      filterByOccasion(occ.name);
      showToast(`Showing ${occ.name} jewellery`, 'info');
      document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    grid.appendChild(card);
  });
  return section;
}

function filterByOccasion(occasion) {
  const tGrid = document.getElementById('trending-grid');
  const bGrid = document.getElementById('bestsellers-grid');
  if (tGrid) {
    tGrid.innerHTML = '';
    PRODUCTS.filter(p => p.section === 'trending' && (occasion === 'All' || p.occasion === occasion))
      .forEach(p => tGrid.appendChild(buildProductCard(p)));
  }
  if (bGrid) {
    bGrid.innerHTML = '';
    PRODUCTS.filter(p => p.section === 'bestseller' && (occasion === 'All' || p.occasion === occasion))
      .forEach(p => bGrid.appendChild(buildProductCard(p)));
  }
}

/* ─────────────────────────────────────────
   CATEGORIES SECTION
   ───────────────────────────────────────── */
const CATEGORY_DATA = [
  { name: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' },
  { name: 'Earrings',  img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
  { name: 'Bangles',   img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80' },
  { name: 'Rings',     img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80' },
];

function populateCategoriesGrid() {
  const grid = document.querySelector('.categories-grid, .cat-square-grid');
  if (!grid || grid.children.length > 0) return;
  CATEGORY_DATA.forEach(cat => {
    const card = document.createElement('a');
    card.href = '#';
    card.className = grid.classList.contains('cat-square-grid') ? 'cat-square-card' : 'category-card';
    if (grid.classList.contains('cat-square-grid')) {
      card.innerHTML = `
        <img src="${cat.img}" alt="${cat.name}" loading="lazy">
        <div class="cat-square-overlay">
          <span class="cat-square-name">${cat.name}</span>
          <span class="cat-square-cta">Explore</span>
        </div>
      `;
    } else {
      card.innerHTML = `
        <img src="${cat.img}" alt="${cat.name}" loading="lazy">
        <div class="category-overlay">
          <span>${cat.name}</span>
          <span class="category-explore">Explore →</span>
        </div>
      `;
    }
    grid.appendChild(card);
  });
}

/* ─────────────────────────────────────────
   CART DRAWER
   ───────────────────────────────────────── */
function renderCartItems() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  const body = drawer.querySelector('.cart-items-body');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty" style="padding:80px 24px;text-align:center;color:var(--text-muted);">
        <div style="font-size:42px;margin-bottom:16px;opacity:0.3;">🛍</div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--text-muted);">Your cart is empty</p>
        <p style="font-size:11px;letter-spacing:2px;margin-top:8px;text-transform:uppercase;color:var(--text-light);">Discover something beautiful</p>
      </div>`;
    updateCartFooter(drawer);
    return;
  }
  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price" data-inr-price="${item.price}">${convertPrice(item.price)}</div>
        ${currentCurrency !== 'INR' ? `<div class="cart-item-original">${formatINR(item.price)}</div>` : ''}
        <div class="qty-controls">
          <button class="qty-dec" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="qty-inc" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" title="Remove">×</button>
    </div>
  `).join('');
  body.querySelectorAll('.qty-inc').forEach(b => b.addEventListener('click', () => updateQty(+b.dataset.id, 1)));
  body.querySelectorAll('.qty-dec').forEach(b => b.addEventListener('click', () => updateQty(+b.dataset.id, -1)));
  body.querySelectorAll('.cart-item-remove').forEach(b => b.addEventListener('click', () => removeFromCart(+b.dataset.id)));
  updateCartFooter(drawer);
}

function updateCartFooter(drawer) {
  const footer = drawer.querySelector('.cart-footer');
  if (!footer) return;
  const totalINR = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalOrigINR = cart.reduce((s, i) => s + i.originalPrice * i.qty, 0);
  const savings = totalOrigINR - totalINR;
  if (cart.length === 0) { footer.style.display = 'none'; return; }
  footer.style.display = 'block';
  footer.innerHTML = `
    ${savings > 0 ? `<div class="cart-savings">🎉 You're saving ${formatINR(savings)} on this order!</div>` : ''}
    <div class="cart-total">
      <span>Total</span>
      <strong data-inr-price="${totalINR}">${convertPrice(totalINR)}</strong>
    </div>
    <button class="btn-checkout" onclick="window.showCheckoutForm()">Proceed to Checkout</button>
    <button class="btn-ghost" onclick="window.closeCart()">Continue Shopping</button>
  `;
}

function buildCartDrawer() {
  const existing = document.querySelector('.cart-drawer');
  if (existing) {
    if (!existing.querySelector('.cart-items-body')) {
      existing.innerHTML = `
        <div class="cart-header">
          <h3>Your Cart</h3>
          <button class="cart-close" onclick="window.closeCart()">×</button>
        </div>
        <div class="cart-items-body" style="overflow-y:auto;flex:1;"></div>
        <div class="cart-footer" style="display:none;padding:20px 24px;border-top:1px solid var(--border-light);background:linear-gradient(135deg,var(--cream) 0%,#f9f4eb 100%);"></div>
      `;
    }
    renderCartItems();
    return;
  }
  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.addEventListener('click', closeCart);
  const drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-header">
      <h3>Your Cart</h3>
      <button class="cart-close" onclick="window.closeCart()">×</button>
    </div>
    <div class="cart-items-body" style="overflow-y:auto;flex:1;"></div>
    <div class="cart-footer" style="display:none;padding:20px 24px;border-top:1px solid var(--border-light);background:linear-gradient(135deg,var(--cream) 0%,#f9f4eb 100%);"></div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  renderCartItems();
}

function openCart() {
  document.querySelector('.cart-overlay')?.classList.add('show');
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartItems();
}

function closeCart() {
  document.querySelector('.cart-overlay')?.classList.remove('show');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────
   CHECKOUT FORM
   ───────────────────────────────────────── */
function showCheckoutForm() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  drawer.innerHTML = `
    <div class="cart-header">
      <h3>Checkout</h3>
      <button class="cart-close" onclick="window.closeCart()">×</button>
    </div>
    <div class="checkout-form" style="padding:22px 24px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:12px;">
      <div class="order-summary">
        <h5>Order Summary</h5>
        ${cart.map(i => `
          <div class="order-summary-item">
            <span>${i.name} × ${i.qty}</span>
            <span data-inr-price="${i.price * i.qty}">${convertPrice(i.price * i.qty)}</span>
          </div>
        `).join('')}
        <div class="order-summary-total">
          <span>Total</span>
          <span data-inr-price="${cart.reduce((s,i)=>s+i.price*i.qty,0)}">${convertPrice(cart.reduce((s,i)=>s+i.price*i.qty,0))}</span>
        </div>
      </div>
      <input type="text" placeholder="Full Name" autocomplete="name">
      <input type="email" placeholder="Email Address" autocomplete="email">
      <input type="tel" placeholder="Phone Number" autocomplete="tel">
      <input type="text" placeholder="Complete Address" autocomplete="street-address">
      <input type="text" placeholder="City" autocomplete="address-level2">
      <input type="text" placeholder="PIN Code" autocomplete="postal-code">
      <button class="btn-checkout" onclick="window.placeOrder()">Place Order</button>
      <button class="btn-ghost" onclick="buildCartDrawer();openCart()">← Back to Cart</button>
    </div>
  `;
}

function placeOrder() {
  const inputs = document.querySelectorAll('.checkout-form input');
  for (const inp of inputs) {
    if (!inp.value.trim()) { inp.focus(); inp.style.borderColor = 'var(--primary)'; showToast('Please fill all fields', 'info'); return; }
  }
  const total = convertPrice(cart.reduce((s,i)=>s+i.price*i.qty,0));
  cart = [];
  saveCart();
  updateCartUI();
  const drawer = document.querySelector('.cart-drawer');
  if (drawer) {
    drawer.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center;">
        <div style="font-size:48px;margin-bottom:20px;">🎉</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:300;font-style:italic;color:var(--text);margin-bottom:12px;">Order Confirmed!</h3>
        <p style="color:var(--text-muted);font-size:13px;line-height:1.8;margin-bottom:8px;">Thank you for your order.</p>
        <p style="color:var(--primary);font-size:14px;font-weight:600;margin-bottom:24px;">Total: ${total}</p>
        <p style="color:var(--text-light);font-size:11px;letter-spacing:2px;text-transform:uppercase;">You'll receive a confirmation shortly</p>
        <button class="btn-checkout" style="margin-top:28px;max-width:200px;" onclick="window.closeCart()">Continue Shopping</button>
      </div>
    `;
  }
  showToast('Order placed successfully!');
}

/* ─────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────── */
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });
  }
  document.querySelectorAll('.cart-icon, .nav-icon[data-action="cart"]').forEach(btn => {
    btn.addEventListener('click', openCart);
  });
  const sections = ['home', 'occasion', 'categories', 'trending', 'bestsellers', 'about', 'contact'];
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    document.querySelectorAll('.nav-links a[href]').forEach(link => {
      const id = link.getAttribute('href')?.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        link.classList.toggle('active', scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight);
      }
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────
   SHOP PAGE
   ───────────────────────────────────────── */
function initShopPage() {
  const searchEl = document.querySelector('.shop-search');
  const sortEl = document.querySelector('.shop-sort');
  const shopGrid = document.getElementById('shop-grid');
  if (!shopGrid) return;
  let activeCategory = 'All';
  function renderShopGrid(products) {
    shopGrid.innerHTML = '';
    products.forEach(p => shopGrid.appendChild(buildProductCard(p)));
    if (products.length === 0) {
      shopGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic;">No jewels found</div>`;
    }
  }
  function getFilteredProducts() {
    let list = [...PRODUCTS];
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    const q = searchEl?.value.toLowerCase().trim();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    const sort = sortEl?.value;
    if (sort === 'price-asc') list.sort((a,b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
    else if (sort === 'discount') list.sort((a,b) => (b.originalPrice - b.price) - (a.originalPrice - a.price));
    return list;
  }
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.cat || 'All';
      renderShopGrid(getFilteredProducts());
    });
  });
  searchEl?.addEventListener('input', () => renderShopGrid(getFilteredProducts()));
  sortEl?.addEventListener('change', () => renderShopGrid(getFilteredProducts()));
  renderShopGrid(getFilteredProducts());
}

/* ─────────────────────────────────────────
   CHATBOT
   ───────────────────────────────────────── */
const CHAT_REPLIES = [
  ['bridal', 'Our bridal collection features handcrafted Kundan Polki sets, temple jewellery harems, and gold-plated bangles. Shall I show you our top bridal picks?'],
  ['price|cost|how much', 'Our pieces start from ₹980. We offer EMI options and COD across India. Would you like to know about a specific piece?'],
  ['delivery|shipping|ship', 'We offer free shipping on orders above ₹999. Standard delivery takes 3–5 business days. Express delivery is available in select cities.'],
  ['return|exchange|refund', 'We offer hassle-free returns within 7 days of delivery. All pieces come with an authenticity certificate.'],
  ['gold|silver|material', 'Our jewellery uses 22k gold-plated brass, sterling silver, and certified gemstones. All gold pieces are BIS hallmarked.'],
  ['discount|offer|sale', 'We currently have up to 30% off on select pieces! Use code LUXE10 for an extra 10% on your first order.'],
  ['contact|help|support', 'You can reach us at +91-XXXX-XXXX or via WhatsApp. Our team is available 9am–7pm IST, 7 days a week.'],
];

function getChatReply(input) {
  const lower = input.toLowerCase();
  for (const [pattern, reply] of CHAT_REPLIES) {
    if (new RegExp(pattern).test(lower)) return reply;
  }
  return 'Thank you for reaching out! Our team will get back to you shortly. You can also WhatsApp us for instant support. 💎';
}

function initChatbot() {
  const chatBtn = document.querySelector('.chat-float-btn');
  if (!chatBtn) return;
  let chatOpen = false;
  let chatContainer = null;
  chatBtn.addEventListener('click', () => {
    if (chatOpen && chatContainer) {
      chatContainer.remove(); chatContainer = null; chatOpen = false; chatBtn.textContent = '💬'; return;
    }
    chatOpen = true; chatBtn.textContent = '✕';
    chatContainer = document.createElement('div');
    chatContainer.className = 'chatbot-container';
    chatContainer.innerHTML = `
      <div class="chat-header">
        <span>✦ Jewellery Assistant</span>
        <span style="opacity:0.6;font-size:10px;margin-left:auto;">Online</span>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="msg bot">Namaste! 💎 I'm here to help you find the perfect piece. Ask me about bridal sets, pricing, delivery, or anything else!</div>
      </div>
      <div class="chat-input">
        <input type="text" id="chatInput" placeholder="Ask about our jewellery…" autocomplete="off">
        <button id="chatSend">➤</button>
      </div>
    `;
    document.body.appendChild(chatContainer);
    const body = chatContainer.querySelector('#chatBody');
    const input = chatContainer.querySelector('#chatInput');
    const send = chatContainer.querySelector('#chatSend');
    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      const userMsg = document.createElement('div');
      userMsg.className = 'msg user'; userMsg.textContent = text;
      body.appendChild(userMsg);
      const typing = document.createElement('div');
      typing.className = 'msg bot typing'; typing.textContent = '…';
      body.appendChild(typing); body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        typing.remove();
        const botMsg = document.createElement('div');
        botMsg.className = 'msg bot'; botMsg.textContent = getChatReply(text);
        body.appendChild(botMsg); body.scrollTop = body.scrollHeight;
      }, 800 + Math.random() * 400);
    }
    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll(
    '.product-card, .category-card, .cat-square-card, .testimonial-card, .stat-box, .trust-item, .occasion-card, .platform-item'
  );
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform?.replace('translateY(28px)', '') || '';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(el);
  });
}

/* ─────────────────────────────────────────
   3D TILT EFFECT
   ───────────────────────────────────────── */
function initTiltEffect() {
  const cards = document.querySelectorAll('.product-card, .category-card, .cat-square-card, .testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (-y / rect.height) * 6;
      const rotY = (x / rect.width) * 6;
      card.style.transform = `translateY(-8px) scale(1.01) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
    });
  });
}

/* ─────────────────────────────────────────
   INJECT BESTSELLERS SECTION
   ───────────────────────────────────────── */
function injectBestsellersSection() {
  if (document.getElementById('bestsellers')) return;
  const trendingSection = document.getElementById('trending')
    || document.querySelector('.featured-section')
    || document.querySelector('[id*="trend"]');
  const section = document.createElement('section');
  section.id = 'bestsellers';
  section.className = 'featured-section bestsellers-main-section';
  section.style.background = 'var(--bg)';
  section.innerHTML = `
    <p class="section-subtitle">Loved by Thousands</p>
    <h2 class="section-title">Our Bestsellers</h2>
    <div class="section-divider">
      <div class="section-divider-line"></div>
      <div class="section-divider-diamond"></div>
      <div class="section-divider-line"></div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:36px;flex-wrap:wrap;">
      <span style="font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--text-muted);">Sorted by</span>
      <span style="background:var(--primary);color:#fff;padding:4px 14px;border-radius:2px;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-family:'DM Sans',sans-serif;font-weight:600;">Customer Orders</span>
    </div>
    <div class="products-grid" id="bestsellers-grid" style="padding:0 40px 56px;"></div>
  `;
  if (trendingSection && trendingSection.nextSibling) {
    trendingSection.parentNode.insertBefore(section, trendingSection.nextSibling);
  } else if (trendingSection) {
    trendingSection.parentNode.appendChild(section);
  } else {
    const footer = document.querySelector('.footer');
    if (footer) footer.parentNode.insertBefore(section, footer);
    else document.body.appendChild(section);
  }
  renderBestsellers();
}

/* ─────────────────────────────────────────
   INJECT OCCASION SECTION
   ───────────────────────────────────────── */
function injectOccasionSection() {
  if (document.getElementById('occasion')) return;
  const categoriesSection = document.querySelector('.categories-section')
    || document.querySelector('[id*="categor"]');
  const occasionSection = buildOccasionSection();
  if (categoriesSection) {
    categoriesSection.parentNode.insertBefore(occasionSection, categoriesSection);
  } else {
    const hero = document.querySelector('.hero');
    if (hero && hero.nextSibling) {
      hero.parentNode.insertBefore(occasionSection, hero.nextSibling);
    } else {
      document.body.insertBefore(occasionSection, document.body.firstChild);
    }
  }
}

/* ─────────────────────────────────────────
   EXTRA STYLES
   ───────────────────────────────────────── */
function injectExtraStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .discount-pill {
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9) !important;
      color: #2e7d32 !important; border: none !important;
      font-weight: 700 !important; font-size: 10px !important;
      padding: 2px 8px !important; border-radius: 20px !important;
      letter-spacing: 0.5px !important;
    }
    .currency-btn .currency-label {
      font-size: 10px; letter-spacing: 2px; font-weight: 600;
      color: var(--text-muted); font-family: 'DM Sans', sans-serif;
    }
    @media (max-width: 900px) {
      .occasion-section .occasion-grid { grid-template-columns: repeat(4, 1fr) !important; }
    }
    @media (max-width: 480px) {
      .occasion-section .occasion-grid {
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 10px !important; padding: 0 12px !important;
      }
    }
    .cart-items-body { scrollbar-width: thin; scrollbar-color: var(--primary) var(--cream); }
    .wishlist-count, .cart-count {
      position: absolute; top: 2px; right: 2px;
      background: var(--primary); color: #fff;
      font-size: 9px; font-weight: 600;
      width: 15px; height: 15px; border-radius: 50%;
      align-items: center; justify-content: center;
      border: 1.5px solid #fff;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────
   BIND CART ICON
   ───────────────────────────────────────── */
function bindCartIcon() {
  document.querySelectorAll('.nav-icon').forEach(btn => {
    if (btn.querySelector('.badge') || btn.innerHTML.includes('🛍') || btn.innerHTML.includes('bag') || btn.innerHTML.includes('cart')) {
      btn.addEventListener('click', openCart);
    }
  });
}

/* ─────────────────────────────────────────
   CLEAN SALE BANNER
   ───────────────────────────────────────── */
function cleanSaleBanner() {
  document.querySelectorAll('.sale-banner, .announcement-bar, .footer-top, .worldwide-strip, [class*="strip"]').forEach(el => {
    if (/available\s+(on|in)\s+the?\s+us/i.test(el.innerHTML)) {
      el.innerHTML = el.innerHTML.replace(/available\s+(on|in)\s+the?\s+us/gi, '').replace(/\s{2,}/g, ' ');
    }
  });
}

/* ─────────────────────────────────────────
   MAIN INIT
   ───────────────────────────────────────── */
function init() {
  // Load persisted cart/wishlist safely
  cart = loadFromStorage('luxCart', []);
  wishlist = loadFromStorage('luxWishlist', []);

  injectExtraStyles();
  cleanSaleBanner();
  initAnnouncement();
  initMarquee();
  renderHeroSlides();
  heroInterval = setInterval(nextSlide, 5000);
  injectOccasionSection();
  populateCategoriesGrid();
  renderTrending();
  injectBestsellersSection();
  buildCartDrawer();
  initCurrencySelector();
  bindCartIcon();
  initNavbar();
  initShopPage();
  initChatbot();
  setTimeout(() => {
    initScrollReveal();
    initTiltEffect();
  }, 200);
  updateCartUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ─────────────────────────────────────────
   EXPOSE GLOBALS
   ───────────────────────────────────────── */
if (typeof window !== 'undefined') {
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.addToCart = addToCart;
  window.showCheckoutForm = showCheckoutForm;
  window.placeOrder = placeOrder;
  window.toggleWishlist = toggleWishlist;
}

/* ─────────────────────────────────────────
   REACT EXPORT — keeps React build happy
   This file is vanilla JS injected via
   index.html <script>, but React's build
   system needs a default export from App.js
   ───────────────────────────────────────── */
function App() { return null; }
export default App;
