// import { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
// import "./App.css";
// import Login from "./login";
// import Admin from "./Admin";
// import Chatbot from "./Chatbot";

// const INR_TO_USD = 0.012; 

// const WALLPAPERS = [
//   "/images/bracelet.jpg",
// ];

// const ANNOUNCEMENT_MESSAGES = [
//   "🌍 Worldwide Shipping — We Deliver to 150+ Countries!",
//   "🎁 Get Additional 15% Discount — Use Code GIFT15",
//   "🚚 Free Express Delivery on All Orders",
//   "💎 Handcrafted in Jaipur — Shipped Worldwide",
// ];



// const API_BASE = "https://rayfinesite-3.onrender.com";
// const NOTIFY_EMAIL = "bhaveshgemsonline@gmail.com";

// // ── Send order notification email via EmailJS / simple mailto fallback ──
// async function sendOrderNotification(order) {
//   try {
//     // Using EmailJS public API — replace SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY with yours
//     // or swap for any transactional email provider
//     const payload = {
//       service_id: "YOUR_EMAILJS_SERVICE_ID",
//       template_id: "YOUR_EMAILJS_TEMPLATE_ID",
//       user_id: "YOUR_EMAILJS_PUBLIC_KEY",
//       template_params: {
//         to_email: NOTIFY_EMAIL,
//         customer_name: order.name,
//         customer_phone: order.phone,
//         customer_address: order.address,
//         order_items: order.items
//           .map(i => `${i.name} x${i.quantity} = ₹${(i.price * i.quantity).toLocaleString()}`)
//           .join("\n"),
//         order_total: `₹${order.total.toLocaleString()} (${formatUSD(order.total)})`,
//         order_time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
//       },
//     };
//     await fetch("https://api.emailjs.com/api/v1.0/email/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//   } catch (e) {
//     console.warn("Email notification failed:", e);
//   }
// }

// // ── Normalize product from API ──
// function normalizeProduct(p) {
//   return {
//     ...p,
//     id: p.id,
//     inStock: p.in_stock !== false && p.in_stock !== 0,
//     stockQty: p.stock_qty ?? p.stockQty ?? null,
//     originalPrice: p.original_price ? Number(p.original_price) : null,
//     careInstructions: p.care_instructions || "",
//     trackingInfo: p.tracking_info || "",
//     image: p.image
//       ? p.image.startsWith("http")
//         ? p.image.split(",")[0].trim()
//         : `${API_BASE}${p.image.split(",")[0].trim()}`
//       : "",
//   };
// }

// function formatUSD(inr) {
//   return "$" + (inr * INR_TO_USD).toFixed(2);
// }

// ── Stock indicator ──
// function StockIndicator({ qty }) {
//   if (qty === null || qty === undefined) return null;
//   if (qty === 0) return <span style={{ fontSize: "11px", color: "#e53935", fontWeight: 600 }}>Out of Stock</span>;
//   if (qty <= 5) return <span style={{ fontSize: "11px", color: "#F57C00", fontWeight: 600 }}>Only {qty} left!</span>;
//   return <span style={{ fontSize: "11px", color: "#388E3C", fontWeight: 600 }}>In Stock ({qty})</span>;
// }

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
//       style={{ position: "fixed", inset: 0, background: "rgba(20,5,10,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}
//       onClick={onClose}
//     >
//       <div
//         style={{ background: "#fff", borderRadius: "16px", maxWidth: "900px", width: "100%", maxHeight: "90vh", overflow: "auto", display: "flex", flexWrap: "wrap", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}
//         onClick={e => e.stopPropagation()}
//       >
//         <div style={{ flex: "1 1 350px", position: "relative", minHeight: "350px" }}>
//           <img
//             src={product.image} alt={product.name}
//             style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "16px 0 0 16px", display: "block" }}
//             onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }}
//           />
//           {!product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "#333", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>OUT OF STOCK</div>}
//           {discount && product.inStock && <div style={{ position: "absolute", top: "16px", left: "16px", background: "var(--primary)", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>-{discount}% OFF</div>}
//           {/* Worldwide shipping badge */}
//           <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(255,255,255,0.95)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, color: "var(--primary)", letterSpacing: "1px" }}>
//             🌍 Ships Worldwide
//           </div>
//         </div>

//         <div style={{ flex: "1 1 300px", padding: "40px 36px" }}>
//           <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
//           <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>{product.category}</div>
//           <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--dark)", fontSize: "28px", marginBottom: "12px", fontWeight: 400, lineHeight: 1.2 }}>{product.name}</h2>

//           {/* Stock indicator */}
//           <div style={{ marginBottom: "12px" }}>
//             <StockIndicator qty={product.stockQty} />
//           </div>

//           <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
//             <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--primary)" }}>₹{product.price.toLocaleString()}</span>
//             {product.originalPrice && <span style={{ textDecoration: "line-through", color: "#c0a0a8", fontSize: "16px" }}>₹{product.originalPrice.toLocaleString()}</span>}
//             <span style={{ fontSize: "14px", color: "#8a7060", background: "var(--bg3)", padding: "3px 10px", borderRadius: "20px" }}>{formatUSD(product.price)}</span>
//             {discount && <span style={{ background: "#fff0f3", color: "var(--primary)", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Save {discount}%</span>}
//           </div>

//           <p style={{ color: "#6a4a50", lineHeight: "1.8", marginBottom: "24px", fontSize: "14px" }}>{product.description}</p>

//           {product.variants && product.variants.length > 0 && (
//             <div style={{ marginBottom: "22px" }}>
//               <p style={{ fontWeight: 600, marginBottom: "10px", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9a7a80" }}>Select Finish</p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                 {(typeof product.variants === "string" ? product.variants.split(",") : product.variants).map(v => (
//                   <button key={v} onClick={() => setSelectedVariant(v.trim())} style={{ padding: "7px 16px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", background: selectedVariant === v.trim() ? "var(--primary)" : "var(--bg3)", color: selectedVariant === v.trim() ? "#fff" : "var(--text)", border: selectedVariant === v.trim() ? "1.5px solid var(--primary)" : "1.5px solid var(--border)", fontWeight: selectedVariant === v.trim() ? 700 : 400, transition: "all 0.2s" }}>{v.trim()}</button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {product.material && <div style={{ marginBottom: "12px", fontSize: "13px", color: "var(--text-muted)" }}><strong>Material:</strong> {product.material}</div>}
//           {product.careInstructions && <div style={{ marginBottom: "16px", fontSize: "13px", color: "var(--text-muted)", background: "var(--bg3)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)" }}><strong>✨ Care:</strong> {product.careInstructions}</div>}

//           {/* Tracking info */}
//           {product.trackingInfo && (
//             <div style={{ marginBottom: "16px", fontSize: "13px", color: "#1565C0", background: "#E3F2FD", padding: "12px 14px", borderRadius: "10px", border: "1px solid #BBDEFB" }}>
//               📦 <strong>Tracking:</strong> {product.trackingInfo}
//             </div>
//           )}

//           {/* Worldwide shipping note */}
//           <div style={{ marginBottom: "20px", fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px", background: "var(--bg3)", padding: "10px 14px", borderRadius: "10px" }}>
//             🌍 <span>We ship to <strong>150+ countries</strong> worldwide · Express delivery available</span>
//           </div>

//           <div style={{ display: "flex", gap: "12px" }}>
//             <button onClick={addToCart} disabled={!product.inStock} style={{ flex: 1, padding: "15px", borderRadius: "40px", border: "none", cursor: product.inStock ? "pointer" : "not-allowed", background: product.inStock ? "var(--primary)" : "#ccc", color: "#fff", fontWeight: 700, fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", transition: "all 0.3s" }}>
//               {!product.inStock ? "Out of Stock" : inCart ? "✓ Added" : "Add to Cart"}
//             </button>
//             <button onClick={toggleWishlist} style={{ padding: "15px 20px", borderRadius: "40px", border: "1.5px solid var(--primary)", background: inWishlist ? "var(--primary)" : "transparent", color: inWishlist ? "#fff" : "var(--primary)", cursor: "pointer", fontSize: "18px", transition: "all 0.3s" }}>
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

// // ── Worldwide Marquee Strip ──
// function WorldwideStrip() {
//   const items = [
//     "🌍 Worldwide Shipping",
    
//     "✈️ Express Delivery", "📦 Tracked Shipping", "💎 Handcrafted in Jaipur",
   
   
   
//   ];
//   return (
//     <div className="worldwide-strip">
//       <div className="worldwide-track">
//         {items.map((item, i) => (
//           <span key={i}>{item} <span style={{ color: "var(--pink-mid)", opacity: 0.5 }}>✦</span></span>
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
//     <nav className="navbar" style={scrolled ? { boxShadow: "0 2px 20px rgba(200,91,130,0.10)" } : {}}>
//       <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
//         <img
//           src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png"
//           alt="Ray Fine Ornates"
//           style={{ display: "block", height: "44px", width: "auto", maxWidth: "160px", objectFit: "contain" }}
//           onError={e => {
//             e.target.style.display = "none";
//             e.target.parentElement.innerHTML = '<span class="navbar-logo-text">Ray Fine Ornates</span>';
//           }}
//         />
//       </Link>

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
//   const [ordering, setOrdering] = useState(false);
//   const [ordered, setOrdered] = useState(false);
//   const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
//   const savings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);

//   const placeOrder = async () => {
//     if (!customer.name || !customer.phone) {
//       alert("Please fill in Name and Phone");
//       return;
//     }
//     setOrdering(true);
//     await sendOrderNotification({
//       name: customer.name,
//       phone: customer.phone,
//       address: customer.address,
//       items: cart,
//       total,
//     });
//     setOrdering(false);
//     setOrdered(true);
//     setTimeout(() => {
//       setCart([]);
//       setStep("cart");
//       setOrdered(false);
//       onClose();
//     }, 2500);
//   };

//   const updateQty = (id, delta) => {
//     setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p).filter(p => p.quantity > 0));
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
//                 <p style={{ marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", color: "var(--dark)" }}>Your cart is empty</p>
//                 <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>Discover our beautiful collection</p>
//                 <Link to="/shop" className="btn-primary" style={{ display: "inline-block" }} onClick={onClose}>Shop Now</Link>
//               </div>
//             ) : cart.map(item => (
//               <div className="cart-item" key={item.id + (item.selectedVariant || "")}>
//                 <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/76x76?text=Item"} />
//                 <div className="cart-item-info">
//                   <p className="cart-item-name">{item.name}</p>
//                   {item.selectedVariant && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>{item.selectedVariant}</p>}
//                   <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                     <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
//                     {item.originalPrice && <p className="cart-item-original">₹{item.originalPrice.toLocaleString()}</p>}
//                     <span style={{ fontSize: "11px", color: "#9a8070" }}>{formatUSD(item.price)}</span>
//                   </div>
//                   {/* Stock qty in cart */}
//                   {item.stockQty !== null && item.stockQty !== undefined && item.stockQty <= 5 && (
//                     <p style={{ fontSize: "10px", color: "#F57C00", marginTop: "2px" }}>Only {item.stockQty} in stock!</p>
//                   )}
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
//         ) : ordered ? (
//           <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
//             <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
//             <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "24px", marginBottom: "10px" }}>Order Placed!</h3>
//             <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Thank you {customer.name}! We'll contact you shortly on {customer.phone}.</p>
//           </div>
//         ) : (
//           <div className="checkout-form">
//             <h4 style={{ color: "var(--primary)", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 400 }}>Delivery Details</h4>
//             <input placeholder="Full Name *" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
//             <input placeholder="Phone Number *" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
//             <input placeholder="Delivery Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />

//             {/* Worldwide shipping note in checkout */}
//             <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px 14px", fontSize: "12px", color: "var(--text-muted)" }}>
//               🌍 We ship worldwide · Tracking info will be shared after dispatch
//             </div>

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
//             <button className="btn-checkout" onClick={placeOrder} disabled={ordering}>
//               {ordering ? "Placing Order..." : `Pay ₹${total.toLocaleString()} →`}
//             </button>
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
// function ProductCard({ product: productProp, cart, setCart, wishlist, setWishlist }) {
//   const product = normalizeProduct(productProp);
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

//   const variants = typeof product.variants === "string"
//     ? product.variants.split(",").map(v => v.trim()).filter(Boolean)
//     : Array.isArray(product.variants) ? product.variants : [];

//   return (
//     <>
//       {showModal && (
//         <ProductModal
//           product={product}
//           onClose={() => setShowModal(false)}
//           cart={cart} setCart={setCart}
//           wishlist={wishlist} setWishlist={setWishlist}
//         />
//       )}

//       <div
//         className="product-card"
//         onClick={() => setShowModal(true)}
//         style={{ cursor: "pointer", opacity: product.inStock ? 1 : 0.7 }}
//       >
//         <div className="product-img-wrap">
//           <img
//             src={product.image}
//             alt={product.name}
//             onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }}
//           />

//           <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}>
//             {inWishlist ? "❤️" : "🤍"}
//           </button>

//           {!product.inStock && <div className="sale-badge" style={{ background: "#555" }}>Out of Stock</div>}
//           {discount && product.inStock && <div className="sale-badge">-{discount}%</div>}

//           <div className="product-category-tag">{product.category}</div>

//           <div
//             onClick={e => { e.stopPropagation(); setShowModal(true); }}
//             style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "10px", padding: "4px 9px", borderRadius: "10px", cursor: "pointer", zIndex: 2 }}
//           >
//             👁 View
//           </div>
//         </div>

//         <div className="product-info">
//           <h4>{product.name}</h4>
//           <p className="product-desc">{product.description?.substring(0, 80)}...</p>

//           {/* Stock quantity indicator */}
//           <div style={{ marginBottom: "8px" }}>
//             <StockIndicator qty={product.stockQty} />
//           </div>

//           {variants.length > 0 && (
//             <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
//               {variants.slice(0, 3).map((v, i) => (
//                 <span key={i} style={{ fontSize: "11px", padding: "4px 8px", background: "var(--bg3)", borderRadius: "12px" }}>{v}</span>
//               ))}
//             </div>
//           )}

//           <div className="price-wrap">
//             <span className="price-current">₹{product.price.toLocaleString()}</span>
//             {product.originalPrice && <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>}
//             <span className="price-usd">{formatUSD(product.price)}</span>
//           </div>

//           <button
//             className={`btn-add-cart ${inCart ? "added" : ""}`}
//             onClick={addToCart}
//             disabled={!product.inStock}
//           >
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
//         { icon: "🌍", title: "Ships Worldwide", sub: "150+ countries" },
//         { icon: "💎", title: "Handcrafted", sub: "Jaipur artisans" },
//         { icon: "🔄", title: "Easy Returns", sub: "Hassle-free" },
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

// // ── Hero Slider ──
// function HeroSlider() {
//   const [current, setCurrent] = useState(0);
//   useEffect(() => {
//     const t = setInterval(() => setCurrent(p => (p + 1) % WALLPAPERS.length), 5000);
//     return () => clearInterval(t);
//   }, []);

//   return (
//     <section className="hero">
//       {WALLPAPERS.map((url, i) => (
//         <div key={i} className={`hero-bg ${i === current ? "active" : "inactive"}`} style={{ backgroundImage: `url(${url})` }} />
//       ))}
//       <div className="hero-gradient" />
//       <div className="hero-vignette" />
//       <div className="hero-overlay">
//         <div className="hero-eyebrow">
//           <div className="hero-eyebrow-line" />
        
//         </div>
//         <h1>Elegance<br /><span>Redefined</span></h1>
       
        
//       </div>
//       <div className="hero-dots">
//         {WALLPAPERS.map((_, i) => (
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
//     fetch(`${API_BASE}/api/products`)
//       .then(r => r.json())
//       .then(data => {
//         const list = Array.isArray(data?.data) ? data.data : [];
//         setFeatured(list.map(normalizeProduct).slice(0, 8));
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <>
//       <HeroSlider />

//       <WorldwideStrip />

//       <div className="sale-banner">
//         <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
//         <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
//       </div>

//       <TrustStrip />

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

//       <section className="featured-section">
//         <SectionDivider subtitle="Curated For You" title="Trending Now" />
//         <div className="products-grid">
//           {featured.map(p => (
//             <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
//           ))}
//         </div>
//         <div style={{ textAlign: "center", marginTop: "52px" }}>
//           <Link to="/shop" className="btn-primary">View All Products</Link>
//         </div>
//       </section>

//       {/* Platforms / Marketing Presence Section */}
//       <PlatformsSection />

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
//     if (cat) setCategory(cat);
//   }, [searchParams]);

//   useEffect(() => {
//     fetch(`${API_BASE}/api/products`)
//       .then(r => r.json())
//       .then(data => {
//         const list = Array.isArray(data?.data) ? data.data : [];
//         setProducts(list.map(normalizeProduct));
//         setLoading(false);
//       })
//       .catch(err => { console.error(err); setLoading(false); });
//   }, []);

//   let filtered = products.filter(p => {
//     const matchCat = category === "All" ? true
//       : category === "sale" ? p.originalPrice
//       : (p.category || "").toLowerCase().trim() === category.toLowerCase().trim();
//     const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
//     const matchStock = showInStock ? p.inStock : true;
//     return matchCat && matchSearch && matchStock;
//   });

//   if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
//   if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

//   return (
//     <div className="shop-page">
//       <div className="shop-hero">
//         <p className="section-subtitle" style={{ marginBottom: "12px" }}>Handcrafted in Jaipur · Ships to 150+ Countries</p>
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
//         <button onClick={() => setShowInStock(!showInStock)} style={{ padding: "10px 18px", borderRadius: "40px", border: "none", cursor: "pointer", background: showInStock ? "var(--primary)" : "var(--bg3)", color: showInStock ? "#fff" : "var(--text)", fontWeight: 600, fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", minHeight: "44px" }}>
//           {showInStock ? "✓ In Stock" : "All Products"}
//         </button>
//       </div>

//       <div className="category-tabs">
//         {["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Sale "].map(cat => (
//           <button key={cat} className={`cat-tab ${(cat === "Sale " ? category === "sale" : category === cat) ? "active" : ""}`} onClick={() => setCategory(cat === "Sale " ? "sale" : cat)}>{cat}</button>
//         ))}
//       </div>

//       {loading && <p style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>Loading collection...</p>}

//       {!loading && (
//         <div className="products-grid" style={{ padding: "0 40px 80px" }}>
//           {filtered.map(p => (
//             <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
//           ))}
//         </div>
//       )}

//       {!loading && filtered.length === 0 && <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "80px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>No pieces found.</p>}
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
//           <p style={{ color: "var(--text-muted)", fontSize: "18px", marginBottom: "28px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>No items saved yet</p>
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
//         <p>Crafting elegance since 2021 · Shipping worldwide</p>
//       </div>
//       <div className="about-grid">
//         <div className="about-text">
//           <h2>Who We Are?</h2>
//           <p>Ray Fine Ornates is a luxury fashion jewellery brand based in the heart of Johari Bazar, Jaipur — India's jewellery capital. We believe every woman deserves to feel like royalty.</p>
//           <p>Our pieces are crafted with precision, using the finest materials to create jewellery that is both timeless and contemporary. From delicate studs to statement necklaces, each piece tells a story.</p>
//           <h2>Worldwide Reach</h2>
//           <p>We proudly ship to 150+ countries across the globe. Whether you're in the USA, UK, UAE, Australia, or anywhere else — your perfect jewellery is just an order away, with full tracking and express delivery options.</p>
//           <h2>Our Promise</h2>
//           <p>Quality you can feel. Beauty you can see. Service you can trust. We stand behind every piece we create with our dedication to craftsmanship and customer satisfaction.</p>
//         </div>
//         <div className="about-image">
//           <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80" alt="Ray Fine Ornates" />
//         </div>
//       </div>
//       <div className="about-stats">
//         {[["2021", "Founded"], ["500+", "Products"], ["10,000+", "Happy Customers"], ["150+", "Countries Served"]].map(([n, l]) => (
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
         
//           <div className="contact-item">📍 Johari Bazar, Jaipur 302003<br />(10:30 AM – 8:30 PM)</div>
//           <div className="contact-item">🌍 We ship to the countries worldwide</div>
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
//   return (
//     <div className="page-content">
//       <div className="shop-hero">
//         <h1>Terms &amp; Conditions</h1>
//         <p>Ray Fine Ornates Policies &amp; Information</p>
//       </div>
//       <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px 40px", lineHeight: "1.8" }}>
//         <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Terms &amp; Conditions</h2>
//         {[
//           ["1. General Information", "Ray Fine Ornates is a Jaipur-based jewelry brand specializing in handcrafted jewelry made with precious, semi-precious, natural, and lab-created stones."],
//           ["2. Product Information", "We make every effort to display product images, colors, materials, and descriptions accurately. Slight differences may occur due to lighting and the handmade nature of our jewelry."],
//           ["3. Pricing", "All prices are subject to change without prior notice. Taxes, shipping charges, and customs duties may be charged separately."],
//           ["4. Orders & Payments", "Orders are confirmed only after successful payment verification. Ray Fine Ornates reserves the right to cancel or refuse any order."],
//           ["5. Shipping & Delivery", "We ship to 150+ countries worldwide. We aim to dispatch orders within the mentioned processing time. Delivery timelines may vary depending on the shipping destination. Tracking information is shared after dispatch."],
//           ["6. Returns & Exchanges", "We accept returns or exchanges only according to our Return Policy. Customized and worn items are generally non-returnable unless damaged or incorrect."],
//           ["7. Handmade Disclaimer", "Slight irregularities and variations in stone shape, color, or finish are natural characteristics of handmade jewelry and should not be considered defects."],
//           ["8. Intellectual Property", "All website content belongs to Ray Fine Ornates and may not be copied or reproduced without written permission."],
//           ["9. Privacy", "Customer information is kept secure and used only for order processing and communication purposes."],
//           ["10. Governing Law", "These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Jaipur, Rajasthan."],
//         ].map(([title, text]) => (
//           <div key={title} style={{ marginBottom: "24px" }}>
//             <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--dark)", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{title}</h3>
//             <p style={{ color: "var(--text-muted)", lineHeight: "1.9" }}>{text}</p>
//           </div>
//         ))}
//         <hr style={{ margin: "48px 0", borderColor: "var(--border)" }} />
//         <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Refund &amp; Cancellation Policy</h2>
//         <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Customers may request order cancellation within 24 hours by contacting us at <strong>+91 8690666771</strong>. Refunds are accepted only in genuine cases such as damaged packages or incorrect products.</p>
//         <hr style={{ margin: "48px 0", borderColor: "var(--border)" }} />
//         <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "32px", fontWeight: 300, marginBottom: "24px" }}>Frequently Asked Questions</h2>
//         {[
//           ["What type of jewelry does Ray Fine Ornates offer?", "We specialize in handcrafted gold-plated jewelry featuring precious, semi-precious, natural, and lab-created stones."],
//           ["Are your jewelry pieces handmade?", "Yes, all our jewelry pieces are handcrafted by skilled artisans in Jaipur, India."],
//           ["Do you accept custom orders?", "Yes, contact us via WhatsApp at +91 8690666771."],
//           ["Do you ship internationally?", "Yes! We ship worldwide to 150+ countries. Tracking information is provided after dispatch."],
//           ["Can I cancel my order?", "Yes, within 24 hours by contacting us at +91 8690666771."],
//           ["How should I care for my jewelry?", "Keep away from water and perfumes, store in a dry airtight pouch."],
//           ["Where is your store?", "223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003."],
//         ].map(([q, a]) => (
//           <details key={q}>
//             <summary>{q}</summary>
//             <p>{a}</p>
//           </details>
//         ))}
//         <div style={{ background: "var(--bg3)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border)", marginTop: "40px" }}>
//           <h3 style={{ fontFamily: "Cormorant Garamond, serif", color: "var(--primary)", fontSize: "22px", marginBottom: "12px" }}>Contact Information</h3>
//           <p style={{ color: "var(--text-muted)" }}><strong>Phone:</strong> +91 8690666771</p>
//           <p style={{ color: "var(--text-muted)" }}><strong>Address:</strong> 223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003</p>
//           <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}><strong>Hours:</strong> Monday–Saturday, 10:00 AM–7:00 PM</p>
//           <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="btn-primary">WhatsApp Us</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Footer ──
// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="footer-top">
//         🌍 Worldwide Shipping &nbsp;·&nbsp; 🚚 Free Express Delivery &nbsp;·&nbsp; ✨ Use Code <strong>GIFT15</strong> for 15% Off &nbsp;·&nbsp; 🔄 Easy Returns
//       </div>
//       <div className="footer-grid">
//         <div>
//           <h4>Ray Fine Ornates</h4>
//           <p className="footer-brand-desc">Luxury fashion jewellery crafted for the modern woman. Handmade by artisans in Jaipur. Delivered worldwide.</p>
//           <p className="footer-brand-desc" style={{ marginTop: "8px", color: "var(--primary)", fontSize: "12px", letterSpacing: "1px" }}>Est. 2021 · Johari Bazar, Jaipur · 🌍 150+ Countries</p>
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
//           <h4>Contact Us</h4>
//           <div className="footer-contact-item"><span className="footer-contact-icon">✉</span><span style={{ color: "var(--footer-text)", fontSize: "13px" }}>info@rayfineornates.com</span></div>
          
//           <div className="footer-contact-item"><span className="footer-contact-icon">📍</span><span style={{ color: "var(--footer-text)", fontSize: "13px" }}>Johari Bazar, Jaipur 302003</span></div>
//           <div className="footer-contact-item"><span className="footer-contact-icon">🌍</span><span style={{ color: "var(--footer-text)", fontSize: "13px" }}>Ships to 150+ Countries</span></div>
//           <div style={{ marginTop: "8px", color: "var(--footer-text)", fontSize: "12px" }}>Mon–Sat · 10:30 AM – 8:30 PM</div>
//         </div>
//       </div>
//       <div className="footer-bottom">
//         © 2021 Ray Fine Ornates. All rights reserved. &nbsp;|&nbsp; Designed with ❤️ in Jaipur &nbsp;|&nbsp; 🌍 Shipping Worldwide
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
//         <Route path="/"         element={<Home     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//         <Route path="/shop"     element={<Shop     cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//         <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
//         <Route path="/about"    element={<About />} />
//         <Route path="/contact"  element={<Contact />} />
//         <Route path="/terms"    element={<Terms />} />
//         <Route path="/login"    element={<Login />} />
//         <Route path="/admin"    element={<Admin />} />
//       </Routes>
//       {!isAdminPage && <Footer />}
//       {!isAdminPage && chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
//       {!isAdminPage && <WhatsAppFloat onOpenChat={() => setChatOpen(true)} />}
//     </>
//   );
// }

// export default function App() {
//   return <BrowserRouter><AppInner /></BrowserRouter>;

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Admin from "./Admin";
import Chatbot from "./Chatbot";

const PRODUCTS = [
  { id: 1, name: "Kundan Polki Necklace", category: "Necklaces", price: 4200, original: 5500, inr: "₹4,200", usd: "$50", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80", badge: "BESTSELLER", desc: "Handcrafted Kundan with semi-precious stones", stock: 8 },
  { id: 2, name: "Meenakari Jhumka Earrings", category: "Earrings", price: 1800, original: 2400, inr: "₹1,800", usd: "$22", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", badge: "NEW", desc: "Traditional Jaipur meenakari enamel work", stock: 15 },
  { id: 3, name: "Gold Plated Jadau Bracelet", category: "Bracelets", price: 2600, original: null, inr: "₹2,600", usd: "$31", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80", badge: null, desc: "22K gold plated with natural emeralds", stock: 5 },
  { id: 4, name: "Navratna Statement Ring", category: "Rings", price: 3100, original: 3800, inr: "₹3,100", usd: "$37", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80", badge: "SALE", desc: "Nine gemstone spiritual ring, handset", stock: 12 },
  { id: 5, name: "Bridal Choker Set", category: "Bridal", price: 9800, original: 12000, inr: "₹9,800", usd: "$118", img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80", badge: "PREMIUM", desc: "Complete bridal set with maang tikka", stock: 3 },
  { id: 6, name: "Gemstone Layered Necklace", category: "Necklaces", price: 3400, original: null, inr: "₹3,400", usd: "$41", img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&q=80", badge: "NEW", desc: "Multi-strand semi-precious stone necklace", stock: 20 },
  { id: 7, name: "Spiritual Om Pendant", category: "Spiritual", price: 1200, original: 1600, inr: "₹1,200", usd: "$14", img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80", badge: "SALE", desc: "Sterling silver Om pendant with rudraksha", stock: 30 },
  { id: 8, name: "Polki Diamond Maang Tikka", category: "Bridal", price: 5600, original: 7000, inr: "₹5,600", usd: "$67", img: "https://images.unsplash.com/photo-1573408301185-9519f94b8145?w=400&q=80", badge: "BESTSELLER", desc: "Uncut diamond maang tikka, Jaipur crafted", stock: 6 },
];

const ORDERS = [
  { id: "RFO-2024-001", customer: "Priya Sharma", email: "priya@email.com", items: "Kundan Polki Necklace x1", total: "₹4,200", status: "Processing", date: "2024-06-04", country: "India", tracking: "" },
  { id: "RFO-2024-002", customer: "Sarah Johnson", email: "sarah@email.com", items: "Meenakari Jhumka x2", total: "₹3,600", status: "Shipped", date: "2024-06-03", country: "USA", tracking: "DTDC123456" },
  { id: "RFO-2024-003", customer: "Fatima Al-Hassan", email: "fatima@email.com", items: "Bridal Choker Set x1", total: "₹9,800", status: "Delivered", date: "2024-06-01", country: "UAE", tracking: "DHL789012" },
  { id: "RFO-2024-004", customer: "Emma Williams", email: "emma@email.com", items: "Navratna Ring x1", total: "₹3,100", status: "Processing", date: "2024-06-04", country: "UK", tracking: "" },
  { id: "RFO-2024-005", customer: "Aisha Patel", email: "aisha@email.com", items: "Gold Bracelet x1, Om Pendant x2", total: "₹5,000", status: "Dispatched", date: "2024-06-02", country: "Canada", tracking: "" },
];




const statusColor = (s) => {
  if (s === "Delivered") return { bg: "#e6f7ee", color: "#1a7a45" };
  if (s === "Shipped" || s === "Dispatched") return { bg: "#e8f3ff", color: "#1a4fa0" };
  return { bg: "#fff3e0", color: "#b45309" };
};

export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState(ORDERS);
  const [products, setProducts] = useState(PRODUCTS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(true);
  const [trackingModal, setTrackingModal] = useState(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminTab, setAdminTab] = useState("orders");
  const [listingModal, setListingModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [toast, setToast] = useState(null);

  const heroImages = [
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1400&q=90",
    "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1400&q=90",
    "https://images.unsplash.com/photo-1573408301185-9519f94b8145?w=1400&q=90",
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(p => (p + 1) % heroImages.length), 4500);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const saveTracking = () => {
    if (!trackingInput.trim()) return;
    setOrders(prev => prev.map(o => o.id === trackingModal.id ? { ...o, tracking: trackingInput, status: "Shipped" } : o));
    showToast("Tracking updated & customer notified");
    setTrackingModal(null);
    setTrackingInput("");
  };

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',sans-serif;background:#0a0805;color:#f5f0e8;overflow-x:hidden;}
    ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#1a1208;}::-webkit-scrollbar-thumb{background:#6b4e2a;border-radius:2px;}
    .serif{font-family:'Cormorant Garamond',serif;}
    a{text-decoration:none;color:inherit;}
    input,select,textarea{font-family:'DM Sans',sans-serif;}
    input:focus,select:focus,textarea:focus{outline:1px solid #b07a5a;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
    @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
    @keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
    @keyframes toastIn{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
    .fade-up{animation:fadeUp 0.7s ease both;}
    .hero-img{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity 1.5s ease;}
  `;

  return (
    <>
      <style>{css}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", background: toast.type === "success" ? "#2d5a27" : "#7a2020", color: "#fff", padding: "12px 24px", borderRadius: 4, zIndex: 99999, fontSize: 13, fontWeight: 500, letterSpacing: 0.5, animation: "toastIn 0.3s ease", whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1a1208", border: "1px solid #3a2a18", borderRadius: 6, padding: 32, width: "100%", maxWidth: 480 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#b07a5a", marginBottom: 8 }}>Upload Tracking</div>
            <div className="serif" style={{ fontSize: 22, marginBottom: 4 }}>Order {trackingModal.id}</div>
            <div style={{ color: "#9a8878", fontSize: 13, marginBottom: 20 }}>Customer: {trackingModal.customer} · {trackingModal.country}</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9a8878", display: "block", marginBottom: 6 }}>Courier / Carrier</label>
              <select style={{ width: "100%", padding: "10px 14px", background: "#0f0d0a", border: "1px solid #3a2a18", borderRadius: 3, color: "#f5f0e8", fontSize: 13 }}>
                <option>DHL Express</option><option>FedEx International</option><option>DTDC</option><option>India Post EMS</option><option>Delhivery</option><option>Blue Dart</option><option>Aramex</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9a8878", display: "block", marginBottom: 6 }}>Tracking Number</label>
              <input value={trackingInput} onChange={e => setTrackingInput(e.target.value)} placeholder="e.g. DHL1234567890" style={{ width: "100%", padding: "10px 14px", background: "#0f0d0a", border: "1px solid #3a2a18", borderRadius: 3, color: "#f5f0e8", fontSize: 14 }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveTracking} style={{ flex: 1, padding: "11px", background: "#b07a5a", color: "#fff", border: "none", borderRadius: 3, fontSize: 11, fontWeight: 500, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer" }}>Save & Notify Customer</button>
              <button onClick={() => setTrackingModal(null)} style={{ padding: "11px 20px", background: "transparent", color: "#9a8878", border: "1px solid #3a2a18", borderRadius: 3, fontSize: 11, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

       {/* PRODUCT EDIT MODAL */}
      {editProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1a1208", border: "1px solid #3a2a18", borderRadius: 6, padding: 32, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#b07a5a", marginBottom: 16 }}>{editProduct.id ? "Edit Listing" : "New Listing"}</div>
            {[
              { label: "Product Name", key: "name", type: "text" },
              { label: "Category", key: "category", type: "select", opts: ["Necklaces","Earrings","Bracelets","Rings","Bridal","Spiritual"] },
              { label: "Price (INR ₹)", key: "price", type: "number" },
              { label: "Original Price (INR ₹)", key: "original", type: "number" },
              { label: "Stock Quantity", key: "stock", type: "number" },
              { label: "Description", key: "desc", type: "text" },
              { label: "Image URL", key: "img", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9a8878", display: "block", marginBottom: 5 }}>{f.label}</label>
                {f.type === "select" ? (
                  <select value={editProduct[f.key] || ""} onChange={e => setEditProduct(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", background: "#0f0d0a", border: "1px solid #3a2a18", borderRadius: 3, color: "#f5f0e8", fontSize: 13 }}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} value={editProduct[f.key] || ""} onChange={e => setEditProduct(p => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))} style={{ width: "100%", padding: "9px 12px", background: "#0f0d0a", border: "1px solid #3a2a18", borderRadius: 3, color: "#f5f0e8", fontSize: 13 }} />
                )}
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9a8878", marginBottom: 8 }}>List on Platforms</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Amazon India", "Amazon Global", "Etsy", "Flipkart", "Meesho", "IndiaMart", "Website"].map(p => (
                  <label key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#c5b5a8", background: "#0f0d0a", border: "1px solid #3a2a18", padding: "5px 12px", borderRadius: 3, cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked={["Website", "Etsy"].includes(p)} style={{ accentColor: "#b07a5a" }} /> {p}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                if (editProduct.id) {
                  setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...editProduct, inr: `₹${editProduct.price}`, usd: `$${Math.round(editProduct.price / 83)}` } : p));
                  showToast("Product updated on all platforms");
                } else {
                  const newP = { ...editProduct, id: Date.now(), inr: `₹${editProduct.price}`, usd: `$${Math.round(editProduct.price / 83)}` };
                  setProducts(prev => [newP, ...prev]);
                  showToast("Product listed on selected platforms");
                }
                setEditProduct(null);
              }} style={{ flex: 1, padding: "11px", background: "#b07a5a", color: "#fff", border: "none", borderRadius: 3, fontSize: 11, fontWeight: 500, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer" }}>Save & Publish</button>
              <button onClick={() => setEditProduct(null)} style={{ padding: "11px 20px", background: "transparent", color: "#9a8878", border: "1px solid #3a2a18", borderRadius: 3, fontSize: 11, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}


      {/* NOTIFICATION PANEL */}
      {notifOpen && (
        <div style={{ position: "fixed", top: 70, right: 20, width: 340, background: "#1a1208", border: "1px solid #3a2a18", borderRadius: 6, zIndex: 8000, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animation: "fadeUp 0.3s ease" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #2a1e10", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#b07a5a" }}>Order Notifications</span>
            <button onClick={() => { setNotifOpen(false); setNewOrderAlert(false); }} style={{ background: "none", border: "none", color: "#9a8878", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          {orders.filter(o => o.status === "Processing").map(o => (
            <div key={o.id} style={{ padding: "12px 18px", borderBottom: "1px solid #2a1e10", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#b07a5a", marginTop: 5, flexShrink: 0, animation: "pulse 2s infinite" }}></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#f5f0e8" }}>{o.id} — {o.customer}</div>
                <div style={{ fontSize: 11, color: "#9a8878", margin: "2px 0" }}>{o.items}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#b07a5a", fontWeight: 500 }}>{o.total}</span>
                  <span style={{ fontSize: 10, color: "#6a5848" }}>· {o.country} · {o.date}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding: "10px 18px" }}>
            <button onClick={() => { setNotifOpen(false); setPage("admin"); setAdminTab("orders"); }} style={{ width: "100%", padding: "9px", background: "transparent", border: "1px solid #3a2a18", borderRadius: 3, color: "#b07a5a", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>View All Orders →</button>
          </div>
        </div>
      )}

      {/* CART OVERLAY */}
      <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1999, opacity: cartOpen ? 1 : 0, pointerEvents: cartOpen ? "all" : "none", transition: "opacity 0.3s" }} />

      {/* CART DRAWER */}
      <div style={{ position: "fixed", right: cartOpen ? 0 : -480, top: 0, width: 420, maxWidth: "100vw", height: "100%", background: "#0f0d0a", borderLeft: "1px solid #2a1e10", zIndex: 2000, display: "flex", flexDirection: "column", transition: "right 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #2a1e10" }}>
          <span className="serif" style={{ fontSize: 22, fontWeight: 400 }}>Your Cart ({cartCount})</span>
          <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#9a8878", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: "#6a5848" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💎</div>
              <div className="serif" style={{ fontSize: 18, marginBottom: 6 }}>Your cart is empty</div>
              <div style={{ fontSize: 12, color: "#4a3828" }}>Discover our handcrafted treasures</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, padding: "14px 22px", borderBottom: "1px solid #1a1208" }}>
              <img src={item.img} alt={item.name} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 3, border: "1px solid #2a1e10" }} />
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 15, marginBottom: 3 }}>{item.name}</div>
                <div style={{ color: "#b07a5a", fontWeight: 500, fontSize: 13 }}>{item.inr}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <button onClick={() => updateQty(item.id, -1)} style={{ background: "#1a1208", border: "1px solid #2a1e10", color: "#f5f0e8", width: 26, height: 26, borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ background: "#1a1208", border: "1px solid #2a1e10", color: "#f5f0e8", width: 26, height: 26, borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#4a3828", cursor: "pointer", fontSize: 16, alignSelf: "flex-start", padding: 4 }}>✕</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "18px 22px", borderTop: "1px solid #2a1e10", background: "#0a0805" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ color: "#9a8878", fontSize: 12, letterSpacing: 1 }}>TOTAL</span>
              <span className="serif" style={{ fontSize: 24, color: "#f5f0e8" }}>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ fontSize: 11, color: "#6a5848", marginBottom: 12, textAlign: "center" }}>≈ ${Math.round(cartTotal / 83)} USD · Free worldwide shipping on orders above ₹5,000</div>
            <button onClick={() => { showToast("Redirecting to checkout..."); }} style={{ width: "100%", padding: "13px", background: "#b07a5a", color: "#fff", border: "none", borderRadius: 2, fontSize: 11, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>Proceed to Checkout</button>
            <button onClick={() => { setCartOpen(false); showToast("Order via WhatsApp: +91 8690666771"); }} style={{ width: "100%", padding: "11px", background: "transparent", color: "#9a8878", border: "1px solid #2a1e10", borderRadius: 2, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginTop: 8 }}>💬 Order via WhatsApp</button>
          </div>
        )}
      </div>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 70, background: "rgba(10,8,5,0.96)", borderBottom: "1px solid #2a1e10", backdropFilter: "blur(16px)" }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="serif" style={{ fontSize: 20, fontStyle: "italic", color: "#f5f0e8", letterSpacing: 1 }}>Ray Fine Ornates</span>
            <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#b07a5a" }}>Jaipur · Est. 1999</span>
          </div>
        </button>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["home", "shop", "about", "contact"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: page === p ? "#b07a5a" : "#9a8878", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, padding: "4px 0", borderBottom: page === p ? "1px solid #b07a5a" : "1px solid transparent", transition: "all 0.2s" }}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => { setNotifOpen(p => !p); setNewOrderAlert(false); }} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#9a8878", fontSize: 18, padding: "8px 10px", borderRadius: 4 }}>
            🔔
            {newOrderAlert && <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#b07a5a", border: "1.5px solid #0a0805" }}></span>}
          </button>
          <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#9a8878", fontSize: 18, padding: "8px 10px", borderRadius: 4 }}>
            🛍
            {cartCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, background: "#b07a5a", color: "#fff", fontSize: 9, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>{cartCount}</span>}
          </button>
          <button onClick={() => setPage("admin")} style={{ background: "#1a1208", border: "1px solid #3a2a18", color: "#b07a5a", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", padding: "8px 16px", borderRadius: 3, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Admin</button>
        </div>
      </nav>

      {/* PAGES */}
      {page === "home" && <HomePage heroImages={heroImages} heroSlide={heroSlide} setHeroSlide={setHeroSlide} products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} setPage={setPage} setActiveCategory={setActiveCategory} />}
      {page === "shop" && <ShopPage products={filteredProducts} categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      {page === "admin" && <AdminPage orders={orders} products={products} adminTab={adminTab} setAdminTab={setAdminTab} setTrackingModal={setTrackingModal} setTrackingInput={setTrackingInput} setEditProduct={setEditProduct} setProducts={setProducts} showToast={showToast} />}

      {/* WHATSAPP */}
      <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" style={{ position: "fixed", bottom: 24, right: 24, width: 50, height: 50, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, zIndex: 9999, boxShadow: "0 8px 24px rgba(37,211,102,0.3)" }}>💬</a>

    </>
  );
}

function HomePage({ heroImages, heroSlide, setHeroSlide, products, addToCart, wishlist, toggleWishlist, setPage, setActiveCategory }) {
  const shipStrip = ["🌍 Ships to 60+ Countries", "✦ Free Shipping on ₹5,000+", "✦ Handcrafted in Jaipur", "✦ Custom Orders", "✦ Real Gemstones", "✦ 25+ Years Heritage", "✦ Same-Day WhatsApp Support"];
  return (
    <div>
      {/* SHIPPING MARQUEE */}
      <div style={{ background: "#0f0d0a", borderBottom: "1px solid #1a1208", overflow: "hidden", padding: "9px 0" }}>
        <div style={{ display: "inline-flex", gap: 52, animation: "marquee 28s linear infinite", whiteSpace: "nowrap" }}>
          {[...shipStrip, ...shipStrip].map((t, i) => (
            <span key={i} style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "#6a5848" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* HERO — full screen, product image, minimal overlay text */}
      <div style={{ position: "relative", height: "94vh", minHeight: 560, overflow: "hidden", background: "#0a0805" }}>
        {heroImages.map((img, i) => (
          <div key={i} className="hero-img" style={{ backgroundImage: `url(${img})`, opacity: heroSlide === i ? 1 : 0, zIndex: heroSlide === i ? 1 : 0 }} />
        ))}
        {/* Dark gradient only on left side so product image shows fully on right */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(10,8,5,0.88) 0%, rgba(10,8,5,0.5) 42%, rgba(10,8,5,0.08) 70%)", zIndex: 2 }} />

        {/* Minimal hero text — bottom left, short */}
        <div style={{ position: "absolute", bottom: "10%", left: "7%", zIndex: 3, maxWidth: 500, animation: "fadeUp 0.8s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 28, height: 1, background: "#b07a5a" }} />
            <span style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#b07a5a" }}>Jaipur · Est. 1999</span>
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(42px,6vw,82px)", fontWeight: 300, fontStyle: "italic", color: "#f5f0e8", lineHeight: 1.0, marginBottom: 28 }}>
            Handcrafted<br /><span style={{ color: "#b07a5a" }}>Ornates</span>
          </h1>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setPage("shop")} style={{ padding: "12px 32px", background: "#b07a5a", color: "#fff", border: "none", borderRadius: 2, fontSize: 10, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer" }}>Shop Now</button>
            <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" style={{ padding: "12px 28px", background: "transparent", color: "#f5f0e8", border: "1px solid rgba(245,240,232,0.45)", borderRadius: 2, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>💬 Custom</a>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: "absolute", bottom: 28, right: "7%", display: "flex", gap: 8, zIndex: 4 }}>
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroSlide(i)} style={{ width: i === heroSlide ? 22 : 5, height: 5, borderRadius: i === heroSlide ? 3 : "50%", background: i === heroSlide ? "#b07a5a" : "#3a2a18", border: "none", cursor: "pointer", transition: "all 0.4s" }} />
          ))}
        </div>

        {/* Ships worldwide badge — top right */}
        <div style={{ position: "absolute", top: 28, right: "7%", zIndex: 4, background: "rgba(10,8,5,0.75)", border: "1px solid #2a1e10", borderRadius: 3, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🌍</span>
          <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#c5b5a8" }}>Ships Worldwide</span>
        </div>
      </div>

      {/* CATEGORIES — image grid, no heading text needed */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3, background: "#0a0805" }}>
        {[
          { name: "Necklaces", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=85" },
          { name: "Earrings",  img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=85" },
          { name: "Bridal",    img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=85" },
          { name: "Spiritual", img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=85" },
        ].map(c => (
          <button key={c.name} onClick={() => { setActiveCategory(c.name); setPage("shop"); }} style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", border: "none", cursor: "pointer", background: "none", display: "block" }}>
            <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
              onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,5,0.72) 0%, transparent 50%)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 22 }}>
              <span className="serif" style={{ fontSize: 18, color: "#f5f0e8", fontStyle: "italic" }}>{c.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ padding: "72px 40px", background: "#0f0d0a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, maxWidth: 1240, margin: "0 auto 36px" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#b07a5a", marginBottom: 8 }}>Handpicked</div>
            <h2 className="serif" style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 300, fontStyle: "italic", color: "#f5f0e8" }}>Featured Pieces</h2>
          </div>
          <button onClick={() => setPage("shop")} style={{ padding: "10px 28px", background: "transparent", color: "#b07a5a", border: "1px solid #b07a5a", borderRadius: 2, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>View All →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, maxWidth: 1240, margin: "0 auto" }}>
          {products.slice(0, 4).map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#1a1208", borderTop: "1px solid #2a1e10", borderBottom: "1px solid #2a1e10" }}>
        {[["💎","Certified Gemstones"],["🔨","Jaipur Artisans"],["🌍","60+ Countries"],["↩️","Easy Returns"]].map(([icon, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "20px 16px", borderRight: "1px solid #2a1e10" }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span className="serif" style={{ fontSize: 14, color: "#c5b5a8", fontStyle: "italic" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: "72px 40px", background: "#0a0805" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 className="serif" style={{ fontSize: "clamp(22px,3vw,38px)", fontWeight: 300, fontStyle: "italic", color: "#f5f0e8" }}>Customer Stories</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { text: "Stunning Kundan necklace — extraordinary craftsmanship, beautiful packaging from Jaipur to London.", name: "Amelia R.", loc: "London, UK" },
            { text: "Custom bridal set exceeded all expectations. True artisan quality, delivered right on time.", name: "Sneha M.", loc: "Mumbai, India" },
            { text: "Fast shipping to Dubai, beautiful meenakari earrings even more gorgeous in person!", name: "Laila K.", loc: "Dubai, UAE" },
          ].map(t => (
            <div key={t.name} style={{ background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 4, padding: "24px 22px" }}>
              <div style={{ color: "#b07a5a", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>★★★★★</div>
              <p className="serif" style={{ fontSize: 15, fontStyle: "italic", color: "#f5f0e8", lineHeight: 1.75, marginBottom: 16, fontWeight: 300 }}>"{t.text}"</p>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#9a8878" }}>{t.name}</div>
              <div style={{ fontSize: 10, color: "#4a3828", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{t.loc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f0d0a", borderTop: "1px solid #1a1208" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, maxWidth: 1200, margin: "0 auto", padding: "52px 40px 36px" }}>
          <div>
            <div className="serif" style={{ fontSize: 19, fontStyle: "italic", color: "#f5f0e8", marginBottom: 10 }}>Ray Fine Ornates</div>
            <div style={{ fontSize: 12, color: "#4a3828", lineHeight: 1.8, marginBottom: 14 }}>Handcrafted jewelry · Jaipur, India · Since 1999</div>
            <div style={{ fontSize: 12, color: "#b07a5a" }}>📞 +91 8690666771</div>
            <div style={{ fontSize: 12, color: "#4a3828", marginTop: 4 }}>Mon–Sat · 10AM–7PM IST</div>
          </div>
          {[
            { title: "Shop", links: ["Necklaces","Earrings","Bracelets","Rings","Bridal","Spiritual"] },
            { title: "Help", links: ["About Us","Contact","FAQs","Bulk Orders","Custom Orders"] },
            { title: "Legal", links: ["Terms & Conditions","Refund Policy","Shipping","Privacy"] },
          ].map(col => (
            <div key={col.title}>
              <div className="serif" style={{ fontSize: 15, color: "#c5b5a8", marginBottom: 16, fontStyle: "italic" }}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{ fontSize: 12, color: "#4a3828", lineHeight: 2.6, cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "14px 40px", borderTop: "1px solid #1a1208", fontSize: 9, color: "#2a1a08", letterSpacing: 2, textTransform: "uppercase" }}>
          © 2024 Ray Fine Ornates · Jaipur, Rajasthan, India
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ p, addToCart, wishlist, toggleWishlist }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    addToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  return (
    <div style={{ background: "#1a1208", border: "1px solid #2a1e10", borderRadius: 4, overflow: "hidden", transition: "box-shadow 0.3s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
        <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {p.badge && <span style={{ position: "absolute", top: 12, left: 12, background: p.badge === "SALE" ? "#7a2020" : "#b07a5a", color: "#fff", padding: "3px 9px", borderRadius: 2, fontSize: 9, fontWeight: 500, letterSpacing: 1.5 }}>{p.badge}</span>}
        <button onClick={() => toggleWishlist(p.id)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(10,8,5,0.8)", border: "1px solid #2a1e10", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>
          {wishlist.includes(p.id) ? "❤️" : "🤍"}
        </button>
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ background: "rgba(10,8,5,0.75)", color: "#6a5848", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", padding: "3px 8px", borderRadius: 2 }}>{p.category}</span>
          <span style={{ background: p.stock <= 5 ? "rgba(120,32,32,0.85)" : "rgba(10,8,5,0.75)", color: p.stock <= 5 ? "#ffaaaa" : "#6a5848", fontSize: 9, letterSpacing: 1, padding: "3px 8px", borderRadius: 2 }}>Stock: {p.stock}</span>
        </div>
      </div>
      <div style={{ padding: "14px 16px", borderTop: "1px solid #2a1e10" }}>
        <div className="serif" style={{ fontSize: 16, color: "#f5f0e8", marginBottom: 4, fontWeight: 400 }}>{p.name}</div>
        <div style={{ fontSize: 11, color: "#6a5848", marginBottom: 10, lineHeight: 1.5 }}>{p.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ color: "#f5f0e8", fontWeight: 500, fontSize: 14 }}>{p.inr}</span>
          {p.original && <span style={{ color: "#3a2a18", fontSize: 12, textDecoration: "line-through" }}>₹{p.original.toLocaleString("en-IN")}</span>}
          <span style={{ background: "#1a1208", border: "1px solid #2a1e10", color: "#6a5848", fontSize: 10, padding: "2px 7px", borderRadius: 2 }}>{p.usd}</span>
        </div>
        <button onClick={handleAdd} style={{ width: "100%", padding: "9px", background: added ? "#2d5a27" : "transparent", border: `1px solid ${added ? "#2d5a27" : "#2a1e10"}`, borderRadius: 2, color: added ? "#fff" : "#9a8878", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", fontFamily: "'DM Sans',sans-serif" }}>
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function ShopPage({ products, categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery, addToCart, wishlist, toggleWishlist }) {
  return (
    <div style={{ background: "#0a0805", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: "72px 40px 48px", background: "#0f0d0a", borderBottom: "1px solid #1a1208" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#b07a5a", marginBottom: 10 }}>Our Collection</div>
        <h1 className="serif" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, fontStyle: "italic", color: "#f5f0e8", marginBottom: 8 }}>All Jewelry</h1>
        <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#6a5848" }}>Handcrafted in Jaipur · Ships to 60+ Countries</p>
      </div>
      <div style={{ padding: "24px 40px 0", maxWidth: 1280, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search jewelry..." style={{ flex: 1, minWidth: 200, padding: "10px 16px", background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 3, color: "#f5f0e8", fontSize: 13 }} />
        <select style={{ padding: "10px 16px", background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 3, color: "#9a8878", fontSize: 13 }}>
          <option>Sort: Featured</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Newest First</option>
        </select>
      </div>
      <div style={{ padding: "16px 40px", maxWidth: 1280, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{ padding: "7px 18px", background: activeCategory === c ? "#b07a5a" : "transparent", border: `1px solid ${activeCategory === c ? "#b07a5a" : "#2a1e10"}`, borderRadius: 2, color: activeCategory === c ? "#fff" : "#6a5848", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20, maxWidth: 1280, margin: "0 auto", padding: "20px 40px 80px" }}>
        {products.map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{ background: "#0a0805", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: "80px 40px 60px", background: "#0f0d0a", borderBottom: "1px solid #1a1208" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#b07a5a", marginBottom: 10 }}>Our Story</div>
        <h1 className="serif" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, fontStyle: "italic", color: "#f5f0e8" }}>About Ray Fine Ornates</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, padding: "80px 40px", maxWidth: 1100, margin: "0 auto", alignItems: "center" }}>
        <div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 300, fontStyle: "italic", color: "#b07a5a", marginBottom: 14 }}>25 Years of Craftsmanship</h2>
          <p style={{ color: "#9a8878", lineHeight: 1.9, marginBottom: 14, fontSize: 15 }}>Based in Jaipur, India, Ray Fine Ornates is a family-owned jewelry brand with over 25 years of experience creating handcrafted jewelry inspired by tradition, spirituality, and artistic heritage.</p>
          <p style={{ color: "#9a8878", lineHeight: 1.9, fontSize: 15 }}>Every piece is thoughtfully designed and handcrafted by skilled artisans who carry forward generations of Indian jewelry-making expertise. We specialize in gold-plated jewelry, precious and semi-precious gemstone jewelry, and ethnic statement pieces.</p>
          <div style={{ marginTop: 24, padding: "16px 20px", background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 4 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#b07a5a", marginBottom: 6 }}>Store Address</div>
            <div style={{ fontSize: 13, color: "#c5b5a8", lineHeight: 1.8 }}>223, 1st Floor, Memiyon Ka Darwaja<br />Haldiyon Ka Rasta, Johari Bazar<br />Jaipur – 302003, Rajasthan, India</div>
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80" alt="Ray Fine Ornates Jewelry" style={{ width: "100%", borderRadius: 4, border: "1px solid #2a1e10" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, padding: "0 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
        {[["25+", "Years of Heritage"], ["10K+", "Happy Customers"], ["500+", "Unique Designs"], ["60+", "Countries Served"]].map(([num, label]) => (
          <div key={num} style={{ textAlign: "center", padding: "32px 16px", background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 4 }}>
            <div className="serif" style={{ fontSize: 40, fontWeight: 300, color: "#b07a5a", marginBottom: 6 }}>{num}</div>
            <div style={{ fontSize: 10, color: "#6a5848", letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div style={{ background: "#0a0805", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: "80px 40px 60px", background: "#0f0d0a", borderBottom: "1px solid #1a1208" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#b07a5a", marginBottom: 10 }}>Get In Touch</div>
        <h1 className="serif" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 300, fontStyle: "italic", color: "#f5f0e8" }}>Contact Us</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 60, padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div>
          <h2 className="serif" style={{ fontSize: 26, fontWeight: 300, fontStyle: "italic", color: "#f5f0e8", marginBottom: 28 }}>We'd love to hear from you</h2>
          {[["📞", "Phone / WhatsApp", "+91 8690666771"], ["🏪", "Store", "Johari Bazar, Jaipur – 302003"], ["🕐", "Business Hours", "Mon–Sat: 10AM – 7PM IST"], ["🌍", "Worldwide Shipping", "60+ countries · Free on ₹5,000+"]].map(([icon, label, val]) => (
            <div key={label} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#b07a5a", marginBottom: 4 }}>{icon} {label}</div>
              <div style={{ fontSize: 14, color: "#c5b5a8" }}>{val}</div>
            </div>
          ))}
          <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 16, padding: "12px 28px", background: "#25D366", color: "#fff", borderRadius: 3, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>💬 WhatsApp Us</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {["Full Name", "Email Address", "Phone / WhatsApp"].map(f => (
            <input key={f} placeholder={f} style={{ padding: "12px 16px", background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 3, color: "#f5f0e8", fontSize: 14 }} />
          ))}
          <textarea placeholder="Your message — custom orders, questions, wholesale inquiries..." rows={5} style={{ padding: "12px 16px", background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 3, color: "#f5f0e8", fontSize: 14, resize: "vertical" }} />
          <button style={{ padding: "13px", background: "#b07a5a", color: "#fff", border: "none", borderRadius: 3, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Send Message</button>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ orders, products, adminTab, setAdminTab, setTrackingModal, setTrackingInput, setEditProduct, setProducts, showToast }) {
  const [stockEdit, setStockEdit] = useState({});
  const tabs = ["orders", "products", "analytics"];
  const processingCount = orders.filter(o => o.status === "Processing").length;

  return (
    <div style={{ background: "#0a0805", minHeight: "100vh" }}>
      <div style={{ background: "#0f0d0a", borderBottom: "1px solid #1a1208", padding: "24px 40px" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#b07a5a", marginBottom: 6 }}>Dashboard</div>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 300, fontStyle: "italic", color: "#f5f0e8" }}>Admin Panel</h1>
      </div>
      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, padding: "24px 40px" }}>
        {[["🔔", "New Orders", processingCount, "#b07a5a"], ["📦", "Total Orders", orders.length, "#c5b5a8"], ["💎", "Products", products.length, "#c5b5a8"], ["🌍", "Countries", "12", "#c5b5a8"]].map(([icon, label, val, color]) => (
          <div key={label} style={{ background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 4, padding: "20px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 500, color, fontFamily: "serif", marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 10, color: "#4a3828", letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>
      {/* TABS */}
      <div style={{ display: "flex", gap: 4, padding: "0 40px 20px", borderBottom: "1px solid #1a1208" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setAdminTab(t)} style={{ padding: "8px 20px", background: adminTab === t ? "#b07a5a" : "transparent", border: `1px solid ${adminTab === t ? "#b07a5a" : "#2a1e10"}`, borderRadius: 2, color: adminTab === t ? "#fff" : "#6a5848", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 40px 80px" }}>
        {/* ORDERS TAB */}
        {adminTab === "orders" && (
          <div>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 300, fontStyle: "italic", color: "#f5f0e8" }}>Order Management</h2>
              <div style={{ fontSize: 11, color: "#6a5848" }}>Order notifications → Bell icon in navbar</div>
            </div>
            <div style={{ background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 2fr 1fr 1fr 1fr auto", gap: 0, padding: "10px 18px", borderBottom: "1px solid #1a1208", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#4a3828" }}>
                <span>Order ID</span><span>Customer</span><span>Items</span><span>Total</span><span>Country</span><span>Status</span><span>Action</span>
              </div>
              {orders.map(o => {
                const sc = statusColor(o.status);
                return (
                  <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 2fr 1fr 1fr 1fr auto", gap: 0, padding: "14px 18px", borderBottom: "1px solid #1a1208", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#b07a5a" }}>{o.id}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "#f5f0e8" }}>{o.customer}</div>
                      <div style={{ fontSize: 10, color: "#4a3828" }}>{o.date}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "#9a8878" }}>{o.items}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#c5b5a8" }}>{o.total}</span>
                    <span style={{ fontSize: 12, color: "#9a8878" }}>{o.country}</span>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 2, fontWeight: 500, background: sc.bg + "33", color: o.status === "Delivered" ? "#4ade80" : o.status === "Processing" ? "#f5a55a" : "#60a5fa", border: `1px solid ${sc.color}44` }}>{o.status}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {o.tracking ? (
                        <span style={{ fontSize: 10, color: "#4a3828", fontFamily: "monospace" }}>{o.tracking}</span>
                      ) : (
                        <button onClick={() => { setTrackingModal(o); setTrackingInput(""); }} style={{ padding: "5px 12px", background: "transparent", border: "1px solid #3a2a18", borderRadius: 2, color: "#b07a5a", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>
                          + Tracking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, padding: "14px 18px", background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 4, fontSize: 12, color: "#6a5848" }}>
              💡 <strong style={{ color: "#b07a5a" }}>How to get order notifications:</strong> New orders trigger the 🔔 bell icon in the navbar. Connect your Shopify/WooCommerce store or set up WhatsApp Business API at +91 8690666771 to receive real-time alerts on your phone.
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {adminTab === "products" && (
          <div>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 300, fontStyle: "italic", color: "#f5f0e8" }}>Product Listings</h2>
              <button onClick={() => setEditProduct({ name: "", category: "Necklaces", price: 0, original: 0, stock: 0, desc: "", img: "", badge: null })} style={{ padding: "10px 22px", background: "#b07a5a", color: "#fff", border: "none", borderRadius: 3, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>+ New Listing</button>
            </div>
            <div style={{ background: "#0f0d0a", border: "1px solid #2a1e10", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 1fr auto", padding: "10px 18px", borderBottom: "1px solid #1a1208", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#4a3828", alignItems: "center" }}>
                <span></span><span>Product</span><span>Category</span><span>INR</span><span>USD</span><span>Stock</span><span>Actions</span>
              </div>
              {products.map(p => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 1fr auto", padding: "12px 18px", borderBottom: "1px solid #1a1208", alignItems: "center", gap: 0 }}>
                  <img src={p.img} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 3, border: "1px solid #2a1e10" }} />
                  <div>
                    <div style={{ fontSize: 13, color: "#f5f0e8" }}>{p.name}</div>
                    {p.badge && <span style={{ fontSize: 9, background: "#2a1a0a", color: "#b07a5a", padding: "2px 6px", borderRadius: 2, letterSpacing: 1 }}>{p.badge}</span>}
                  </div>
                  <span style={{ fontSize: 12, color: "#6a5848" }}>{p.category}</span>
                  <span style={{ fontSize: 13, color: "#c5b5a8", fontWeight: 500 }}>{p.inr}</span>
                  <span style={{ fontSize: 12, color: "#6a5848" }}>{p.usd}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => { const n = stockEdit[p.id] ?? p.stock; if (n > 0) { setProducts(prev => prev.map(x => x.id === p.id ? { ...x, stock: n - 1 } : x)); }}} style={{ background: "#1a1208", border: "1px solid #2a1e10", color: "#f5f0e8", width: 22, height: 22, borderRadius: 2, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <input type="number" value={stockEdit[p.id] ?? p.stock} onChange={e => setStockEdit(prev => ({ ...prev, [p.id]: Number(e.target.value) }))} onBlur={e => { setProducts(prev => prev.map(x => x.id === p.id ? { ...x, stock: Number(e.target.value) } : x)); showToast(`Stock updated: ${p.name}`); }} style={{ width: 44, padding: "3px 6px", background: "#0a0805", border: "1px solid #2a1e10", borderRadius: 2, color: "#f5f0e8", fontSize: 12, textAlign: "center" }} />
                    <button onClick={() => { setProducts(prev => prev.map(x => x.id === p.id ? { ...x, stock: x.stock + 1 } : x)); }} style
