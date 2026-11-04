# GlassMart - Seller & Customer marketplace (glassmorphism UI)

No install, no build. Everything runs in the browser; data is saved in localStorage.

## Run it
- Easiest: double-click `index.html` (Chrome, Edge or Firefox).
- Or double-click `start.bat` (Windows) / run `./start.sh` (Mac/Linux) to serve it at http://localhost:8080
  (needs Python 3 or Node.js). Use this if sign-up says "Secure crypto unavailable".

## Try it
1. Home page -> **Seller Portal** -> Sign up (pick a city, e.g. Pune). Inventory -> **Add sample products** (or add your own).
2. Log out, then **Customer Portal** -> Sign up (pick another city, e.g. Delhi).
3. Shop: filters, "Available - Delivered in X Days" (distance-based), Add to cart / Book product, place order.
4. Log in as the seller: Orders -> mark Dispatched -> Delivered. Overview shows daily/monthly/yearly sales.
5. Back as the customer: My Orders -> Review delivered items. Seller sees them under Reviews.
6. Seller: **Download / Export data** gives Inventory, Sales log and Orders as CSV.

A built-in "Demo Store" (Mumbai) has 12 products so the shop is never empty.

## Notes
- Delivery: city-to-city great-circle distance x 1.25 road factor; days = 1 + ceil(km / 200). ~500 km = 3-4 days. Unknown cities use a 700 km estimate.
- Passwords are salted and hashed with PBKDF2-SHA256 (210k iterations) via WebCrypto, with a 5-try / 30 s lockout.
  This is a browser-only demo: there is no server, so anyone with access to the browser profile can read its data. Do not reuse real passwords.
- To reset everything, clear this site's data in the browser (or run `localStorage.clear()` in the console).
- Files: `index.html`, `css/styles.css`, `js/app.js`, `vendor/tailwind.js` (Tailwind 3.4.17 Play CDN build, bundled for offline use).
