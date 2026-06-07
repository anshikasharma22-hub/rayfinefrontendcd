import React, { useEffect, useState, useCallback, createContext, useContext, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Admin from "./admin";
import Chatbot from "./Chatbot";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const ANNOUNCEMENT_MESSAGES = [
  "✨ Free Delivery on All Orders",
  "💎 Handcrafted in Jaipur, India",
  "🌍 Worldwide Shipping Available",
  "🎁 Use Code GIFT15 for 15% Off",
  "🔄 Easy Exchanges",
];

const HERO_SLIDES = [
  {
    bg: "https://rayfinesite-3.onrender.com/images/wallpaper-1.jpg",
    eyebrow: "Festive Season",
    title: ["Celebrate in", "Style"],
    desc: "Adorn yourself for every celebration — from weddings to festivals, we have the perfect piece.",
  },
  {
    bg: "https://rayfinesite-3.onrender.com/images/wallpaper-pink.jpg",
    eyebrow: "Gift Someone Special",
    title: ["Gifted with", "Love"],
    desc: "Find the perfect jewellery gift for every occasion. Beautifully packaged, always cherished.",
  },
  {
    bg: "https://rayfinesite-3.onrender.com/images/wallpaper1.jpg.jpeg",
    eyebrow: "Ships Worldwide",
    title: ["Crafted with", "Love"],
    desc: "From Jaipur to your doorstep — across 140+ countries. Use code GIFT15 for 15% off your order.",
  },
];

const OCCASIONS = [
  { name: "Festive",        img: "https://rayfinesite-3.onrender.com/images/festive.jpg",     path: "/shop?cat=Necklace" },
  { name: "Gifting",        img: "https://rayfinesite-3.onrender.com/images/gifting.jpg",     path: "/shop?cat=Bracelet" },
  { name: "Party",          img: "https://rayfinesite-3.onrender.com/images/party.jpg",       path: "/shop?cat=Earring" },
  { name: "Traditional",    img: "https://rayfinesite-3.onrender.com/images/traditional.jpg", path: "/shop?cat=Necklace" },
  { name: "Vacation Ready", img: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400&q=80", path: "/shop?cat=Ring" },
  { name: "Bridal",         img: "https://rayfinesite-3.onrender.com/images/1000128664.jpg",  path: "/shop?cat=Necklace" },
  { name: "Everyday",       img: "https://rayfinesite-3.onrender.com/images/bracelet.jpg",    path: "/shop?cat=Bracelet" },
];

const CATEGORIES = [
  { name: "Earrings",        img: "https://rayfinesite-3.onrender.com/images/1000128648.jpg", path: "/shop?cat=Earring" },
  { name: "Necklaces",       img: "https://rayfinesite-3.onrender.com/images/necklace.jpg",   path: "/shop?cat=Necklace" },
  { name: "Pendants",        img: "https://rayfinesite-3.onrender.com/images/pendant-2.jpg",  path: "/shop?cat=Pendants" },
  { name: "Rings",           img: "https://rayfinesite-3.onrender.com/images/ring-cateo.jpg", path: "/shop?cat=Ring" },
  { name: "Bracelet",        img: "https://rayfinesite-3.onrender.com/images/1000128686.jpg", path: "/shop?cat=Bracelet" },
  { name: "Bangles",         img: "https://rayfinesite-3.onrender.com/images/bangles.jpg",    path: "/shop?cat=Bangle" },
  { name: "Gemstone Charms", img: "https://rayfinesite-3.onrender.com/images/pendant-3.jpg", path: "/shop?cat=Gemstone Charm" },
];

const TESTIMONIALS = [
  { name: "Ms. Heena Gupta",           text: "When it arrived, it was exactly as shown. So pretty. Very happy with my purchase!", product: "Katherine Bracelet",        rating: 5 },
  { name: "Ms. Bhavika Kakurlawala",   text: "The earrings are awesome & the bracelet is so elegant and easy to wear! Both pieces are just lovely.", product: "Swarovski Pearl Bracelet", rating: 5 },
  { name: "Ms. Tanya",                 text: "Found the most perfect gift! The moonstone was her sunshine stone. She was so happy.", product: "Multi Moonlight Bracelet",  rating: 5 },
  { name: "Ms. Priya Sharma",          text: "Absolutely stunning quality! The necklace looked even better in person. Will definitely order again.", product: "Gold Layered Necklace",    rating: 5 },
  { name: "Ms. Riya Patel",            text: "Fast delivery, beautiful packaging and the ring is gorgeous. Love it so much!", product: "Floral Statement Ring",      rating: 5 },
  { name: "Ms. Anika Mehta",           text: "The craftsmanship is incredible. You can tell it's made with so much care and love.", product: "Jaipur Heritage Earrings",   rating: 5 },
];

// ─────────────────────────────────────────────
// CURRENCY CONTEXT
// ─────────────────────────────────────────────
const CURRENCIES = [
  { code: "INR", symbol: "₹",    rate: 1 },
  { code: "USD", symbol: "$",    rate: 0.012 },
  { code: "AED", symbol: "AED ", rate: 0.044 },
  { code: "GBP", symbol: "£",    rate: 0.0095 },
  { code: "AUD", symbol: "A$",   rate: 0.018 },
];

const CurrencyContext = createContext({ currency: CURRENCIES[0], setCurrency: () => {} });
function useCurrency() { return useContext(CurrencyContext); }

function formatPrice(inr, currency) {
  if (!currency) return `₹${inr.toLocaleString()}`;
  const val = inr * currency.rate;
  return `${currency.symbol}${currency.code === "INR" ? Math.round(val).toLocaleString() : val.toFixed(2)}`;
}

// ─────────────────────────────────────────────
// RECENTLY VIEWED CONTEXT
// ─────────────────────────────────────────────
const RecentlyViewedContext = createContext({ viewed: [], addViewed: () => {} });
function useRecentlyViewed() { return useContext(RecentlyViewedContext); }

// ─────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────
const ToastContext = createContext({ showToast: () => {} });
function useToast() { return useContext(ToastContext); }

function ToastContainer({ toasts }) {
  return (
    <div style={{
      position: "fixed", bottom: "90px", right: "20px", zIndex: 99999,
      display: "flex", flexDirection: "column", gap: "10px",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#2C2418" : "#c0392b",
          color: "#fff", padding: "12px 20px", borderRadius: "6px",
          fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// CURRENCY DROPDOWN
// ─────────────────────────────────────────────
function CurrencyDropdown() {
  const { currency, setCurrency } = useCurrency();
  return (
    <select
      value={currency.code}
      onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
      style={{
        background: "transparent", border: "1px solid var(--border-light)",
        color: "var(--text)", fontSize: "11px", padding: "5px 7px",
        borderRadius: "4px", cursor: "pointer", fontFamily: "inherit",
        fontWeight: 600, letterSpacing: "0.5px", outline: "none",
      }}
    >
      {CURRENCIES.map(c => (
        <option key={c.code} value={c.code} style={{ background: "#fff", color: "#2C2418" }}>
          {c.code}
        </option>
      ))}
    </select>
  );
}

// ─────────────────────────────────────────────
// PINCODE CHECKER
// ─────────────────────────────────────────────
function PincodeChecker() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (pin.length !== 6 || isNaN(pin)) {
      setResult({ ok: false, msg: "Enter a valid 6-digit pincode" });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    const serviceable = parseInt(pin) % 7 !== 0;
    setResult({
      ok: serviceable,
      msg: serviceable
        ? `✓ Delivery available to ${pin} in 3-5 days`
        : `✕ Sorry, we don't deliver to ${pin} yet. Try WhatsApp ordering.`,
    });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
        Check Delivery
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Enter Pincode"
          value={pin}
          maxLength={6}
          onChange={e => { setPin(e.target.value); setResult(null); }}
          onKeyDown={e => e.key === "Enter" && check()}
          style={{
            flex: 1, padding: "9px 12px", borderRadius: "4px", fontSize: "13px",
            border: "1.5px solid var(--border)", outline: "none", fontFamily: "inherit",
            color: "var(--text)", background: "#fff",
          }}
        />
        <button
          onClick={check}
          disabled={loading}
          style={{
            padding: "9px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 700,
            letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer",
            background: "var(--text)", color: "#fff", border: "none",
          }}
        >
          {loading ? "..." : "Check"}
        </button>
      </div>
      {result && (
        <p style={{ fontSize: "12px", marginTop: 6, color: result.ok ? "#27ae60" : "#c0392b", fontWeight: 600 }}>
          {result.msg}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCT MODAL
// ─────────────────────────────────────────────
function ProductModal({ product, onClose, cart, setCart, wishlist, setWishlist }) {
  const { currency } = useCurrency();
  const { showToast } = useToast();
  const { addViewed } = useRecentlyViewed();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || "");
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const inWishlist = wishlist.find(w => w.id === product.id);
  const inCart = cart.find(c => c.id === product.id && c.selectedVariant === selectedVariant);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const images = product.images?.length ? product.images : [product.image];

  const addToCart = () => {
    if (!product.inStock) return;
    if (inCart) {
      setCart(cart.map(c =>
        c.id === product.id && c.selectedVariant === selectedVariant
          ? { ...c, quantity: c.quantity + qty }
          : c
      ));
    } else {
      setCart([...cart, { ...product, quantity: qty, selectedVariant }]);
    }
    showToast(`${product.name} added to cart!`, "success");
    onClose();
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      setWishlist(wishlist.filter(w => w.id !== product.id));
      showToast("Removed from wishlist", "error");
    } else {
      setWishlist([...wishlist, product]);
      showToast("Added to wishlist ♥", "success");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied!", "success");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    addViewed(product);
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(44,36,24,0.7)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "12px", maxWidth: "960px", width: "100%",
          maxHeight: "92vh", overflow: "auto", display: "flex", flexWrap: "wrap",
          boxShadow: "0 40px 100px rgba(44,36,24,0.22)",
        }}
      >
        {/* Image panel */}
        <div style={{ flex: "1 1 380px", position: "relative", minHeight: "400px", background: "#fdf8f4" }}>
          <img
            src={images[imgIdx] || product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", minHeight: "400px", objectFit: "cover", borderRadius: "12px 0 0 12px", display: "block" }}
            onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }}
          />
          {!product.inStock && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "#555", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OUT OF STOCK</div>
          )}
          {discount && product.inStock && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "var(--primary)", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>-{discount}% OFF</div>
          )}
          {images.length > 1 && (
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", background: i === imgIdx ? "var(--primary)" : "rgba(255,255,255,0.6)" }}
                />
              ))}
            </div>
          )}
          <button
            onClick={handleShare}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
            title="Share"
          >
            🔗
          </button>
        </div>

        {/* Details panel */}
        <div style={{ flex: "1 1 320px", padding: "36px 32px", overflowY: "auto" }}>
          <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#aaa", lineHeight: 1 }}>✕</button>
          <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 8 }}>{product.category}</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text)", fontSize: "28px", marginBottom: 12, fontWeight: 500, lineHeight: 1.2 }}>{product.name}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ color: "#E8B84B", fontSize: "14px" }}>★★★★★</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>4.9 (124 reviews)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--primary)" }}>{formatPrice(product.price, currency)}</span>
            {product.originalPrice && (
              <span style={{ textDecoration: "line-through", color: "var(--text-light)", fontSize: "16px" }}>{formatPrice(product.originalPrice, currency)}</span>
            )}
            {discount && (
              <span style={{ background: "#fff0f3", color: "var(--primary)", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Save {discount}%</span>
            )}
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.8", marginBottom: 20, fontSize: "14px" }}>{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontWeight: 700, marginBottom: 10, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Select Finish: <span style={{ color: "var(--primary)" }}>{selectedVariant}</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.variants.map(v => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    style={{ padding: "8px 16px", borderRadius: "2px", fontSize: "12px", cursor: "pointer", background: selectedVariant === v ? "var(--text)" : "#fff", color: selectedVariant === v ? "#fff" : "var(--text-muted)", border: selectedVariant === v ? "1.5px solid var(--text)" : "1.5px solid var(--border)", fontWeight: selectedVariant === v ? 700 : 400, transition: "all 0.2s" }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <p style={{ fontWeight: 700, marginBottom: 10, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>Quantity</p>
            <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1.5px solid var(--border)", borderRadius: "4px", width: "fit-content" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--text)" }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: "14px", color: "var(--text)" }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--text)" }}>+</button>
            </div>
          </div>

          <PincodeChecker />

          {product.material && (
            <div style={{ marginBottom: 10, fontSize: "13px", color: "var(--text-muted)" }}><strong>Material:</strong> {product.material}</div>
          )}
          {product.careInstructions && (
            <div style={{ marginBottom: 20, fontSize: "12px", color: "var(--text-muted)", background: "var(--cream)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-light)", lineHeight: 1.7 }}>
              <strong>✨ Care:</strong> {product.careInstructions}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button
              onClick={addToCart}
              disabled={!product.inStock}
              style={{ flex: 1, padding: 15, borderRadius: "2px", border: "none", cursor: product.inStock ? "pointer" : "not-allowed", background: product.inStock ? "var(--text)" : "#ccc", color: "#fff", fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", transition: "all 0.3s" }}
            >
              {!product.inStock ? "Out of Stock" : inCart ? "✓ Add More" : "Add to Cart"}
            </button>
            <button
              onClick={toggleWishlist}
              style={{ padding: "15px 18px", borderRadius: "2px", border: "1.5px solid var(--border)", background: inWishlist ? "var(--primary)" : "transparent", color: inWishlist ? "#fff" : "var(--text)", cursor: "pointer", fontSize: "18px", transition: "all 0.3s" }}
            >
              {inWishlist ? "❤️" : "🤍"}
            </button>
          </div>

          <a
            href={`https://wa.me/918690666771?text=Hi! I'm interested in ${encodeURIComponent(product.name)} (${formatPrice(product.price, currency)})`}
            target="_blank"
            rel="noreferrer"
            style={{ display: "block", textAlign: "center", padding: "13px", background: "#25D366", color: "#fff", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none" }}
          >
            💬 Order via WhatsApp
          </a>

          <div style={{ display: "flex", gap: 16, marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-light)", justifyContent: "center" }}>
            {[["🚚", "Free Delivery"], ["🔒", "Secure Pay"], ["🔄", "Easy Returns"]].map(([icon, label]) => (
              <div key={label} style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "18px", marginBottom: 3 }}>{icon}</div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ANNOUNCEMENT BAR
// ─────────────────────────────────────────────
function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % ANNOUNCEMENT_MESSAGES.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="announcement-bar">
      <span key={idx} className="announcement-text">{ANNOUNCEMENT_MESSAGES[idx]}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// WORLDWIDE STRIP
// ─────────────────────────────────────────────
function WorldwideStrip() {
  const items = [
    "🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇦🇪 UAE", "🇦🇺 Australia",
    "🇨🇦 Canada", "🇩🇪 Germany", "🇸🇬 Singapore", "🇯🇵 Japan", "🇳🇿 New Zealand",
    "🇿🇦 South Africa", "🌍 140+ Countries",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="worldwide-strip">
      <div className="worldwide-track">
        {doubled.map((item, i) => (
          <span key={i}>
            <span style={{ color: "var(--primary)", marginRight: 4 }}>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({ cart, wishlist, onCartOpen, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const loc = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [loc]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  return (
    <>
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(44,36,24,0.5)", zIndex: 10000, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "80px", backdropFilter: "blur(4px)" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#fff", width: "min(600px, 90vw)", borderRadius: "8px", padding: "20px", boxShadow: "0 20px 60px rgba(44,36,24,0.2)" }}
          >
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 10 }}>
              <input
                ref={searchRef}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search jewellery, categories..."
                style={{ flex: 1, padding: "14px 16px", fontSize: "16px", border: "1.5px solid var(--border)", borderRadius: "4px", outline: "none", fontFamily: "inherit", color: "var(--text)" }}
              />
              <button type="submit" style={{ padding: "14px 20px", background: "var(--text)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 700, fontSize: "13px" }}>Search</button>
            </form>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {["Earrings", "Necklace", "Bracelet", "Ring", "Anklet"].map(tag => (
                <button
                  key={tag}
                  onClick={() => { navigate(`/shop?cat=${tag}`); setSearchOpen(false); }}
                  style={{ padding: "6px 14px", borderRadius: "20px", background: "var(--cream)", border: "1px solid var(--border-light)", fontSize: "12px", cursor: "pointer", color: "var(--text-muted)", fontWeight: 600 }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="navbar" style={scrolled ? { boxShadow: "0 2px 20px rgba(176,122,90,0.10)" } : {}}>
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <svg width="160" height="40" viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="34" fontFamily="Cormorant Garamond, serif" fontSize="32" fontStyle="italic" fontWeight="300" fill="#B07A5A" letterSpacing="1">Ray</text>
            <text x="60" y="34" fontFamily="Cormorant Garamond, serif" fontSize="32" fontWeight="400" fill="#2C2418" letterSpacing="1"> Fine</text>
            <line x1="0" y1="40" x2="150" y2="40" stroke="#B07A5A" strokeWidth="0.6" opacity="0.3" />
            <text x="0" y="47" fontFamily="DM Sans, sans-serif" fontSize="7" fontWeight="300" fill="#8A7968" letterSpacing="5">ORNATES</text>
          </svg>
        </Link>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/"       className={loc.pathname === "/"        ? "active" : ""}>Home</Link>
          <Link to="/shop"   className={loc.pathname === "/shop"    ? "active" : ""}>Shop</Link>
          <Link to="/shop?cat=sale">Sale</Link>
          <Link to="/about"  className={loc.pathname === "/about"   ? "active" : ""}>About</Link>
          <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""}>Contact</Link>
          <Link to="/track"  className={loc.pathname === "/track"   ? "active" : ""}>Track Order</Link>
        </div>

        <div className="nav-actions">
          <CurrencyDropdown />
          <button className="nav-icon" onClick={() => setSearchOpen(true)} title="Search" style={{ background: "none", border: "none", cursor: "pointer" }}>🔍</button>
          <Link to="/wishlist" className="nav-icon" title="Wishlist">🤍 <span className="badge">{wishlist.length}</span></Link>
          <button className="nav-icon" onClick={onCartOpen} title="Cart">🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span></button>
          <Link to="/account" className="nav-icon" title={user ? `Hi, ${user.name || "Account"}` : "Account"}>
            {user
              ? <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--primary)" }}>{(user.name || user.email)[0].toUpperCase()}</span>
              : "👤"}
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? "✕" : "☰"}</button>
        </div>
      </nav>
    </>
  );
}

// ─────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────
function CartDrawer({ cart, setCart, open, onClose }) {
  const { currency } = useCurrency();
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "" });
  const [step, setStep] = useState("cart");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const GIFT_WRAP_PRICE = 99;
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);
  const grandTotal = total + (giftWrap ? GIFT_WRAP_PRICE : 0) - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "GIFT15") {
      const d = Math.round(total * 0.15);
      setDiscount(d);
      setCouponMsg(`✓ GIFT15 applied! You save ${formatPrice(d, currency)}`);
    } else {
      setDiscount(0);
      setCouponMsg("✕ Invalid coupon code");
    }
  };

  // FIX: use item._id || item.id consistently
  const updateQty = (itemId, delta) => {
    setCart(prev =>
      prev
        .map(p => (p._id || p.id) === itemId ? { ...p, quantity: p.quantity + delta } : p)
        .filter(p => p.quantity > 0)
    );
  };

  const placeOrder = () => alert("Payment integration pending");

  return (
    <>
      <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h3>{step === "cart" ? `Your Cart (${cart.length})` : "Checkout"}</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {step === "cart" ? (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
                <p style={{ marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", color: "var(--text)" }}>Your cart is empty</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>Discover our beautiful collection</p>
                <Link to="/shop" className="btn-primary" style={{ display: "inline-block" }} onClick={onClose}>Shop Now</Link>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div className="cart-item" key={(item._id || item.id) + (item.selectedVariant || "")}>
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={e => { e.target.src = "https://placehold.co/76x76?text=Item"; }}
                    />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      {item.selectedVariant && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: 4 }}>{item.selectedVariant}</p>}
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <p className="cart-item-price">{formatPrice(item.price, currency)}</p>
                        {item.originalPrice && <p className="cart-item-original">{formatPrice(item.originalPrice, currency)}</p>}
                      </div>
                      <div className="qty-controls">
                        <button onClick={() => updateQty(item._id || item.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item._id || item.id, 1)}>+</button>
                      </div>
                    </div>
                    <button className="cart-item-remove" onClick={() => updateQty(item._id || item.id, -item.quantity)}>🗑</button>
                  </div>
                ))}

                <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-light)" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Have a Coupon?</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      placeholder="Enter code (try GIFT15)"
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value); setCouponMsg(""); }}
                      style={{ flex: 1, padding: "9px 12px", borderRadius: "4px", fontSize: "12px", border: "1.5px solid var(--border)", outline: "none", fontFamily: "inherit" }}
                    />
                    <button onClick={applyCoupon} style={{ padding: "9px 14px", background: "var(--text)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Apply</button>
                  </div>
                  {couponMsg && <p style={{ fontSize: "11px", marginTop: 6, color: discount > 0 ? "#27ae60" : "#c0392b", fontWeight: 600 }}>{couponMsg}</p>}
                </div>

                <div style={{ padding: "0 20px 16px", borderBottom: "1px solid var(--border-light)" }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={e => setGiftWrap(e.target.checked)}
                      style={{ marginTop: 3, accentColor: "var(--primary)", width: 16, height: 16 }}
                    />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>🎁 Add Gift Wrapping (+{formatPrice(GIFT_WRAP_PRICE, currency)})</p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Premium box with ribbon & handwritten note</p>
                    </div>
                  </label>
                  {giftWrap && (
                    <textarea
                      placeholder="Add a personal gift message..."
                      value={giftNote}
                      onChange={e => setGiftNote(e.target.value)}
                      rows={2}
                      style={{ width: "100%", marginTop: 10, padding: "10px 12px", borderRadius: "4px", border: "1.5px solid var(--border)", fontSize: "12px", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box", color: "var(--text)" }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="checkout-form">
            <h4 style={{ color: "var(--primary)", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 500 }}>Delivery Details</h4>
            <input placeholder="Full Name *"         value={customer.name}    onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            <input placeholder="Phone Number *"      value={customer.phone}   onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            <input placeholder="Delivery Address"    value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
            <div className="order-summary">
              <h5>Order Summary</h5>
              {cart.map(item => (
                <div key={item._id || item.id} className="order-summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity, currency)}</span>
                </div>
              ))}
              {discount > 0 && <div className="order-summary-item" style={{ color: "#27ae60" }}><span>Coupon Discount</span><span>-{formatPrice(discount, currency)}</span></div>}
              {giftWrap && <div className="order-summary-item"><span>🎁 Gift Wrapping</span><span>{formatPrice(GIFT_WRAP_PRICE, currency)}</span></div>}
              <div className="order-summary-total"><span>Total</span><strong>{formatPrice(grandTotal, currency)}</strong></div>
            </div>
            <button className="btn-checkout" onClick={placeOrder}>Pay {formatPrice(grandTotal, currency)} →</button>
            <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
          </div>
        )}

        {step === "cart" && cart.length > 0 && (
          <div className="cart-footer">
            {savings > 0 && <div className="cart-savings">🎉 You save {formatPrice(savings, currency)}!</div>}
            <div className="cart-total">
              <span>Total</span>
              <div style={{ textAlign: "right" }}>
                <strong>{formatPrice(grandTotal, currency)}</strong>
                {(discount > 0 || giftWrap) && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {discount > 0 ? `Coupon: -${formatPrice(discount, currency)} ` : ""}
                    {giftWrap ? `+ 🎁 ${formatPrice(GIFT_WRAP_PRICE, currency)}` : ""}
                  </div>
                )}
              </div>
            </div>
            <button className="btn-checkout" onClick={() => setStep("checkout")}>Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────
function ProductCard({ product, cart, setCart, wishlist, setWishlist }) {
  const { currency } = useCurrency();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inWishlist = wishlist.find(w => w.id === product.id);
  const inCart = cart.find(c => c.id === product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const addToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    if (inCart) {
      setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`${product.name} added!`, "success");
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      setWishlist(wishlist.filter(w => w.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
      showToast("Added to wishlist ♥", "success");
    }
  };

  return (
    <>
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
        />
      )}
      <div
        className="product-card"
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer", opacity: product.inStock ? 1 : 0.7 }}
      >
        <div className="product-img-wrap">
          <img
            src={product.image}
            alt={product.name}
            onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }}
          />
          <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}>
            {inWishlist ? "❤️" : "🤍"}
          </button>
          {!product.inStock && <div className="sale-badge" style={{ background: "#555" }}>Out of Stock</div>}
          {discount && product.inStock && <div className="sale-badge">-{discount}%</div>}
          {product.isNew && product.inStock && !discount && <div className="sale-badge" style={{ background: "#2C2418" }}>✨ New</div>}
          {product.isBestseller && product.inStock && !discount && !product.isNew && <div className="sale-badge" style={{ background: "#8B6914" }}>⭐ Bestseller</div>}
          <div className="product-category-tag">{product.category}</div>
          {product.inStock && (
            <button
              className="quick-add-btn"
              onClick={addToCart}
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "12px", background: "rgba(44,36,24,0.9)", color: "#fff",
                border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700,
                letterSpacing: "2px", textTransform: "uppercase",
                transform: hovered ? "translateY(0)" : "translateY(100%)",
                transition: "transform 0.3s ease",
              }}
            >
              {inCart ? "✓ Added" : "Quick Add +"}
            </button>
          )}
        </div>
        <div className="product-info">
          <h4>{product.name}</h4>
          <p className="product-desc">{product.description?.substring(0, 75)}...</p>
          {product.variants && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
              {product.variants.slice(0, 3).map(v => (
                <span key={v} style={{ fontSize: "10px", background: "var(--cream)", padding: "2px 8px", borderRadius: "10px", color: "var(--text-muted)" }}>{v}</span>
              ))}
            </div>
          )}
          <div className="price-wrap">
            <span className="price-current">{formatPrice(product.price, currency)}</span>
            {product.originalPrice && <span className="price-original">{formatPrice(product.originalPrice, currency)}</span>}
          </div>
          <button className={`btn-add-cart ${inCart ? "added" : ""}`} onClick={addToCart} disabled={!product.inStock}>
            {!product.inStock ? "Out of Stock" : inCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// SECTION DIVIDER
// ─────────────────────────────────────────────
function SectionDivider({ subtitle, title }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "52px" }}>
      <p className="section-subtitle">{subtitle}</p>
      <h2 className="section-title">{title}</h2>
      <div className="section-divider">
        <div className="section-divider-line"></div>
        <div className="section-divider-diamond"></div>
        <div className="section-divider-line"></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TRUST STRIP
// ─────────────────────────────────────────────
function TrustStrip() {
  return (
    <div className="trust-strip">
      {[
        { icon: "🚚", title: "Free Delivery",    sub: "On all orders" },
        { icon: "💎", title: "Handcrafted",      sub: "Jaipur artisans" },
        { icon: "🌍", title: "Shipped Globally", sub: "140+ countries" },
        { icon: "🔒", title: "Secure Payment",   sub: "100% safe" },
      ].map(item => (
        <div className="trust-item" key={item.title}>
          <div className="trust-item-icon">{item.icon}</div>
          <div className="trust-item-title">{item.title}</div>
          <div className="trust-item-sub">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// PLATFORMS SECTION
// ─────────────────────────────────────────────
function PlatformsSection() {
  const platforms = [
    { icon: "📸", name: "Instagram", handle: "@rayfineornates",     url: "https://www.instagram.com/rayfineornates/" },
    { icon: "👍", name: "Facebook",  handle: "Ray Fine Ornates",    url: "https://www.facebook.com/rayfineornatesjewellery" },
    { icon: "📌", name: "Pinterest", handle: "rayfineornates",      url: "https://in.pinterest.com/rayfineornates/" },
  ];
  return (
    <div className="platforms-section">
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <p className="section-subtitle">Find Us On</p>
        <h2 className="section-title" style={{ fontSize: "clamp(20px,2.5vw,30px)" }}>Available on Our Platforms</h2>
      </div>
      <div className="platforms-grid" style={{ gap: "28px", flexWrap: "wrap" }}>
        {platforms.map(p => (
          <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="platform-item" style={{ textDecoration: "none" }}>
            <div className="platform-icon">{p.icon}</div>
            <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "13px" }}>{p.name}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.handle}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO SLIDER
// ─────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(p => (p + 1) % HERO_SLIDES.length), []);
  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);
  const slide = HERO_SLIDES[current];
  return (
    <section className="hero">
      {HERO_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hero-bg ${i === current ? "active" : "inactive"}`}
          style={{ backgroundImage: `url(${s.bg})` }}
        />
      ))}
      <div className="hero-overlay">
        <div className="hero-eyebrow" key={current + "eyebrow"}>
          <div className="hero-eyebrow-line" />
          <span className="hero-sub">{slide.eyebrow}</span>
        </div>
        <h1 key={current + "h1"}>{slide.title[0]}<br /><span>{slide.title[1]}</span></h1>
        <p className="hero-desc" key={current + "desc"}>{slide.desc}</p>
        <div className="hero-btns" key={current + "btns"}>
          <Link to="/shop" className="btn-primary">Explore Collection</Link>
          <Link to="/about" className="btn-outline">Our Story</Link>
        </div>
      </div>
      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <div key={i} className={`dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ORDER TRACKING
// ─────────────────────────────────────────────
function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async () => {
    if (!orderId.trim() && !phone.trim()) {
      setError("Please enter your Order ID or Phone Number.");
      return;
    }
    setError(""); setLoading(true); setResult(null);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setResult({ found: false });
  };

  const inputStyle = {
    padding: "13px 16px", borderRadius: "6px", border: "1.5px solid var(--border, #d9ccc2)",
    fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff",
    color: "var(--text, #2C2418)", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #fdf8f4 0%, #f5ede4 100%)", border: "1px solid var(--border-light)", borderRadius: "16px", padding: "36px 32px", maxWidth: "540px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "36px", marginBottom: "10px" }}>📦</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "26px", fontWeight: 500, color: "var(--text)", marginBottom: "6px" }}>Track Your Order</h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>Enter your Order ID or registered phone number to check your delivery status.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        <input
          placeholder="Order ID (e.g. RFO-2024-1234)"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "var(--primary)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        <div style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "1px" }}>— OR —</div>
        <input
          placeholder="Registered Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "var(--primary)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
      </div>
      {error && <p style={{ color: "#c0392b", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>{error}</p>}
      <button
        onClick={trackOrder}
        disabled={loading}
        style={{ width: "100%", padding: "14px", background: loading ? "#c4a98a" : "var(--primary)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.3s", marginBottom: "16px" }}
      >
        {loading ? "Tracking..." : "Track Order →"}
      </button>
      {result && !result.found && (
        <div style={{ background: "#fff8f5", border: "1px solid #f0ddd0", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔍</div>
          <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "6px", fontSize: "15px" }}>Order Not Found</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", lineHeight: 1.6 }}>We couldn't find this order. Please double-check your details or contact us on WhatsApp.</p>
          <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "10px 24px", background: "#25D366", color: "#fff", borderRadius: "6px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textDecoration: "none", textTransform: "uppercase" }}>💬 WhatsApp Us</a>
        </div>
      )}
      <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)", marginTop: "14px" }}>
        Need help?{" "}
        <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>WhatsApp us</a>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// TRACK ORDER PAGE
// ─────────────────────────────────────────────
function TrackOrderPage() {
  return (
    <div className="page-content">
      <div className="shop-hero">
        <p className="section-subtitle" style={{ marginBottom: "12px" }}>Real-Time Updates</p>
        <h1>Track Your Order</h1>
        <p>Know exactly where your jewellery is</p>
      </div>
      <div style={{ padding: "60px 24px 100px" }}><OrderTracking /></div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RECENTLY VIEWED
// ─────────────────────────────────────────────
function RecentlyViewedSection({ cart, setCart, wishlist, setWishlist }) {
  const { viewed } = useRecentlyViewed();
  if (viewed.length === 0) return null;
  return (
    <section className="featured-section" style={{ background: "#fff", paddingTop: "60px" }}>
      <SectionDivider subtitle="Your Browsing History" title="Recently Viewed" />
      <div className="products-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {viewed.slice(0, 6).map(p => (
          <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// BESTSELLERS SECTION — horizontal scroll
// ─────────────────────────────────────────────
function BestsellersSection({ cart, setCart, wishlist, setWishlist }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://rayfinesite-3.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const fixed = list.map(p => ({
          ...p,
          id: p._id || p.id,
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim(),
          isBestseller: true,
        }));
        setProducts(fixed.filter(p => p.inStock).slice(0, 10));
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <section style={{ padding: "60px 0", background: "var(--cream)" }}>
        <div style={{ padding: "0 40px", textAlign: "center", color: "var(--text-muted)", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>
          Loading bestsellers...
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section style={{ padding: "60px 0", background: "var(--cream)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 40px 28px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600, marginBottom: 6 }}>Most Loved</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, color: "var(--text)" }}>Our Best Sellers</h2>
        </div>
        <Link to="/shop" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--primary)", textDecoration: "none", borderBottom: "1px solid var(--primary)", paddingBottom: 2 }}>View All</Link>
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 40px 16px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
        {products.map(p => (
          <div key={p._id || p.id} style={{ minWidth: 200, maxWidth: 200, flexShrink: 0, scrollSnapAlign: "start" }}>
            <ProductCard product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SHOP BY OCCASION — horizontal scroll
// ─────────────────────────────────────────────
function OccasionSection() {
  return (
    <section style={{ padding: "60px 0", background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 40px 28px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600, marginBottom: 6 }}>Find Your Perfect Piece</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, color: "var(--text)" }}>Shop by Occasion</h2>
        </div>
        <Link to="/shop" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--primary)", textDecoration: "none", borderBottom: "1px solid var(--primary)", paddingBottom: 2 }}>View All</Link>
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 40px 16px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
        {OCCASIONS.map(occ => (
          <Link
            key={occ.name}
            to={occ.path}
            style={{
              minWidth: 160, maxWidth: 160, flexShrink: 0, scrollSnapAlign: "start",
              position: "relative", borderRadius: "10px", overflow: "hidden",
              textDecoration: "none", display: "block", aspectRatio: "3/4",
              boxShadow: "0 4px 20px rgba(44,36,24,0.10)", transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(44,36,24,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(44,36,24,0.10)"; }}
          >
            <img
              src={occ.img}
              alt={occ.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.target.src = "https://placehold.co/160x213?text=Jewellery"; }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(44,36,24,0.80) 0%, rgba(44,36,24,0.08) 55%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 12px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "16px", fontWeight: 500, color: "#fff", letterSpacing: "0.5px", textAlign: "center" }}>{occ.name}</span>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "8px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>Shop Now →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SHOP BY CATEGORY — cat-square-grid (inline on home)
// ─────────────────────────────────────────────
function CategorySection() {
  return (
    <section className="categories-section">
      <SectionDivider subtitle="Browse by Style" title="Shop by Category" />
      <div className="cat-square-grid">
        {CATEGORIES.map(cat => (
          <Link to={cat.path} key={cat.name} className="cat-square-card">
            <img src={cat.img} alt={cat.name} onError={e => { e.target.src = `https://placehold.co/300x300?text=${cat.name}`; }} />
            <div className="cat-square-overlay">
              <span className="cat-square-name">{cat.name}</span>
              <span className="cat-square-cta">Shop Now →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// REVIEWS SECTION — NEW, enhanced carousel
// ─────────────────────────────────────────────
function ReviewsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const VISIBLE = 3; // cards visible at once on desktop
  const total = TESTIMONIALS.length;

  const goTo = (idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIdx((idx + total) % total);
    setTimeout(() => setIsAnimating(false), 400);
  };

  // auto-advance
  useEffect(() => {
    const t = setInterval(() => goTo(activeIdx + 1), 4500);
    return () => clearInterval(t);
  }, [activeIdx]);

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <section style={{ padding: "80px 0", background: "linear-gradient(135deg, #fdf8f4 0%, #f0e8df 100%)", overflow: "hidden" }}>
      <SectionDivider subtitle="Customer Love" title="What They Say" />

      {/* Stats row */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "60px",
        marginBottom: "52px", flexWrap: "wrap", padding: "0 40px",
      }}>
        {[
          { value: "10,000+", label: "Happy Customers" },
          { value: "4.9★",    label: "Average Rating" },
          { value: "140+",    label: "Countries Served" },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, color: "var(--primary)", lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 6, fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", padding: "0 60px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${VISIBLE}, 1fr)`,
          gap: "20px",
          transition: "opacity 0.4s ease",
          opacity: isAnimating ? 0.7 : 1,
        }}
          className="reviews-grid-responsive"
        >
          {Array.from({ length: VISIBLE }).map((_, offset) => {
            const review = TESTIMONIALS[(activeIdx + offset) % total];
            return (
              <div
                key={review.name + offset}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "32px 28px",
                  boxShadow: offset === 1
                    ? "0 16px 48px rgba(44,36,24,0.14)"
                    : "0 4px 20px rgba(44,36,24,0.07)",
                  border: offset === 1
                    ? "1.5px solid var(--primary)"
                    : "1px solid var(--border-light)",
                  transform: offset === 1 ? "translateY(-8px)" : "translateY(0)",
                  transition: "all 0.4s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {offset === 1 && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    background: "var(--primary)", color: "#fff",
                    fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px",
                    textTransform: "uppercase", padding: "5px 12px",
                    borderRadius: "0 0 0 8px",
                  }}>
                    ★ Featured
                  </div>
                )}
                {/* Large quote mark */}
                <div style={{
                  fontSize: "64px", lineHeight: "40px", color: "var(--primary)",
                  opacity: 0.12, fontFamily: "Georgia, serif", marginBottom: 12,
                  fontWeight: 700,
                }}>
                  "
                </div>
                <div style={{ color: "#E8B84B", fontSize: "16px", marginBottom: 12, letterSpacing: "2px" }}>
                  {stars(review.rating)}
                </div>
                <p style={{
                  color: "var(--text-muted)", lineHeight: "1.75", fontSize: "14px",
                  fontStyle: "italic", marginBottom: 20, minHeight: "80px",
                }}>
                  "{review.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary), #E8B84B)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "16px",
                    fontFamily: "Cormorant Garamond, serif", flexShrink: 0,
                  }}>
                    {review.name[4].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text)", fontSize: "13px", marginBottom: 2 }}>{review.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 600 }}>Bought: {review.product}</p>
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "12px", color: "#27ae60", fontWeight: 700 }}>✓ Verified Purchase</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prev / Next arrows */}
        {[
          { dir: -1, style: { left: 12 }, label: "←" },
          { dir:  1, style: { right: 12 }, label: "→" },
        ].map(({ dir, style, label }) => (
          <button
            key={label}
            onClick={() => goTo(activeIdx + dir)}
            style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              ...style,
              width: 40, height: 40, borderRadius: "50%",
              background: "#fff", border: "1.5px solid var(--border)",
              cursor: "pointer", fontSize: "18px", color: "var(--primary)",
              boxShadow: "0 4px 12px rgba(44,36,24,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--primary)"; }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === activeIdx ? 24 : 8,
              height: 8, borderRadius: "4px", border: "none",
              cursor: "pointer", transition: "all 0.3s",
              background: i === activeIdx ? "var(--primary)" : "rgba(176,122,90,0.25)",
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: 16 }}>
          Join 10,000+ happy customers across 140 countries
        </p>
        <Link to="/shop" className="btn-primary">Shop Our Collection</Link>
      </div>

      {/* Responsive style override */}
      <style>{`
        @media (max-width: 768px) {
          .reviews-grid-responsive {
            grid-template-columns: 1fr !important;
          }
          .reviews-grid-responsive > *:not(:first-child) {
            display: none;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .reviews-grid-responsive {
            grid-template-columns: 1fr 1fr !important;
          }
          .reviews-grid-responsive > *:nth-child(3) {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────
// TRENDING SECTION — full grid from API
// ─────────────────────────────────────────────
function TrendingSection({ cart, setCart, wishlist, setWishlist }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://rayfinesite-3.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const fixed = list.map((p, i) => ({
          ...p,
          id: p._id || p.id,
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim(),
          isNew: i < 4,
        }));
        setFeatured(fixed.slice(0, 8));
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <section className="featured-section">
      <SectionDivider subtitle="Curated For You" title="Trending Now" />
      {loading ? (
        <p style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontStyle: "italic" }}>
          Loading collection...
        </p>
      ) : (
        <>
          <div className="products-grid">
            {featured.map(p => (
              <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "52px" }}>
            <Link to="/shop" className="btn-primary">View All Products</Link>
          </div>
        </>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function Home({ cart, setCart, wishlist, setWishlist }) {
  return (
    <>
      <HeroSlider />

      <div className="sale-banner">
        <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
        <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
      </div>

      <TrustStrip />
      <WorldwideStrip />

      {/* 1. Shop by Occasion — horizontal scroll */}
      <OccasionSection />

      {/* 2. Best Sellers — horizontal scroll */}
      <BestsellersSection cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />

      {/* 3. Shop by Category — grid */}
      <CategorySection />

      {/* 4. Trending Now — product grid */}
      <TrendingSection cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />

      {/* 5. Reviews / Testimonials — carousel */}
      <ReviewsSection />

      {/* 6. Social Platforms */}
      <PlatformsSection />
    </>
  );
}

// ─────────────────────────────────────────────
// SHOP PAGE
// ─────────────────────────────────────────────
function Shop({ cart, setCart, wishlist, setWishlist }) {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("cat") || "All");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState([]);
  const [showInStock, setShowInStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("cat");
    const q = searchParams.get("search");
    if (cat) setCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    fetch("https://rayfinesite-3.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const fixed = list.map(p => ({
          ...p,
          id: p._id || p.id,
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim(),
        }));
        setProducts(fixed);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  let filtered = products.filter(p => {
    const matchCat = category === "All"
      ? true
      : category === "sale"
      ? p.originalPrice
      : (p.category || "").toLowerCase().trim() === category.toLowerCase().trim();
    const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStock = showInStock ? p.inStock : true;
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchCat && matchSearch && matchStock && matchPrice;
  });

  if (sort === "low")    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high")   filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "newest") filtered = [...filtered].reverse();

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <p className="section-subtitle" style={{ marginBottom: "12px" }}>Handcrafted in Jaipur</p>
        <h1>Our Collection</h1>
        <p>Discover timeless pieces crafted with love</p>
      </div>
      <div className="shop-controls">
        <input className="shop-search" placeholder="🔍 Search jewellery..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="shop-sort" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort: Featured</option>
          <option value="newest">Sort: Newest</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
        <button
          onClick={() => setShowInStock(!showInStock)}
          style={{ padding: "10px 18px", borderRadius: "2px", border: "none", cursor: "pointer", background: showInStock ? "var(--text)" : "var(--cream)", color: showInStock ? "#fff" : "var(--text-muted)", fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", minHeight: "44px" }}
        >
          {showInStock ? "✓ In Stock" : "All Products"}
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{ padding: "10px 18px", borderRadius: "2px", border: "1.5px solid var(--border)", cursor: "pointer", background: showFilters ? "var(--cream)" : "transparent", color: "var(--text-muted)", fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", minHeight: "44px" }}
        >
          ⚙ Filters
        </button>
      </div>
      {showFilters && (
        <div style={{ padding: "20px 40px", background: "var(--cream)", borderBottom: "1px solid var(--border-light)" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
            Price Range: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", maxWidth: 400 }}>
            <input type="range" min={0} max={50000} step={500} value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              style={{ flex: 1, accentColor: "var(--primary)" }}
            />
            <button
              onClick={() => setPriceRange([0, 50000])}
              style={{ padding: "6px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: "transparent", border: "1.5px solid var(--border)", borderRadius: "2px", cursor: "pointer", color: "var(--text-muted)" }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
      <div className="category-tabs">
        {["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Sale 🔥"].map(cat => (
          <button
            key={cat}
            className={`cat-tab ${(cat === "Sale 🔥" ? category === "sale" : category === cat) ? "active" : ""}`}
            onClick={() => setCategory(cat === "Sale 🔥" ? "sale" : cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {!loading && <p style={{ textAlign: "right", padding: "0 40px 16px", fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{filtered.length} piece{filtered.length !== 1 ? "s" : ""} found</p>}
      {loading && <p style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontStyle: "italic" }}>Loading collection...</p>}
      {!loading && (
        <div className="products-grid" style={{ padding: "0 40px 80px" }}>
          {filtered.map(p => (
            <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: 16 }}>🔍</div>
          <p style={{ color: "var(--text-muted)", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontStyle: "italic", marginBottom: 20 }}>No pieces found.</p>
          <button onClick={() => { setSearch(""); setCategory("All"); setPriceRange([0, 50000]); }} className="btn-primary">Clear Filters</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────
function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  return (
    <div className="shop-page">
      <div className="shop-hero">
        <h1>Your Wishlist</h1>
        <p>{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
      </div>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>🤍</div>
          <p style={{ color: "var(--text-muted)", fontSize: "18px", marginBottom: "28px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>No items saved yet</p>
          <Link to="/shop" className="btn-primary">Explore Collection</Link>
        </div>
      ) : (
        <>
          <div className="products-grid" style={{ padding: "40px" }}>
            {wishlist.map(p => (
              <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
            ))}
          </div>
          <div style={{ textAlign: "center", padding: "0 0 60px" }}>
            <button
              onClick={() => {
                wishlist.forEach(p => {
                  if (p.inStock) {
                    setCart(prev => {
                      const exists = prev.find(c => c.id === (p._id || p.id));
                      return exists
                        ? prev.map(c => c.id === (p._id || p.id) ? { ...c, quantity: c.quantity + 1 } : c)
                        : [...prev, { ...p, id: p._id || p.id, quantity: 1 }];
                    });
                  }
                });
              }}
              className="btn-primary"
            >
              Add All to Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────
function About() {
  const aboutPlatforms = [
    { icon: "📸", name: "Instagram", url: "https://www.instagram.com/rayfineornates/",             handle: "@rayfineornates" },
    { icon: "👍", name: "Facebook",  url: "https://www.facebook.com/rayfineornatesjewellery",      handle: "Ray Fine Ornates" },
    { icon: "📌", name: "Pinterest", url: "https://in.pinterest.com/rayfineornates/",              handle: "rayfineornates" },
  ];
  return (
    <div className="page-content">
      <div className="shop-hero">
        <p className="section-subtitle" style={{ marginBottom: "12px" }}>Est. 2021 · Jaipur, India</p>
        <h1>Our Story</h1>
        <p>Crafting elegance since 2021</p>
      </div>
      <div className="about-grid">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>Ray Fine Ornates is a luxury fashion jewellery brand based in the heart of Johari Bazar, Jaipur — India's jewellery capital. We believe every woman deserves to feel like royalty.</p>
          <p>Our pieces are crafted with precision, using the finest materials to create jewellery that is both timeless and contemporary. From delicate studs to statement necklaces, each piece tells a story.</p>
          <h2>Our Promise</h2>
          <p>Quality you can feel. Beauty you can see. Service you can trust. We stand behind every piece we create with our dedication to craftsmanship and customer satisfaction.</p>
          <h2>Worldwide Reach</h2>
          <p>We ship to 140+ countries across the globe. From India to the USA, UAE to Australia — our jewellery reaches every corner of the world.</p>
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80" alt="Ray Fine Ornates" />
        </div>
      </div>
      <div style={{ background: "var(--cream)", padding: "60px 40px", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p className="section-subtitle">Find Us Everywhere</p>
          <h2 className="section-title" style={{ fontSize: "clamp(22px, 3vw, 36px)" }}>Available On</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", maxWidth: "960px", margin: "0 auto" }}>
          {aboutPlatforms.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "24px 20px", background: "#fff", border: "1px solid var(--border-light)", borderRadius: "12px", textDecoration: "none", minWidth: "120px", flex: "1 1 120px", maxWidth: "140px", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(176,122,90,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: "28px" }}>{p.icon}</div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", textAlign: "center" }}>{p.name}</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center", letterSpacing: "0.5px" }}>{p.handle}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="about-stats">
        {[["2021", "Founded"], ["10,000+", "Happy Customers"], ["140+", "Countries Shipped"]].map(([n, l]) => (
          <div className="stat-box" key={l}><h3>{n}</h3><p>{l}</p></div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <div className="page-content">
      <div className="shop-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you</p>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="contact-item">📧 <a href="mailto:info@rayfineornates.com">info@rayfineornates.com</a></div>
          <div className="contact-item">📍 Johari Bazar, Jaipur 302003<br />(10:30 AM – 8:30 PM)</div>
          <div className="contact-item" style={{ marginTop: "12px" }}>
            <Link to="/track" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none", fontSize: "14px" }}>📦 Track Your Order →</Link>
          </div>
          <div className="social-links">
            <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
          </div>
        </div>
        <div className="contact-form">
          <input placeholder="Your Name"    value={form.name}    onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Your Email"   value={form.email}   onChange={e => setForm({ ...form, email: e.target.value })} />
          <textarea placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          <button className="btn-primary" onClick={() => alert("Message sent! We'll get back to you soon.")}>Send Message</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TERMS
// ─────────────────────────────────────────────
function Terms() {
  return (
    <div className="page-content">
      <div className="shop-hero">
        <h1>Terms &amp; Conditions</h1>
        <p>Ray Fine Ornates Policies &amp; Information</p>
      </div>
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px 40px", lineHeight: "1.8" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 400, marginBottom: "24px" }}>Terms &amp; Conditions</h2>
        {[
          ["1. General Information",    "Ray Fine Ornates is a Jaipur-based jewelry brand specializing in handcrafted jewelry made with precious, semi-precious, natural, and lab-created stones. All products are handcrafted and may have slight variations, making each piece unique."],
          ["2. Product Information",    "We make every effort to display product images, colors, materials, and descriptions accurately. However, slight differences may occur due to lighting, screen settings, photography, and the handmade nature of our jewelry."],
          ["3. Pricing",               "All prices displayed on the website are subject to change without prior notice."],
          ["4. Orders & Payments",     "Orders are confirmed only after successful payment verification."],
          ["5. Shipping & Delivery",   "We aim to dispatch orders within the mentioned processing time. Delivery timelines may vary."],
          ["6. Returns & Exchanges",   "We accept returns or exchanges only according to our Return Policy."],
          ["7. Handmade Disclaimer",   "Slight irregularities are natural characteristics of handmade jewelry and should not be considered defects."],
          ["8. Intellectual Property", "All website content belongs to Ray Fine Ornates and may not be copied without written permission."],
          ["9. Privacy",               "Customer information is kept secure and used only for order processing and communication."],
          ["10. Governing Law",        "These Terms are governed by the laws of India. Disputes are subject to Jaipur jurisdiction."],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--text)", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.9" }}>{text}</p>
          </div>
        ))}
        <hr style={{ margin: "48px 0", borderColor: "var(--border-light)" }} />
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 400, marginBottom: "24px" }}>Refund &amp; Cancellation Policy</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Customers may request order cancellation within 24 hours by contacting us at <strong>+91 8690666771</strong>. Refunds are accepted only in genuine cases such as damaged packages or incorrect products.</p>
        <hr style={{ margin: "48px 0", borderColor: "var(--border-light)" }} />
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 400, marginBottom: "24px" }}>Frequently Asked Questions</h2>
        {[
          ["What type of jewelry does Ray Fine Ornates offer?", "We specialize in handcrafted gold-plated jewelry featuring precious, semi-precious, natural, and lab-created stones."],
          ["Do you ship internationally?", "Yes, we ship worldwide to 140+ countries."],
          ["Can I cancel my order?", "Yes, within 24 hours of placing the order by contacting us at +91 8690666771."],
          ["How should I care for my jewelry?", "Keep away from water and perfumes, store in a dry airtight pouch."],
          ["Where is your store located?", "223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003."],
        ].map(([q, a]) => (
          <details key={q} style={{ marginBottom: "10px", padding: "14px 18px", border: "1px solid var(--border-light)", borderRadius: "8px", background: "#fff" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "15px", color: "var(--text)" }}>{q}</summary>
            <p style={{ marginTop: "12px", color: "var(--text-muted)", lineHeight: "1.7" }}>{a}</p>
          </details>
        ))}
        <hr style={{ margin: "48px 0", borderColor: "var(--border-light)" }} />
        <div style={{ background: "var(--cream)", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "22px", marginBottom: "12px" }}>Contact Information</h3>
          <p style={{ color: "var(--text-muted)" }}><strong>Phone:</strong> +91 8690666771</p>
          <p style={{ color: "var(--text-muted)" }}><strong>Address:</strong> 223, 1st Floor, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003</p>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}><strong>Hours:</strong> Monday–Saturday, 10:00 AM–7:00 PM</p>
          <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="btn-primary">WhatsApp Us</a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>Ray Fine Ornates</h4>
          <p className="footer-brand-desc">Luxury fashion jewellery crafted for the modern woman. Handmade by artisans in the jewellery capital of India — Jaipur.</p>
          <p className="footer-brand-desc" style={{ marginTop: "8px", color: "var(--primary)", fontSize: "12px", letterSpacing: "1px" }}>Est. 2021 · Johari Bazar, Jaipur</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/shop?cat=sale">Sale</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/track">Track Order</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
        <div>
          <h4>Categories</h4>
          {["Earrings", "Necklaces", "Bracelets", "Rings", "Anklets", "Gemstone Charms", "Bangles", "Pendants"].map(c => (
            <Link to={`/shop?cat=${c.replace(/s$/, "")}`} key={c}>{c}</Link>
          ))}
        </div>
        <div>
          <h4>Contact Us</h4>
          <div className="footer-contact-item"><span className="footer-contact-icon">✉</span><span style={{ fontSize: "13px", color: "var(--text-muted)" }}>info@rayfineornates.com</span></div>
          <div className="footer-contact-item"><span className="footer-contact-icon">📍</span><span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Johari Bazar, Jaipur 302003</span></div>
          <div style={{ marginTop: "8px", color: "var(--text-muted)", fontSize: "12px" }}>Mon–Sat · 10:30 AM – 8:30 PM</div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2021 Ray Fine Ornates. All rights reserved. &nbsp;|&nbsp; Designed with ❤️ in Jaipur
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// WHATSAPP FLOAT
// ─────────────────────────────────────────────
function WhatsAppFloat({ onOpenChat }) {
  return (
    <>
      <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="whatsapp-float" title="WhatsApp">
        <span style={{ fontSize: "28px" }}>💬</span>
      </a>
      <button className="chat-float-btn" onClick={onOpenChat} title="AI Chat">🤖</button>
    </>
  );
}

// ─────────────────────────────────────────────
// USER AUTH
// ─────────────────────────────────────────────
function useUserAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rfo_user")) || null; }
    catch { return null; }
  });
  const login = (userData) => { localStorage.setItem("rfo_user", JSON.stringify(userData)); setUser(userData); };
  const logout = () => { localStorage.removeItem("rfo_user"); setUser(null); };
  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem("rfo_users") || "[]");
    const exists = users.find(u => u.email === userData.email);
    if (exists) return { error: "Email already registered." };
    const newUser = { ...userData, id: Date.now() };
    users.push(newUser);
    localStorage.setItem("rfo_users", JSON.stringify(users));
    login(newUser);
    return { success: true };
  };
  const loginWithCredentials = (email, password) => {
    const users = JSON.parse(localStorage.getItem("rfo_users") || "[]");
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: "Incorrect email or password." };
    login(found);
    return { success: true };
  };
  return { user, login, logout, signup, loginWithCredentials };
}

// ─────────────────────────────────────────────
// CUSTOMER ACCOUNT
// ─────────────────────────────────────────────
function CustomerAccount({ userAuth }) {
  const { user, logout, signup, loginWithCredentials } = userAuth;
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all required fields."); return; }
    if (mode === "signup" && !form.name) { setError("Please enter your name."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = mode === "signup" ? signup(form) : loginWithCredentials(form.email, form.password);
    setLoading(false);
    if (result?.error) setError(result.error);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: "6px",
    border: "1.5px solid var(--border)", fontSize: "14px", fontFamily: "inherit",
    outline: "none", background: "#fff", color: "var(--text)",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };

  if (user) {
    return (
      <div className="page-content">
        <div className="shop-hero"><h1>My Account</h1><p>Welcome back, {user.name || user.email}</p></div>
        <div style={{ maxWidth: 480, margin: "60px auto", padding: "0 24px 80px" }}>
          <div style={{ background: "linear-gradient(135deg, #fdf8f4, #f5ede4)", border: "1px solid var(--border-light)", borderRadius: 16, padding: "40px 36px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px", color: "#fff", fontFamily: "Cormorant Garamond, serif" }}>
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>{user.name || "Valued Customer"}</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>{user.email}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link to="/track" style={{ display: "block", padding: "13px", background: "var(--primary)", color: "#fff", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>📦 Track My Order</Link>
              <Link to="/wishlist" style={{ display: "block", padding: "13px", background: "var(--cream)", color: "var(--text)", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", border: "1.5px solid var(--border)" }}>🤍 My Wishlist</Link>
              <button onClick={logout} style={{ width: "100%", padding: 13, background: "transparent", color: "#c0392b", border: "1.5px solid #f5c6c6", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="shop-hero">
        <h1>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p>{mode === "login" ? "Sign in to your account" : "Join Ray Fine Ornates"}</p>
      </div>
      <div style={{ maxWidth: 440, margin: "60px auto", padding: "0 24px 80px" }}>
        <div style={{ background: "linear-gradient(135deg, #fdf8f4, #f5ede4)", border: "1px solid var(--border-light)", borderRadius: 16, padding: "40px 36px" }}>
          <div style={{ display: "flex", background: "#fff", borderRadius: 8, padding: 4, marginBottom: 28, border: "1px solid var(--border-light)" }}>
            {["login", "signup"].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase", transition: "all 0.2s", background: mode === m ? "var(--primary)" : "transparent", color: mode === m ? "#fff" : "var(--text-muted)" }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <input
                placeholder="Full Name *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            )}
            <input
              placeholder="Email Address *"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <input
              placeholder="Password *"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {error && <p style={{ color: "#c0392b", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", marginTop: 20, padding: 14, background: loading ? "#c4a98a" : "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 16 }}>
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP INNER
// ─────────────────────────────────────────────
function AppInner() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [viewed, setViewed] = useState([]);
  const [toasts, setToasts] = useState([]);
  const userAuth = useUserAuth();
  const loc = useLocation();
  const isAdminPage = loc.pathname === "/admin" || loc.pathname === "/login";

  const addViewed = useCallback((product) => {
    setViewed(prev => {
      const id = product._id || product.id;
      const filtered = prev.filter(p => (p._id || p.id) !== id);
      return [product, ...filtered].slice(0, 10);
    });
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <RecentlyViewedContext.Provider value={{ viewed, addViewed }}>
        <ToastContext.Provider value={{ showToast }}>
          {!isAdminPage && <AnnouncementBar />}
          {!isAdminPage && <Navbar cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} user={userAuth.user} />}
          {!isAdminPage && <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />}

          <Routes>
            <Route path="/"         element={<Home     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
            <Route path="/shop"     element={<Shop     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
            <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
            <Route path="/account"  element={<CustomerAccount userAuth={userAuth} />} />
            <Route path="/about"    element={<About />} />
            <Route path="/contact"  element={<Contact />} />
            <Route path="/track"    element={<TrackOrderPage />} />
            <Route path="/terms"    element={<Terms />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/admin"    element={<Admin />} />
          </Routes>

          {!isAdminPage && <Footer />}
          {!isAdminPage && chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
          {!isAdminPage && <WhatsAppFloat onOpenChat={() => setChatOpen(true)} />}
          <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
      </RecentlyViewedContext.Provider>
    </CurrencyContext.Provider>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  return <BrowserRouter><AppInner /></BrowserRouter>;
}