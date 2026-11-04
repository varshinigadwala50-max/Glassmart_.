(() => {
'use strict';

/* ================= constants ================= */
const KEY = 'glassmart:data:v1', SKEY = 'glassmart:session:v1', TKEY = 'glassmart:theme';
const CATS = ['Beauty', 'Skincare', 'Healthcare', 'Electronics', 'Pharmacy', 'General', 'Fashion', 'Home'];
const CAT_ICON = { Beauty: '💄', Skincare: '🧴', Healthcare: '🩺', Electronics: '🎧', Pharmacy: '💊', General: '🛍️', Fashion: '👕', Home: '🏠' };
const CAT_HUE = { Beauty: 330, Skincare: 160, Healthcare: 200, Electronics: 250, Pharmacy: 10, General: 40, Fashion: 280, Home: 100 };
const DAY = 864e5;
const CITIES = {
  Mumbai: [19.076, 72.8777], Delhi: [28.6139, 77.209], Bengaluru: [12.9716, 77.5946], Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707], Kolkata: [22.5726, 88.3639], Pune: [18.5204, 73.8567], Ahmedabad: [23.0225, 72.5714],
  Jaipur: [26.9124, 75.7873], Lucknow: [26.8467, 80.9462], Surat: [21.1702, 72.8311], Kanpur: [26.4499, 80.3319],
  Nagpur: [21.1458, 79.0882], Indore: [22.7196, 75.8577], Bhopal: [23.2599, 77.4126], Patna: [25.5941, 85.1376],
  Vadodara: [22.3072, 73.1812], Ludhiana: [30.901, 75.8573], Agra: [27.1767, 78.0081], Nashik: [19.9975, 73.7898],
  Coimbatore: [11.0168, 76.9558], Kochi: [9.9312, 76.2673], Visakhapatnam: [17.6868, 83.2185], Chandigarh: [30.7333, 76.7794],
  Guwahati: [26.1445, 91.7362], Bhubaneswar: [20.2961, 85.8245], Thiruvananthapuram: [8.5241, 76.9366], Mysuru: [12.2958, 76.6394],
  Gurugram: [28.4595, 77.0266], Noida: [28.5355, 77.391], Varanasi: [25.3176, 82.9739], Amritsar: [31.634, 74.8723],
  Ranchi: [23.3441, 85.3096], Raipur: [21.2514, 81.6296], Dehradun: [30.3165, 78.0322], Panaji: [15.4909, 73.8278], Madurai: [9.9252, 78.1198]
};

const SAMPLES = [
  { name: 'Radiance Vitamin C Serum', category: 'Skincare', brand: 'PureLeaf', price: 899, discount: 20, stock: 40, sizes: ['30ml', '50ml'], colors: [], desc: 'Brightening serum with 15% vitamin C and hyaluronic acid.' },
  { name: 'Matte Velvet Lipstick', category: 'Beauty', brand: 'Aurora', price: 499, discount: 0, stock: 60, sizes: [], colors: ['Rose', 'Ruby', 'Nude'], desc: 'Long-wear matte finish, smudge-proof for 12 hours.' },
  { name: 'Digital Blood Pressure Monitor', category: 'Healthcare', brand: 'VitaCare', price: 2199, discount: 15, stock: 18, sizes: [], colors: ['White'], desc: 'Clinically validated upper-arm monitor with memory for 2 users.' },
  { name: 'Wireless ANC Headphones', category: 'Electronics', brand: 'SonicWave', price: 5999, discount: 30, stock: 25, sizes: [], colors: ['Black', 'Silver', 'Blue'], desc: '40-hour battery, active noise cancellation, fast charge.' },
  { name: 'Paracetamol 500mg (Strip of 15)', category: 'Pharmacy', brand: 'MediPlus', price: 35, discount: 0, stock: 300, sizes: [], colors: [], desc: 'Fever and pain relief tablets. Use as directed.' },
  { name: 'Smart LED Desk Lamp', category: 'Home', brand: 'HomeNest', price: 1499, discount: 10, stock: 0, sizes: [], colors: ['White', 'Black'], desc: 'Touch dimming, 3 colour temperatures, USB charging port.' },
  { name: 'Everyday Cotton T-Shirt', category: 'Fashion', brand: 'UrbanThread', price: 599, discount: 25, stock: 80, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Navy'], desc: '100% combed cotton, relaxed fit, pre-shrunk.' },
  { name: 'Hydrating Face Moisturiser', category: 'Skincare', brand: 'PureLeaf', price: 649, discount: 10, stock: 55, sizes: ['50g', '100g'], colors: [], desc: 'Lightweight gel-cream for all skin types.' },
  { name: 'Bluetooth Speaker Mini', category: 'Electronics', brand: 'SonicWave', price: 1799, discount: 0, stock: 34, sizes: [], colors: ['Black', 'Red'], desc: 'Waterproof IPX7 speaker with 12 hours of playtime.' },
  { name: 'Multivitamin Tablets (60)', category: 'Healthcare', brand: 'VitaCare', price: 749, discount: 18, stock: 70, sizes: [], colors: [], desc: 'Daily multivitamin with minerals and antioxidants.' },
  { name: 'Reusable Steel Bottle 750ml', category: 'General', brand: 'HomeNest', price: 549, discount: 5, stock: 90, sizes: ['500ml', '750ml', '1L'], colors: ['Steel', 'Teal'], desc: 'Double-wall insulated, keeps drinks cold 24h and hot 12h.' },
  { name: 'Organic Rose Face Mist', category: 'Beauty', brand: 'Aurora', price: 349, discount: 12, stock: 45, sizes: ['100ml'], colors: [], desc: 'Alcohol-free toning mist with rose water.' }
];

/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pad = n => String(n).padStart(2, '0');
const fmtDate = t => new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const uid = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), b => b.toString(16).padStart(2, '0')).join('');
const finalPrice = p => Math.round(p.price * (1 - (p.discount || 0) / 100) * 100) / 100;
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const safeImg = src => (typeof src === 'string' && /^data:image\/(jpeg|png|webp|svg\+xml)[;,]/.test(src)) ? src : '';
const csvList = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 12);

function svgImg(p) {
  const h = CAT_HUE[p.category] ?? 220, icon = CAT_ICON[p.category] || '🛍️';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},80%,70%)"/><stop offset="1" stop-color="hsl(${(h + 50) % 360},75%,45%)"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="100" y="125" font-size="80" text-anchor="middle">${icon}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
const imgOf = p => esc(safeImg(p.image) || svgImg(p));

/* ================= storage ================= */
function mkProduct(sellerId, s, createdAt) {
  return { id: uid(), sellerId, name: s.name, category: s.category, brand: s.brand, price: s.price, discount: s.discount, stock: s.stock, purchased: s.stock, sizes: s.sizes, colors: s.colors, desc: s.desc, image: '', createdAt };
}
function seed() {
  const now = Date.now();
  const d = { v: 1, users: [{ id: 'demo-seller', role: 'seller', name: 'Demo Store', storeName: 'Demo Store', email: 'demo-store@example.invalid', salt: '', hash: '', city: 'Mumbai', address: 'Demo warehouse, Andheri', locked: true }], products: [], orders: [], reviews: [], carts: {} };
  SAMPLES.forEach((s, i) => d.products.push(mkProduct('demo-seller', s, now - i * 1.5 * DAY)));
  const txt = ['Great quality, arrived well packed.', 'Good value for money.', 'Works as described.', 'Loved it, will buy again.', 'Decent, but delivery took a little long.', 'Very happy with this purchase.'];
  [5, 4, 4, 5, 3, 4].forEach((r, i) => d.reviews.push({ id: uid(), productId: d.products[i].id, customerId: 'seed', name: 'Verified buyer', rating: r, text: txt[i], createdAt: now - (i + 1) * DAY }));
  return d;
}
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.v === 1 && Array.isArray(d.users)) return d; } catch (e) { /* fall through */ }
  const d = seed();
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* ignore */ }
  return d;
}
let db = load();
let syncTimer = null;
let syncReady = false;
let syncBusy = false;
function queueServerSync() {
  if (!syncReady) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    try {
      syncBusy = true;
      const response = await fetch('/api/state', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: db })
      });
      if (!response.ok) throw new Error('sync failed');
      const badge = document.querySelector('[data-sync-status]');
      if (badge) badge.textContent = 'Shared data synced';
    } catch (e) {
      const badge = document.querySelector('[data-sync-status]');
      if (badge) badge.textContent = 'Sync unavailable';
      console.warn('GlassMart server sync failed:', e);
    } finally { syncBusy = false; }
  }, 300);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); queueServerSync(); return true; }
  catch (e) { toast('Browser storage is full. Try a smaller image or delete some products.'); return false; }
}
let sessionId = null;
try { sessionId = localStorage.getItem(SKEY); } catch (e) { /* ignore */ }
const me = () => db.users.find(u => u.id === sessionId && !u.locked) || null;
function setSession(id) {
  sessionId = id;
  try { id ? localStorage.setItem(SKEY, id) : localStorage.removeItem(SKEY); } catch (e) { /* ignore */ }
}
const userById = id => db.users.find(u => u.id === id);

/* ================= password hashing (PBKDF2 via WebCrypto) ================= */
const b64e = u8 => btoa(String.fromCharCode(...u8));
const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function hashPw(pw, saltB64) {
  if (!(window.crypto && crypto.subtle)) throw new Error('nocrypto');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: b64d(saltB64), iterations: 210000, hash: 'SHA-256' }, key, 256);
  return b64e(new Uint8Array(bits));
}
function sameStr(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
const fails = {};

/* ================= delivery engine ================= */
const cityKey = c => Object.keys(CITIES).find(k => k.toLowerCase() === String(c || '').trim().toLowerCase());
function distanceKm(a, b) {
  const ka = cityKey(a), kb = cityKey(b);
  if (ka && kb) {
    if (ka === kb) return 15;
    const [la1, lo1] = CITIES[ka], [la2, lo2] = CITIES[kb], R = 6371, rad = Math.PI / 180;
    const dLa = (la2 - la1) * rad, dLo = (lo2 - lo1) * rad;
    const x = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * rad) * Math.cos(la2 * rad) * Math.sin(dLo / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(x)) * 1.25); // 1.25 = road factor
  }
  if (String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase()) return 15;
  return 700; // unknown city: rough estimate
}
const isEstimated = (a, b) => !(cityKey(a) && cityKey(b)) && String(a || '').trim().toLowerCase() !== String(b || '').trim().toLowerCase();
function etaDays(km) { const hi = 1 + Math.ceil(km / 200); return { lo: Math.max(1, hi - 1), hi }; }
function etaText(km) { const { lo, hi } = etaDays(km); return lo === hi ? `${hi} Day${hi > 1 ? 's' : ''}` : `${lo}-${hi} Days`; }
function kmFor(p, cust) { const s = userById(p.sellerId); return s && cust ? distanceKm(s.city, cust.city) : null; }

/* ================= domain helpers ================= */
const reviewsOf = pid => db.reviews.filter(r => r.productId === pid);
function avgRating(pid) { const r = reviewsOf(pid); return r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : 0; }
const getCart = () => { const u = me(); return u ? (db.carts[u.id] || (db.carts[u.id] = [])) : []; };
const cartCount = () => { const u = me(); return u && u.role === 'customer' ? getCart().reduce((a, l) => a + l.qty, 0) : 0; };
const productById = id => db.products.find(p => p.id === id);

function availability(p, cust) {
  if (p.stock <= 0) return '<span class="badge b-bad">Out of Stock</span>';
  if (!cust) return '<span class="badge b-ok">In Stock</span> <span class="text-xs muted">Log in as customer for delivery time</span>';
  const km = kmFor(p, cust);
  if (km == null) return '<span class="badge b-ok">In Stock</span>';
  const s = userById(p.sellerId);
  return `<span class="badge b-ok">Available - Delivered in ${etaText(km)}</span> <span class="text-xs muted">${km} km${isEstimated(s.city, cust.city) ? ' (est.)' : ''}</span>`;
}

/* ================= ui primitives ================= */
let toastT;
function toast(msg) {
  const box = $('#toast'), d = document.createElement('div');
  d.textContent = msg; box.appendChild(d);
  clearTimeout(toastT);
  setTimeout(() => d.remove(), 3200);
}
function openModal(html) { $('#modal').innerHTML = `<div class="modal-back"><div class="glass-strong modal-card" role="dialog" aria-modal="true">${html}</div></div>`; const f = $('#modal input,#modal select,#modal textarea'); if (f) f.focus(); }
function closeModal() { $('#modal').innerHTML = ''; modalImage = undefined; }
let modalImage;

function go(path) { location.hash = '#/' + path; }
const citiesList = `<datalist id="cities">${Object.keys(CITIES).map(c => `<option value="${esc(c)}">`).join('')}</datalist>`;

/* ================= navbar ================= */
function renderNav() {
  const u = me(), cur = location.hash;
  const on = p => cur.startsWith('#/' + p) ? ' on' : '';
  let links = `<a class="nl${cur === '' || cur === '#/' ? ' on' : ''}" href="#/">Home</a>`;
  if (!u || u.role === 'customer') links += `<a class="nl${on('shop')}" href="#/shop">Shop</a>`;
  if (u && u.role === 'customer') {
    links += `<a class="nl${on('orders')}" href="#/orders">My Orders</a><a class="nl${on('profile')}" href="#/profile">Profile</a>`;
    const c = cartCount();
    links += `<a class="nl${on('cart')}" href="#/cart" aria-label="Cart, ${c} items">🛒 Cart${c ? `<span class="count">${c}</span>` : ''}</a>`;
  }
  if (u && u.role === 'seller') links += `<a class="nl${on('seller')}" href="#/seller/overview">Seller Dashboard</a>`;
  if (!u) links += `<a class="nl" href="#/login/customer">Customer Login</a><a class="nl" href="#/login/seller">Seller Login</a>`;
  else links += `<span class="text-sm muted px-2 hidden sm:inline">${esc(u.name)} · ${u.role}</span><button class="btn btn-sm" data-act="logout">Logout</button>`;
  links += `<button class="btn btn-sm" data-act="theme" aria-label="Toggle theme">🌓</button>`;
  $('#nav').innerHTML = `<nav class="glass navbar"><a class="brand" href="#/">🛍️ GlassMart</a>${links}</nav>`;
}

/* ================= router ================= */
function render() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const u = me();
  const need = role => {
    if (!u) { go('login/' + role); return false; }
    if (u.role !== role) { go(u.role === 'seller' ? 'seller/overview' : 'shop'); return false; }
    return true;
  };
  let html;
  switch (parts[0] || 'home') {
    case 'home': html = viewHome(); break;
    case 'login': html = viewAuth('login', parts[1]); break;
    case 'signup': html = viewAuth('signup', parts[1]); break;
    case 'shop': if (u && u.role === 'seller') { go('seller/overview'); return; } html = viewShop(); break;
    case 'product': if (u && u.role === 'seller') { go('seller/overview'); return; } html = viewProduct(parts[1]); break;
    case 'cart': if (!need('customer')) return; html = viewCart(); break;
    case 'checkout': if (!need('customer')) return; html = viewCheckout(); break;
    case 'orders': if (!need('customer')) return; html = viewOrders(); break;
    case 'profile': if (!need('customer')) return; html = viewProfile(); break;
    case 'seller': if (!need('seller')) return; html = viewSeller(parts[1] || 'overview'); break;
    default: html = `<div class="glass p-8 text-center mt-6"><h1 class="text-2xl font-bold">Page not found</h1><a class="btn btn-primary mt-4" href="#/">Go home</a></div>`;
  }
  void qs;
  renderNav();
  $('#view').innerHTML = html;
  if (parts[0] === 'shop') renderGrid();
  window.scrollTo(0, 0);
}

/* ================= views: home & auth ================= */
function viewHome() {
  const u = me();
  const portal = (role, icon, title, desc) => `<div class="glass p-6 md:p-8 flex flex-col gap-3">
    <div class="text-4xl">${icon}</div><h2 class="text-2xl font-bold">${title}</h2><p class="muted">${desc}</p>
    ${u && u.role === role ? `<a class="btn btn-primary w-fit" href="#/${role === 'seller' ? 'seller/overview' : 'shop'}">Open ${title}</a>`
      : `<div class="flex gap-2 flex-wrap"><a class="btn btn-primary" href="#/login/${role}">${cap(role)} Login</a><a class="btn" href="#/signup/${role}">Sign up</a></div>`}
  </div>`;
  const featured = db.products.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  return `<section class="text-center py-8 md:py-14">
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">Shop smart. <span style="background:linear-gradient(135deg,#6366f1,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent">Sell simply.</span></h1>
    <p class="muted mt-4 max-w-2xl mx-auto">One marketplace, two portals. Customers see live stock and a distance-based delivery estimate. Sellers manage inventory, track sales and export their data.</p>
  </section>
  <section class="grid md:grid-cols-2 gap-5">
    ${portal('customer', '🛒', 'Customer Portal', 'Browse with powerful filters, add to cart, book products and track every order.')}
    ${portal('seller', '🏬', 'Seller Portal', 'Add products, manage stock, view sales analytics, read reviews and export CSVs.')}
  </section>
  <h2 class="text-xl font-bold mt-10 mb-3">New arrivals</h2>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${featured.map(p => card(p, u && u.role === 'customer' ? u : null)).join('')}</div>`;
}

function viewAuth(mode, role) {
  if (role !== 'customer' && role !== 'seller') return '<div class="glass p-8 mt-6">Unknown portal.</div>';
  if (me()) return `<div class="glass p-8 mt-6 text-center">You are already logged in. <a class="underline" href="#/">Go home</a></div>`;
  const seller = role === 'seller', su = mode === 'signup';
  return `<div class="max-w-md mx-auto glass p-6 md:p-8 mt-4">
    <h1 class="text-2xl font-bold">${cap(role)} ${su ? 'sign up' : 'login'}</h1>
    <p class="muted text-sm mt-1">${su ? 'Create your ' + role + ' account.' : 'Welcome back.'}</p>
    <form data-form="${mode}" data-role="${role}" class="grid gap-3 mt-4" autocomplete="on">
      ${su ? `<label class="lbl">Your name<input class="input" name="name" required maxlength="60" autocomplete="name"></label>
      ${seller ? `<label class="lbl">Store name<input class="input" name="storeName" required maxlength="60"></label>` : ''}` : ''}
      <label class="lbl">Email<input class="input" type="email" name="email" required maxlength="120" autocomplete="email"></label>
      <label class="lbl">Password${su ? ' (min 8 chars, letters &amp; a number)' : ''}<input class="input" type="password" name="password" required minlength="${su ? 8 : 1}" maxlength="128" autocomplete="${su ? 'new-password' : 'current-password'}"></label>
      ${su ? `<label class="lbl">${seller ? 'Store / warehouse city' : 'Delivery city'}<input class="input" name="city" list="cities" required maxlength="60" placeholder="e.g. Pune"></label>
      <label class="lbl">${seller ? 'Store / warehouse address' : 'Delivery address'}<textarea class="input" name="address" required maxlength="250" rows="2"></textarea></label>${citiesList}` : ''}
      <button class="btn btn-primary" type="submit">${su ? 'Create account' : 'Login'}</button>
    </form>
    <p class="text-sm muted mt-4">${su ? `Already registered? <a class="underline" href="#/login/${role}">Login</a>` : `New here? <a class="underline" href="#/signup/${role}">Create an account</a>`}
    · ${seller ? '<a class="underline" href="#/login/customer">Customer portal</a>' : '<a class="underline" href="#/login/seller">Seller portal</a>'}</p>
  </div>`;
}

/* ================= views: shop ================= */
const F = { q: '', cats: new Set(), brands: new Set(), min: '', max: '', deals: false, rating: 0, isNew: false, inStock: false, sizes: new Set(), colors: new Set(), sort: 'new' };
function resetFilters() { Object.assign(F, { q: '', cats: new Set(), brands: new Set(), min: '', max: '', deals: false, rating: 0, isNew: false, inStock: false, sizes: new Set(), colors: new Set(), sort: 'new' }); }

function filtered() {
  const now = Date.now(), q = F.q.trim().toLowerCase();
  const list = db.products.filter(p => {
    if (q && !`${p.name} ${p.brand} ${p.category} ${p.desc || ''}`.toLowerCase().includes(q)) return false;
    if (F.cats.size && !F.cats.has(p.category)) return false;
    if (F.brands.size && !F.brands.has(p.brand)) return false;
    const fp = finalPrice(p);
    if (F.min !== '' && fp < Number(F.min)) return false;
    if (F.max !== '' && fp > Number(F.max)) return false;
    if (F.deals && !(p.discount > 0)) return false;
    if (F.rating && avgRating(p.id) < F.rating) return false;
    if (F.isNew && now - p.createdAt > 7 * DAY) return false;
    if (F.inStock && p.stock <= 0) return false;
    if (F.sizes.size && !(p.sizes || []).some(s => F.sizes.has(s))) return false;
    if (F.colors.size && !(p.colors || []).some(c => F.colors.has(c))) return false;
    return true;
  });
  const s = {
    new: (a, b) => b.createdAt - a.createdAt,
    low: (a, b) => finalPrice(a) - finalPrice(b),
    high: (a, b) => finalPrice(b) - finalPrice(a),
    rating: (a, b) => avgRating(b.id) - avgRating(a.id),
    deal: (a, b) => (b.discount || 0) - (a.discount || 0)
  }[F.sort] || (() => 0);
  return list.sort(s);
}

function card(p, cust) {
  const r = avgRating(p.id), n = reviewsOf(p.id).length;
  return `<article class="glass card">
    <a href="#/product/${esc(p.id)}" class="relative block"><img class="pimg" src="${imgOf(p)}" alt="${esc(p.name)}" loading="lazy">
      ${p.discount > 0 ? `<span class="badge b-deal absolute top-2 left-2">-${p.discount}%</span>` : ''}</a>
    <div class="text-xs muted">${esc(p.brand)} · ${esc(p.category)}</div>
    <a href="#/product/${esc(p.id)}" class="font-semibold leading-tight">${esc(p.name)}</a>
    <div class="text-sm"><span class="star">${n ? stars(r) : '☆☆☆☆☆'}</span> <span class="muted text-xs">${n ? r.toFixed(1) + ' (' + n + ')' : 'No reviews'}</span></div>
    <div><b>${money(finalPrice(p))}</b> ${p.discount > 0 ? `<s class="muted text-xs">${money(p.price)}</s>` : ''}</div>
    <div class="text-xs leading-6">${availability(p, cust)}</div>
    <div class="flex gap-2 mt-auto"><a class="btn btn-sm flex-1" href="#/product/${esc(p.id)}">View</a>
      <button class="btn btn-sm btn-primary flex-1" data-act="add" data-id="${esc(p.id)}" ${p.stock <= 0 ? 'disabled' : ''}>Add to cart</button></div>
  </article>`;
}

function viewShop() {
  const brands = [...new Set(db.products.map(p => p.brand))].sort();
  const sizes = [...new Set(db.products.flatMap(p => p.sizes || []))];
  const colors = [...new Set(db.products.flatMap(p => p.colors || []))];
  const chk = (key, val, label) => `<label class="flex items-center gap-2 text-sm py-0.5"><input type="checkbox" data-f="${key}" value="${esc(val)}" ${F[key].has(val) ? 'checked' : ''}> ${esc(label ?? val)}</label>`;
  const chip = (key, val) => `<label class="chip"><input type="checkbox" data-f="${key}" value="${esc(val)}" ${F[key].has(val) ? 'checked' : ''}><span>${esc(val)}</span></label>`;
  const grp = (t, inner) => `<div class="mb-4"><h3 class="text-xs font-bold uppercase tracking-wide muted mb-1">${t}</h3>${inner}</div>`;
  return `<div class="flex items-center gap-2 mb-4 flex-wrap">
      <input class="input flex-1 min-w-[12rem]" type="search" placeholder="Search products, brands, categories…" data-f="q" value="${esc(F.q)}" aria-label="Search">
      <select class="input w-auto" data-f="sort" aria-label="Sort">
        ${[['new', 'Newest'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['rating', 'Top rated'], ['deal', 'Biggest discount']].map(([v, l]) => `<option value="${v}" ${F.sort === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
      <button class="btn lg:hidden" data-act="toggleFilters">Filters</button>
    </div>
    <div class="grid lg:grid-cols-[17rem_1fr] gap-5">
      <aside id="filters" class="glass p-4 hidden lg:block h-fit">
        <div class="flex justify-between items-center mb-3"><b>Filters</b><button class="btn btn-sm" data-act="resetFilters">Reset</button></div>
        ${grp('Category', CATS.map(c => chk('cats', c, CAT_ICON[c] + ' ' + c)).join(''))}
        ${grp('Brand', brands.map(b => chk('brands', b)).join(''))}
        ${grp('Price (₹)', `<div class="flex gap-2"><input class="input" type="number" min="0" placeholder="Min" data-f="min" value="${esc(F.min)}"><input class="input" type="number" min="0" placeholder="Max" data-f="max" value="${esc(F.max)}"></div>`)}
        ${grp('Deals & availability', `<label class="flex items-center gap-2 text-sm py-0.5"><input type="checkbox" data-f="deals" ${F.deals ? 'checked' : ''}> Deals &amp; discounts</label>
          <label class="flex items-center gap-2 text-sm py-0.5"><input type="checkbox" data-f="isNew" ${F.isNew ? 'checked' : ''}> New arrivals (7 days)</label>
          <label class="flex items-center gap-2 text-sm py-0.5"><input type="checkbox" data-f="inStock" ${F.inStock ? 'checked' : ''}> In stock only</label>`)}
        ${grp('Customer reviews', [4, 3, 2, 0].map(r => `<label class="flex items-center gap-2 text-sm py-0.5"><input type="radio" name="rt" data-f="rating" value="${r}" ${F.rating === r ? 'checked' : ''}> ${r ? `<span class="star">${stars(r)}</span> &amp; up` : 'Any rating'}</label>`).join(''))}
        ${sizes.length ? grp('Size', `<div class="flex flex-wrap gap-1.5">${sizes.map(s => chip('sizes', s)).join('')}</div>`) : ''}
        ${colors.length ? grp('Color', `<div class="flex flex-wrap gap-1.5">${colors.map(c => chip('colors', c)).join('')}</div>`) : ''}
      </aside>
      <section><div id="count" class="text-sm muted mb-2"></div><div id="grid" class="grid grid-cols-2 md:grid-cols-3 gap-4"></div></section>
    </div>`;
}
function renderGrid() {
  const g = $('#grid'); if (!g) return;
  const u = me(), cust = u && u.role === 'customer' ? u : null, list = filtered();
  $('#count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
  g.innerHTML = list.length ? list.map(p => card(p, cust)).join('') : '<div class="glass p-8 text-center col-span-full muted">No products match your filters.</div>';
}

function viewProduct(id) {
  const p = productById(id);
  if (!p) return '<div class="glass p-8 mt-6 text-center">Product not found. <a class="underline" href="#/shop">Back to shop</a></div>';
  const u = me(), cust = u && u.role === 'customer' ? u : null, s = userById(p.sellerId);
  const r = avgRating(p.id), rs = reviewsOf(p.id).slice().sort((a, b) => b.createdAt - a.createdAt);
  const sel = (name, arr, label) => arr.length ? `<label class="lbl">${label}<select class="input" id="${name}">${arr.map(x => `<option>${esc(x)}</option>`).join('')}</select></label>` : '';
  return `<a href="#/shop" class="text-sm underline">← Back to shop</a>
  <div class="grid md:grid-cols-2 gap-6 mt-3">
    <div class="glass p-3"><img class="pimg" src="${imgOf(p)}" alt="${esc(p.name)}"></div>
    <div class="glass p-5 md:p-6 grid gap-3 content-start">
      <div class="text-xs muted">${esc(p.brand)} · ${esc(p.category)} · Sold by ${esc(s ? (s.storeName || s.name) : 'Seller')}</div>
      <h1 class="text-2xl font-bold">${esc(p.name)}</h1>
      <div><span class="star">${reviewsOf(p.id).length ? stars(r) : '☆☆☆☆☆'}</span> <span class="muted text-sm">${reviewsOf(p.id).length ? r.toFixed(1) + ' · ' + reviewsOf(p.id).length + ' reviews' : 'No reviews yet'}</span></div>
      <div class="text-2xl font-extrabold">${money(finalPrice(p))} ${p.discount > 0 ? `<s class="muted text-base font-normal">${money(p.price)}</s> <span class="badge b-deal">-${p.discount}%</span>` : ''}</div>
      <div class="leading-7">${availability(p, cust)}</div>
      <p class="muted text-sm">${esc(p.desc)}</p>
      ${p.stock > 0 ? `<div class="grid grid-cols-2 gap-3">${sel('psize', p.sizes || [], 'Size')}${sel('pcolor', p.colors || [], 'Color')}
        <label class="lbl">Quantity<input class="input" id="pqty" type="number" min="1" max="${p.stock}" value="1"></label></div>
        <div class="text-xs muted">${p.stock <= 5 ? `Only ${p.stock} left!` : ''}</div>
        <div class="flex gap-2 flex-wrap"><button class="btn" data-act="addDetail" data-id="${esc(p.id)}">Add to cart</button>
        <button class="btn btn-primary" data-act="book" data-id="${esc(p.id)}">Book product</button></div>` : ''}
    </div>
  </div>
  <h2 class="text-xl font-bold mt-8 mb-3">Customer reviews</h2>
  <div class="grid gap-3">${rs.length ? rs.map(x => `<div class="glass p-4"><div><span class="star">${stars(x.rating)}</span> <b class="text-sm">${esc(x.name)}</b> <span class="muted text-xs">${fmtDate(x.createdAt)}</span></div><p class="text-sm mt-1">${esc(x.text)}</p></div>`).join('') : '<div class="glass p-4 muted">No reviews yet. Order and receive this product to leave one.</div>'}</div>`;
}

/* ================= views: cart / checkout / orders / profile ================= */
function viewCart() {
  const cart = getCart(), u = me();
  if (!cart.length) return `<div class="glass p-10 text-center mt-4"><div class="text-5xl">🛒</div><h1 class="text-xl font-bold mt-2">Your cart is empty</h1><a class="btn btn-primary mt-4" href="#/shop">Start shopping</a></div>`;
  let total = 0;
  const rows = cart.map((l, i) => {
    const p = productById(l.pid); if (!p) return '';
    const sub = finalPrice(p) * l.qty; total += sub;
    return `<div class="glass p-3 flex gap-3 items-center">
      <img class="rounded-xl" style="width:84px;height:84px;object-fit:cover" src="${imgOf(p)}" alt="">
      <div class="flex-1 min-w-0"><a class="font-semibold" href="#/product/${esc(p.id)}">${esc(p.name)}</a>
        <div class="text-xs muted">${[l.size, l.color].filter(Boolean).map(esc).join(' · ')}</div>
        <div class="text-xs mt-1">${availability(p, u)}</div></div>
      <div class="flex items-center gap-1"><button class="btn btn-sm" data-act="qty" data-i="${i}" data-d="-1" aria-label="Decrease">−</button><b class="w-6 text-center">${l.qty}</b><button class="btn btn-sm" data-act="qty" data-i="${i}" data-d="1" aria-label="Increase">+</button></div>
      <div class="w-24 text-right font-bold">${money(sub)}</div>
      <button class="btn btn-sm" data-act="remove" data-i="${i}" aria-label="Remove">✕</button></div>`;
  }).join('');
  return `<h1 class="text-2xl font-bold mb-4">Your cart</h1><div class="grid lg:grid-cols-[1fr_20rem] gap-5"><div class="grid gap-3">${rows}</div>
    <div class="glass p-5 h-fit grid gap-3"><div class="flex justify-between"><span>Items</span><b>${cart.reduce((a, l) => a + l.qty, 0)}</b></div>
    <div class="flex justify-between text-lg"><span>Total</span><b>${money(total)}</b></div>
    <a class="btn btn-primary" href="#/checkout">Proceed to checkout</a></div></div>`;
}

function viewCheckout() {
  const u = me(), cart = getCart();
  if (!cart.length) return `<div class="glass p-8 mt-4 text-center">Your cart is empty. <a class="underline" href="#/shop">Shop</a></div>`;
  let total = 0, ok = true;
  const lines = cart.map(l => {
    const p = productById(l.pid); if (!p) return '';
    const sub = finalPrice(p) * l.qty; total += sub;
    if (p.stock < l.qty) ok = false;
    return `<div class="flex justify-between gap-3 text-sm py-1"><span>${esc(p.name)} × ${l.qty}${p.stock < l.qty ? ' <span class="badge b-bad">Insufficient stock</span>' : ''}<br><span class="text-xs">${availability(p, u)}</span></span><b>${money(sub)}</b></div>`;
  }).join('');
  const hasAddr = u.city && u.address;
  return `<h1 class="text-2xl font-bold mb-4">Checkout</h1><div class="grid lg:grid-cols-2 gap-5">
    <div class="glass p-5"><h2 class="font-bold mb-2">Delivery address</h2>
      ${hasAddr ? `<p class="text-sm">${esc(u.name)}<br>${esc(u.address)}<br>${esc(u.city)}</p>` : '<p class="text-sm">No address saved.</p>'}
      <a class="btn btn-sm mt-3" href="#/profile">${hasAddr ? 'Change address' : 'Add address'}</a>
      <p class="text-xs muted mt-3">Payment: Cash on delivery (demo).</p></div>
    <div class="glass p-5"><h2 class="font-bold mb-2">Order summary</h2>${lines}
      <div class="flex justify-between text-lg mt-3 pt-3" style="border-top:1px solid var(--border)"><span>Total</span><b>${money(total)}</b></div>
      <button class="btn btn-primary w-full mt-4" data-act="placeOrder" ${hasAddr && ok ? '' : 'disabled'}>Place order</button></div></div>`;
}

function viewOrders() {
  const u = me(), list = db.orders.filter(o => o.customerId === u.id).sort((a, b) => b.createdAt - a.createdAt);
  if (!list.length) return `<div class="glass p-10 text-center mt-4"><div class="text-5xl">📦</div><h1 class="text-xl font-bold mt-2">No orders yet</h1><a class="btn btn-primary mt-4" href="#/shop">Browse products</a></div>`;
  return `<h1 class="text-2xl font-bold mb-4">My orders</h1><div class="grid gap-4">${list.map(o => {
    const seller = userById(o.sellerId), arrival = new Date(o.createdAt + etaDays(o.km).hi * DAY);
    return `<div class="glass p-4"><div class="flex flex-wrap justify-between gap-2 items-center">
      <div><b>Order #${esc(o.id.slice(0, 8).toUpperCase())}</b> <span class="muted text-xs">${fmtDate(o.createdAt)} · ${esc(seller ? (seller.storeName || seller.name) : 'Seller')}</span></div>
      <span class="badge st-${esc(o.status)}">${esc(cap(o.status))}</span></div>
      <div class="grid gap-1 my-3">${o.items.map(it => `<div class="flex justify-between gap-2 text-sm"><span>${esc(it.name)} ${[it.size, it.color].filter(Boolean).length ? `<span class="muted text-xs">(${[it.size, it.color].filter(Boolean).map(esc).join(', ')})</span>` : ''} × ${it.qty}
        ${o.status === 'delivered' ? `<button class="btn btn-sm ml-2" data-act="review" data-oid="${esc(o.id)}" data-pid="${esc(it.pid)}">★ Review</button>` : ''}</span><span>${money(it.price * it.qty)}</span></div>`).join('')}</div>
      <div class="flex flex-wrap justify-between gap-2 items-center text-sm"><span class="muted">${o.km} km · ${o.status === 'cancelled' ? 'Cancelled' : o.status === 'delivered' ? 'Delivered' : 'Expected by ' + fmtDate(arrival)}</span>
        <span><b>${money(o.total)}</b> ${o.status === 'pending' ? `<button class="btn btn-sm btn-danger ml-2" data-act="cancelOrder" data-oid="${esc(o.id)}">Cancel</button>` : ''}</span></div>
      <div class="flex gap-1 mt-3 text-xs">${['pending', 'dispatched', 'delivered'].map((s, i) => `<span class="badge ${o.status !== 'cancelled' && i <= STATUS_IDX(o.status) ? 'st-' + s : ''}" style="${o.status === 'cancelled' || i > STATUS_IDX(o.status) ? 'background:var(--field);color:var(--muted)' : ''}">${cap(s)}</span>`).join('<span class="muted">→</span>')}</div>
    </div>`;
  }).join('')}</div>`;
}
const STATUS_IDX = s => ['pending', 'dispatched', 'delivered'].indexOf(s);

function viewProfile() {
  const u = me();
  return `<div class="max-w-lg mx-auto glass p-6 mt-4"><h1 class="text-2xl font-bold mb-1">Profile &amp; delivery address</h1><p class="muted text-sm mb-4">${esc(u.email)}</p>
    <form data-form="profile" class="grid gap-3">
      <label class="lbl">Name<input class="input" name="name" required maxlength="60" value="${esc(u.name)}"></label>
      <label class="lbl">City<input class="input" name="city" list="cities" required maxlength="60" value="${esc(u.city)}"></label>
      <label class="lbl">Address<textarea class="input" name="address" required maxlength="250" rows="3">${esc(u.address)}</textarea></label>${citiesList}
      <button class="btn btn-primary">Save</button></form></div>`;
}

/* ================= views: seller ================= */
let period = 'daily';
const mine = () => db.products.filter(p => p.sellerId === me().id);
const sellerOrders = () => db.orders.filter(o => o.sellerId === me().id);
function sellerStats() {
  const ps = mine(), os = sellerOrders().filter(o => o.status !== 'cancelled');
  const sold = os.reduce((a, o) => a + o.items.reduce((x, i) => x + i.qty, 0), 0);
  return { sold, revenue: os.reduce((a, o) => a + o.total, 0), left: ps.reduce((a, p) => a + p.stock, 0), purchased: ps.reduce((a, p) => a + (p.purchased || 0), 0), orders: os.length };
}
const keyOf = (t, p) => { const d = new Date(t); return p === 'daily' ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : p === 'monthly' ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}` : String(d.getFullYear()); };
function buckets(p) {
  const out = [], now = new Date(), n = p === 'daily' ? 14 : p === 'monthly' ? 12 : 5;
  for (let i = n - 1; i >= 0; i--) {
    const d = p === 'daily' ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - i) : p === 'monthly' ? new Date(now.getFullYear(), now.getMonth() - i, 1) : new Date(now.getFullYear() - i, 0, 1);
    const label = p === 'daily' ? `${d.getDate()}/${d.getMonth() + 1}` : p === 'monthly' ? d.toLocaleString('en', { month: 'short' }) + " '" + String(d.getFullYear()).slice(2) : String(d.getFullYear());
    out.push({ k: keyOf(d, p), label, rev: 0, qty: 0, orders: 0 });
  }
  return out;
}

function viewSeller(tab) {
  const tabs = [['overview', 'Overview'], ['inventory', 'Inventory'], ['orders', 'Orders'], ['reviews', 'Reviews'], ['profile', 'Store profile']];
  if (!tabs.some(t => t[0] === tab)) tab = 'overview';
  const head = `<div class="flex flex-wrap items-center justify-between gap-2 mb-3"><h1 class="text-2xl font-bold">Seller dashboard</h1>
    <button class="btn btn-primary" data-act="exportMenu">⬇ Download / Export data</button></div>
    <div class="glass tabs">${tabs.map(([k, l]) => `<a class="tab${tab === k ? ' on' : ''}" href="#/seller/${k}">${l}</a>`).join('')}</div>`;
  return head + ({ overview: sellerOverview, inventory: sellerInventory, orders: sellerOrdersView, reviews: sellerReviews, profile: sellerProfile }[tab])();
}

function sellerOverview() {
  const st = sellerStats(), bs = buckets(period);
  sellerOrders().filter(o => o.status !== 'cancelled').forEach(o => {
    const b = bs.find(x => x.k === keyOf(o.createdAt, period));
    if (b) { b.rev += o.total; b.qty += o.items.reduce((a, i) => a + i.qty, 0); b.orders++; }
  });
  const max = Math.max(1, ...bs.map(b => b.rev)), totalRev = bs.reduce((a, b) => a + b.rev, 0), totalQty = bs.reduce((a, b) => a + b.qty, 0);
  const allRs = db.reviews.filter(r => mine().some(p => p.id === r.productId)), avg = allRs.length ? allRs.reduce((a, r) => a + r.rating, 0) / allRs.length : 0;
  const stat = (t, v, sub) => `<div class="glass p-4"><div class="text-xs muted uppercase tracking-wide">${t}</div><div class="text-2xl font-extrabold mt-1">${v}</div><div class="text-xs muted">${sub || ''}</div></div>`;
  const pend = sellerOrders().filter(o => o.status === 'pending').length;
  return `<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
    ${stat('Total revenue', money(st.revenue), st.orders + ' orders')}${stat('Items sold', st.sold)}
    ${stat('Stock left', st.left, 'units in inventory')}${stat('Stock purchased', st.purchased, 'initial + restocked')}
    ${stat('Pending orders', pend, 'need dispatch')}${stat('Avg rating', allRs.length ? avg.toFixed(1) + ' ★' : '—', allRs.length + ' reviews')}
    ${stat('Products', mine().length)}${stat('Out of stock', mine().filter(p => p.stock <= 0).length)}</div>
  <div class="glass p-4"><div class="flex flex-wrap justify-between items-center gap-2 mb-3"><h2 class="font-bold">Sales trend</h2>
    <div class="flex gap-1">${['daily', 'monthly', 'yearly'].map(p => `<button class="btn btn-sm ${period === p ? 'btn-primary' : ''}" data-act="period" data-p="${p}">${cap(p)}</button>`).join('')}</div></div>
    <div class="text-sm muted mb-3">Earnings in range: <b style="color:var(--text)">${money(totalRev)}</b> · Items sold: <b style="color:var(--text)">${totalQty}</b></div>
    <div class="bars" role="img" aria-label="${period} revenue chart">${bs.map(b => `<div class="bar" title="${esc(b.label)}: ${money(b.rev)}, ${b.qty} items"><b style="height:${Math.round(b.rev / max * 100)}%"></b><small>${esc(b.label)}</small></div>`).join('')}</div>
    <div class="scroll-x mt-4"><table class="tbl"><thead><tr><th>Period</th><th>Orders</th><th>Items</th><th>Earnings</th></tr></thead><tbody>${bs.slice().reverse().map(b => `<tr><td>${esc(b.label)}</td><td>${b.orders}</td><td>${b.qty}</td><td>${money(b.rev)}</td></tr>`).join('')}</tbody></table></div></div>`;
}

function sellerInventory() {
  const sold = {};
  sellerOrders().filter(o => o.status !== 'cancelled').forEach(o => o.items.forEach(i => { sold[i.pid] = (sold[i.pid] || 0) + i.qty; }));
  const ps = mine().sort((a, b) => b.createdAt - a.createdAt);
  return `<div class="flex flex-wrap gap-2 mb-3"><button class="btn btn-primary" data-act="productForm">＋ Add product</button>
    <button class="btn" data-act="sampleProducts">Add sample products</button></div>
  <div class="glass p-2 scroll-x">${ps.length ? `<table class="tbl"><thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th></th></tr></thead><tbody>
    ${ps.map(p => `<tr><td><img class="rounded-lg" style="width:44px;height:44px;object-fit:cover" src="${imgOf(p)}" alt=""></td>
      <td><b>${esc(p.name)}</b><div class="text-xs muted">${esc(p.brand)}</div></td><td>${esc(p.category)}</td>
      <td>${money(finalPrice(p))}${p.discount > 0 ? `<div class="text-xs muted">-${p.discount}%</div>` : ''}</td>
      <td>${p.stock > 0 ? p.stock : '<span class="badge b-bad">Out</span>'}</td><td>${sold[p.id] || 0}</td>
      <td class="whitespace-nowrap"><button class="btn btn-sm" data-act="restock" data-id="${esc(p.id)}">Restock</button> <button class="btn btn-sm" data-act="productForm" data-id="${esc(p.id)}">Edit</button> <button class="btn btn-sm btn-danger" data-act="delProduct" data-id="${esc(p.id)}">Delete</button></td></tr>`).join('')}</tbody></table>`
    : '<div class="p-8 text-center muted">No products yet. Add your first product or load sample products.</div>'}</div>`;
}

function sellerOrdersView() {
  const list = sellerOrders().sort((a, b) => b.createdAt - a.createdAt);
  if (!list.length) return '<div class="glass p-8 text-center muted">No orders yet. Orders from customers will appear here.</div>';
  return `<div class="grid gap-3">${list.map(o => {
    const c = userById(o.customerId), next = { pending: 'dispatched', dispatched: 'delivered' }[o.status];
    return `<div class="glass p-4"><div class="flex flex-wrap justify-between gap-2"><div><b>#${esc(o.id.slice(0, 8).toUpperCase())}</b> <span class="muted text-xs">${fmtDate(o.createdAt)}</span></div><span class="badge st-${esc(o.status)}">${esc(cap(o.status))}</span></div>
      <div class="text-sm mt-1">${o.items.map(i => `${esc(i.name)} × ${i.qty}`).join(', ')}</div>
      <div class="text-xs muted mt-1">To: ${esc(c ? c.name : 'Customer')}, ${esc(o.address)}, ${esc(o.city)} · ${o.km} km (${esc(etaText(o.km))})</div>
      <div class="flex justify-between items-center mt-2"><b>${money(o.total)}</b>${next ? `<button class="btn btn-sm btn-primary" data-act="advance" data-oid="${esc(o.id)}">Mark ${next}</button>` : ''}</div></div>`;
  }).join('')}</div>`;
}

function sellerReviews() {
  const ids = new Set(mine().map(p => p.id)), rs = db.reviews.filter(r => ids.has(r.productId)).sort((a, b) => b.createdAt - a.createdAt);
  if (!rs.length) return '<div class="glass p-8 text-center muted">No customer feedback yet.</div>';
  return `<div class="grid gap-3">${rs.map(r => { const p = productById(r.productId); return `<div class="glass p-4"><div class="flex flex-wrap gap-2 items-center"><span class="star">${stars(r.rating)}</span><b class="text-sm">${esc(p ? p.name : 'Product')}</b><span class="muted text-xs">by ${esc(r.name)} · ${fmtDate(r.createdAt)}</span></div><p class="text-sm mt-1">${esc(r.text)}</p></div>`; }).join('')}</div>`;
}

function sellerProfile() {
  const u = me();
  return `<div class="max-w-lg glass p-6"><h2 class="text-xl font-bold mb-1">Store profile &amp; location</h2><p class="muted text-sm mb-4">Your city is used to calculate delivery distance for customers.</p>
    <form data-form="profile" class="grid gap-3">
      <label class="lbl">Your name<input class="input" name="name" required maxlength="60" value="${esc(u.name)}"></label>
      <label class="lbl">Store name<input class="input" name="storeName" required maxlength="60" value="${esc(u.storeName || u.name)}"></label>
      <label class="lbl">Store / warehouse city<input class="input" name="city" list="cities" required maxlength="60" value="${esc(u.city)}"></label>
      <label class="lbl">Store / warehouse address<textarea class="input" name="address" required maxlength="250" rows="3">${esc(u.address)}</textarea></label>${citiesList}
      <button class="btn btn-primary">Save</button></form></div>`;
}

/* ================= modals ================= */
function productFormModal(id) {
  const p = id ? mine().find(x => x.id === id) : null;
  if (id && !p) return;
  modalImage = undefined;
  openModal(`<h2 class="text-xl font-bold mb-3">${p ? 'Edit' : 'Add'} product</h2>
  <form data-form="product" data-id="${esc(p ? p.id : '')}" class="grid gap-3">
    <label class="lbl">Name<input class="input" name="name" required maxlength="100" value="${esc(p?.name)}"></label>
    <div class="grid grid-cols-2 gap-3"><label class="lbl">Category<select class="input" name="category">${CATS.map(c => `<option ${p?.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      <label class="lbl">Brand<input class="input" name="brand" required maxlength="50" value="${esc(p?.brand)}"></label></div>
    <div class="grid grid-cols-3 gap-3"><label class="lbl">Price (₹)<input class="input" type="number" name="price" min="1" max="10000000" step="0.01" required value="${esc(p?.price)}"></label>
      <label class="lbl">Discount %<input class="input" type="number" name="discount" min="0" max="90" step="1" value="${esc(p?.discount ?? 0)}"></label>
      <label class="lbl">${p ? 'Stock' : 'Initial stock'}<input class="input" type="number" name="stock" min="0" max="1000000" step="1" required value="${esc(p?.stock ?? 10)}"></label></div>
    <label class="lbl">Sizes (comma separated, optional)<input class="input" name="sizes" maxlength="120" value="${esc((p?.sizes || []).join(', '))}"></label>
    <label class="lbl">Colors (comma separated, optional)<input class="input" name="colors" maxlength="120" value="${esc((p?.colors || []).join(', '))}"></label>
    <label class="lbl">Description<textarea class="input" name="desc" rows="3" maxlength="600">${esc(p?.desc)}</textarea></label>
    <label class="lbl">Product image (JPG/PNG/WebP, max 2 MB)<input class="input" type="file" id="pimg" accept="image/jpeg,image/png,image/webp"></label>
    <img id="pprev" class="rounded-xl" style="width:96px;height:96px;object-fit:cover" src="${p ? imgOf(p) : ''}" alt="" ${p ? '' : 'hidden'}>
    <div class="flex gap-2 justify-end"><button type="button" class="btn" data-act="closeModal">Cancel</button><button class="btn btn-primary">Save product</button></div>
  </form>`);
}

function exportMenu() {
  openModal(`<h2 class="text-xl font-bold mb-1">Export data</h2><p class="muted text-sm mb-4">Downloads CSV files you can open in Excel or Google Sheets.</p>
    <div class="grid gap-2"><button class="btn" data-act="export" data-k="inventory">📦 Inventory (CSV)</button><button class="btn" data-act="export" data-k="sales">💰 Sales log (CSV)</button><button class="btn" data-act="export" data-k="orders">🧾 Orders (CSV)</button></div>
    <div class="text-right mt-4"><button class="btn" data-act="closeModal">Close</button></div>`);
}
function csv(rows) {
  return rows.map(r => r.map(c => {
    let s = typeof c === 'number' ? String(c) : String(c ?? '');
    if (typeof c === 'string' && /^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise spreadsheet formulas
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(',')).join('\r\n');
}
function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
function doExport(k) {
  const date = keyOf(Date.now(), 'daily'), os = sellerOrders().sort((a, b) => a.createdAt - b.createdAt);
  if (k === 'inventory') {
    const sold = {}; os.filter(o => o.status !== 'cancelled').forEach(o => o.items.forEach(i => { sold[i.pid] = (sold[i.pid] || 0) + i.qty; }));
    download(`inventory-${date}.csv`, csv([['Product ID', 'Name', 'Category', 'Brand', 'Price', 'Discount %', 'Final price', 'Stock left', 'Total purchased/restocked', 'Units sold', 'Added on'],
      ...mine().map(p => [p.id, p.name, p.category, p.brand, p.price, p.discount, finalPrice(p), p.stock, p.purchased || 0, sold[p.id] || 0, keyOf(p.createdAt, 'daily')])]));
  } else if (k === 'sales') {
    const rows = [['Date', 'Order ID', 'Product', 'Qty', 'Unit price', 'Line total', 'Order status']];
    os.forEach(o => o.items.forEach(i => rows.push([keyOf(o.createdAt, 'daily'), o.id, i.name, i.qty, i.price, Math.round(i.price * i.qty * 100) / 100, o.status])));
    download(`sales-log-${date}.csv`, csv(rows));
  } else {
    download(`orders-${date}.csv`, csv([['Order ID', 'Date', 'Customer', 'City', 'Distance km', 'Items', 'Total', 'Status'],
      ...os.map(o => [o.id, keyOf(o.createdAt, 'daily'), (userById(o.customerId) || {}).name || '', o.city, o.km, o.items.map(i => `${i.name} x${i.qty}`).join('; '), o.total, o.status])]));
  }
  toast('Download started');
}

/* ================= actions ================= */
function requireCustomer() {
  const u = me();
  if (!u) { toast('Please log in as a customer first'); go('login/customer'); return null; }
  if (u.role !== 'customer') { toast('Switch to a customer account to shop'); return null; }
  return u;
}
function addToCart(pid, qty, size, color) {
  const u = requireCustomer(); if (!u) return false;
  const p = productById(pid); if (!p || p.stock <= 0) { toast('Out of stock'); return false; }
  qty = Math.max(1, Math.floor(Number(qty)) || 1);
  const cart = getCart(), line = cart.find(l => l.pid === pid && l.size === size && l.color === color);
  const have = cart.filter(l => l.pid === pid).reduce((a, l) => a + l.qty, 0);
  if (have + qty > p.stock) { toast(`Only ${p.stock} in stock`); return false; }
  line ? line.qty += qty : cart.push({ pid, qty, size: size || '', color: color || '' });
  save(); renderNav(); toast('Added to cart'); return true;
}
function placeOrder() {
  const u = me(), cart = getCart();
  if (!u.city || !u.address) { toast('Add a delivery address first'); return; }
  const need = {};
  for (const l of cart) { const p = productById(l.pid); if (!p) { toast('A product in your cart is no longer available'); return; } need[l.pid] = (need[l.pid] || 0) + l.qty; if (need[l.pid] > p.stock) { toast(`Not enough stock for ${p.name}`); return; } }
  const bySeller = {};
  cart.forEach(l => { const p = productById(l.pid); (bySeller[p.sellerId] = bySeller[p.sellerId] || []).push({ pid: p.id, name: p.name, price: finalPrice(p), qty: l.qty, size: l.size, color: l.color }); });
  Object.entries(bySeller).forEach(([sid, items]) => {
    const s = userById(sid), km = distanceKm(s ? s.city : '', u.city);
    db.orders.push({ id: uid(), customerId: u.id, sellerId: sid, createdAt: Date.now(), items, total: Math.round(items.reduce((a, i) => a + i.price * i.qty, 0) * 100) / 100, km, city: u.city, address: u.address, status: 'pending' });
  });
  cart.forEach(l => { productById(l.pid).stock -= l.qty; });
  db.carts[u.id] = [];
  if (save()) { toast('Order placed!'); go('orders'); }
}
function reviewModal(oid, pid) {
  const p = productById(pid), u = me();
  const o = db.orders.find(x => x.id === oid && x.customerId === u.id && x.status === 'delivered');
  if (!p || !o) return;
  const ex = db.reviews.find(r => r.productId === pid && r.customerId === u.id);
  openModal(`<h2 class="text-xl font-bold mb-3">Review: ${esc(p.name)}</h2><form data-form="review" data-pid="${esc(pid)}" class="grid gap-3">
    <label class="lbl">Rating<select class="input" name="rating">${[5, 4, 3, 2, 1].map(n => `<option value="${n}" ${ex && ex.rating === n ? 'selected' : ''}>${stars(n)} (${n})</option>`).join('')}</select></label>
    <label class="lbl">Your feedback<textarea class="input" name="text" rows="3" required maxlength="500">${esc(ex?.text)}</textarea></label>
    <div class="flex gap-2 justify-end"><button type="button" class="btn" data-act="closeModal">Cancel</button><button class="btn btn-primary">Submit</button></div></form>`);
}

const acts = {
  logout() { setSession(null); toast('Logged out'); go(''); render(); },
  theme() { const d = document.documentElement.classList.toggle('dark'); try { localStorage.setItem(TKEY, d ? 'dark' : 'light'); } catch (e) { /* ignore */ } },
  closeModal,
  toggleFilters() { $('#filters').classList.toggle('hidden'); },
  resetFilters() { resetFilters(); render(); },
  add(d) { addToCart(d.id, 1, (productById(d.id)?.sizes || [])[0] || '', (productById(d.id)?.colors || [])[0] || ''); },
  addDetail(d) { addToCart(d.id, $('#pqty').value, $('#psize')?.value || '', $('#pcolor')?.value || ''); },
  book(d) { if (addToCart(d.id, $('#pqty').value, $('#psize')?.value || '', $('#pcolor')?.value || '')) go('checkout'); },
  qty(d) {
    const cart = getCart(), l = cart[Number(d.i)]; if (!l) return;
    const p = productById(l.pid), n = l.qty + Number(d.d);
    if (n < 1) return;
    if (p && n > p.stock) { toast(`Only ${p.stock} in stock`); return; }
    l.qty = n; save(); render();
  },
  remove(d) { getCart().splice(Number(d.i), 1); save(); render(); },
  placeOrder,
  cancelOrder(d) {
    const o = db.orders.find(x => x.id === d.oid && x.customerId === me().id);
    if (!o || o.status !== 'pending') return;
    o.status = 'cancelled'; o.items.forEach(i => { const p = productById(i.pid); if (p) p.stock += i.qty; });
    save(); toast('Order cancelled'); render();
  },
  review(d) { reviewModal(d.oid, d.pid); },
  period(d) { if (['daily', 'monthly', 'yearly'].includes(d.p)) { period = d.p; render(); } },
  productForm(d) { productFormModal(d.id); },
  restock(d) {
    const p = mine().find(x => x.id === d.id); if (!p) return;
    openModal(`<h2 class="text-xl font-bold mb-3">Restock: ${esc(p.name)}</h2><form data-form="restock" data-id="${esc(p.id)}" class="grid gap-3">
      <p class="text-sm muted">Current stock: ${p.stock}</p><label class="lbl">Units to add<input class="input" type="number" name="qty" min="1" max="1000000" step="1" required value="10"></label>
      <div class="flex gap-2 justify-end"><button type="button" class="btn" data-act="closeModal">Cancel</button><button class="btn btn-primary">Add stock</button></div></form>`);
  },
  delProduct(d) {
    const p = mine().find(x => x.id === d.id); if (!p) return;
    if (!confirm(`Delete "${p.name}"? Past orders keep their history.`)) return;
    db.products = db.products.filter(x => x.id !== p.id);
    db.reviews = db.reviews.filter(r => r.productId !== p.id);
    Object.keys(db.carts).forEach(k => { db.carts[k] = db.carts[k].filter(l => l.pid !== p.id); });
    save(); render();
  },
  sampleProducts() {
    const u = me(), t = Date.now(), have = new Set(mine().map(p => p.name));
    const fresh = SAMPLES.filter(s => !have.has(s.name));
    if (!fresh.length) { toast('Sample products already added'); return; }
    fresh.forEach((s, i) => db.products.push(mkProduct(u.id, s, t - i * 1000)));
    save(); toast(`${fresh.length} sample products added`); render();
  },
  advance(d) {
    const o = sellerOrders().find(x => x.id === d.oid), next = o && { pending: 'dispatched', dispatched: 'delivered' }[o.status];
    if (!next) return;
    o.status = next; save(); toast('Order marked ' + next); render();
  },
  exportMenu,
  export(d) { if (['inventory', 'sales', 'orders'].includes(d.k)) doExport(d.k); }
};

/* ================= forms ================= */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const forms = {
  async signup(f) {
    const role = f.dataset.role, v = Object.fromEntries(new FormData(f));
    const email = String(v.email).trim().toLowerCase(), pw = String(v.password);
    if (!emailRe.test(email)) return toast('Enter a valid email');
    if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return toast('Password needs 8+ characters with letters and a number');
    if (db.users.some(u => u.email === email)) return toast('An account with this email already exists');
    let salt, hash;
    try { salt = b64e(crypto.getRandomValues(new Uint8Array(16))); hash = await hashPw(pw, salt); }
    catch (e) { return toast('Secure crypto unavailable. Open via start.bat (localhost) or use Chrome/Edge.'); }
    const u = { id: uid(), role, name: String(v.name).trim().slice(0, 60), email, salt, hash, city: String(v.city).trim(), address: String(v.address).trim() };
    if (role === 'seller') u.storeName = String(v.storeName).trim().slice(0, 60);
    db.users.push(u);
    if (!save()) { db.users.pop(); return; }
    setSession(u.id); toast('Welcome, ' + u.name + '!'); go(role === 'seller' ? 'seller/overview' : 'shop');
  },
  async login(f) {
    const role = f.dataset.role, v = Object.fromEntries(new FormData(f)), email = String(v.email).trim().toLowerCase();
    const fl = fails[email] || { n: 0, until: 0 };
    if (Date.now() < fl.until) return toast(`Too many attempts. Try again in ${Math.ceil((fl.until - Date.now()) / 1000)}s`);
    const u = db.users.find(x => x.email === email && x.role === role && x.hash);
    let ok = false;
    try { if (u) ok = sameStr(await hashPw(String(v.password), u.salt), u.hash); }
    catch (e) { return toast('Secure crypto unavailable. Open via start.bat (localhost) or use Chrome/Edge.'); }
    if (!ok) { fl.n++; if (fl.n >= 5) { fl.until = Date.now() + 30000; fl.n = 0; } fails[email] = fl; return toast('Invalid email or password'); }
    delete fails[email]; setSession(u.id); toast('Welcome back, ' + u.name); go(role === 'seller' ? 'seller/overview' : 'shop');
  },
  profile(f) {
    const u = me(), v = Object.fromEntries(new FormData(f));
    u.name = String(v.name).trim().slice(0, 60); u.city = String(v.city).trim(); u.address = String(v.address).trim();
    if (u.role === 'seller') u.storeName = String(v.storeName).trim().slice(0, 60);
    if (save()) { toast('Profile saved'); renderNav(); }
  },
  product(f) {
    const u = me(), v = Object.fromEntries(new FormData(f)), id = f.dataset.id;
    const price = Number(v.price), discount = Math.min(90, Math.max(0, Math.floor(Number(v.discount) || 0))), stock = Math.max(0, Math.floor(Number(v.stock) || 0));
    if (!(price > 0)) return toast('Enter a valid price');
    if (!CATS.includes(v.category)) return toast('Choose a category');
    const data = { name: String(v.name).trim(), category: v.category, brand: String(v.brand).trim(), price, discount, sizes: csvList(v.sizes), colors: csvList(v.colors), desc: String(v.desc).trim() };
    if (id) {
      const p = mine().find(x => x.id === id); if (!p) return;
      if (stock > p.stock) p.purchased = (p.purchased || 0) + (stock - p.stock);
      Object.assign(p, data, { stock });
      if (modalImage !== undefined) p.image = modalImage;
    } else {
      db.products.push({ id: uid(), sellerId: u.id, ...data, stock, purchased: stock, image: modalImage || '', createdAt: Date.now() });
    }
    if (save()) { closeModal(); toast('Product saved'); render(); }
  },
  restock(f) {
    const p = mine().find(x => x.id === f.dataset.id), n = Math.floor(Number(new FormData(f).get('qty')));
    if (!p || !(n > 0)) return;
    p.stock += n; p.purchased = (p.purchased || 0) + n;
    if (save()) { closeModal(); toast(`Added ${n} units`); render(); }
  },
  review(f) {
    const u = me(), v = Object.fromEntries(new FormData(f)), pid = f.dataset.pid;
    const ok = db.orders.some(o => o.customerId === u.id && o.status === 'delivered' && o.items.some(i => i.pid === pid));
    if (!ok || !productById(pid)) return toast('You can only review delivered products');
    const rating = Math.min(5, Math.max(1, Math.floor(Number(v.rating)) || 5)), text = String(v.text).trim().slice(0, 500);
    const ex = db.reviews.find(r => r.productId === pid && r.customerId === u.id);
    ex ? Object.assign(ex, { rating, text, createdAt: Date.now() }) : db.reviews.push({ id: uid(), productId: pid, customerId: u.id, name: u.name.split(' ')[0], rating, text, createdAt: Date.now() });
    if (save()) { closeModal(); toast('Thanks for your review!'); render(); }
  }
};

/* ================= image upload ================= */
function handleImage(input) {
  const file = input.files && input.files[0]; if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast('Only JPG, PNG or WebP images'); input.value = ''; return; }
  if (file.size > 2 * 1024 * 1024) { toast('Image must be 2 MB or smaller'); input.value = ''; return; }
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => {
    const max = 480, k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    modalImage = c.toDataURL('image/jpeg', 0.8);
    const pv = $('#pprev'); if (pv) { pv.src = modalImage; pv.hidden = false; }
    URL.revokeObjectURL(url);
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast('Could not read that image'); };
  img.src = url;
}

/* ================= events ================= */
document.addEventListener('click', e => {
  if (e.target.classList && e.target.classList.contains('modal-back')) { closeModal(); return; }
  const el = e.target.closest('[data-act]');
  if (el && acts[el.dataset.act]) { e.preventDefault(); acts[el.dataset.act](el.dataset); }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]');
  if (!f) return;
  e.preventDefault();
  const fn = forms[f.dataset.form];
  if (fn) { const b = f.querySelector('button:not([type=button])'); if (b) b.disabled = true; Promise.resolve(fn(f)).finally(() => { if (b && b.isConnected) b.disabled = false; }); }
});
document.addEventListener('input', e => {
  const el = e.target.closest ? e.target.closest('[data-f]') : null;
  if (el) {
    const k = el.dataset.f;
    if (F[k] instanceof Set) el.checked ? F[k].add(el.value) : F[k].delete(el.value);
    else if (el.type === 'checkbox') F[k] = el.checked;
    else if (el.type === 'radio') F[k] = Number(el.value);
    else F[k] = el.value;
    renderGrid(); return;
  }
  if (e.target.id === 'pimg') handleImage(e.target);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').firstChild) closeModal(); });
window.addEventListener('hashchange', () => { closeModal(); render(); });
window.addEventListener('storage', e => {
  if (e.key === KEY) { db = load(); if (!$('#modal').firstChild) render(); }
  if (e.key === SKEY) { sessionId = e.newValue; render(); }
});

/* ================= boot ================= */
try { if (localStorage.getItem(TKEY) === 'light') document.documentElement.classList.remove('dark'); } catch (e) { /* ignore */ }
(async function startGlassMart() {
  try {
    const response = await fetch('/api/state', { cache: 'no-store' });
    if (response.ok) {
      const result = await response.json();
      if (result.state && result.state.v === 1) {
        db = result.state;
        try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* server remains source of truth */ }
      }
      syncReady = true;
      if (!result.state) queueServerSync();
    }
  } catch (e) {
    console.warn('GlassMart is running without server sync:', e);
  }
  render();
})();
})();
