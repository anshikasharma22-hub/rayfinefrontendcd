import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Admin from "./Admin";
import Chatbot from "./Chatbot";

const INR_TO_USD = 0.012;

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1617038260897-41a1f14a0d7b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1920&q=90",
];

const ANNOUNCEMENT_MESSAGES = [
  "🎁 Get Additional 15% Discount — Use Code GIFT15",
  "🚚 Free Express Delivery on All Orders",
  "💎 Handcrafted in Jaipur — Shipped Worldwide",
];

const API_BASE = "https://rayfinesite-3.onrender.com";

// ── Normalize product from API ──
function normalizeProduct(p) {
  return {
    ...p,
    id: p.id,
    inStock: p.in_stock !== false && p.in_stock !== 0,
    originalPrice: p.original_price ? Number(p.original_price) : null,
    careInstructions: p.care_instructions || "",
    image: p.image
      ? p.image.startsWith("http")
        ? p.image.split(",")[0].trim()
        : `${API_BASE}${p.image.split(",")[0].trim()}`
      : "",
  };
}

function formatUSD(inr) {
  return "$" + (inr * INR_TO_USD).toFixed(2);
}

// ── Product Modal ──
function ProductModal({ product, onClose, cart, setCart, wishlist, setWishlist }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || "");
  const inWishlist = wishlist.find(w => w.id === product.id);
  const inCart = cart.find(c => c.id === product.id && c.selectedVariant === selectedVariant);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const addToCart = () => {
    if (!product.inStock) return;
    if (inCart) {
      setCart(cart.map(c => c.id === product.id && c.selectedVariant === selectedVariant ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedVariant }]);
    }
    onClose();
  };

  const toggleWishlist = () => {
    if (inWishlist) setWishlist(wishlist.filter(w => w.id !== product.id));
    else setWishlist([...wishlist, product]);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(20,5,10,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: "8px", maxWidth: "900px", width: "100%", maxHeight: "90vh", overflow: "auto", display: "flex", flexWrap: "wrap", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ flex: "1 1 350px", position: "relative", minHeight: "350px" }}>
          <img
            src={product.image} alt={product.name}
            style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "8px 0 0 8px", display: "block" }}
            onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }}
          />
          {!product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "#333", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OUT OF STOCK</div>}
          {discount && product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "#7B2E3E", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>-{discount}% OFF</div>}
        </div>

        <div style={{ flex: "1 1 300px", padding: "40px 36px" }}>
          <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
          <div style={{ fontSize: "10px", color: "#C9963C", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>{product.category}</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a0a0f", fontSize: "28px", marginBottom: "16px", fontWeight: 400, lineHeight: 1.2 }}>{product.name}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "#7B2E3E" }}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span style={{ textDecoration: "line-through", color: "#c0a0a8", fontSize: "16px" }}>₹{product.originalPrice.toLocaleString()}</span>}
            <span style={{ fontSize: "14px", color: "#8a7060", background: "#f5f0eb", padding: "3px 10px", borderRadius: "20px" }}>{formatUSD(product.price)}</span>
            {discount && <span style={{ background: "#fff0f3", color: "#7B2E3E", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Save {discount}%</span>}
          </div>

          <p style={{ color: "#6a4a50", lineHeight: "1.8", marginBottom: "24px", fontSize: "14px" }}>{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <p style={{ fontWeight: 600, marginBottom: "10px", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9a7a80" }}>Select Finish</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(typeof product.variants === "string" ? product.variants.split(",") : product.variants).map(v => (
                  <button key={v} onClick={() => setSelectedVariant(v.trim())} style={{ padding: "7px 16px", borderRadius: "2px", fontSize: "12px", cursor: "pointer", background: selectedVariant === v.trim() ? "#7B2E3E" : "#f5f0eb", color: selectedVariant === v.trim() ? "#fff" : "#5a3a42", border: selectedVariant === v.trim() ? "1.5px solid #7B2E3E" : "1.5px solid #e0d0d4", fontWeight: selectedVariant === v.trim() ? 700 : 400, transition: "all 0.2s" }}>{v.trim()}</button>
                ))}
              </div>
            </div>
          )}

          {product.material && <div style={{ marginBottom: "12px", fontSize: "13px", color: "#7a5a60" }}><strong>Material:</strong> {product.material}</div>}
          {product.careInstructions && <div style={{ marginBottom: "24px", fontSize: "13px", color: "#7a5a60", background: "#fdf8f5", padding: "14px", borderRadius: "6px", border: "1px solid #f0e4df" }}><strong>✨ Care:</strong> {product.careInstructions}</div>}

          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={addToCart} disabled={!product.inStock} style={{ flex: 1, padding: "15px", borderRadius: "2px", border: "none", cursor: product.inStock ? "pointer" : "not-allowed", background: product.inStock ? "#7B2E3E" : "#ccc", color: "#fff", fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", transition: "all 0.3s" }}>
              {!product.inStock ? "Out of Stock" : inCart ? "✓ Added" : "Add to Cart"}
            </button>
            <button onClick={toggleWishlist} style={{ padding: "15px 20px", borderRadius: "2px", border: "1.5px solid #7B2E3E", background: inWishlist ? "#7B2E3E" : "transparent", color: inWishlist ? "#fff" : "#7B2E3E", cursor: "pointer", fontSize: "18px", transition: "all 0.3s" }}>
              {inWishlist ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Announcement Bar ──
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

// ── Navbar ──
function Navbar({ cart, wishlist, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [loc]);

  return (
    <nav className="navbar" style={scrolled ? { boxShadow: "0 2px 20px rgba(123,46,62,0.10)" } : {}}>
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        <img
          src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png"
          alt="Ray Fine Ornates"
          style={{ display: "block", height: "44px", width: "auto", maxWidth: "160px", objectFit: "contain" }}
          onError={e => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = '<span style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#7B2E3E;">Ray Fine Ornates</span>';
          }}
        />
      </Link>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={loc.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to="/shop" className={loc.pathname === "/shop" ? "active" : ""}>Shop</Link>
        <Link to="/shop?cat=sale">Sale</Link>
        <Link to="/about" className={loc.pathname === "/about" ? "active" : ""}>About</Link>
        <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""}>Contact</Link>
      </div>

      <div className="nav-actions">
        <Link to="/wishlist" className="nav-icon" title="Wishlist">🤍 <span className="badge">{wishlist.length}</span></Link>
        <button className="nav-icon" onClick={onCartOpen} title="Cart">🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span></button>
        <Link to="/admin" className="nav-icon" title="Account">👤</Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? "✕" : "☰"}</button>
      </div>
    </nav>
  );
}

// ── Cart Drawer ──
function CartDrawer({ cart, setCart, open, onClose }) {
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "" });
  const [step, setStep] = useState("cart");
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);

  const placeOrder = () => { alert("Payment integration pending"); };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p).filter(p => p.quantity > 0));
  };

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
                <p style={{ marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", color: "#5a3a42" }}>Your cart is empty</p>
                <p style={{ fontSize: "13px", color: "#9a7a80", marginBottom: "24px" }}>Discover our beautiful collection</p>
                <Link to="/shop" className="btn-primary" style={{ display: "inline-block" }} onClick={onClose}>Shop Now</Link>
              </div>
            ) : cart.map(item => (
              <div className="cart-item" key={item.id + (item.selectedVariant || "")}>
                <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/76x76?text=Item"} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  {item.selectedVariant && <p style={{ fontSize: "11px", color: "#9a7a80", marginBottom: "4px" }}>{item.selectedVariant}</p>}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                    {item.originalPrice && <p className="cart-item-original">₹{item.originalPrice.toLocaleString()}</p>}
                    <span style={{ fontSize: "11px", color: "#9a8070" }}>{formatUSD(item.price)}</span>
                  </div>
                  <div className="qty-controls">
                    <button onClick={() => updateQty(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => updateQty(item.id, -item.quantity)}>🗑</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="checkout-form">
            <h4 style={{ color: "#7B2E3E", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 400 }}>Delivery Details</h4>
            <input placeholder="Full Name *" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            <input placeholder="Phone Number *" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            <input placeholder="Delivery Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
            <div className="order-summary">
              <h5>Order Summary</h5>
              {cart.map(item => (
                <div key={item.id} className="order-summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()} ({formatUSD(item.price * item.quantity)})</span>
                </div>
              ))}
              <div className="order-summary-total">
                <span>Total</span>
                <strong>₹{total.toLocaleString()} ({formatUSD(total)})</strong>
              </div>
            </div>
            <button className="btn-checkout" onClick={placeOrder}>Pay ₹{total.toLocaleString()} →</button>
            <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
          </div>
        )}

        {step === "cart" && cart.length > 0 && (
          <div className="cart-footer">
            {savings > 0 && <div className="cart-savings">🎉 You save ₹{savings.toLocaleString()}!</div>}
            <div className="cart-total">
              <span>Total</span>
              <div style={{ textAlign: "right" }}>
                <strong>₹{total.toLocaleString()}</strong>
                <div style={{ fontSize: "12px", color: "#9a7060" }}>{formatUSD(total)}</div>
              </div>
            </div>
            <button className="btn-checkout" onClick={() => setStep("checkout")}>Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Product Card ──
function ProductCard({ product: productProp, cart, setCart, wishlist, setWishlist }) {
  const product = normalizeProduct(productProp);
  const [showModal, setShowModal] = useState(false);

  const inWishlist = wishlist.find(w => w.id === product.id);
  const inCart = cart.find(c => c.id === product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const addToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    if (inCart) setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
    else setCart([...cart, { ...product, quantity: 1 }]);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (inWishlist) setWishlist(wishlist.filter(w => w.id !== product.id));
    else setWishlist([...wishlist, product]);
  };

  const variants = typeof product.variants === "string"
    ? product.variants.split(",").map(v => v.trim()).filter(Boolean)
    : Array.isArray(product.variants) ? product.variants : [];

  return (
    <>
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
          cart={cart} setCart={setCart}
          wishlist={wishlist} setWishlist={setWishlist}
        />
      )}

      <div
        className="product-card"
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer", opacity: product.inStock ? 1 : 0.7 }}
      >
        <div className="product-img-wrap">
          <img
            src={product.image}
            alt={product.name}
            onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }}
          />

          <button
            className={`wishlist-btn ${inWishlist ? "active" : ""}`}
            onClick={toggleWishlist}
          >
            {inWishlist ? "❤️" : "🤍"}
          </button>

          {!product.inStock && <div className="sale-badge" style={{ background: "#555" }}>Out of Stock</div>}
          {discount && product.inStock && <div className="sale-badge">-{discount}%</div>}

          <div className="product-category-tag">{product.category}</div>

          <div
            onClick={e => { e.stopPropagation(); setShowModal(true); }}
            style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "10px", padding: "4px 9px", borderRadius: "10px", cursor: "pointer", zIndex: 2 }}
          >
            👁 View
          </div>
        </div>{/* product-img-wrap END */}

        <div className="product-info">
          <h4>{product.name}</h4>
          <p className="product-desc">{product.description?.substring(0, 80)}...</p>

          {variants.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
              {variants.slice(0, 3).map((v, i) => (
                <span key={i} style={{ fontSize: "11px", padding: "4px 8px", background: "#f5f5f5", borderRadius: "12px" }}>{v}</span>
              ))}
            </div>
          )}

          <div className="price-wrap">
            <span className="price-current">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>}
            <span className="price-usd">{formatUSD(product.price)}</span>
          </div>

          <button
            className={`btn-add-cart ${inCart ? "added" : ""}`}
            onClick={addToCart}
            disabled={!product.inStock}
          >
            {!product.inStock ? "Out of Stock" : inCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Section Divider ──
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

// ── Trust Strip ──
function TrustStrip() {
  return (
    <div className="trust-strip">
      {[
        { icon: "🚚", title: "Free Delivery", sub: "On all orders" },
        { icon: "💎", title: "Handcrafted", sub: "Jaipur artisans" },
        { icon: "🔄", title: "Easy Returns", sub: "Hassle-free" },
        { icon: "🔒", title: "Secure Payment", sub: "100% safe" },
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

// ── Hero Slider ──
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % WALLPAPERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero">
      {WALLPAPERS.map((url, i) => (
        <div key={i} className={`hero-bg ${i === current ? "active" : "inactive"}`} style={{ backgroundImage: `url(${url})` }} />
      ))}
      <div className="hero-overlay">
        <h1>Elegance<br /><span>Redefined</span></h1>
        <div className="hero-btns">
          <Link to="/shop" className="btn-primary">Explore Collection</Link>
          <Link to="/about" className="btn-outline">Our Story</Link>
        </div>
      </div>
      <div className="hero-dots">
        {WALLPAPERS.map((_, i) => (
          <div key={i} className={`dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </section>
  );
}

// ── Home Page ──
function Home({ cart, setCart, wishlist, setWishlist }) {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setFeatured(list.map(normalizeProduct).slice(0, 8));
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <HeroSlider />

      <div className="sale-banner">
        <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
        <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
      </div>

      <TrustStrip />

      <section className="categories-section">
        <SectionDivider subtitle="Browse by Style" title="Shop by Category" />
        <div className="categories-grid">
          {[
            { name: "Earrings",  img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=85", path: "/shop?cat=Earring" },
            { name: "Necklaces", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85", path: "/shop?cat=Necklace" },
            { name: "Bracelets", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85", path: "/shop?cat=Bracelet" },
            { name: "Rings",     img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85", path: "/shop?cat=Ring" },
          ].map(cat => (
            <Link to={cat.path} key={cat.name} className="category-card">
              <img src={cat.img} alt={cat.name} />
              <div className="category-overlay">
                <span>{cat.name}</span>
                <div className="category-explore">Explore →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <SectionDivider subtitle="Curated For You" title="Trending Now" />
        <div className="products-grid">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "52px" }}>
          <Link to="/shop" className="btn-primary">View All Products</Link>
        </div>
      </section>

      <section className="testimonials-section">
        <SectionDivider subtitle="Customer Love" title="What They Say" />
        <div className="testimonials-grid">
          {[
            { name: "Ms. Heena Gupta", text: "When it arrived, it was exactly as shown. So pretty. Very happy with my purchase!", product: "Katherine Bracelet" },
            { name: "Ms. Bhavika Kakurlawala", text: "The earrings are awesome & the bracelet is so elegant and easy to wear! Both pieces are just lovely.", product: "Swarovski Pearl Bracelet" },
            { name: "Ms. Tanya", text: "Found the most perfect gift! The moonstone was her sunshine stone. She was so happy.", product: "Multi Moonlight Bracelet" },
          ].map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"{t.text}"</p>
              <p className="testimonial-name">{t.name}</p>
              <p className="testimonial-product">{t.product}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ── Shop Page ──
function Shop({ cart, setCart, wishlist, setWishlist }) {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("cat") || "All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState([]);
  const [showInStock, setShowInStock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setProducts(list.map(normalizeProduct));
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  let filtered = products.filter(p => {
    const matchCat = category === "All" ? true
      : category === "sale" ? p.originalPrice
      : (p.category || "").toLowerCase().trim() === category.toLowerCase().trim();
    const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStock = showInStock ? p.inStock : true;
    return matchCat && matchSearch && matchStock;
  });

  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

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
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
        <button onClick={() => setShowInStock(!showInStock)} style={{ padding: "10px 18px", borderRadius: "2px", border: "none", cursor: "pointer", background: showInStock ? "#7B2E3E" : "#f0ebe6", color: showInStock ? "#fff" : "#5a3a42", fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", minHeight: "44px" }}>
          {showInStock ? "✓ In Stock" : "All Products"}
        </button>
      </div>

      <div className="category-tabs">
        {["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Sale 🔥"].map(cat => (
          <button key={cat} className={`cat-tab ${(cat === "Sale 🔥" ? category === "sale" : category === cat) ? "active" : ""}`} onClick={() => setCategory(cat === "Sale 🔥" ? "sale" : cat)}>{cat}</button>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center", padding: "80px", color: "#9a7a80", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>Loading collection...</p>}

      {!loading && (
        <div className="products-grid" style={{ padding: "0 40px 80px" }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && <p style={{ textAlign: "center", color: "#9a7a80", padding: "80px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>No pieces found.</p>}
    </div>
  );
}

// ── Wishlist ──
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
          <p style={{ color: "#9a7a80", fontSize: "18px", marginBottom: "28px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>No items saved yet</p>
          <Link to="/shop" className="btn-primary">Explore Collection</Link>
        </div>
      ) : (
        <div className="products-grid" style={{ padding: "40px" }}>
          {wishlist.map(p => <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />)}
        </div>
      )}
    </div>
  );
}

// ── About ──
function About() {
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
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80" alt="Ray Fine Ornates" />
        </div>
      </div>
      <div className="about-stats">
        {[["2021", "Founded"], ["500+", "Products"], ["10,000+", "Happy Customers"], ["Jaipur", "Headquarters"]].map(([n, l]) => (
          <div className="stat-box" key={l}><h3>{n}</h3><p>{l}</p></div>
        ))}
      </div>
    </div>
  );
}

// ── Contact ──
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
          <div className="contact-item">📞 <a href="tel:+918112240112">+91 8112240112</a></div>
          <div className="contact-item">📍 Johari Bazar, Jaipur 302003<br />(10:30 AM – 8:30 PM)</div>
          <div className="social-links">
            <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
          </div>
        </div>
        <div className="contact-form">
          <input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <textarea placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          <button className="btn-primary" onClick={() => alert("Message sent! We'll get back to you soon.")}>Send Message</button>
        </div>
      </div>
    </div>
  );
}

// ── Terms ──
function Terms() {
  return (
    <div className="page-content">
      <div className="shop-hero">
        <h1>Terms &amp; Conditions</h1>
        <p>Ray Fine Ornates Policies &amp; Information</p>
      </div>
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px 40px", lineHeight: "1.8" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#7B2E3E", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Terms &amp; Conditions</h2>
        {[
          ["1. General Information", "Ray Fine Ornates is a Jaipur-based jewelry brand specializing in handcrafted jewelry made with precious, semi-precious, natural, and lab-created stones."],
          ["2. Product Information", "We make every effort to display product images, colors, materials, and descriptions accurately. Slight differences may occur due to lighting and the handmade nature of our jewelry."],
          ["3. Pricing", "All prices are subject to change without prior notice. Taxes, shipping charges, and customs duties may be charged separately."],
          ["4. Orders & Payments", "Orders are confirmed only after successful payment verification. Ray Fine Ornates reserves the right to cancel or refuse any order."],
          ["5. Shipping & Delivery", "We aim to dispatch orders within the mentioned processing time. Delivery timelines may vary depending on the shipping destination."],
          ["6. Returns & Exchanges", "We accept returns or exchanges only according to our Return Policy. Customized and worn items are generally non-returnable unless damaged or incorrect."],
          ["7. Handmade Disclaimer", "Slight irregularities and variations in stone shape, color, or finish are natural characteristics of handmade jewelry and should not be considered defects."],
          ["8. Intellectual Property", "All website content belongs to Ray Fine Ornates and may not be copied or reproduced without written permission."],
          ["9. Privacy", "Customer information is kept secure and used only for order processing and communication purposes."],
          ["10. Governing Law", "These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Jaipur, Rajasthan."],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a0a0f", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{title}</h3>
            <p style={{ color: "#7a6060", lineHeight: "1.9" }}>{text}</p>
          </div>
        ))}
        <hr style={{ margin: "48px 0", borderColor: "#f0e4df" }} />
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#7B2E3E", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Refund &amp; Cancellation Policy</h2>
        <p style={{ color: "#7a6060", marginBottom: "16px" }}>Customers may request order cancellation within 24 hours by contacting us at <strong>+91 8690666771</strong>. Refunds are accepted only in genuine cases such as damaged packages or incorrect products.</p>
        <hr style={{ margin: "48px 0", borderColor: "#f0e4df" }} />
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#7B2E3E", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Frequently Asked Questions</h2>
        {[
          ["What type of jewelry does Ray Fine Ornates offer?", "We specialize in handcrafted gold-plated jewelry featuring precious, semi-precious, natural, and lab-created stones."],
          ["Are your jewelry pieces handmade?", "Yes, all our jewelry pieces are handcrafted by skilled artisans in Jaipur, India."],
          ["Do you accept custom orders?", "Yes, contact us via WhatsApp at +91 8690666771."],
          ["Do you ship internationally?", "Yes, we ship worldwide."],
          ["Can I cancel my order?", "Yes, within 24 hours by contacting us at +91 8690666771."],
          ["How should I care for my jewelry?", "Keep away from water and perfumes, store in a dry airtight pouch."],
          ["Where is your store?", "223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003."],
        ].map(([q, a]) => (
          <details key={q} style={{ marginBottom: "10px", padding: "14px 18px", border: "1px solid #f0e4df", borderRadius: "8px", background: "#fff" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "15px", color: "#1a0a0f" }}>{q}</summary>
            <p style={{ marginTop: "12px", color: "#7a6060", lineHeight: "1.7" }}>{a}</p>
          </details>
        ))}
        <div style={{ background: "#fdf2ee", padding: "24px", borderRadius: "8px", border: "1px solid #f0e4df", marginTop: "40px" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "#7B2E3E", fontSize: "22px", marginBottom: "12px" }}>Contact Information</h3>
          <p style={{ color: "#7a6060" }}><strong>Phone:</strong> +91 8690666771</p>
          <p style={{ color: "#7a6060" }}><strong>Address:</strong> 223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003</p>
          <p style={{ color: "#7a6060", marginBottom: "16px" }}><strong>Hours:</strong> Monday–Saturday, 10:00 AM–7:00 PM</p>
          <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="btn-primary">WhatsApp Us</a>
        </div>
      </div>
    </div>
  );
}

// ── Footer ──
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        🚚 Free Express Delivery &nbsp;·&nbsp; ✨ Use Code <strong>GIFT15</strong> for 15% Off &nbsp;·&nbsp; 🔄 Easy Returns
      </div>
      <div className="footer-grid">
        <div>
          <h4>Ray Fine Ornates</h4>
          <p className="footer-brand-desc">Luxury fashion jewellery crafted for the modern woman. Handmade by artisans in Jaipur.</p>
          <p className="footer-brand-desc" style={{ marginTop: "8px", color: "#C9963C", fontSize: "12px", letterSpacing: "1px" }}>Est. 2021 · Johari Bazar, Jaipur</p>
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
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
        <div>
          <h4>Categories</h4>
          {["Earrings", "Necklaces", "Bracelets", "Rings", "Anklets"].map(c => (
            <Link to="/shop" key={c}>{c}</Link>
          ))}
        </div>
        <div>
          <h4>Contact Us</h4>
          <div className="footer-contact-item"><span className="footer-contact-icon">✉</span><span style={{ color: "var(--footer-text)", fontSize: "13px" }}>info@rayfineornates.com</span></div>
          <div className="footer-contact-item"><span className="footer-contact-icon">☎</span><span style={{ color: "var(--footer-text)", fontSize: "13px" }}>+91 8112240112</span></div>
          <div className="footer-contact-item"><span className="footer-contact-icon">📍</span><span style={{ color: "var(--footer-text)", fontSize: "13px" }}>Johari Bazar, Jaipur 302003</span></div>
          <div style={{ marginTop: "8px", color: "var(--footer-text)", fontSize: "12px" }}>Mon–Sat · 10:30 AM – 8:30 PM</div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2021 Ray Fine Ornates. All rights reserved. &nbsp;|&nbsp; Designed with ❤️ in Jaipur
      </div>
    </footer>
  );
}

// ── WhatsApp Float ──
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

// ── App Root ──
function AppInner() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const loc = useLocation();
  const isAdminPage = loc.pathname === "/admin" || loc.pathname === "/login";

  return (
    <>
      {!isAdminPage && <AnnouncementBar />}
      {!isAdminPage && <Navbar cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} />}
      {!isAdminPage && <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />}
      <Routes>
        <Route path="/"         element={<Home     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/shop"     element={<Shop     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/terms"    element={<Terms />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/admin"    element={<Admin />} />
      </Routes>
      {!isAdminPage && <Footer />}
      {!isAdminPage && chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
      {!isAdminPage && <WhatsAppFloat onOpenChat={() => setChatOpen(true)} />}
    </>
  );
}

export default function App() {
  return <BrowserRouter><AppInner /></BrowserRouter>;
}
