
// import { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
// import "./App.css";
// import Login from "./login";
// import Admin from "./Admin";
// import Chatbot from "./Chatbot";

// const WALLPAPERS = [
//   "https://images.unsplash.com/photo-1617038260897-41a1f14a0d7b?auto=format&fit=crop&w=1600&q=80",
//   "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
//   "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=80",
//   "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1920&q=90",
// ];

// const ANNOUNCEMENT_MESSAGES = [
//   "🎁 Get Additional 15% Discount — Use Code GIFT15",
//   "🚚 Free Express Delivery on All Orders",
//   "💎 Handcrafted in Jaipur — Shipped Worldwide",
// ];

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
//     <div style={{ position: "fixed", inset: 0, background: "rgba(20,5,10,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
//       <div style={{ background: "#fff", borderRadius: "8px", maxWidth: "900px", width: "100%", maxHeight: "90vh", overflow: "auto", display: "flex", flexWrap: "wrap", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
//         <div style={{ flex: "1 1 350px", position: "relative", minHeight: "350px" }}>
//           <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "8px 0 0 8px", display: "block" }} onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }} />
//           {!product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "#333", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OUT OF STOCK</div>}
//           {discount && product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "#7B2E3E", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>-{discount}% OFF</div>}
//         </div>
//         <div style={{ flex: "1 1 300px", padding: "40px 36px" }}>
//           <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
//           <div style={{ fontSize: "10px", color: "#C9963C", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>{product.category}</div>
//           <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a0a0f", fontSize: "28px", marginBottom: "16px", fontWeight: 400, lineHeight: 1.2 }}>{product.name}</h2>
//           <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
//             <span style={{ fontSize: "26px", fontWeight: 700, color: "#7B2E3E" }}>₹{product.price.toLocaleString()}</span>
//             {product.originalPrice && <span style={{ textDecoration: "line-through", color: "#c0a0a8", fontSize: "16px" }}>₹{product.originalPrice.toLocaleString()}</span>}
//             {discount && <span style={{ background: "#fff0f3", color: "#7B2E3E", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Save {discount}%</span>}
//           </div>
//           <p style={{ color: "#6a4a50", lineHeight: "1.8", marginBottom: "24px", fontSize: "14px" }}>{product.description}</p>
//           {product.variants && product.variants.length > 0 && (
//             <div style={{ marginBottom: "22px" }}>
//               <p style={{ fontWeight: 600, marginBottom: "10px", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9a7a80" }}>Select Finish</p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                 {product.variants.map(v => (
//                   <button key={v} onClick={() => setSelectedVariant(v)} style={{ padding: "7px 16px", borderRadius: "2px", fontSize: "12px", cursor: "pointer", background: selectedVariant === v ? "#7B2E3E" : "#f5f0eb", color: selectedVariant === v ? "#fff" : "#5a3a42", border: selectedVariant === v ? "1.5px solid #7B2E3E" : "1.5px solid #e0d0d4", fontWeight: selectedVariant === v ? 700 : 400, transition: "all 0.2s" }}>{v}</button>
//                 ))}
//               </div>
//             </div>
//           )}
//           {product.material && <div style={{ marginBottom: "12px", fontSize: "13px", color: "#7a5a60" }}><strong>Material:</strong> {product.material}</div>}
//           {product.careInstructions && <div style={{ marginBottom: "24px", fontSize: "13px", color: "#7a5a60", background: "#fdf8f5", padding: "14px", borderRadius: "6px", border: "1px solid #f0e4df" }}><strong>✨ Care:</strong> {product.careInstructions}</div>}
//           <div style={{ display: "flex", gap: "12px" }}>
//             <button onClick={addToCart} disabled={!product.inStock} style={{ flex: 1, padding: "15px", borderRadius: "2px", border: "none", cursor: product.inStock ? "pointer" : "not-allowed", background: product.inStock ? "#7B2E3E" : "#ccc", color: "#fff", fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", transition: "all 0.3s" }}>
//               {!product.inStock ? "Out of Stock" : inCart ? "✓ Added" : "Add to Cart"}
//             </button>
//             <button onClick={toggleWishlist} style={{ padding: "15px 20px", borderRadius: "2px", border: "1.5px solid #7B2E3E", background: inWishlist ? "#7B2E3E" : "transparent", color: inWishlist ? "#fff" : "#7B2E3E", cursor: "pointer", fontSize: "18px", transition: "all 0.3s" }}>
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
//     <nav className="navbar" style={scrolled ? { boxShadow: "0 2px 20px rgba(123,46,62,0.10)" } : {}}>
//      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
//   <img
//     src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png"
//     alt="Ray Fine Ornates"
//     style={{ height: "50px", width: "auto", display: "block" }}
//   />
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
//         <button className="nav-icon cart-btn" onClick={onCartOpen} title="Cart">🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span></button>
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
// const placeOrder = () => {
//   alert("Payment integration pending");
// };
//   // FIX: use _id || id for matching
// const updateQty = (id, delta) => {
//     setCart(prev => prev.map(p => (p._id || p.id) === id ? { ...p, quantity: p.quantity + delta } : p).filter(p => p.quantity > 0));
// };

 

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
//                 <p style={{ marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", color: "#5a3a42" }}>Your cart is empty</p>
//                 <p style={{ fontSize: "13px", color: "#9a7a80", marginBottom: "24px" }}>Discover our beautiful collection</p>
//                 <Link to="/shop" className="btn-primary" style={{ display: "inline-block" }} onClick={onClose}>Shop Now</Link>
//               </div>
//             ) : cart.map(item => (
//               <div className="cart-item" key={item.id}>
//                 <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/76x76?text=Item"} />
//                 <div className="cart-item-info">
//                   <p className="cart-item-name">{item.name}</p>
//                   {item.selectedVariant && <p style={{ fontSize: "11px", color: "#9a7a80", marginBottom: "4px" }}>{item.selectedVariant}</p>}
//                   <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                     <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
//                     {item.originalPrice && <p className="cart-item-original">₹{item.originalPrice.toLocaleString()}</p>}
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
//             <h4 style={{ color: "#7B2E3E", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 400 }}>Delivery Details</h4>
//             <input placeholder="Full Name *" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
//             <input placeholder="Phone Number *" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
//             <input placeholder="Delivery Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
//             <div className="order-summary">
//               <h5>Order Summary</h5>
//               {cart.map(item => (
//                 <div key={item.id} className="order-summary-item">
//                   <span>{item.name} × {item.quantity}</span>
//                   <span>₹{(item.price * item.quantity).toLocaleString()}</span>
//                 </div>
//               ))}
//               <div className="order-summary-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
//             </div>
//             <button className="btn-checkout" onClick={placeOrder}>Pay ₹{total.toLocaleString()} →</button>
//             <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
//           </div>
//         )}
//         {step === "cart" && cart.length > 0 && (
//           <div className="cart-footer">
//             {savings > 0 && <div className="cart-savings">🎉 You save ₹{savings.toLocaleString()}!</div>}
//             <div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
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
//       {showModal && <ProductModal product={product} onClose={() => setShowModal(false)} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />}
//       <div className="product-card" onClick={() => setShowModal(true)} style={{ cursor: "pointer", opacity: product.inStock ? 1 : 0.7 }}>
//         <div className="product-img-wrap">
//           <img src={product.image} alt={product.name} onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }} />
//           <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}>{inWishlist ? "❤️" : "🤍"}</button>
//           {!product.inStock && <div className="sale-badge" style={{ background: "#555" }}>Out of Stock</div>}
//           {discount && product.inStock && <div className="sale-badge">-{discount}%</div>}
//           <div className="product-category-tag">{product.category}</div>
//           <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "10px", padding: "4px 9px", borderRadius: "10px" }}>👁 View</div>
//         </div>
//         <div className="product-info">
//           <h4>{product.name}</h4>
//           <p className="product-desc">{product.description?.substring(0, 80)}...</p>
//           {product.variants && (
//             <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
//               {product.variants.slice(0, 3).map(v => (
//                 <span key={v} style={{ fontSize: "10px", background: "#f5f0eb", padding: "2px 8px", borderRadius: "10px", color: "#9a7a80" }}>{v}</span>
//               ))}
//             </div>
//           )}
//           <div className="price-wrap">
//             <span className="price-current">₹{product.price.toLocaleString()}</span>
//             {product.originalPrice && <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>}
//           </div>
//           <button className={`btn-add-cart ${inCart ? "added" : ""} ${!product.inStock ? "disabled" : ""}`} onClick={addToCart} disabled={!product.inStock}>
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
//         { icon: "🔄", title: "Easy Returns", sub: "Hassle-free" },
//         { icon: "🔒", title: "Secure Payment", sub: "100% safe" },
//       ].map((item) => (
//         <div className="trust-item" key={item.title}>
//           <div className="trust-item-icon">{item.icon}</div>
//           <div className="trust-item-title">{item.title}</div>
//           <div className="trust-item-sub">{item.sub}</div>
//         </div>
//       ))}
//     </div>
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
//         const fixed = list.map(p => ({ ...p, image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim() }));
//         setFeatured(fixed.slice(0, 8));
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <>
//       {/* HERO SLIDER */}
      
// <section className="hero" style={{ position: "relative", overflow: "hidden", height: "100vh", background: "#1a0a0f" }}>
//         <div style={{
//           position: "absolute", inset: 0,
//           backgroundImage: `url(${WALLPAPERS[0]})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
         
//         }} />
//         <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(20,5,10,0.65) 0%, rgba(20,5,10,0.2) 100%)" }} />
//         <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8%", maxWidth: "650px" }}>
//           <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(48px, 8vw, 90px)", fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: "24px", fontStyle: "italic" }}>
//             Elegance<br /><span style={{ color: "#D4AA80" }}>Redefined</span>
//           </h1>
//           <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//             <Link to="/shop" style={{ background: "#7B2E3E", color: "#fff", padding: "14px 32px", textDecoration: "none", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600 }}>Explore Collection</Link>
//             <Link to="/about" style={{ border: "1px solid rgba(255,255,255,0.6)", color: "#fff", padding: "14px 32px", textDecoration: "none", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 300 }}>Our Story</Link>
//           </div>
//         </div>
//       </section>

       

//       {/* SALE BANNER */}
//       <div className="sale-banner">
//         <span> SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
//         <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
//       </div>

//       {/* TRUST STRIP */}
//       <TrustStrip />

//       {/* CATEGORIES */}
//       <section className="categories-section">
//         <SectionDivider subtitle="Browse by Style" title="Shop by Category" />
//         <div className="categories-grid">
//           {[
//              { name: "Earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=85", path: "/shop?cat=Earring" },
//             { name: "Necklaces", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85", path: "/shop?cat=Necklace" },
//             { name: "Bracelets", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85", path: "/shop?cat=Bracelet" },
//            { name: "Rings", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85", path: "/shop?cat=Ring" },
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

//       {/* FEATURED PRODUCTS */}
//       <section className="featured-section">
//         <SectionDivider subtitle="Curated For You" title="Trending Now" />
//         <div className="products-grid">
//           {featured.map(p => (
//             <ProductCard key={p._id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
//           ))}
//         </div>
//         <div style={{ textAlign: "center", marginTop: "52px" }}>
//           <Link to="/shop" className="btn-primary">View All Products</Link>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
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
//     fetch("https://rayfinesite-3.onrender.com/api/products")
//       .then(res => res.json())
//       .then(data => {
//         const list = Array.isArray(data?.data) ? data.data : [];
//         const fixed = list.map(p => ({ ...p, image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim() }));
//         setProducts(fixed);
//         setLoading(false);
//       })
//       .catch(err => { console.error(err); setLoading(false); });
//   }, []);

//   let filtered = products.filter(p => {
//     const matchCat = category === "All" ? true : category === "sale" ? p.originalPrice : (p.category || "").toLowerCase().trim() === category.toLowerCase().trim();
//     const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
//     const matchStock = showInStock ? p.inStock : true;
//     return matchCat && matchSearch && matchStock;
//   });

//   if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
//   if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

//   return (
//     <div className="shop-page">
//       <div className="shop-hero">
//         <p className="section-subtitle" style={{ marginBottom: "12px" }}>Handcrafted in Jaipur</p>
//         <h1>Our Collection</h1>
//         <p>Discover timeless pieces crafted with love</p>
//       </div>
//       <div className="shop-controls">
//         <input className="shop-search" placeholder="🔍 Search jewellery..." value={search} onChange={e => setSearch(e.target.value)} />
//         <select className="shop-sort" value={sort} onChange={e => setSort(e.target.value)}>
//           <option value="default">Sort: Featured</option>
//           <option value="low">Price: Low to High</option>
//           <option value="high">Price: High to Low</option>
//         </select>
//         <button onClick={() => setShowInStock(!showInStock)} style={{ padding: "10px 18px", borderRadius: "2px", border: "none", cursor: "pointer", background: showInStock ? "#7B2E3E" : "#f0ebe6", color: showInStock ? "#fff" : "#5a3a42", fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", minHeight: "44px" }}>
//           {showInStock ? "✓ In Stock" : "All Products"}
//         </button>
//       </div>
//       <div className="category-tabs">
//         {["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Sale 🔥"].map(cat => (
//           <button key={cat} className={`cat-tab ${(cat === "Sale 🔥" ? category === "sale" : category === cat) ? "active" : ""}`} onClick={() => setCategory(cat === "Sale 🔥" ? "sale" : cat)}>{cat}</button>
//         ))}
//       </div>
//       {loading && <p style={{ textAlign: "center", padding: "80px", color: "#9a7a80", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>Loading collection...</p>}
//       {!loading && (
//         <div className="products-grid" style={{ padding: "0 40px 80px" }}>
//           {filtered.map(p => <ProductCard key={p._id || p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />)}
//         </div>
//       )}
//       {!loading && filtered.length === 0 && <p style={{ textAlign: "center", color: "#9a7a80", padding: "80px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>No pieces found.</p>}
//     </div>
//   );
// }

// // ── Wishlist ──
// function Wishlist({ wishlist, setWishlist, cart, setCart }) {
//   return (
//     <div className="shop-page">
//       <div className="shop-hero">
//         <h1>Your Wishlist</h1>
//         <p>{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
//       </div>
//       {wishlist.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "100px 20px" }}>
//           <div style={{ fontSize: "56px", marginBottom: "20px" }}>🤍</div>
//           <p style={{ color: "#9a7a80", fontSize: "18px", marginBottom: "28px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>No items saved yet</p>
//           <Link to="/shop" className="btn-primary">Explore Collection</Link>
//         </div>
//       ) : (
//         <div className="products-grid" style={{ padding: "40px" }}>
//           {wishlist.map(p => <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />)}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── About ──
// function About() {
//   return (
//     <div className="page-content">
//       <div className="shop-hero">
//         <p className="section-subtitle" style={{ marginBottom: "12px" }}>Est. 2021 · Jaipur, India</p>
//         <h1>Our Story</h1>
//         <p>Crafting elegance since 2021</p>
//       </div>
//       <div className="about-grid">
//         <div className="about-text">
//           <h2>Who We Are</h2>
//           <p>Ray Fine Ornates is a luxury fashion jewellery brand based in the heart of Johari Bazar, Jaipur — India's jewellery capital. We believe every woman deserves to feel like royalty.</p>
//           <p>Our pieces are crafted with precision, using the finest materials to create jewellery that is both timeless and contemporary. From delicate studs to statement necklaces, each piece tells a story.</p>
//           <h2>Our Promise</h2>
//           <p>Quality you can feel. Beauty you can see. Service you can trust. We stand behind every piece we create with our dedication to craftsmanship and customer satisfaction.</p>
//         </div>
//         <div className="about-image">
//           <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80" alt="Ray Fine Ornates" />
//         </div>
//       </div>
//       <div className="about-stats">
//         {[["2021", "Founded"], ["500+", "Products"], ["10,000+", "Happy Customers"], ["Jaipur", "Headquarters"]].map(([n, l]) => (
//           <div className="stat-box" key={l}><h3>{n}</h3><p>{l}</p></div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Contact ──
// function Contact() {
//   const [form, setForm] = useState({ name: "", email: "", message: "" });
//   return (
//     <div className="page-content">
//       <div className="shop-hero">
//         <h1>Get in Touch</h1>
//         <p>We'd love to hear from you</p>
//       </div>
//       <div className="contact-grid">
//         <div className="contact-info">
//           <h2>Contact Information</h2>
//           <div className="contact-item">📧 <a href="mailto:info@rayfineornates.com">info@rayfineornates.com</a></div>
//           <div className="contact-item">📞 <a href="tel:+918112240112">+91 8112240112</a></div>
//           <div className="contact-item">📍 Johari Bazar, Jaipur 302003<br />(10:30 AM – 8:30 PM)</div>
//           <div className="social-links">
//             <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
//             <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
//             <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
//           </div>
//         </div>
//         <div className="contact-form">
//           <input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
//           <input placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
//           <textarea placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
//           <button className="btn-primary" onClick={() => alert("Message sent! We'll get back to you soon.")}>Send Message</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Terms ──

// function Terms() {
//     return (
//         <div className="page-content">
//         <div className="shop-hero">
//             <h1>Terms &amp; Conditions</h1>
//             <p>Ray Fine Ornates Policies &amp; Information</p>
//         </div>
//         <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px", lineHeight: "1.8" }}>

//             <h2>Terms &amp; Conditions</h2>

//             <h3>1. General Information</h3>
//             <p>Ray Fine Ornates is a Jaipur-based jewelry brand specializing in handcrafted jewelry made with precious, semi-precious, natural, and lab-created stones. All products are handcrafted and may have slight variations, making each piece unique.</p>

//             <h3>2. Product Information</h3>
//             <p>We make every effort to display product images, colors, materials, and descriptions accurately. However, slight differences may occur due to lighting, screen settings, photography, and the handmade nature of our jewelry.</p>

//             <h3>3. Pricing</h3>
//             <p>All prices displayed on the website are subject to change without prior notice. Prices may vary during promotions, sales, or special offers. Taxes, shipping charges, and customs duties (if applicable) may be charged separately.</p>

//             <h3>4. Orders &amp; Payments</h3>
//             <p>Orders are confirmed only after successful payment verification. Ray Fine Ornates reserves the right to cancel or refuse any order due to payment issues, product unavailability, or suspicious activity. Custom-made and personalized orders cannot be canceled once production has started.</p>

//             <h3>5. Shipping &amp; Delivery</h3>
//             <p>We aim to dispatch orders within the mentioned processing time. Delivery timelines may vary depending on the shipping destination, customs clearance, or courier delays. Customers are responsible for providing accurate shipping information.</p>

//             <h3>6. Returns &amp; Exchanges</h3>
//             <p>We accept returns or exchanges only according to our Return Policy. Customized, personalized, made-to-order, and worn items are generally non-returnable unless damaged or incorrect. Customers must contact us within the specified period after delivery.</p>

//             <h3>7. Handmade Jewelry Disclaimer</h3>
//             <p>As our jewelry is handcrafted, slight irregularities, minor imperfections, and variations in stone shape, color, or finish are natural characteristics and should not be considered defects.</p>

//             <h3>8. Intellectual Property</h3>
//             <p>All website content, including images, logos, product designs, text, and graphics, belongs to Ray Fine Ornates and may not be copied or reproduced without written permission.</p>

//             <h3>9. Privacy</h3>
//             <p>Customer information is kept secure and used only for order processing, communication, and service-related purposes. We do not sell or share customer information with unauthorized third parties.</p>

//             <h3>10. Limitation of Liability</h3>
//             <p>Ray Fine Ornates shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>

//             <h3>11. Governing Law</h3>
//             <p>These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Jaipur, Rajasthan.</p>

//             <h3>12. Contact Information</h3>
//             <p>For any questions regarding these Terms &amp; Conditions, please contact us through the contact information available on our website.</p>

//             <hr style={{ margin: "40px 0" }} />

//             <h2>Refund &amp; Cancellation Policy</h2>
//             <p>Thank you for shopping with Ray Fine Ornates. Please read our Refund &amp; Cancellation Policy carefully before placing an order.</p>

//             <h3>Order Cancellation</h3>
//             <p>Customers may request order cancellation within 24 hours of placing the order by contacting us directly at +91 8690666771. Cancellation requests made after 24 hours may not be accepted if the order has already been processed or dispatched.</p>

//             <h3>Refund Policy</h3>
//             <p>Refunds are accepted only in genuine cases and will be reviewed after verification. Customers must contact us immediately if:</p>
//             <ul>
//             <li>The package is received in damaged condition</li>
//             <li>The product received is different from the item ordered</li>
//             <li>There is a genuine issue with the order</li>
//             </ul>

//             <h3>Non-Refundable Items</h3>
//             <ul>
//             <li>Customized or made-to-order jewelry</li>
//             <li>Personalized products</li>
//             <li>Used or worn jewelry</li>
//             <li>Orders damaged due to customer mishandling</li>
//             </ul>

//             <h3>Refund Processing</h3>
//             <p>If approved, refunds will be processed through the original payment method.</p>

//             <h3>Contact Us</h3>
//             <p><strong>Phone:</strong> +91 8690666771</p>
//             <p>Ray Fine Ornates – Jaipur, Rajasthan, India</p>

//             <hr style={{ margin: "40px 0" }} />

//             <h2>Frequently Asked Questions (FAQs)</h2>

//             <details><summary>1. What type of jewelry does Ray Fine Ornates offer?</summary><p>We specialize in handcrafted gold-plated jewelry featuring precious, semi-precious, natural, and lab-created stones. Our collection includes necklaces, bracelets, earrings, rings, bridal jewelry, spiritual jewelry, and custom-made designs.</p></details>
//             <details><summary>2. Are your jewelry pieces handmade?</summary><p>Yes, all our jewelry pieces are handcrafted by skilled artisans in Jaipur, India. Slight variations are natural characteristics of handmade jewelry.</p></details>
//             <details><summary>3. Do you use real gemstones?</summary><p>We work with a variety of natural, semi-precious, precious, and lab-created stones. Product descriptions clearly mention the type of stones used.</p></details>
//             <details><summary>4. Do you accept custom or personalized orders?</summary><p>Yes, we offer made-to-order and customized jewelry services. Customers can request changes in stone colors, sizes, finishes, and designs.</p></details>
//             <details><summary>5. How can I place a custom order?</summary><p>You can contact us directly through WhatsApp or phone at +91 8690666771.</p></details>
//             <details><summary>6. Do you ship internationally?</summary><p>Yes, we ship worldwide. Shipping timelines may vary depending on the destination country and customs clearance process.</p></details>
//             <details><summary>7. How long does shipping take?</summary><p>Processing and delivery times depend on the product and shipping location. Customized orders may require additional production time.</p></details>
//             <details><summary>8. Can I cancel my order?</summary><p>Yes, orders can be canceled within 24 hours of placing the order by contacting us at +91 8690666771.</p></details>
//             <details><summary>9. Do you accept returns or refunds?</summary><p>Refunds and returns are accepted only in genuine cases such as receiving a damaged package or an incorrect product.</p></details>
//             <details><summary>10. What should I do if my package arrives damaged?</summary><p>Please contact us immediately with clear photos or videos of the damaged package and product.</p></details>
//             <details><summary>11. How should I care for my jewelry?</summary><p>To maintain the shine and quality: keep away from water and perfumes, store in a dry airtight pouch, avoid moisture and rough surfaces.</p></details>
//             <details><summary>12. Where is your store located?</summary><p>223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003, Rajasthan, India</p></details>

//             <hr style={{ margin: "40px 0" }} />

//             <h2>Bulk Order Services</h2>
//             <ul>
//             <li>Corporate gifting</li>
//             <li>Wedding gifting</li>
//             <li>Boutique orders</li>
//             <li>Event giveaways</li>
//             <li>Retail partnerships</li>
//             <li>Customized employee gifts</li>
//             <li>Fashion and retail partnerships</li>
//             </ul>

//             <h3>Customization Available</h3>
//             <ul>
//             <li>Stone selection and color customization</li>
//             <li>Gold-plated finishes</li>
//             <li>Personalized designs</li>
//             <li>Custom packaging</li>
//             <li>Bulk quantity production</li>
//             <li>Branding support for businesses and events</li>
//             </ul>

//             <h2>Why Choose Ray Fine Ornates?</h2>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px", marginTop: "20px" }}>
//             <div className="feature-box"><h4>✨ Handmade Craftsmanship</h4><p>Handcrafted with care in Jaipur, India.</p></div>
//             <div className="feature-box"><h4>💎 Premium Quality</h4><p>High-quality materials with fine finishing.</p></div>
//             <div className="feature-box"><h4>💍 Wide Collection</h4><p>Extensive range of gemstone and fashion jewelry.</p></div>
//             <div className="feature-box"><h4>💰 Competitive Pricing</h4><p>Affordable bulk and wholesale pricing options.</p></div>
//             <div className="feature-box"><h4>🌍 Worldwide Shipping</h4><p>Reliable shipping available across the globe.</p></div>
//             <div className="feature-box"><h4>❤️ Personalized Support</h4><p>Dedicated customer assistance and customization support.</p></div>
//             </div>

//             <p style={{ marginTop: "30px", lineHeight: "1.8" }}>
//             Whether you are looking for elegant gifting options or sourcing handcrafted jewelry in bulk, our team is dedicated to providing unique designs and reliable service tailored to your needs.
//             </p>

//             <h2>Contact Information</h2>
//             <p><strong>Phone:</strong> +91 8690666771</p>
//             <p><strong>Address:</strong><br />223, 1st Floor, Memiyon Ka Darwaja,<br />Haldiyon Ka Rasta, Johari Bazar,<br />Jaipur – 302003, Rajasthan, India</p>
//             <p><strong>Business Hours:</strong> Monday–Saturday, 10:00 AM–7:00 PM</p>
//             <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="btn-primary">WhatsApp Us</a>
//         </div>
//         </div>
//     );
//     }
// // ── Footer ──
// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="footer-top">
//         🚚 Free Express Delivery &nbsp;|&nbsp; ✨ Use Code <strong>GIFT15</strong> for 15% Off &nbsp;|&nbsp; 🔄 Easy Returns
//       </div>
//       <div className="footer-grid">
//         <div>
//           <h4>Ray Fine Ornates</h4>
//           <p>Luxury fashion jewellery crafted for the modern woman. Handmade in Jaipur, India.</p>
//           <div className="footer-social">
//             <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
//             <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
//             <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
//           </div>
//         </div>
//         <div>
//           <h4>Quick Links</h4>
//           <Link to="/">Home</Link>
//           <Link to="/shop">Shop</Link>
//           <Link to="/shop?cat=sale">Sale</Link>
//           <Link to="/about">About Us</Link>
//           <Link to="/contact">Contact</Link>
//           <Link to="/terms">Terms &amp; Conditions</Link>
//         </div>
//         <div>
//           <h4>Categories</h4>
//           {["Earrings", "Necklaces", "Bracelets", "Rings", "Anklets"].map(c => (
//             <Link to="/shop" key={c}>{c}</Link>
//           ))}
//         </div>
//         <div>
//           <h4>Contact</h4>
//           <p>info@rayfineornates.com</p>
//           <p>+91 8112240112</p>
//           <p>Johari Bazar, Jaipur 302003</p>
//           <p>10:30 AM – 8:30 PM</p>
//         </div>
//       </div>
//       <div className="footer-bottom">
//         <p>© 2021 Ray Fine Ornates. All rights reserved. | Designed with ❤️ in Jaipur</p>
//       </div>
//     </footer>
//   );
// }

// // ── WhatsApp Float ──
// function WhatsAppFloat({ onOpenChat }) {
//   return (
//     <>
//       <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="whatsapp-float" title="WhatsApp">
//         <span style={{ fontSize: "28px" }}>💬</span>
//       </a>
//       <button className="chat-float-btn" onClick={onOpenChat} title="AI Chat">🤖</button>
//     </>
//   );
// }

// // ── App Root ──
// function AppInner() {
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const loc = useLocation();
//   const isAdminPage = loc.pathname === "/admin" || loc.pathname === "/login";

//   return (
//     <>
//       {!isAdminPage && <AnnouncementBar />}
//       {!isAdminPage && <Navbar cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} />}
//       {!isAdminPage && <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />}
//       <Routes>
//         <Route path="/" element={<Home cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//         <Route path="/shop" element={<Shop cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//         <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/admin" element={<Admin />} />
//         <Route path="/terms" element={<Terms />} />
//       </Routes>
//       {!isAdminPage && <Footer />}
//       {!isAdminPage && chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
//       {!isAdminPage && <WhatsAppFloat onOpenChat={() => setChatOpen(true)} />}
//     </>
//   );
// }

// export default function App() {
//   return <BrowserRouter><AppInner /></BrowserRouter>;
// }
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Admin from "./Admin";
import Chatbot from "./Chatbot";

// ── Constants ──
const INR_TO_USD = 0.012; // 1 INR ≈ 0.012 USD

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

// ── Price Helper ──
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
        {/* Image */}
        <div style={{ flex: "1 1 350px", position: "relative", minHeight: "350px" }}>
          <img
            src={product.image} alt={product.name}
            style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "8px 0 0 8px", display: "block" }}
            onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }}
          />
          {!product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "#333", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OUT OF STOCK</div>}
          {discount && product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "#7B2E3E", color: "#fff", padding: "6px 14px", borderRadius: "2px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>-{discount}% OFF</div>}
        </div>

        {/* Info */}
        <div style={{ flex: "1 1 300px", padding: "40px 36px" }}>
          <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
          <div style={{ fontSize: "10px", color: "#C9963C", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>{product.category}</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a0a0f", fontSize: "28px", marginBottom: "16px", fontWeight: 400, lineHeight: 1.2 }}>{product.name}</h2>

          {/* Price: INR + USD */}
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
                {product.variants.map(v => (
                  <button key={v} onClick={() => setSelectedVariant(v)} style={{ padding: "7px 16px", borderRadius: "2px", fontSize: "12px", cursor: "pointer", background: selectedVariant === v ? "#7B2E3E" : "#f5f0eb", color: selectedVariant === v ? "#fff" : "#5a3a42", border: selectedVariant === v ? "1.5px solid #7B2E3E" : "1.5px solid #e0d0d4", fontWeight: selectedVariant === v ? 700 : 400, transition: "all 0.2s" }}>{v}</button>
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
          style={{
            display: "block",
            visibility: "visible",
            opacity: 1,
            height: "44px",
            width: "auto",
            maxWidth: "160px",
            objectFit: "contain",
            flexShrink: 0,
          }}
          onError={e => {
            // Fallback: text logo if image fails
            e.target.style.display = "none";
            e.target.parentElement.innerHTML =
              '<span style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#7B2E3E;letter-spacing:0.5px;">Ray Fine Ornates</span>';
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
                <div style={{ fontSize: "12px", color: "#9a7060", fontFamily: "Josefin Sans, sans-serif" }}>{formatUSD(total)}</div>
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
  const product = { ...productProp, id: productProp._id || productProp.id };
 
  const [showModal, setShowModal] = useState(false);

  const inWishlist = wishlist.find(w => w.id === product.id);
  const inCart = cart.find(c => c.id === product.id);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const addToCart = (e) => {
    e.stopPropagation();

    if (!product.inStock) return;

    if (inCart) {
      setCart(
        cart.map(c =>
          c.id === product.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();

    if (inWishlist) {
      setWishlist(wishlist.filter(w => w.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Safe variants handling
  const variants = Array.isArray(product?.variants)
    ? product.variants
    : [];

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
        style={{
          cursor: "pointer",
          opacity: product.inStock ? 1 : 0.7
        }}
      >
        <div className="product-img-wrap">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/300x300?text=Jewellery";
            }}
          />

          <button
            className={`wishlist-btn ${
              inWishlist ? "active" : ""
            }`}
            onClick={toggleWishlist}
          >
            {inWishlist ? "❤️" : "🤍"}
          </button>

          {!product.inStock && (
            <div
              className="sale-badge"
              style={{ background: "#555" }}
            >
              Out of Stock
            </div>
          )}

          {discount && product.inStock && (
            <div className="sale-badge">
              -{discount}%
            </div>
          )}

          <div className="product-category-tag">
            {product.category}
          </div>

         <div
  onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
  style={{
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    fontSize: "10px",
    padding: "4px 9px",
    borderRadius: "10px",
    cursor: "pointer",
    zIndex: 2,
  }}
>
  👁 View
</div>
        <div className="product-info">
          <h4>{product.name}</h4>

          <p className="product-desc">
            {product.description?.substring(0, 80)}...
          </p>

          {/* Safe Variants */}
          {variants.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
                marginBottom: "10px"
              }}
            >
              {variants.slice(0, 3).map((v, i) => (
                <span
                  key={v.id || i}
                  style={{
                    fontSize: "11px",
                    padding: "4px 8px",
                    background: "#f5f5f5",
                    borderRadius: "12px"
                  }}
                >
                  {typeof v === "object"
                    ? v.name || "Variant"
                    : v}
                </span>
              ))}
            </div>
          )}

          <div className="price-wrap">
            <span className="price-current">
              ₹{product.price.toLocaleString()}
            </span>

            {product.originalPrice && (
              <span className="price-original">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}

            <span className="price-usd">
              {formatUSD(product.price)}
            </span>
          </div>

          <button
            className={`btn-add-cart ${
              inCart ? "added" : ""
            }`}
            onClick={addToCart}
            disabled={!product.inStock}
          >
            {!product.inStock
              ? "Out of Stock"
              : inCart
              ? "✓ Added to Cart"
              : "Add to Cart"}
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
      ].map((item) => (
        <div className="trust-item" key={item.title}>
          <div className="trust-item-icon">{item.icon}</div>
          <div className="trust-item-title">{item.title}</div>
          <div className="trust-item-sub">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ── Hero — wallpapers cycle, text stays fixed ──
function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % WALLPAPERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero">
      {/* Wallpaper layers — active one fades in, rest hidden */}
      {WALLPAPERS.map((url, i) => (
        <div
          key={i}
          className={`hero-bg ${i === current ? "active" : "inactive"}`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}

      <div className="hero-gradient" />
      <div className="hero-vignette" />

      {/* Fixed text — never changes */}
      <div className="hero-overlay">
        <div className="hero-eyebrow">
          <div className="hero-eyebrow-line" />
         
        </div>
        <h1>Elegance<br /><span>Redefined</span></h1>
        
        <div className="hero-btns">
          <Link to="/shop" className="btn-primary">Explore Collection</Link>
          <Link to="/about" className="btn-outline">Our Story</Link>
        </div>
      </div>

      {/* Wallpaper indicator dots */}
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
    fetch("https://rayfinesite-3.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const fixed = list.map(p => ({
          ...p,
         id: p._id || p.id, 
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim()
        }));
        setFeatured(fixed.slice(0, 8));
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* HERO SLIDER */}
      <HeroSlider />

      {/* SALE BANNER */}
      <div className="sale-banner">
        <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
        <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
      </div>

      {/* TRUST STRIP */}
      <TrustStrip />

      {/* CATEGORIES */}
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

      {/* FEATURED PRODUCTS */}
      <section className="featured-section">
        <SectionDivider subtitle="Curated For You" title="Trending Now" />
        <div className="products-grid">
          {featured.map(p => (
            <ProductCard
              key={p._id || p.id}
              product={p}
              cart={cart} setCart={setCart}
              wishlist={wishlist} setWishlist={setWishlist}
            />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "52px" }}>
          <Link to="/shop" className="btn-primary">View All Products</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
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
          style={{ padding: "10px 18px", borderRadius: "2px", border: "none", cursor: "pointer", background: showInStock ? "#7B2E3E" : "#f0ebe6", color: showInStock ? "#fff" : "#5a3a42", fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", minHeight: "44px" }}
        >
          {showInStock ? "✓ In Stock" : "All Products"}
        </button>
      </div>

      <div className="category-tabs">
        {["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Sale 🔥"].map(cat => (
          <button
            key={cat}
            className={`cat-tab ${(cat === "Sale 🔥" ? category === "sale" : category === cat) ? "active" : ""}`}
            onClick={() => setCategory(cat === "Sale 🔥" ? "sale" : cat)}
          >{cat}</button>
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: "center", padding: "80px", color: "#9a7a80", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>
          Loading collection...
        </p>
      )}

      {!loading && (
        <div className="products-grid" style={{ padding: "0 40px 80px" }}>
          {filtered.map(p => (
            <ProductCard
              key={p._id || p.id}
              product={p}
              cart={cart} setCart={setCart}
              wishlist={wishlist} setWishlist={setWishlist}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#9a7a80", padding: "80px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>
          No pieces found.
        </p>
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
          <p style={{ color: "#9a7a80", fontSize: "18px", marginBottom: "28px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>No items saved yet</p>
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
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a0a0f", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{title}</h3>
            <p style={{ color: "#7a6060", lineHeight: "1.9" }}>{text}</p>
          </div>
        ))}

        <hr style={{ margin: "48px 0", borderColor: "#f0e4df" }} />

        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#7B2E3E", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Refund &amp; Cancellation Policy</h2>
        <p style={{ color: "#7a6060", marginBottom: "16px" }}>Customers may request order cancellation within 24 hours of placing the order by contacting us at <strong>+91 8690666771</strong>. Refunds are accepted only in genuine cases such as damaged packages or incorrect products.</p>
        <p style={{ color: "#7a6060", marginBottom: "8px" }}><strong>Non-Refundable:</strong> Customized orders, personalized products, used/worn jewelry, and orders damaged due to customer mishandling.</p>

        <hr style={{ margin: "48px 0", borderColor: "#f0e4df" }} />

        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#7B2E3E", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Frequently Asked Questions</h2>
        {[
          ["What type of jewelry does Ray Fine Ornates offer?", "We specialize in handcrafted gold-plated jewelry featuring precious, semi-precious, natural, and lab-created stones. Our collection includes necklaces, bracelets, earrings, rings, bridal jewelry, spiritual jewelry, and custom-made designs."],
          ["Are your jewelry pieces handmade?", "Yes, all our jewelry pieces are handcrafted by skilled artisans in Jaipur, India. Slight variations are natural characteristics of handmade jewelry."],
          ["Do you accept custom or personalized orders?", "Yes, we offer made-to-order and customized jewelry services. Contact us via WhatsApp at +91 8690666771."],
          ["Do you ship internationally?", "Yes, we ship worldwide. Shipping timelines may vary depending on the destination country and customs clearance process."],
          ["Can I cancel my order?", "Yes, orders can be canceled within 24 hours of placing the order by contacting us at +91 8690666771."],
          ["How should I care for my jewelry?", "Keep away from water and perfumes, store in a dry airtight pouch, avoid moisture and rough surfaces."],
          ["Where is your store located?", "223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003, Rajasthan, India."],
        ].map(([q, a]) => (
          <details key={q} style={{ marginBottom: "10px", padding: "14px 18px", border: "1px solid #f0e4df", borderRadius: "8px", background: "#fff" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "15px", color: "#1a0a0f" }}>{q}</summary>
            <p style={{ marginTop: "12px", color: "#7a6060", lineHeight: "1.7" }}>{a}</p>
          </details>
        ))}

        <hr style={{ margin: "48px 0", borderColor: "#f0e4df" }} />

        <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "#7B2E3E", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Bulk &amp; Corporate Orders</h2>
        <p style={{ color: "#7a6060", marginBottom: "20px" }}>We serve corporate gifting, wedding gifting, boutique orders, event giveaways, retail partnerships, and customized employee gifts. Custom packaging, branding support, and bulk quantity production available.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px", marginTop: "20px", marginBottom: "32px" }}>
          {[["✨ Handmade Craftsmanship", "Handcrafted with care in Jaipur, India."], ["💎 Premium Quality", "High-quality materials with fine finishing."], ["💍 Wide Collection", "Extensive range of gemstone and fashion jewelry."], ["💰 Competitive Pricing", "Affordable bulk and wholesale pricing options."], ["🌍 Worldwide Shipping", "Reliable shipping available across the globe."], ["❤️ Personalized Support", "Dedicated customer assistance and customization support."]].map(([t, d]) => (
            <div key={t} className="feature-box"><h4>{t}</h4><p>{d}</p></div>
          ))}
        </div>

        <div style={{ background: "#fdf2ee", padding: "24px", borderRadius: "8px", border: "1px solid #f0e4df" }}>
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
        {/* Brand */}
        <div>
          <h4>Ray Fine Ornates</h4>
          <p className="footer-brand-desc">Luxury fashion jewellery crafted for the modern woman. Handmade by artisans in the jewellery capital of India — Jaipur.</p>
          <p className="footer-brand-desc" style={{ marginTop: "8px", color: "#C9963C", fontSize: "12px", letterSpacing: "1px" }}>Est. 2021 · Johari Bazar, Jaipur</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/shop?cat=sale">Sale</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>

        {/* Categories */}
        <div>
          <h4>Categories</h4>
          {["Earrings", "Necklaces", "Bracelets", "Rings", "Anklets"].map(c => (
            <Link to="/shop" key={c}>{c}</Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4>Contact Us</h4>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">✉</span>
            <span style={{ color: "var(--footer-text)", fontSize: "13px" }}>info@rayfineornates.com</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">☎</span>
            <span style={{ color: "var(--footer-text)", fontSize: "13px" }}>+91 8112240112</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📍</span>
            <span style={{ color: "var(--footer-text)", fontSize: "13px" }}>Johari Bazar, Jaipur 302003</span>
          </div>
          <div style={{ marginTop: "8px", color: "var(--footer-text)", fontSize: "12px", letterSpacing: "0.5px" }}>
            Mon–Sat · 10:30 AM – 8:30 PM
          </div>
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
        <Route path="/"        element={<Home     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/shop"    element={<Shop     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/wishlist"element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms"   element={<Terms />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/admin"   element={<Admin />} />
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
