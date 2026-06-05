
// // ── Product Modal ──
// function ProductModal({ product, onClose, cart, setCart, wishlist, setWishlist }) {
//   const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || "");
//   const inWishlist = wishlist.find(w => w.id === product.id);
//   const inCart = cart.find(c => c.id === product.id && c.selectedVariant === selectedVariant);
//   const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

//   const addToCart = () => {
//     if (!product.inStock) return;
//     if (inCart) {
//       setCart(cart.map(c => c.id === product.id && c.selectedVariant === selectedVariant ? { ...c, quantity: c.quantity + 1 } : c));
//     } else {
//       setCart([...cart, { ...product, quantity: 1, selectedVariant }]);
//     }
//     onClose();
//   };

//   const toggleWishlist = () => {
//     if (inWishlist) setWishlist(wishlist.filter(w => w.id !== product.id));
//     else setWishlist([...wishlist, product]);
//   };

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = "unset"; };
//   }, []);

//   return (
//     <div
//       style={{ position: "fixed", inset: 0, background: "rgba(44,36,24,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         style={{ background: "#fff", borderRadius: "8px", maxWidth: "900px", width: "100%", maxHeight: "90vh", overflow: "auto", display: "flex", flexWrap: "wrap", boxShadow: "0 32px 80px rgba(44,36,24,0.18)" }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div style={{ flex: "1 1 350px", position: "relative", minHeight: "350px" }}>
//           <img
//             src={product.image} alt={product.name}
//             style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "8px 0 0 8px", display: "block" }}
//             onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }}
//           />
//           {!product.inStock && <div style={{ position: "absolute", top: 16, left: 16, background: "#555", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OUT OF STOCK</div>}
//           {discount && product.inStock && <div style={{ position: "absolute", top: 16, left: 16, background: "var(--primary)", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>-{discount}% OFF</div>}
//         </div>
//         <div style={{ flex: "1 1 300px", padding: "40px 36px" }}>
//           <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
//           <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 10 }}>{product.category}</div>
//           <h2 style={{ fontFamily: "Playfair Display, serif", color: "var(--text)", fontSize: "28px", marginBottom: 16, fontWeight: 400, lineHeight: 1.2 }}>{product.name}</h2>
//           <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
//             <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--primary)" }}>₹{product.price.toLocaleString()}</span>
//             {product.originalPrice && <span style={{ textDecoration: "line-through", color: "var(--text-light)", fontSize: "16px" }}>₹{product.originalPrice.toLocaleString()}</span>}
//             <span style={{ fontSize: "13px", color: "var(--text-muted)", background: "var(--cream)", padding: "3px 10px", borderRadius: "20px" }}>{formatUSD(product.price)}</span>
//             {discount && <span style={{ background: "#fff0f3", color: "var(--primary)", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Save {discount}%</span>}
//           </div>
//           <p style={{ color: "var(--text-muted)", lineHeight: "1.8", marginBottom: 24, fontSize: "14px" }}>{product.description}</p>
//           {product.variants && product.variants.length > 0 && (
//             <div style={{ marginBottom: 22 }}>
//               <p style={{ fontWeight: 600, marginBottom: 10, fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>Select Finish</p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                 {product.variants.map(v => (
//                   <button key={v} onClick={() => setSelectedVariant(v)} style={{ padding: "7px 16px", borderRadius: "2px", fontSize: "12px", cursor: "pointer", background: selectedVariant === v ? "var(--text)" : "var(--cream)", color: selectedVariant === v ? "#fff" : "var(--text-muted)", border: selectedVariant === v ? "1.5px solid var(--text)" : "1.5px solid var(--border)", fontWeight: selectedVariant === v ? 700 : 400, transition: "all 0.2s" }}>{v}</button>
//                 ))}
//               </div>
//             </div>
//           )}
//           {product.material && <div style={{ marginBottom: 12, fontSize: "13px", color: "var(--text-muted)" }}><strong>Material:</strong> {product.material}</div>}
//           {product.careInstructions && <div style={{ marginBottom: 24, fontSize: "13px", color: "var(--text-muted)", background: "var(--cream)", padding: "14px", borderRadius: "6px", border: "1px solid var(--border-light)" }}><strong>✨ Care:</strong> {product.careInstructions}</div>}
//           <div style={{ display: "flex", gap: 12 }}>
//             <button onClick={addToCart} disabled={!product.inStock} style={{ flex: 1, padding: 15, borderRadius: "2px", border: "none", cursor: product.inStock ? "pointer" : "not-allowed", background: product.inStock ? "var(--text)" : "#ccc", color: "#fff", fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", transition: "all 0.3s" }}>
//               {!product.inStock ? "Out of Stock" : inCart ? "✓ Added" : "Add to Cart"}
//             </button>
//             <button onClick={toggleWishlist} style={{ padding: "15px 20px", borderRadius: "2px", border: "1.5px solid var(--border)", background: inWishlist ? "var(--primary)" : "transparent", color: inWishlist ? "#fff" : "var(--text)", cursor: "pointer", fontSize: "18px", transition: "all 0.3s" }}>
//               {inWishlist ? "❤️" : "🤍"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Announcement Bar ──
// function AnnouncementBar() {
//   const [idx, setIdx] = useState(0);
//   useEffect(() => {
//     const t = setInterval(() => setIdx(p => (p + 1) % ANNOUNCEMENT_MESSAGES.length), 3200);
//     return () => clearInterval(t);
//   }, []);
//   return (
//     <div className="announcement-bar">
//       <span key={idx} className="announcement-text">{ANNOUNCEMENT_MESSAGES[idx]}</span>
//     </div>
//   );
// }

// // ── Worldwide Strip ──
// function WorldwideStrip() {
//   const items = [
//     "🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇦🇪 UAE", "🇦🇺 Australia",
//     "🇨🇦 Canada", "🇩🇪 Germany", "🇸🇬 Singapore", "🇯🇵 Japan", "🇳🇿 New Zealand",
//     "🇿🇦 South Africa", "🌍 140+ Countries",
//   ];
//   const doubled = [...items, ...items];
//   return (
//     <div className="worldwide-strip">
//       <div className="worldwide-track">
//         {doubled.map((item, i) => (
//           <span key={i}>
//             <span style={{ color: "var(--primary)", marginRight: 4 }}>✦</span>
//             {item}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Navbar ──
// function Navbar({ cart, wishlist, onCartOpen }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const loc = useLocation();

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => { setMenuOpen(false); }, [loc]);

//   return (
//     <nav className="navbar" style={scrolled ? { boxShadow: "0 2px 20px rgba(176,122,90,0.10)" } : {}}>
//      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
//   <svg width="160" height="40" viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <text x="0" y="34" fontFamily="Cormorant Garamond, serif" fontSize="32" fontStyle="italic" fontWeight="300" fill="#B07A5A" letterSpacing="1">Ray</text>
//     <text x="60" y="34" fontFamily="Cormorant Garamond, serif" fontSize="32" fontWeight="400" fill="#2C2418" letterSpacing="1"> Fine</text>
//     <line x1="0" y1="40" x2="150" y2="40" stroke="#B07A5A" strokeWidth="0.6" opacity="0.3"/>
//     <text x="0" y="47" fontFamily="DM Sans, sans-serif" fontSize="7" fontWeight="300" fill="#8A7968" letterSpacing="5">ORNATES</text>
//   </svg>
// </Link>
//       <div className={`nav-links ${menuOpen ? "open" : ""}`}>
//         <Link to="/" className={loc.pathname === "/" ? "active" : ""}>Home</Link>
//         <Link to="/shop" className={loc.pathname === "/shop" ? "active" : ""}>Shop</Link>
//         <Link to="/shop?cat=sale">Sale</Link>
//         <Link to="/about" className={loc.pathname === "/about" ? "active" : ""}>About</Link>
//         <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""}>Contact</Link>
//       </div>
//       <div className="nav-actions">
//         <Link to="/wishlist" className="nav-icon" title="Wishlist">🤍 <span className="badge">{wishlist.length}</span></Link>
//         <button className="nav-icon" onClick={onCartOpen} title="Cart">🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span></button>
//         <Link to="/admin" className="nav-icon" title="Account">👤</Link>
//         <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? "✕" : "☰"}</button>
//       </div>
//     </nav>
//   );
// }

// // ── Cart Drawer ──
// function CartDrawer({ cart, setCart, open, onClose }) {
//   const [customer, setCustomer] = useState({ name: "", address: "", phone: "" });
//   const [step, setStep] = useState("cart");
//   const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
//   const savings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);

//   const placeOrder = () => {
//     alert("Payment integration pending");
//   };

//   const updateQty = (id, delta) => {
//     setCart(prev =>
//       prev.map(p => (p._id || p.id) === id ? { ...p, quantity: p.quantity + delta } : p)
//           .filter(p => p.quantity > 0)
//     );
//   };

//   return (
//     <>
//       <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose} />
//       <div className={`cart-drawer ${open ? "open" : ""}`}>
//         <div className="cart-header">
//           <h3>{step === "cart" ? `Your Cart (${cart.length})` : "Checkout"}</h3>
//           <button className="cart-close" onClick={onClose}>✕</button>
//         </div>
//         {step === "cart" ? (
//           <div style={{ flex: 1, overflowY: "auto" }}>
//             {cart.length === 0 ? (
//               <div className="cart-empty">
//                 <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
//                 <p style={{ marginBottom: "8px", fontFamily: "Playfair Display, serif", fontSize: "20px", color: "var(--text)" }}>Your cart is empty</p>
//                 <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>Discover our beautiful collection</p>
//                 <Link to="/shop" className="btn-primary" style={{ display: "inline-block" }} onClick={onClose}>Shop Now</Link>
//               </div>
//             ) : cart.map(item => (
//               <div className="cart-item" key={item.id + (item.selectedVariant || "")}>
//                 <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/76x76?text=Item"} />
//                 <div className="cart-item-info">
//                   <p className="cart-item-name">{item.name}</p>
//                   {item.selectedVariant && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: 4 }}>{item.selectedVariant}</p>}
//                   <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                     <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
//                     {item.originalPrice && <p className="cart-item-original">₹{item.originalPrice.toLocaleString()}</p>}
//                     <span style={{ fontSize: "11px", color: "var(--text-light)" }}>{formatUSD(item.price)}</span>
//                   </div>
//                   <div className="qty-controls">
//                     <button onClick={() => updateQty(item.id, -1)}>−</button>
//                     <span>{item.quantity}</span>
//                     <button onClick={() => updateQty(item.id, 1)}>+</button>
//                   </div>
//                 </div>
//                 <button className="cart-item-remove" onClick={() => updateQty(item.id, -item.quantity)}>🗑</button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="checkout-form">
//             <h4 style={{ color: "var(--primary)", fontFamily: "Playfair Display, serif", fontSize: "22px", fontWeight: 400 }}>Delivery Details</h4>
//             <input placeholder="Full Name *" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
//             <input placeholder="Phone Number *" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
//             <input placeholder="Delivery Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
//             <div className="order-summary">
//               <h5>Order Summary</h5>
//               {cart.map(item => (
//                 <div key={item.id} className="order-summary-item">
//                   <span>{item.name} × {item.quantity}</span>
//                   <span>₹{(item.price * item.quantity).toLocaleString()} ({formatUSD(item.price * item.quantity)})</span>
//                 </div>
//               ))}
//               <div className="order-summary-total">
//                 <span>Total</span>
//                 <strong>₹{total.toLocaleString()} ({formatUSD(total)})</strong>
//               </div>
//             </div>
//             <button className="btn-checkout" onClick={placeOrder}>Pay ₹{total.toLocaleString()} →</button>
//             <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
//           </div>
//         )}
//         {step === "cart" && cart.length > 0 && (
//           <div className="cart-footer">
//             {savings > 0 && <div className="cart-savings">🎉 You save ₹{savings.toLocaleString()}!</div>}
//             <div className="cart-total">
//               <span>Total</span>
//               <div style={{ textAlign: "right" }}>
//                 <strong>₹{total.toLocaleString()}</strong>
//                 <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{formatUSD(total)}</div>
//               </div>
//             </div>
//             <button className="btn-checkout" onClick={() => setStep("checkout")}>Proceed to Checkout →</button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // ── Product Card ──
// function ProductCard({ product, cart, setCart, wishlist, setWishlist }) {
//   const [showModal, setShowModal] = useState(false);
//   const inWishlist = wishlist.find(w => w.id === product.id);
//   const inCart = cart.find(c => c.id === product.id);
//   const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

//   const addToCart = (e) => {
//     e.stopPropagation();
//     if (!product.inStock) return;
//     if (inCart) setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
//     else setCart([...cart, { ...product, quantity: 1 }]);
//   };

//   const toggleWishlist = (e) => {
//     e.stopPropagation();
//     if (inWishlist) setWishlist(wishlist.filter(w => w.id !== product.id));
//     else setWishlist([...wishlist, product]);
//   };

//   return (
//     <>
//       {showModal && (
//         <ProductModal product={product} onClose={() => setShowModal(false)} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
//       )}
//       <div className="product-card" onClick={() => setShowModal(true)} style={{ cursor: "pointer", opacity: product.inStock ? 1 : 0.7 }}>
//         <div className="product-img-wrap">
//           <img src={product.image} alt={product.name} onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }} />
//           <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}>{inWishlist ? "❤️" : "🤍"}</button>
//           {!product.inStock && <div className="sale-badge" style={{ background: "#555" }}>Out of Stock</div>}
//           {discount && product.inStock && <div className="sale-badge">-{discount}%</div>}
//           <div className="product-category-tag">{product.category}</div>
//         </div>
//         <div className="product-info">
//           <h4>{product.name}</h4>
//           <p className="product-desc">{product.description?.substring(0, 80)}...</p>
//           {product.variants && (
//             <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
//               {product.variants.slice(0, 3).map(v => (
//                 <span key={v} style={{ fontSize: "10px", background: "var(--cream)", padding: "2px 8px", borderRadius: "10px", color: "var(--text-muted)" }}>{v}</span>
//               ))}
//             </div>
//           )}
//           <div className="price-wrap">
//             <span className="price-current">₹{product.price.toLocaleString()}</span>
//             {product.originalPrice && <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>}
//             <span className="price-usd">{formatUSD(product.price)}</span>
//           </div>
//           <button className={`btn-add-cart ${inCart ? "added" : ""}`} onClick={addToCart} disabled={!product.inStock}>
//             {!product.inStock ? "Out of Stock" : inCart ? "✓ Added to Cart" : "Add to Cart"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// // ── Section Divider ──
// function SectionDivider({ subtitle, title }) {
//   return (
//     <div style={{ textAlign: "center", marginBottom: "52px" }}>
//       <p className="section-subtitle">{subtitle}</p>
//       <h2 className="section-title">{title}</h2>
//       <div className="section-divider">
//         <div className="section-divider-line"></div>
//         <div className="section-divider-diamond"></div>
//         <div className="section-divider-line"></div>
//       </div>
//     </div>
//   );
// }

// // ── Trust Strip ──
// function TrustStrip() {
//   return (
//     <div className="trust-strip">
//       {[
//         { icon: "🚚", title: "Free Delivery", sub: "On all orders" },
//         { icon: "💎", title: "Handcrafted", sub: "Jaipur artisans" },
//         { icon: "🌍", title: "Worldwide Shipping", sub: "140+ countries" },
//         { icon: "🔒", title: "Secure Payment", sub: "100% safe" },
//       ].map(item => (
//         <div className="trust-item" key={item.title}>
//           <div className="trust-item-icon">{item.icon}</div>
//           <div className="trust-item-title">{item.title}</div>
//           <div className="trust-item-sub">{item.sub}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ── Platforms Section ──
// function PlatformsSection() {
//   return (
//     <div className="platforms-section">
//       <div style={{ textAlign: "center", marginBottom: "28px" }}>
//         <p className="section-subtitle">Find Us On</p>
//         <h2 className="section-title" style={{ fontSize: "clamp(20px,2.5vw,30px)" }}>Available on Our Platforms</h2>
//       </div>
//       <div className="platforms-grid">
//         {[
//           { icon: "📸", name: "Instagram", handle: "@rayfineornates", url: "https://www.instagram.com/rayfineornates/" },
//           { icon: "👍", name: "Facebook", handle: "Ray Fine Ornates", url: "https://www.facebook.com/rayfineornatesjewellery" },
//           { icon: "📌", name: "Pinterest", handle: "rayfineornates", url: "https://in.pinterest.com/rayfineornates/" },
//         ].map(p => (
//           <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="platform-item" style={{ textDecoration: "none" }}>
//             <div className="platform-icon">{p.icon}</div>
//             <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "13px" }}>{p.name}</span>
//             <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.handle}</span>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Hero Slider ──
// function HeroSlider() {
//   const [current, setCurrent] = useState(0);
//   const next = useCallback(() => setCurrent(p => (p + 1) % HERO_SLIDES.length), []);

//   useEffect(() => {
//     const t = setInterval(next, 5000);
//     return () => clearInterval(t);
//   }, [next]);

//   const slide = HERO_SLIDES[current];

//   return (
//     <section className="hero">
//       {HERO_SLIDES.map((s, i) => (
//         <div key={i} className={`hero-bg ${i === current ? "active" : "inactive"}`} style={{ backgroundImage: `url(${s.bg})` }} />
//       ))}
//       <div className="hero-overlay">
//         <div className="hero-eyebrow" key={current + "eyebrow"}>
//           <div className="hero-eyebrow-line" />
//           <span className="hero-sub">{slide.eyebrow}</span>
//         </div>
//         <h1 key={current + "h1"}>
//           {slide.title[0]}<br /><span>{slide.title[1]}</span>
//         </h1>
//         <p className="hero-desc" key={current + "desc"}>{slide.desc}</p>
//         <div className="hero-btns" key={current + "btns"}>
//           <Link to="/shop" className="btn-primary">Explore Collection</Link>
//           <Link to="/about" className="btn-outline">Our Story</Link>
//         </div>
//       </div>
//       <div className="hero-dots">
//         {HERO_SLIDES.map((_, i) => (
//           <div key={i} className={`dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
//         ))}
//       </div>
//     </section>
//   );
// }

// // ── Home Page ──
// function Home({ cart, setCart, wishlist, setWishlist }) {
//   const [featured, setFeatured] = useState([]);

//   useEffect(() => {
//     fetch("https://rayfinesite-3.onrender.com/api/products")
//       .then(res => res.json())
//       .then(data => {
//         const list = Array.isArray(data?.data) ? data.data : [];
//         const fixed = list.map(p => ({
//           ...p,
//           image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim()
//         }));
//         setFeatured(fixed.slice(0, 8));
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <>
//       {/* 1. HERO */}
//       <HeroSlider />

//       {/* 2. SALE BANNER */}
//       <div className="sale-banner">
//         <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
//         <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
//       </div>

//       {/* 3. TRUST STRIP */}
//       <TrustStrip />

//       {/* 4. WORLDWIDE STRIP */}
//       <WorldwideStrip />

//       {/* 5. CATEGORIES */}
//       <section className="categories-section">
//         <SectionDivider subtitle="Browse by Style" title="Shop by Category" />
//         <div className="categories-grid">
//           {[
//             { name: "Earrings",  img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=85", path: "/shop?cat=Earring" },
//             { name: "Necklaces", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85", path: "/shop?cat=Necklace" },
//             { name: "Bracelets", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85", path: "/shop?cat=Bracelet" },
//             { name: "Rings",     img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85", path: "/shop?cat=Ring" },
//           ].map(cat => (
//             <Link to={cat.path} key={cat.name} className="category-card">
//               <img src={cat.img} alt={cat.name} />
//               <div className="category-overlay">
//                 <span>{cat.name}</span>
//                 <div className="category-explore">Explore →</div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* 6. FEATURED PRODUCTS */}
//       <section className="featured-section">
//         <SectionDivider subtitle="Curated For You" title="Trending Now" />
//         <div className="products-grid">
//           {featured.map(p => (
//             <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
//           ))}
//         </div>
//         <div style={{ textAlign: "center", marginTop: "52px" }}>
//           <Link to="/shop" className="btn-primary">View All Products</Link>
//         </div>
//       </section>

//       {/* 7. PLATFORMS */}
//       <PlatformsSection />

//       {/* 8. TESTIMONIALS */}
//       <section className="testimonials-section">
//         <SectionDivider subtitle="Customer Love" title="What They Say" />
//         <div className="testimonials-grid">
//           {[
//             { name: "Ms. Heena Gupta", text: "When it arrived, it was exactly as shown. So pretty. Very happy with my purchase!", product: "Katherine Bracelet" },
//             { name: "Ms. Bhavika Kakurlawala", text: "The earrings are awesome & the bracelet is so elegant and easy to wear! Both pieces are just lovely.", product: "Swarovski Pearl Bracelet" },
//             { name: "Ms. Tanya", text: "Found the most perfect gift! The moonstone was her sunshine stone. She was so happy.", product: "Multi Moonlight Bracelet" },
//           ].map((t, i) => (
//             <div className="testimonial-card" key={i}>
//               <div className="testimonial-stars">★★★★★</div>
//               <p className="testimonial-text">"{t.text}"</p>
//               <p className="testimonial-name">{t.name}</p>
//               <p className="testimonial-product">{t.product}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// }

// // ── Shop Page ──
// function Shop({ cart, setCart, wishlist, setWishlist }) {
//   const [searchParams] = useSearchParams();
//   const [category, setCategory] = useState(searchParams.get("cat") || "All");
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("default");
//   const [products, setProducts] = useState([]);
//   const [showInStock, setShowInStock] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const cat = searchParams.get("cat");





import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Admin from "./Admin";
import Chatbot from "./Chatbot";

// ── Constants ──
const INR_TO_USD = 0.012;

const ANNOUNCEMENT_MESSAGES = [
  "✨ Free Delivery on All Orders",
  "💎 Handcrafted in Jaipur, India",
  "🌍 Worldwide Shipping Available",
  "🎁 Use Code GIFT15 for 15% Off",
  "🔄 Easy Returns & Exchanges",
];

const WALLPAPERS = [
  "https://rayfinesite-3.onrender.com/images/bracelet.jpg",
  "https://rayfinesite-3.onrender.com/images/wallpaper1.jpg.jpeg",
  "https://rayfinesite-3.onrender.com/images/earrings.jpg.jpeg",
];

const HERO_SLIDES = [
  { bg: "https://rayfinesite-3.onrender.com/images/bracelet.jpg", eyebrow: "New Collection", title: ["Elegance", "Redefined"], desc: "Handcrafted jewellery for the modern woman. Explore our new arrivals from Jaipur's finest artisans." },
  { bg: "https://rayfinesite-3.onrender.com/images/wallpaper1.jpg.jpeg", eyebrow: "Ships Worldwide", title: ["Crafted with", "Love"], desc: "From Jaipur to your doorstep — across 140+ countries. Use code GIFT15 for 15% off your order." },
  { bg: "https://rayfinesite-3.onrender.com/images/earrings.jpg.jpeg", eyebrow: "Trending Now", title: ["Timeless", "Beauty"], desc: "Gold-plated, stone-studded, handmade with care. Every piece tells a story." },
];

// ── Helpers ──
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
      style={{ position: "fixed", inset: 0, background: "rgba(44,36,24,0.65)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: "8px", maxWidth: "900px", width: "100%", maxHeight: "90vh", overflow: "auto", display: "flex", flexWrap: "wrap", boxShadow: "0 32px 80px rgba(44,36,24,0.18)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ flex: "1 1 350px", position: "relative", minHeight: "350px" }}>
          <img
            src={product.image} alt={product.name}
            style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "8px 0 0 8px", display: "block" }}
            onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }}
          />
          {!product.inStock && <div style={{ position: "absolute", top: 16, left: 16, background: "#555", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OUT OF STOCK</div>}
          {discount && product.inStock && <div style={{ position: "absolute", top: 16, left: 16, background: "var(--primary)", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>-{discount}% OFF</div>}
        </div>
        <div style={{ flex: "1 1 300px", padding: "40px 36px" }}>
          <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
          <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 10 }}>{product.category}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", color: "var(--text)", fontSize: "28px", marginBottom: 16, fontWeight: 400, lineHeight: 1.2 }}>{product.name}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--primary)" }}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span style={{ textDecoration: "line-through", color: "var(--text-light)", fontSize: "16px" }}>₹{product.originalPrice.toLocaleString()}</span>}
            <span style={{ fontSize: "13px", color: "var(--text-muted)", background: "var(--cream)", padding: "3px 10px", borderRadius: "20px" }}>{formatUSD(product.price)}</span>
            {discount && <span style={{ background: "#fff0f3", color: "var(--primary)", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Save {discount}%</span>}
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.8", marginBottom: 24, fontSize: "14px" }}>{product.description}</p>
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontWeight: 600, marginBottom: 10, fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>Select Finish</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.variants.map(v => (
                  <button key={v} onClick={() => setSelectedVariant(v)} style={{ padding: "7px 16px", borderRadius: "2px", fontSize: "12px", cursor: "pointer", background: selectedVariant === v ? "var(--text)" : "var(--cream)", color: selectedVariant === v ? "#fff" : "var(--text-muted)", border: selectedVariant === v ? "1.5px solid var(--text)" : "1.5px solid var(--border)", fontWeight: selectedVariant === v ? 700 : 400, transition: "all 0.2s" }}>{v}</button>
                ))}
              </div>
            </div>
          )}
          {product.material && <div style={{ marginBottom: 12, fontSize: "13px", color: "var(--text-muted)" }}><strong>Material:</strong> {product.material}</div>}
          {product.careInstructions && <div style={{ marginBottom: 24, fontSize: "13px", color: "var(--text-muted)", background: "var(--cream)", padding: "14px", borderRadius: "6px", border: "1px solid var(--border-light)" }}><strong>✨ Care:</strong> {product.careInstructions}</div>}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={addToCart} disabled={!product.inStock} style={{ flex: 1, padding: 15, borderRadius: "2px", border: "none", cursor: product.inStock ? "pointer" : "not-allowed", background: product.inStock ? "var(--text)" : "#ccc", color: "#fff", fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", transition: "all 0.3s" }}>
              {!product.inStock ? "Out of Stock" : inCart ? "✓ Added" : "Add to Cart"}
            </button>
            <button onClick={toggleWishlist} style={{ padding: "15px 20px", borderRadius: "2px", border: "1.5px solid var(--border)", background: inWishlist ? "var(--primary)" : "transparent", color: inWishlist ? "#fff" : "var(--text)", cursor: "pointer", fontSize: "18px", transition: "all 0.3s" }}>
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

// ── Worldwide Strip ──
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

// ── Navbar ── (CHANGED: removed admin icon, kept only wishlist + cart)
function Navbar({ cart, wishlist, onCartOpen, user }) {
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
    <nav className="navbar" style={scrolled ? { boxShadow: "0 2px 20px rgba(176,122,90,0.10)" } : {}}>
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
        <svg width="160" height="40" viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="34" fontFamily="Cormorant Garamond, serif" fontSize="32" fontStyle="italic" fontWeight="300" fill="#B07A5A" letterSpacing="1">Ray</text>
          <text x="60" y="34" fontFamily="Cormorant Garamond, serif" fontSize="32" fontWeight="400" fill="#2C2418" letterSpacing="1"> Fine</text>
          <line x1="0" y1="40" x2="150" y2="40" stroke="#B07A5A" strokeWidth="0.6" opacity="0.3"/>
          <text x="0" y="47" fontFamily="DM Sans, sans-serif" fontSize="7" fontWeight="300" fill="#8A7968" letterSpacing="5">ORNATES</text>
        </svg>
      </Link>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={loc.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to="/shop" className={loc.pathname === "/shop" ? "active" : ""}>Shop</Link>
        <Link to="/shop?cat=sale">Sale</Link>
        <Link to="/about" className={loc.pathname === "/about" ? "active" : ""}>About</Link>
        <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""}>Contact</Link>
      </div>
      <div className="nav-actions">
        {/* Wishlist + Cart only; Account links to customer page */}
        <Link to="/wishlist" className="nav-icon" title="Wishlist">🤍 <span className="badge">{wishlist.length}</span></Link>
        <button className="nav-icon" onClick={onCartOpen} title="Cart">🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span></button>
        <Link to="/account" className="nav-icon" title={user ? `Hi, ${user.name || "Account"}` : "Account"}>
          {user ? <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--primary)" }}>{(user.name || user.email)[0].toUpperCase()}</span> : "👤"}
        </Link>
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

  const placeOrder = () => {
    alert("Payment integration pending");
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(p => (p._id || p.id) === id ? { ...p, quantity: p.quantity + delta } : p)
          .filter(p => p.quantity > 0)
    );
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
                <p style={{ marginBottom: "8px", fontFamily: "Playfair Display, serif", fontSize: "20px", color: "var(--text)" }}>Your cart is empty</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>Discover our beautiful collection</p>
                <Link to="/shop" className="btn-primary" style={{ display: "inline-block" }} onClick={onClose}>Shop Now</Link>
              </div>
            ) : cart.map(item => (
              <div className="cart-item" key={item.id + (item.selectedVariant || "")}>
                <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/76x76?text=Item"} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  {item.selectedVariant && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: 4 }}>{item.selectedVariant}</p>}
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                    {item.originalPrice && <p className="cart-item-original">₹{item.originalPrice.toLocaleString()}</p>}
                    <span style={{ fontSize: "11px", color: "var(--text-light)" }}>{formatUSD(item.price)}</span>
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
            <h4 style={{ color: "var(--primary)", fontFamily: "Playfair Display, serif", fontSize: "22px", fontWeight: 400 }}>Delivery Details</h4>
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
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{formatUSD(total)}</div>
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
function ProductCard({ product, cart, setCart, wishlist, setWishlist }) {
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

  return (
    <>
      {showModal && (
        <ProductModal product={product} onClose={() => setShowModal(false)} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
      )}
      <div className="product-card" onClick={() => setShowModal(true)} style={{ cursor: "pointer", opacity: product.inStock ? 1 : 0.7 }}>
        <div className="product-img-wrap">
          <img src={product.image} alt={product.name} onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }} />
          <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}>{inWishlist ? "❤️" : "🤍"}</button>
          {!product.inStock && <div className="sale-badge" style={{ background: "#555" }}>Out of Stock</div>}
          {discount && product.inStock && <div className="sale-badge">-{discount}%</div>}
          <div className="product-category-tag">{product.category}</div>
        </div>
        <div className="product-info">
          <h4>{product.name}</h4>
          <p className="product-desc">{product.description?.substring(0, 80)}...</p>
          {product.variants && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
              {product.variants.slice(0, 3).map(v => (
                <span key={v} style={{ fontSize: "10px", background: "var(--cream)", padding: "2px 8px", borderRadius: "10px", color: "var(--text-muted)" }}>{v}</span>
              ))}
            </div>
          )}
          <div className="price-wrap">
            <span className="price-current">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>}
            <span className="price-usd">{formatUSD(product.price)}</span>
          </div>
          <button className={`btn-add-cart ${inCart ? "added" : ""}`} onClick={addToCart} disabled={!product.inStock}>
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

// ── Trust Strip ── (CHANGED: added "Shipped Globally")
function TrustStrip() {
  return (
    <div className="trust-strip">
      {[
        { icon: "🚚", title: "Free Delivery", sub: "On all orders" },
        { icon: "💎", title: "Handcrafted", sub: "Jaipur artisans" },
        { icon: "🌍", title: "Shipped Globally", sub: "140+ countries" },
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

// ── Platforms Section ──
function PlatformsSection() {
  return (
    <div className="platforms-section">
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <p className="section-subtitle">Find Us On</p>
        <h2 className="section-title" style={{ fontSize: "clamp(20px,2.5vw,30px)" }}>Available on Our Platforms</h2>
      </div>
      <div className="platforms-grid">
        {[
          { icon: "📸", name: "Instagram", handle: "@rayfineornates", url: "https://www.instagram.com/rayfineornates/" },
          { icon: "👍", name: "Facebook", handle: "Ray Fine Ornates", url: "https://www.facebook.com/rayfineornatesjewellery" },
          { icon: "📌", name: "Pinterest", handle: "rayfineornates", url: "https://in.pinterest.com/rayfineornates/" },
        ].map(p => (
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

// ── Hero Slider ──
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
        <div key={i} className={`hero-bg ${i === current ? "active" : "inactive"}`} style={{ backgroundImage: `url(${s.bg})` }} />
      ))}
      <div className="hero-overlay">
        <div className="hero-eyebrow" key={current + "eyebrow"}>
          <div className="hero-eyebrow-line" />
          <span className="hero-sub">{slide.eyebrow}</span>
        </div>
        <h1 key={current + "h1"}>
          {slide.title[0]}<br /><span>{slide.title[1]}</span>
        </h1>
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

// ── Order Tracking ── (NEW COMPONENT)
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
    setError("");
    setLoading(true);
    setResult(null);

    // Simulated tracking — replace with real API call
    await new Promise(r => setTimeout(r, 1400));

    // Mock response — replace with actual fetch to your backend
    // e.g. fetch(`https://rayfinesite-3.onrender.com/api/orders/track?orderId=${orderId}&phone=${phone}`)
    setLoading(false);
    setResult({
      found: false, // set true when real API is integrated
    });
  };

  const statusSteps = ["Order Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

  return (
    <div style={{
      background: "linear-gradient(135deg, #fdf8f4 0%, #f5ede4 100%)",
      border: "1px solid var(--border-light, #e8ddd4)",
      borderRadius: "16px",
      padding: "36px 32px",
      maxWidth: "540px",
      margin: "0 auto 0",
    }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "36px", marginBottom: "10px" }}>📦</div>
        <h3 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "24px",
          fontWeight: 400,
          color: "var(--text, #2C2418)",
          marginBottom: "6px",
        }}>Track Your Order</h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted, #8A7968)", lineHeight: 1.6 }}>
          Enter your Order ID or registered phone number to check your delivery status.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        <input
          placeholder="Order ID (e.g. RFO-2024-1234)"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          style={{
            padding: "13px 16px",
            borderRadius: "6px",
            border: "1.5px solid var(--border, #d9ccc2)",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            background: "#fff",
            color: "var(--text, #2C2418)",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--primary, #B07A5A)"}
          onBlur={e => e.target.style.borderColor = "var(--border, #d9ccc2)"}
        />
        <div style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted, #8A7968)", letterSpacing: "1px" }}>— OR —</div>
        <input
          placeholder="Registered Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{
            padding: "13px 16px",
            borderRadius: "6px",
            border: "1.5px solid var(--border, #d9ccc2)",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            background: "#fff",
            color: "var(--text, #2C2418)",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--primary, #B07A5A)"}
          onBlur={e => e.target.style.borderColor = "var(--border, #d9ccc2)"}
        />
      </div>

      {error && (
        <p style={{ color: "#c0392b", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>{error}</p>
      )}

      <button
        onClick={trackOrder}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "#c4a98a" : "var(--primary, #B07A5A)",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.3s",
          marginBottom: "16px",
        }}
      >
        {loading ? "Tracking..." : "Track Order →"}
      </button>

      {result && !result.found && (
        <div style={{
          background: "#fff8f5",
          border: "1px solid #f0ddd0",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔍</div>
          <p style={{ fontWeight: 600, color: "var(--text, #2C2418)", marginBottom: "6px", fontSize: "15px" }}>Order Not Found</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted, #8A7968)", marginBottom: "14px", lineHeight: 1.6 }}>
            We couldn't find this order. Please double-check your details or contact us on WhatsApp for help.
          </p>
          <a
            href="https://wa.me/918690666771"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "#25D366",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            💬 WhatsApp Us
          </a>
        </div>
      )}

      {result && result.found && (
        <div style={{ background: "#fff", border: "1px solid var(--border-light)", borderRadius: "10px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: 8 }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Order ID</p>
              <p style={{ fontWeight: 700, color: "var(--text)" }}>{result.orderId}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Status</p>
              <p style={{ fontWeight: 700, color: "var(--primary)" }}>{result.status}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              {statusSteps.map((step, i) => {
                const currentIdx = statusSteps.indexOf(result.status);
                const done = i <= currentIdx;
                return (
                  <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{
                      width: 20, height: 20,
                      borderRadius: "50%",
                      background: done ? "var(--primary, #B07A5A)" : "#e0d4cb",
                      border: done ? "none" : "2px solid #e0d4cb",
                      marginBottom: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", color: "#fff", fontWeight: 700,
                    }}>{done ? "✓" : ""}</div>
                    <span style={{ fontSize: "9px", color: done ? "var(--primary)" : "var(--text-muted)", textAlign: "center", lineHeight: 1.2 }}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {result.estimatedDelivery && (
            <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
              📅 Estimated Delivery: <strong>{result.estimatedDelivery}</strong>
            </p>
          )}
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted, #8A7968)", marginTop: "14px" }}>
        Need help?{" "}
        <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer"
          style={{ color: "var(--primary, #B07A5A)", fontWeight: 600, textDecoration: "none" }}>
          WhatsApp us
        </a>
      </p>
    </div>
  );
}

// ── Home Page ──
function Home({ cart, setCart, wishlist, setWishlist }) {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("https://rayfinesite-3.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const fixed = list.map(p => ({
          ...p,
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim()
        }));
        setFeatured(fixed.slice(0, 8));
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* 1. HERO */}
      <HeroSlider />

      {/* 2. SALE BANNER */}
      <div className="sale-banner">
        <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
        <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
      </div>

      {/* 3. TRUST STRIP */}
      <TrustStrip />

      {/* 4. WORLDWIDE STRIP */}
      <WorldwideStrip />

      {/* 5. CATEGORIES — Square grid 4 across */}
      <section className="categories-section">
        <SectionDivider subtitle="Browse by Style" title="Shop by Category" />
        <div className="cat-square-grid">
          {[
          { name: "Earrings",  img: "https://rayfinesite-3.onrender.com/images/IMG-20260527-WA0037.jpg", path: "/shop?cat=Earring" },
{ name: "Necklaces", img: "https://rayfinesite-3.onrender.com/images/necklace.jpg", path: "/shop?cat=Necklace" },
{ name: "Bracelets", img: "https://rayfinesite-3.onrender.com/images/golden.jpg", path: "/shop?cat=Bracelet" },
{ name: "Rings",     img: "https://rayfinesite-3.onrender.com/images/ring cateo.jpg", path: "/shop?cat=Ring" },
          ].map(cat => (
            <Link to={cat.path} key={cat.name} className="cat-square-card">
              <img src={cat.img} alt={cat.name} />
              <div className="cat-square-overlay">
                <span className="cat-square-name">{cat.name}</span>
                <span className="cat-square-cta">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. FEATURED PRODUCTS */}
      <section className="featured-section">
        <SectionDivider subtitle="Curated For You" title="Trending Now" />
        <div className="products-grid">
          {featured.map(p => (
            <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "52px" }}>
          <Link to="/shop" className="btn-primary">View All Products</Link>
        </div>
      </section>

      {/* 7. PLATFORMS */}
      <PlatformsSection />

      {/* 8. TESTIMONIALS */}
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
    fetch("https://rayfinesite-3.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const fixed = list.map(p => ({
          ...p,
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim()
        }));
        setProducts(fixed);
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
        <button
          onClick={() => setShowInStock(!showInStock)}
          style={{ padding: "10px 18px", borderRadius: "2px", border: "none", cursor: "pointer", background: showInStock ? "var(--text)" : "var(--cream)", color: showInStock ? "#fff" : "var(--text-muted)", fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", minHeight: "44px" }}
        >
          {showInStock ? "✓ In Stock" : "All Products"}
        </button>
      </div>
      <div className="category-tabs">
        {["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Sale 🔥"].map(cat => (
          <button key={cat} className={`cat-tab ${(cat === "Sale 🔥" ? category === "sale" : category === cat) ? "active" : ""}`} onClick={() => setCategory(cat === "Sale 🔥" ? "sale" : cat)}>{cat}</button>
        ))}
      </div>
      {loading && <p style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)", fontFamily: "Playfair Display, serif", fontSize: "20px", fontStyle: "italic" }}>Loading collection...</p>}
      {!loading && (
        <div className="products-grid" style={{ padding: "0 40px 80px" }}>
          {filtered.map(p => (
            <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "80px", fontFamily: "Playfair Display, serif", fontSize: "20px", fontStyle: "italic" }}>No pieces found.</p>
      )}
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
          <p style={{ color: "var(--text-muted)", fontSize: "18px", marginBottom: "28px", fontFamily: "Playfair Display, serif", fontStyle: "italic" }}>No items saved yet</p>
          <Link to="/shop" className="btn-primary">Explore Collection</Link>
        </div>
      ) : (
        <div className="products-grid" style={{ padding: "40px" }}>
          {wishlist.map(p => (
            <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
          ))}
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
          <h2>Worldwide Reach</h2>
          <p>We ship to 140+ countries across the globe. From India to the USA, UAE to Australia — our jewellery reaches every corner of the world. Find us on Instagram, Facebook, and Pinterest.</p>
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80" alt="Ray Fine Ornates" />
        </div>
      </div>
      <div className="about-stats">
        {[["2021", "Founded"], ["500+", "Products"], ["10,000+", "Happy Customers"], ["140+", "Countries Shipped"]].map(([n, l]) => (
          <div className="stat-box" key={l}><h3>{n}</h3><p>{l}</p></div>
        ))}
      </div>
    </div>
  );
}

// ── Contact ── (CHANGED: removed phone, added Order Tracking section)
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
          {/* CHANGED: Phone number removed */}
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

      {/* CHANGED: Order Tracking section added */}
      <div style={{ padding: "60px 40px", background: "var(--cream, #fdf8f4)", borderTop: "1px solid var(--border-light, #e8ddd4)" }}>
        <SectionDivider subtitle="Where's My Order?" title="Track Your Delivery" />
        <OrderTracking />
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
        <h2 style={{ fontFamily: "Playfair Display, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Terms &amp; Conditions</h2>
        {[
          ["1. General Information", "Ray Fine Ornates is a Jaipur-based jewelry brand specializing in handcrafted jewelry made with precious, semi-precious, natural, and lab-created stones. All products are handcrafted and may have slight variations, making each piece unique."],
          ["2. Product Information", "We make every effort to display product images, colors, materials, and descriptions accurately. However, slight differences may occur due to lighting, screen settings, photography, and the handmade nature of our jewelry."],
          ["3. Pricing", "All prices displayed on the website are subject to change without prior notice. Prices may vary during promotions, sales, or special offers. Taxes, shipping charges, and customs duties (if applicable) may be charged separately."],
          ["4. Orders & Payments", "Orders are confirmed only after successful payment verification. Ray Fine Ornates reserves the right to cancel or refuse any order due to payment issues, product unavailability, or suspicious activity."],
          ["5. Shipping & Delivery", "We aim to dispatch orders within the mentioned processing time. Delivery timelines may vary depending on the shipping destination, customs clearance, or courier delays."],
          ["6. Returns & Exchanges", "We accept returns or exchanges only according to our Return Policy. Customized, personalized, made-to-order, and worn items are generally non-returnable unless damaged or incorrect."],
          ["7. Handmade Disclaimer", "As our jewelry is handcrafted, slight irregularities, minor imperfections, and variations in stone shape, color, or finish are natural characteristics and should not be considered defects."],
          ["8. Intellectual Property", "All website content, including images, logos, product designs, text, and graphics, belongs to Ray Fine Ornates and may not be copied or reproduced without written permission."],
          ["9. Privacy", "Customer information is kept secure and used only for order processing, communication, and service-related purposes. We do not sell or share customer information with unauthorized third parties."],
          ["10. Governing Law", "These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Jaipur, Rajasthan."],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "Playfair Display, serif", color: "var(--text)", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.9" }}>{text}</p>
          </div>
        ))}
        <hr style={{ margin: "48px 0", borderColor: "var(--border-light)" }} />
        <h2 style={{ fontFamily: "Playfair Display, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Refund &amp; Cancellation Policy</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Customers may request order cancellation within 24 hours of placing the order by contacting us at <strong>+91 8690666771</strong>. Refunds are accepted only in genuine cases such as damaged packages or incorrect products.</p>
        <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}><strong>Non-Refundable:</strong> Customized orders, personalized products, used/worn jewelry, and orders damaged due to customer mishandling.</p>
        <hr style={{ margin: "48px 0", borderColor: "var(--border-light)" }} />
        <h2 style={{ fontFamily: "Playfair Display, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Frequently Asked Questions</h2>
        {[
          ["What type of jewelry does Ray Fine Ornates offer?", "We specialize in handcrafted gold-plated jewelry featuring precious, semi-precious, natural, and lab-created stones. Our collection includes necklaces, bracelets, earrings, rings, bridal jewelry, spiritual jewelry, and custom-made designs."],
          ["Are your jewelry pieces handmade?", "Yes, all our jewelry pieces are handcrafted by skilled artisans in Jaipur, India. Slight variations are natural characteristics of handmade jewelry."],
          ["Do you accept custom or personalized orders?", "Yes, we offer made-to-order and customized jewelry services. Contact us via WhatsApp at +91 8690666771."],
          ["Do you ship internationally?", "Yes, we ship worldwide to 140+ countries. Shipping timelines may vary depending on the destination country and customs clearance process."],
          ["Can I cancel my order?", "Yes, orders can be canceled within 24 hours of placing the order by contacting us at +91 8690666771."],
          ["How should I care for my jewelry?", "Keep away from water and perfumes, store in a dry airtight pouch, avoid moisture and rough surfaces."],
          ["Where is your store located?", "223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003, Rajasthan, India."],
        ].map(([q, a]) => (
          <details key={q} style={{ marginBottom: "10px", padding: "14px 18px", border: "1px solid var(--border-light)", borderRadius: "8px", background: "#fff" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "15px", color: "var(--text)" }}>{q}</summary>
            <p style={{ marginTop: "12px", color: "var(--text-muted)", lineHeight: "1.7" }}>{a}</p>
          </details>
        ))}
        <hr style={{ margin: "48px 0", borderColor: "var(--border-light)" }} />
        <div style={{ background: "var(--cream)", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily: "Playfair Display, serif", color: "var(--primary)", fontSize: "22px", marginBottom: "12px" }}>Contact Information</h3>
          <p style={{ color: "var(--text-muted)" }}><strong>Phone:</strong> +91 8690666771</p>
          <p style={{ color: "var(--text-muted)" }}><strong>Address:</strong> 223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003</p>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}><strong>Hours:</strong> Monday–Saturday, 10:00 AM–7:00 PM</p>
          <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="btn-primary">WhatsApp Us</a>
        </div>
      </div>
    </div>
  );
}

// ── Footer ── (CHANGED: removed top footer strip, kept main footer only)
function Footer() {
  return (
    <footer className="footer">
      {/* CHANGED: top strip removed */}
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
          <div className="footer-contact-item"><span className="footer-contact-icon">✉</span><span style={{ fontSize: "13px", color: "var(--text-muted)" }}>info@rayfineornates.com</span></div>
          {/* CHANGED: phone number removed from footer too */}
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

// ── User Auth Context ──
function useUserAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rfo_user")) || null; } catch { return null; }
  });

  const login = (userData) => {
    localStorage.setItem("rfo_user", JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("rfo_user");
    setUser(null);
  };
  const signup = (userData) => {
    // Save to localStorage as simple user store
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


// ── Customer Account Page ──
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
    const result = mode === "signup"
      ? signup(form)
      : loginWithCredentials(form.email, form.password);
    setLoading(false);
    if (result?.error) setError(result.error);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: "6px",
    border: "1.5px solid var(--border, #d9ccc2)", fontSize: "14px",
    fontFamily: "inherit", outline: "none", background: "#fff",
    color: "var(--text, #2C2418)", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  if (user) {
    return (
      <div className="page-content">
        <div className="shop-hero">
          <h1>My Account</h1>
          <p>Welcome back, {user.name || user.email}</p>
        </div>
        <div style={{ maxWidth: 480, margin: "60px auto", padding: "0 24px 80px" }}>
          <div style={{ background: "linear-gradient(135deg, #fdf8f4, #f5ede4)", border: "1px solid var(--border-light, #e8ddd4)", borderRadius: 16, padding: "40px 36px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary, #B07A5A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px", color: "#fff", fontFamily: "Playfair Display, serif" }}>
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>{user.name || "Valued Customer"}</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 32 }}>{user.email}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer"
                style={{ display: "block", padding: "13px", background: "#25D366", color: "#fff", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>
                💬 Track Order on WhatsApp
              </a>
              <Link to="/wishlist"
                style={{ display: "block", padding: "13px", background: "var(--cream, #fdf8f4)", color: "var(--text)", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", border: "1.5px solid var(--border, #d9ccc2)" }}>
                🤍 My Wishlist
              </Link>
              <button onClick={logout}
                style={{ width: "100%", padding: 13, background: "transparent", color: "#c0392b", border: "1.5px solid #f5c6c6", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>
                Sign Out
              </button>
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
        <div style={{ background: "linear-gradient(135deg, #fdf8f4, #f5ede4)", border: "1px solid var(--border-light, #e8ddd4)", borderRadius: 16, padding: "40px 36px" }}>
          <div style={{ display: "flex", background: "#fff", borderRadius: 8, padding: 4, marginBottom: 28, border: "1px solid var(--border-light)" }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase", transition: "all 0.2s",
                  background: mode === m ? "var(--primary, #B07A5A)" : "transparent",
                  color: mode === m ? "#fff" : "var(--text-muted, #8A7968)" }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--primary, #B07A5A)"}
                onBlur={e => e.target.style.borderColor = "var(--border, #d9ccc2)"} />
            )}
            <input placeholder="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--primary, #B07A5A)"}
              onBlur={e => e.target.style.borderColor = "var(--border, #d9ccc2)"} />
            <input placeholder="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--primary, #B07A5A)"}
              onBlur={e => e.target.style.borderColor = "var(--border, #d9ccc2)"}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          {error && <p style={{ color: "#c0392b", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", marginTop: 20, padding: 14, background: loading ? "#c4a98a" : "var(--primary, #B07A5A)", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 16 }}>
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ background: "none", border: "none", color: "var(--primary, #B07A5A)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const userAuth = useUserAuth();
  const loc = useLocation();
  const isAdminPage = loc.pathname === "/admin" || loc.pathname === "/login";

  return (
    <>
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
