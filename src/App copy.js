    
    // import { useEffect, useState} from "react";
    // import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
    // import "./App.css";
    // import Login from "./login";
    // import Admin from "./Admin";

    // // ── Real product images from rayfineornates.com ──
    // const FEATURED = [
    // { id: 1, name: "Silver Palm Beaded Anklets", price: 330, category: "Anklet", image: "https://rayfineornates.com/wp-content/uploads/2021/07/1-scaled-e1625215263636-300x300.jpg" },
    // { id: 2, name: "Aalya Ring", price: 1326, category: "Ring", image: "https://rayfineornates.com/wp-content/uploads/2021/07/10a-300x300.jpg" },
    // { id: 3, name: "Baguette Bracelet", price: 1570, category: "Bracelet", image: "https://rayfineornates.com/wp-content/uploads/2021/08/2-1-300x300.jpg" },
    // { id: 4, name: "Isla Mini Hoop", price: 1025, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/3A-1-scaled-1-300x300.jpg" },
    // { id: 5, name: "Torso Oval Earring", price: 1550, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/2c-scaled-e1619944411396-300x300.jpg" },
    // { id: 6, name: "Mia Stud", price: 2750, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/07/spot-shop-1-300x285.jpg" },
    // { id: 7, name: "Madonna in Green", price: 1777, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/08/3a-1-300x300.jpg" },
    // { id: 8, name: "Cleo", price: 1350, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/2-copy-4-scaled-e1620057018882-295x300.jpg" },
    // { id: 9, name: "Sage Polki Stud", price: 1513, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/08/3-300x300.jpg" },
    // { id: 10, name: "Aventurine Bracelet", price: 1025, category: "Bracelet", image: "https://rayfineornates.com/wp-content/uploads/2021/07/15a-300x300.jpg" },
    // { id: 11, name: "Fitore Stud", price: 2100, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/DSC00406-300x300.jpg" },
    // { id: 12, name: "Hermosa Earring", price: 1770, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/16-263x300.jpg" },
    // { id: 13, name: "Sukayanah Dangler", price: 2500, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/1a-300x300.jpg" },
    // { id: 14, name: "Marceline Earring", price: 1670, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/13-300x300.jpg" },
    // { id: 15, name: "Eloise Necklace Set", price: 2780, category: "Necklace", image: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC08595-1-300x300.jpg" },
    // { id: 16, name: "Arbre Silver Stud", price: 1290, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC00383-copy-300x300.jpg" },
    // ];

    // const CATEGORIES = ["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet"];

    // const WALLPAPERS = [
    // "https://images.unsplash.com/photo-1617038260897-41a1f14a0d7b?auto=format&fit=crop&w=1600&q=80",
    // "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
    // "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=80",
    // "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1600&q=80",
    // ];

    // ── Navbar ──
//     function Navbar({ cart, wishlist, onCartOpen }) {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const loc = useLocation();

//     return (
//         <nav className="navbar">


//     <Link to="/" className="navbar-logo">
//     <img
//         src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png" 
//         alt="Ray Fine Ornates"
//         style={{ height: "50px", objectFit: "contain" }}
//     />
//     </Link>
//         <div className={`nav-links ${menuOpen ? "open" : ""}`}>
//             <Link to="/" className={loc.pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>Home</Link>
//             <Link to="/shop" className={loc.pathname === "/shop" ? "active" : ""} onClick={() => setMenuOpen(false)}>Shop</Link>
//             <Link to="/about" className={loc.pathname === "/about" ? "active" : ""} onClick={() => setMenuOpen(false)}>About</Link>
//             <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""} onClick={() => setMenuOpen(false)}>Contact</Link>
//         </div>
//         <div className="nav-actions">
//             <Link to="/wishlist" className="nav-icon" title="Wishlist">
//             🤍 <span className="badge">{wishlist.length}</span>
//             </Link>
//             <button className="nav-icon cart-btn" onClick={onCartOpen}>
//             🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
//             </button>
//             <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
//         </div>
//         </nav>
//     );
//     }

//     // ── Cart Drawer ──
//     function CartDrawer({ cart, setCart, open, onClose }) {
//     const [customer, setCustomer] = useState({ name: "", address: "", phone: "" });
//     const [step, setStep] = useState("cart");

//     const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

//     const updateQty = (id, delta) => {
//         setCart(prev => prev
//         .map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p)
//         .filter(p => p.quantity > 0)
//         );
//     };

    
//         const placeOrder = async () => {
//     if (!customer.name || !customer.phone) {
//         alert("Please fill name and phone");
//         return;
//     }

//     const response = await fetch(
//         "http://127.0.0.1:5000/api/create-order",
//         {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             amount: total
//         })
//         }
//     );

//     const order = await response.json();

//     const options = {
//         key: "YOUR_KEY_ID",
//         amount: order.amount,
//         currency: "INR",
//         name: "Ray Fine Ornates",
//         description: "Jewellery Purchase",
//         order_id: order.id,

//         handler: function(response) {
//         alert("Payment Successful ✅");

//         setCart([]);
//         onClose();
//         },

//         prefill: {
//         name: customer.name,
//         contact: customer.phone
//         },

//         theme: {
//         color: "#000000"
//         }
//     };

//     const razor = new window.Razorpay(options);
//     razor.open();
//     };

//     return (
//         <>
//         <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose} />
//         <div className={`cart-drawer ${open ? "open" : ""}`}>
//             <div className="cart-header">
//             <h3>{step === "cart" ? "Your Cart" : "Checkout"}</h3>
//             <button className="cart-close" onClick={onClose}>✕</button>
//             </div>

//             {step === "cart" ? (
//             <>
//                 {cart.length === 0
//                 ? <p className="cart-empty">Your cart is empty 🛒</p>
//                 : cart.map(item => (
//                     <div className="cart-item" key={item.id}>
//                     <img src={item.image} alt={item.name} />
//                     <div className="cart-item-info">
//                         <p className="cart-item-name">{item.name}</p>
//                         <p className="cart-item-price">₹{item.price}</p>
//                         <div className="qty-controls">
//                         <button onClick={() => updateQty(item.id, -1)}>−</button>
//                         <span>{item.quantity}</span>
//                         <button onClick={() => updateQty(item.id, 1)}>+</button>
//                         </div>
//                     </div>
//                     </div>
//                 ))
//                 }
//                 {cart.length > 0 && (
//                 <div className="cart-footer">
//                     <div className="cart-total">Total: <strong>₹{total}</strong></div>
//                     <button className="btn-primary" onClick={() => setStep("checkout")}>Proceed to Checkout</button>
//                 </div>
//                 )}
//             </>
//             ) : (
//             <div className="checkout-form">
//                 <input placeholder="Full Name *" value={customer.name}
//                 onChange={e => setCustomer({ ...customer, name: e.target.value })} />
//                 <input placeholder="Address" value={customer.address}
//                 onChange={e => setCustomer({ ...customer, address: e.target.value })} />
//                 <input placeholder="Phone *" value={customer.phone}
//                 onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
//                 <div className="cart-total">Total: <strong>₹{total}</strong></div>
//                 <button className="btn-primary" onClick={placeOrder}>Place Order ✨</button>
//                 <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
//             </div>
//             )}
//         </div>
//         </>
//     );
//     }

//     // ── Product Card ──
//     function ProductCard({ product, cart, setCart, wishlist, setWishlist }) {
//     const inWishlist = wishlist.find(w => w.id === product.id);
//     const inCart = cart.find(c => c.id === product.id);

//     const addToCart = () => {
//         if (inCart) {
//         setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
//         } else {
//         setCart([...cart, { ...product, quantity: 1 }]);
//         }
//     };

//     const toggleWishlist = () => {
//         if (inWishlist) setWishlist(wishlist.filter(w => w.id !== product.id));
//         else setWishlist([...wishlist, product]);
//     };

//     return (
//         <div className="product-card">
//         <div className="product-img-wrap">
//             <img src={product.image} alt={product.name}
//             onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }} />
//             <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}>
//             {inWishlist ? "❤️" : "🤍"}
//             </button>
//             <div className="product-category-tag">{product.category}</div>
//         </div>
//         <div className="product-info">
//             <h4>{product.name}</h4>
//             <p>₹{product.price.toLocaleString()}</p>
//             <button className="btn-add-cart" onClick={addToCart}>
//             {inCart ? "✓ Added" : "Add to Cart"}
//             </button>
//         </div>
//         </div>
//     );
//     }

//     // ── Home Page ──
//     function Home({ cart, setCart, wishlist, setWishlist }) {
//     const [bgIndex, setBgIndex] = useState(0);

//     useEffect(() => {
//         const t = setInterval(() => setBgIndex(p => (p + 1) % WALLPAPERS.length), 5000);
//         return () => clearInterval(t);
//     }, []);

//     return (
//         <>
//         {/* Hero */}
//         <section className="hero" style={{ backgroundImage: `url(${WALLPAPERS[bgIndex]})` }}>
//             <div className="hero-overlay">
//             <p className="hero-sub">New Collection 2024</p>
//             <h1>Elegance<br />Redefined</h1>
//             <p className="hero-desc">Luxury fashion jewellery crafted for the modern woman</p>
//             <div className="hero-btns">
//                 <Link to="/shop" className="btn-primary">Shop Now</Link>
//                 <Link to="/about" className="btn-outline">Our Story</Link>
//             </div>
//             </div>
//             <div className="hero-dots">
//             {WALLPAPERS.map((_, i) => (
//                 <span key={i} className={`dot ${i === bgIndex ? "active" : ""}`}
//                 onClick={() => setBgIndex(i)} />
//             ))}
//             </div>
//         </section>

//         {/* Categories */}
//         <section className="categories-section">
//             <h2 className="section-title">Shop by Category</h2>
//             <div className="categories-grid">
//             {[
//                 { name: "Earrings", img: "https://rayfineornates.com/wp-content/uploads/2021/06/3A-1-scaled-1-300x300.jpg", path: "/shop?cat=Earring" },
//                 { name: "Necklaces", img: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC08595-1-300x300.jpg", path: "/shop?cat=Necklace" },
//                 { name: "Bracelets", img: "https://rayfineornates.com/wp-content/uploads/2021/08/2-1-300x300.jpg", path: "/shop?cat=Bracelet" },
//                 { name: "Rings", img: "https://rayfineornates.com/wp-content/uploads/2021/07/10a-300x300.jpg", path: "/shop?cat=Ring" },
//             ].map(cat => (
//                 <Link to={cat.path} key={cat.name} className="category-card">
//                 <img src={cat.img} alt={cat.name} />
//                 <div className="category-overlay"><span>{cat.name}</span></div>
//                 </Link>
//             ))}
//             </div>
//         </section>

//         {/* Featured */}
//         <section className="featured-section">
//             <h2 className="section-title">Trending Now</h2>
//             <div className="products-grid">
//             {FEATURED.slice(0, 8).map(p => (
//                 <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
//                 wishlist={wishlist} setWishlist={setWishlist} />
//             ))}
//             </div>
//             <div style={{ textAlign: "center", marginTop: "40px" }}>
//             <Link to="/shop" className="btn-primary">View All Products</Link>
//             </div>
//         </section>

//         {/* Testimonials */}
//         <section className="testimonials-section">
//             <h2 className="section-title">What Our Customers Say</h2>
//             <div className="testimonials-grid">
//             {[
//                 { name: "Ms. Heena Gupta", text: "When it arrived, it was exactly as shown. So pretty. Very happy with my purchase!", product: "Katherine Bracelet" },
//                 { name: "Ms. Bhavika Kakurlawala", text: "The earrings are awesome & the bracelet is so elegant and easy to wear! Both pieces are just lovely.", product: "Swarovski Pearl Bracelet" },
//                 { name: "Ms. Tanya", text: "Found the most perfect gift! The moonstone was her sunshine stone. She was so happy.", product: "Multi Moonlight Bracelet" },
//             ].map((t, i) => (
//                 <div className="testimonial-card" key={i}>
//                 <p className="testimonial-text">"{t.text}"</p>
//                 <p className="testimonial-name">{t.name}</p>
//                 <p className="testimonial-product">{t.product}</p>
//                 </div>
//             ))}
//             </div>
//         </section>
//         </>
//     );
//     }

//     // ── Shop Page ──
//     function Shop({ cart, setCart, wishlist, setWishlist }) {
//     const [searchParams] = useSearchParams();
// const [category, setCategory] = useState(
//     searchParams.get("cat") || "All"
// );
//     const [search, setSearch] = useState("");
//     const [sort, setSort] = useState("default");
//     const [dbProducts, setDbProducts] = useState([]);

//     useEffect(() => {
//         fetch("http://127.0.0.1:5000/api/products")
//         .then(r => r.json())
//         .then(d => { if (d.success) setDbProducts(d.data.map((p, i) => ({ ...p, id: p._id || i }))); })
//         .catch(() => {});
//     }, []);

//     const allProducts = [...FEATURED, ...dbProducts];

//     let filtered = allProducts.filter(p => {
//         const matchCat = category === "All" || p.category === category;
//         const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
//         return matchCat && matchSearch;
//     });

//     if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
//     if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

//     return (
//         <div className="shop-page">
//         <div className="shop-hero">
//             <h1>Our Collection</h1>
//             <p>Discover timeless pieces crafted with love</p>
//         </div>

//         <div className="shop-controls">
//             <input className="shop-search" placeholder="🔍 Search jewellery..."
//             value={search} onChange={e => setSearch(e.target.value)} />
//             <select className="shop-sort" value={sort} onChange={e => setSort(e.target.value)}>
//             <option value="default">Sort: Featured</option>
//             <option value="low">Price: Low to High</option>
//             <option value="high">Price: High to Low</option>
//             </select>
//         </div>

//         <div className="category-tabs">
//             {CATEGORIES.map(cat => (
//             <button key={cat} className={`cat-tab ${category === cat ? "active" : ""}`}
//                 onClick={() => setCategory(cat)}>{cat}</button>
//             ))}
//         </div>

//         <div className="products-grid">
//             {filtered.map(p => (
//             <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
//                 wishlist={wishlist} setWishlist={setWishlist} />
//             ))}
//         </div>

//         {filtered.length === 0 && (
//             <p style={{ textAlign: "center", color: "#999", padding: "60px" }}>No products found.</p>
//         )}
//         </div>
//     );
//     }

//     // ── Wishlist Page ──
//     function Wishlist({ wishlist, setWishlist, cart, setCart }) {
//     return (
//         <div className="shop-page">
//         <div className="shop-hero">
//             <h1>Your Wishlist</h1>
//             <p>{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
//         </div>
//         {wishlist.length === 0
//             ? <p style={{ textAlign: "center", color: "#999", padding: "60px" }}>No items in wishlist yet 🤍</p>
//             : <div className="products-grid">
//                 {wishlist.map(p => (
//                 <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
//                     wishlist={wishlist} setWishlist={setWishlist} />
//                 ))}
//             </div>
//         }
//         </div>
//     );
//     }

//     // ── About Page ──
//     function About() {
//     return (
//         <div className="page-content">
//         <div className="shop-hero">
//             <h1>Our Story</h1>
//             <p>Crafting elegance since 2021</p>
//         </div>
//         <div className="about-grid">
//             <div className="about-text">
//             <h2>Who We Are</h2>
//             <p>Ray Fine Ornates is a luxury fashion jewellery brand based in the heart of Johari Bazar, Jaipur — India's jewellery capital. We believe every woman deserves to feel like royalty.</p>
//             <p>Our pieces are crafted with precision, using the finest materials to create jewellery that is both timeless and contemporary. From delicate studs to statement necklaces, each piece tells a story.</p>
//             <h2>Our Promise</h2>
//             <p>Quality you can feel. Beauty you can see. Service you can trust. We stand behind every piece we create with our dedication to craftsmanship and customer satisfaction.</p>
//             </div>
//             <div className="about-image">
//             <img src="https://rayfineornates.com/wp-content/uploads/2021/10/shotshop_ray02.webp" alt="Ray Fine Ornates" />
//             </div>
//         </div>
//         <div className="about-stats">
//             {[["2021", "Founded"], ["500+", "Products"], ["10,000+", "Happy Customers"], ["Jaipur", "Headquarters"]].map(([n, l]) => (
//             <div className="stat-box" key={l}>
//                 <h3>{n}</h3>
//                 <p>{l}</p>
//             </div>
//             ))}
//         </div>
//         </div>
//     );
//     }

//     // ── Contact Page ──
//     function Contact() {
//     const [form, setForm] = useState({ name: "", email: "", message: "" });

//     return (
//         <div className="page-content">
//         <div className="shop-hero">
//             <h1>Get in Touch</h1>
//             <p>We'd love to hear from you</p>
//         </div>
//         <div className="contact-grid">
//             <div className="contact-info">
//             <h2>Contact Information</h2>
//             <div className="contact-item">📧 <a href="mailto:info@rayfineornates.com">info@rayfineornates.com</a></div>
//             <div className="contact-item">📞 <a href="tel:+918112240112">+91 8112240112</a></div>
//             <div className="contact-item">📍 Johari Bazar, Jaipur 302003<br />(10:30 AM – 8:30 PM)</div>
//             <div className="social-links">
//                 <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
//                 <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
//                 <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
//             </div>
//             </div>
//             <div className="contact-form">
//             <input placeholder="Your Name" value={form.name}
//                 onChange={e => setForm({ ...form, name: e.target.value })} />
//             <input placeholder="Your Email" value={form.email}
//                 onChange={e => setForm({ ...form, email: e.target.value })} />
//             <textarea placeholder="Your Message" rows={5} value={form.message}
//                 onChange={e => setForm({ ...form, message: e.target.value })} />
//             <button className="btn-primary" onClick={() => alert("Message sent! We'll get back to you soon.")}>
//                 Send Message
//             </button>
//             </div>
//         </div>
//         </div>
//     );
//     }

//     // ── Footer ──
//     function Footer() {
//     return (
//         <footer className="footer">
//         <div className="footer-grid">
//             <div>
//             <h4>Ray Fine Ornates</h4>
//             <p>Luxury fashion jewellery crafted for the modern woman. Based in Jaipur, India.</p>
//             </div>
//             <div>
//             <h4>Quick Links</h4>
//             <Link to="/">Home</Link>
//             <Link to="/shop">Shop</Link>
//             <Link to="/about">About Us</Link>
//             <Link to="/contact">Contact</Link>
//             </div>
//             <div>
//             <h4>Categories</h4>
//             {["Earrings", "Necklaces", "Bracelets", "Rings", "Anklets"].map(c => (
//                 <Link to="/shop" key={c}>{c}</Link>
//             ))}
//             </div>
//             <div>
//             <h4>Contact</h4>
//             <p>info@rayfineornates.com</p>
//             <p>+91 8112240112</p>
//             <p>Johari Bazar, Jaipur</p>
//             </div>
//         </div>
//         <div className="footer-bottom">
//             <p>© 2021 Ray Fine Ornates. All rights reserved.</p>
//         </div>
//         </footer>
//     );
//     }

//     // ── App Root ──
//     // function AppInner() {
//     // const [cart, setCart] = useState([]);
//     // const [wishlist, setWishlist] = useState([]);
//     // const [cartOpen, setCartOpen] = useState(false);

//     // return (
//     //     <>
//     //     <Navbar cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} />
//     //     <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />
//     //     <Routes>
//     //         <Route path="/" element={<Home cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//     //         <Route path="/shop" element={<Shop cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//     //         <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
//     //         <Route path="/about" element={<About />} />
//     //         <Route path="/contact" element={<Contact />} />
//     //         <Route path="/login" element={<Login />} />
//     //     <Route path="/admin" element={<Admin />} />
//     //     </Routes>
//     //     <Footer />
//     //     </>
//     // );
//     // }
//     function AppInner() {
//     const [cart, setCart] = useState([]);
//     const [wishlist, setWishlist] = useState([]);
//     const [cartOpen, setCartOpen] = useState(false);
//     const loc = useLocation();

//     const isAdminPage = loc.pathname === "/admin" || loc.pathname === "/login";

//     return (
//         <>
//         {!isAdminPage && <Navbar cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} />}
//         {!isAdminPage && <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />}
//         <Routes>
//             <Route path="/" element={<Home cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//             <Route path="/shop" element={<Shop cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//             <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/admin" element={<Admin />} />
//         </Routes>
//         {!isAdminPage && <Footer />}
//         </>
//     );
//     }
//     export default function App() {
//     return <BrowserRouter><AppInner /></BrowserRouter>;
// import { useEffect, useState } from "react";
//     import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
//     import "./App.css";
//     import Login from "./login";
//     import Admin from "./Admin";

//     const FEATURED = [
//     { id: 1, name: "Silver Palm Beaded Anklets", price: 330,description: "Elegant silver anklets with delicate bead detailing.", originalPrice: 450, category: "Anklet", image: "https://rayfineornates.com/wp-content/uploads/2021/07/1-scaled-e1625215263636-300x300.jpg" },
//     { id: 2, name: "Aalya Ring", price: 1326, originalPrice: 1600, category: "Ring", image: "https://rayfineornates.com/wp-content/uploads/2021/07/10a-300x300.jpg" },
//     { id: 3, name: "Baguette Bracelet", price: 1570, originalPrice: null, category: "Bracelet", image: "https://rayfineornates.com/wp-content/uploads/2021/08/2-1-300x300.jpg" },
//     { id: 4, name: "Isla Mini Hoop", price: 1025, originalPrice: 1200, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/3A-1-scaled-1-300x300.jpg" },
//     { id: 5, name: "Torso Oval Earring", price: 1550, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/2c-scaled-e1619944411396-300x300.jpg" },
//     { id: 6, name: "Mia Stud", price: 2750, originalPrice: 3200, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/07/spot-shop-1-300x285.jpg" },
//     { id: 7, name: "Madonna in Green", price: 1777, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/08/3a-1-300x300.jpg" },
//     { id: 8, name: "Cleo", price: 1350, originalPrice: 1600, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/2-copy-4-scaled-e1620057018882-295x300.jpg" },
//     { id: 9, name: "Sage Polki Stud", price: 1513, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/08/3-300x300.jpg" },
//     { id: 10, name: "Aventurine Bracelet", price: 1025, originalPrice: 1300, category: "Bracelet", image: "https://rayfineornates.com/wp-content/uploads/2021/07/15a-300x300.jpg" },
//     { id: 11, name: "Fitore Stud", price: 2100, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/DSC00406-300x300.jpg" },
//     { id: 12, name: "Hermosa Earring", price: 1770, originalPrice: 2000, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/16-263x300.jpg" },
//     { id: 13, name: "Sukayanah Dangler", price: 2500, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/1a-300x300.jpg" },
//     { id: 14, name: "Marceline Earring", price: 1670, originalPrice: 1900, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/13-300x300.jpg" },
//     { id: 15, name: "Eloise Necklace Set", price: 2780, originalPrice: null, category: "Necklace", image: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC08595-1-300x300.jpg" },
//     { id: 16, name: "Arbre Silver Stud", price: 1290, originalPrice: 1500, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC00383-copy-300x300.jpg" },
//     ];

//     const CATEGORIES = ["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet"];

//     const WALLPAPERS = [
//     "https://images.unsplash.com/photo-1617038260897-41a1f14a0d7b?auto=format&fit=crop&w=1600&q=80",
//     "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
//     "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=80",
//     "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1600&q=80",
//     ];

//     // ── Announcement Bar ──
//     function AnnouncementBar() {
//     const messages = [
//         "🎁 Get Additional 15% Discount — Use Code GIFT15",
//         "🚚 Free Express Delivery on All Orders"
        
//     ];
//     const [idx, setIdx] = useState(0);
//     useEffect(() => {
//         const t = setInterval(() => setIdx(p => (p + 1) % messages.length), 3000);
//         return () => clearInterval(t);
//     }, []);
//     return (
//         <div className="announcement-bar">
//         <span key={idx} className="announcement-text">{messages[idx]}</span>
//         </div>
//     );
//     }

    
// // ── Navbar ──
//     function Navbar({ cart, wishlist, onCartOpen }) {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const loc = useLocation();

//     return (
//         <nav className="navbar">
//         <Link to="/" className="navbar-logo">
//             <img
//             src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png"
//             alt="Ray Fine Ornates"
//             style={{ height: "50px", objectFit: "contain" }}
//             />
//         </Link>
//         <div className={`nav-links ${menuOpen ? "open" : ""}`}>
//             <Link to="/" className={loc.pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>Home</Link>
//             <Link to="/shop" className={loc.pathname === "/shop" ? "active" : ""} onClick={() => setMenuOpen(false)}>Shop</Link>
//             <Link to="/shop?cat=sale" onClick={() => setMenuOpen(false)}>Sale</Link>
//             <Link to="/about" className={loc.pathname === "/about" ? "active" : ""} onClick={() => setMenuOpen(false)}>About</Link>
//             <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""} onClick={() => setMenuOpen(false)}>Contact</Link>
//         </div>
//         <div className="nav-actions">
//             <Link to="/wishlist" className="nav-icon" title="Wishlist">
//             🤍 <span className="badge">{wishlist.length}</span>
//             </Link>
//             <button className="nav-icon cart-btn" onClick={onCartOpen}>
//             🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
//             </button>

//             {/* 👇 Sirf ye add kiya hai */}
//             <Link to="/admin" className="nav-icon" title="Admin Panel">
//             👤
//             </Link>

//             <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
//         </div>
//         </nav>
//     );
//     }

//         // ── Cart Drawer ──
//         function CartDrawer({ cart, setCart, open, onClose }) {
//         const [customer, setCustomer] = useState({ name: "", address: "", phone: "" });
//         const [step, setStep] = useState("cart");

//         const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
//         const savings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);

//         const updateQty = (id, delta) => {
//             setCart(prev => prev
//             .map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p)
//             .filter(p => p.quantity > 0)
//             );
//         };

//         const placeOrder = async () => {
//             if (!customer.name || !customer.phone) {
//             alert("Please fill name and phone");
//             return;
//         }
//         try {
//         const response = await fetch("http://127.0.0.1:5000/api/create-order", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ amount: total })
//         });
//         const order = await response.json();
//         const options = {
//             key: "YOUR_KEY_ID",
//             amount: order.amount,
//             currency: "INR",
//             name: "Ray Fine Ornates",
//             description: "Jewellery Purchase",
//             order_id: order.id,
//             handler: function () {
//             alert("Payment Successful ✅");
//             setCart([]);
//             setStep("cart");
//             onClose();
//             },
//             prefill: { name: customer.name, contact: customer.phone },
//             theme: { color: "#7B2E3E" }
//         };
//         const razor = new window.Razorpay(options);
//         razor.open();
//         } catch {
//         alert("Could not connect to server");
//         }
//     };

//     return (
//         <>
//         <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose} />
//         <div className={`cart-drawer ${open ? "open" : ""}`}>
//             <div className="cart-header">
//             <h3>{step === "cart" ? `Your Cart (${cart.length})` : "Checkout"}</h3>
//             <button className="cart-close" onClick={onClose}>✕</button>
//             </div>

//             {step === "cart" ? (
//             <>
//                 {cart.length === 0
//                 ? (
//                     <div className="cart-empty">
//                     <p>🛒 Your cart is empty</p>
//                     <Link to="/shop" className="btn-primary" style={{ display: "inline-block", marginTop: "16px" }} onClick={onClose}>
//                         Shop Now
//                     </Link>
//                     </div>
//                 )
//                 : cart.map(item => (
//                     <div className="cart-item" key={item.id}>
//                     <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/72x72?text=Item"} />
//                     <div className="cart-item-info">
//                         <p className="cart-item-name">{item.name}</p>
//                         <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                         <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
//                         {item.originalPrice && <p className="cart-item-original">₹{item.originalPrice.toLocaleString()}</p>}
//                         </div>
//                         <div className="qty-controls">
//                         <button onClick={() => updateQty(item.id, -1)}>−</button>
//                         <span>{item.quantity}</span>
//                         <button onClick={() => updateQty(item.id, 1)}>+</button>
//                         </div>
//                     </div>
//                     <button className="cart-item-remove" onClick={() => updateQty(item.id, -item.quantity)}>🗑</button>
//                     </div>
//                 ))
//                 }
//                 {cart.length > 0 && (
//                 <div className="cart-footer">
//                     {savings > 0 && <div className="cart-savings">🎉 You save ₹{savings.toLocaleString()}!</div>}
//                     <div className="cart-total">
//                     <span>Total</span>
//                     <strong>₹{total.toLocaleString()}</strong>
//                     </div>
//                     <button className="btn-checkout" onClick={() => setStep("checkout")}>
//                     Proceed to Checkout →
//                     </button>
//                 </div>
//                 )}
//             </>
//             ) : (
//             <div className="checkout-form">
//                 <h4 style={{ color: "#7B2E3E", marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px" }}>
//                 Delivery Details
//                 </h4>
//                 <input placeholder="Full Name *" value={customer.name}
//                 onChange={e => setCustomer({ ...customer, name: e.target.value })} />
//                 <input placeholder="Phone Number *" value={customer.phone}
//                 onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
//                 <input placeholder="Delivery Address" value={customer.address}
//                 onChange={e => setCustomer({ ...customer, address: e.target.value })} />

//                 <div className="order-summary">
//                 <h5>Order Summary</h5>
//                 {cart.map(item => (
//                     <div key={item.id} className="order-summary-item">
//                     <span>{item.name} × {item.quantity}</span>
//                     <span>₹{(item.price * item.quantity).toLocaleString()}</span>
//                     </div>
//                 ))}
//                 <div className="order-summary-total">
//                     <span>Total</span>
//                     <strong>₹{total.toLocaleString()}</strong>
//                 </div>
//                 </div>

//                 <button className="btn-checkout" onClick={placeOrder}>
//                 Pay ₹{total.toLocaleString()} →
//                 </button>
//                 <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
//             </div>
//             )}
//         </div>
//         </>
//     );
//     }

//     // ── Product Card ──
//     function ProductCard({ product, cart, setCart, wishlist, setWishlist }) {
//     const inWishlist = wishlist.find(w => w.id === product.id);
//     const inCart = cart.find(c => c.id === product.id);
//     const discount = product.originalPrice
//         ? Math.round((1 - product.price / product.originalPrice) * 100)
//         : null;

//     const addToCart = () => {
//         if (inCart) setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
//         else setCart([...cart, { ...product, quantity: 1 }]);
//     };

//     const toggleWishlist = () => {
//         if (inWishlist) setWishlist(wishlist.filter(w => w.id !== product.id));
//         else setWishlist([...wishlist, product]);
//     };

//     return (
//         <div className="product-card">
//         <div className="product-img-wrap">
//             <img src={product.image} alt={product.name}
//             onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }} />
//             <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}
//             title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
//             {inWishlist ? "❤️" : "🤍"}
//             </button>
//             {discount && <div className="sale-badge">-{discount}%</div>}
//             <div className="product-category-tag">{product.category}</div>
//         </div>
//         <div className="product-info">
//             <h4>{product.name}</h4>

//         <p className="product-desc">
//         {product.description}
//         </p>

//             <div className="price-wrap">
//             <span className="price-current">₹{product.price.toLocaleString()}</span>
//             {product.originalPrice && (
//                 <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
//             )}
//             </div>
//             <button className={`btn-add-cart ${inCart ? "added" : ""}`} onClick={addToCart}>
//             {inCart ? "✓ Added to Cart" : "Add to Cart"}
//             </button>
//         </div>
//         </div>
//     );
//     }

//     // ── Home Page ──
//     function Home({ cart, setCart, wishlist, setWishlist }) {
//     const [bgIndex, setBgIndex] = useState(0);

//     useEffect(() => {
//         const t = setInterval(() => setBgIndex(p => (p + 1) % WALLPAPERS.length), 5000);
//         return () => clearInterval(t);
//     }, []);

//     return (
//         <>
//         <section className="hero" style={{ backgroundImage: `url(${WALLPAPERS[bgIndex]})` }}>
//             <div className="hero-overlay">
//             <p className="hero-sub">New Collection 2024</p>
//             <h1>Elegance<br />Redefined</h1>
//             <p className="hero-desc">Luxury fashion jewellery crafted for the modern woman</p>
//             <div className="hero-btns">
//                 <Link to="/shop" className="btn-primary">Shop Now</Link>
//                 <Link to="/about" className="btn-outline">Our Story</Link>
//             </div>
//             </div>
//             <div className="hero-dots">
//             {WALLPAPERS.map((_, i) => (
//                 <span key={i} className={`dot ${i === bgIndex ? "active" : ""}`} onClick={() => setBgIndex(i)} />
//             ))}
//             </div>
//         </section>

//         {/* Sale Banner */}
//         <div className="sale-banner">
//             <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
//             <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
//         </div>

//         {/* Categories */}
//         <section className="categories-section">
//             <h2 className="section-title">Shop by Category</h2>
//             <div className="categories-grid">
//             {[
//                 { name: "Earrings", img: "https://rayfineornates.com/wp-content/uploads/2021/06/3A-1-scaled-1-300x300.jpg", path: "/shop?cat=Earring" },
//                 { name: "Necklaces", img: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC08595-1-300x300.jpg", path: "/shop?cat=Necklace" },
//                 { name: "Bracelets", img: "https://rayfineornates.com/wp-content/uploads/2021/08/2-1-300x300.jpg", path: "/shop?cat=Bracelet" },
//                 { name: "Rings", img: "https://rayfineornates.com/wp-content/uploads/2021/07/10a-300x300.jpg", path: "/shop?cat=Ring" },
//             ].map(cat => (
//                 <Link to={cat.path} key={cat.name} className="category-card">
//                 <img src={cat.img} alt={cat.name} />
//                 <div className="category-overlay"><span>{cat.name}</span></div>
//                 </Link>
//             ))}
//             </div>
//         </section>

//         {/* Featured */}
//         <section className="featured-section">
//             <h2 className="section-title">Trending Now</h2>
//             <div className="products-grid">
//             {FEATURED.slice(0, 8).map(p => (
//                 <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
//                 wishlist={wishlist} setWishlist={setWishlist} />
//             ))}
//             </div>
//             <div style={{ textAlign: "center", marginTop: "40px" }}>
//             <Link to="/shop" className="btn-primary">View All Products</Link>
//             </div>
//         </section>

//         {/* Testimonials */}
//         <section className="testimonials-section">
//             <h2 className="section-title">What Our Customers Say</h2>
//             <div className="testimonials-grid">
//             {[
//                 { name: "Ms. Heena Gupta", text: "When it arrived, it was exactly as shown. So pretty. Very happy with my purchase!", product: "Katherine Bracelet" },
//                 { name: "Ms. Bhavika Kakurlawala", text: "The earrings are awesome & the bracelet is so elegant and easy to wear! Both pieces are just lovely.", product: "Swarovski Pearl Bracelet" },
//                 { name: "Ms. Tanya", text: "Found the most perfect gift! The moonstone was her sunshine stone. She was so happy.", product: "Multi Moonlight Bracelet" },
//             ].map((t, i) => (
//                 <div className="testimonial-card" key={i}>
//                 <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
//                 <p className="testimonial-text">"{t.text}"</p>
//                 <p className="testimonial-name">{t.name}</p>
//                 <p className="testimonial-product">{t.product}</p>
//                 </div>
//             ))}
//             </div>
//         </section>
//         </>
//     );
//     }

//     // ── Shop Page ──
//     function Shop({ cart, setCart, wishlist, setWishlist }) {
//     const [searchParams] = useSearchParams();
//     const [category, setCategory] = useState(searchParams.get("cat") || "All");
//     const [search, setSearch] = useState("");
//     const [sort, setSort] = useState("default");
//     const [dbProducts, setDbProducts] = useState([]);

//     useEffect(() => {
//         fetch("http://127.0.0.1:5000/api/products")
//         .then(r => r.json())
//         .then(d => { if (d.success) setDbProducts(d.data.map((p, i) => ({ ...p, id: p._id || i }))); })
//         .catch(() => {});
//     }, []);

//     const allProducts = [...FEATURED, ...dbProducts];

//     let filtered = allProducts.filter(p => {
//         const matchCat = category === "All" || category === "sale"
//         ? (category === "sale" ? p.originalPrice : true)
//         : p.category === category;
//         const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
//         return matchCat && matchSearch;
//     });

//     if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
//     if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

//     return (
//         <div className="shop-page">
//         <div className="shop-hero">
//             <h1>Our Collection</h1>
//             <p>Discover timeless pieces crafted with love</p>
//         </div>

//         <div className="shop-controls">
//             <input className="shop-search" placeholder="🔍 Search jewellery..."
//             value={search} onChange={e => setSearch(e.target.value)} />
//             <select className="shop-sort" value={sort} onChange={e => setSort(e.target.value)}>
//             <option value="default">Sort: Featured</option>
//             <option value="low">Price: Low to High</option>
//             <option value="high">Price: High to Low</option>
//             </select>
//         </div>

//         <div className="category-tabs">
//             {[...CATEGORIES, "Sale 🔥"].map(cat => (
//             <button key={cat}
//                 className={`cat-tab ${(cat === "Sale 🔥" ? category === "sale" : category === cat) ? "active sale-tab" : ""}`}
//                 onClick={() => setCategory(cat === "Sale 🔥" ? "sale" : cat)}>
//                 {cat}
//             </button>
//             ))}
//         </div>

//         <div className="products-grid" style={{ padding: "0 40px 80px" }}>
//             {filtered.map(p => (
//             <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
//                 wishlist={wishlist} setWishlist={setWishlist} />
//             ))}
//         </div>

//         {filtered.length === 0 && (
//             <p style={{ textAlign: "center", color: "#999", padding: "60px" }}>No products found.</p>
//         )}
//         </div>
//     );
//     }

//     // ── Wishlist Page ──
//     function Wishlist({ wishlist, setWishlist, cart, setCart }) {
//     return (
//         <div className="shop-page">
//         <div className="shop-hero">
//             <h1>Your Wishlist</h1>
//             <p>{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
//         </div>
//         {wishlist.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "80px 20px" }}>
//             <p style={{ color: "#999", fontSize: "18px", marginBottom: "24px" }}>No items in wishlist yet 🤍</p>
//             <Link to="/shop" className="btn-primary">Explore Collection</Link>
//             </div>
//         ) : (
//             <div className="products-grid" style={{ padding: "40px" }}>
//             {wishlist.map(p => (
//                 <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
//                 wishlist={wishlist} setWishlist={setWishlist} />
//             ))}
//             </div>
//         )}
//         </div>
//     );
//     }

//     // ── About Page ──
//     function About() {
//     return (
//         <div className="page-content">
//         <div className="shop-hero">
//             <h1>Our Story</h1>
//             <p>Crafting elegance since 2021</p>
//         </div>
//         <div className="about-grid">
//             <div className="about-text">
//             <h2>Who We Are</h2>
//             <p>Ray Fine Ornates is a luxury fashion jewellery brand based in the heart of Johari Bazar, Jaipur — India's jewellery capital. We believe every woman deserves to feel like royalty.</p>
//             <p>Our pieces are crafted with precision, using the finest materials to create jewellery that is both timeless and contemporary. From delicate studs to statement necklaces, each piece tells a story.</p>
//             <h2>Our Promise</h2>
//             <p>Quality you can feel. Beauty you can see. Service you can trust. We stand behind every piece we create with our dedication to craftsmanship and customer satisfaction.</p>
//             </div>
//             <div className="about-image">
//             <img src="https://rayfineornates.com/wp-content/uploads/2021/10/shotshop_ray02.webp" alt="Ray Fine Ornates" />
//             </div>
//         </div>
//         <div className="about-stats">
//             {[["2021", "Founded"], ["500+", "Products"], ["10,000+", "Happy Customers"], ["Jaipur", "Headquarters"]].map(([n, l]) => (
//             <div className="stat-box" key={l}>
//                 <h3>{n}</h3>
//                 <p>{l}</p>
//             </div>
//             ))}
//         </div>
//         </div>
//     );
//     }

//     // ── Contact Page ──
//     function Contact() {
//     const [form, setForm] = useState({ name: "", email: "", message: "" });
//     return (
//         <div className="page-content">
//         <div className="shop-hero">
//             <h1>Get in Touch</h1>
//             <p>We'd love to hear from you</p>
//         </div>
//         <div className="contact-grid">
//             <div className="contact-info">
//             <h2>Contact Information</h2>
//             <div className="contact-item">📧 <a href="mailto:info@rayfineornates.com">info@rayfineornates.com</a></div>
//             <div className="contact-item">📞 <a href="tel:+918112240112">+91 8112240112</a></div>
//             <div className="contact-item">📍 Johari Bazar, Jaipur 302003<br />(10:30 AM – 8:30 PM)</div>
//             <div className="social-links">
//                 <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
//                 <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
//                 <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
//             </div>
//             </div>
//             <div className="contact-form">
//             <input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
//             <input placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
//             <textarea placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
//             <button className="btn-primary" onClick={() => alert("Message sent! We'll get back to you soon.")}>Send Message</button>
//             </div>
//         </div>
//         </div>
//     );
//     }

//     // ── Footer ──
//     function Footer() {
//     return (
//         <footer className="footer">
//         <div className="footer-top">
//             <p>🚚 Free Express Delivery &nbsp;|&nbsp; ✨ Use Code <strong>GIFT15</strong> for 15% Off &nbsp;|&nbsp; 🔄 Easy Returns</p>
//         </div>
//         <div className="footer-grid">
//             <div>
//             <h4>Ray Fine Ornates</h4>
//             <p>Luxury fashion jewellery crafted for the modern woman. Based in Jaipur, India.</p>
//             <div className="footer-social">
//                 <a href="https://www.instagram.com/rayfineornates/" target="_blank" rel="noreferrer">Instagram</a>
//                 <a href="https://www.facebook.com/rayfineornatesjewellery" target="_blank" rel="noreferrer">Facebook</a>
//                 <a href="https://in.pinterest.com/rayfineornates/" target="_blank" rel="noreferrer">Pinterest</a>
//             </div>
//             </div>
//             <div>
//             <h4>Quick Links</h4>
//             <Link to="/">Home</Link>
//             <Link to="/shop">Shop</Link>
//             <Link to="/shop?cat=sale">Sale</Link>
//             <Link to="/about">About Us</Link>
//             <Link to="/contact">Contact</Link>
//             </div>
//             <div>
//             <h4>Categories</h4>
//             {["Earrings", "Necklaces", "Bracelets", "Rings", "Anklets"].map(c => (
//                 <Link to="/shop" key={c}>{c}</Link>
//             ))}
//             </div>
//             <div>
//             <h4>Contact</h4>
//             <p>info@rayfineornates.com</p>
//             <p>+91 8112240112</p>
//             <p>Johari Bazar, Jaipur 302003</p>
//             <p>10:30 AM – 8:30 PM</p>
//             </div>
//         </div>
//         <div className="footer-bottom">
//             <p>© 2021 Ray Fine Ornates. All rights reserved. | Designed with ❤️ in Jaipur</p>
//         </div>
//         </footer>
//     );
//     }

//     // ── App Root ──
//     function AppInner() {
//     const [cart, setCart] = useState([]);
//     const [wishlist, setWishlist] = useState([]);
//     const [cartOpen, setCartOpen] = useState(false);
//     const loc = useLocation();
//     const isAdminPage = loc.pathname === "/admin" || loc.pathname === "/login";

//     return (
//         <>
//         {!isAdminPage && <AnnouncementBar />}
//         {!isAdminPage && <Navbar cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} />}
//         {!isAdminPage && <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />}
//         <Routes>
//             <Route path="/" element={<Home cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//             <Route path="/shop" element={<Shop cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
//             <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/admin" element={<Admin />} />
//         </Routes>
//         {!isAdminPage && <Footer />}
//         </>
//     );
//     }

//     export default function App() {
//     return <BrowserRouter><AppInner /></BrowserRouter>;
//     }
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Admin from "./Admin";

    const FEATURED = [
    { id: 1, name: "Silver Palm Beaded Anklets", price: 330, description: "Elegant silver anklets with delicate bead detailing.", originalPrice: 450, category: "Anklet", image: "https://rayfineornates.com/wp-content/uploads/2021/07/1-scaled-e1625215263636-300x300.jpg" },
    { id: 2, name: "Aalya Ring", price: 1326, originalPrice: 1600, category: "Ring", image: "https://rayfineornates.com/wp-content/uploads/2021/07/10a-300x300.jpg" },
    { id: 3, name: "Baguette Bracelet", price: 1570, originalPrice: null, category: "Bracelet", image: "https://rayfineornates.com/wp-content/uploads/2021/08/2-1-300x300.jpg" },
    { id: 4, name: "Isla Mini Hoop", price: 1025, originalPrice: 1200, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/3A-1-scaled-1-300x300.jpg" },
    { id: 5, name: "Torso Oval Earring", price: 1550, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/2c-scaled-e1619944411396-300x300.jpg" },
    { id: 6, name: "Mia Stud", price: 2750, originalPrice: 3200, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/07/spot-shop-1-300x285.jpg" },
    { id: 7, name: "Madonna in Green", price: 1777, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/08/3a-1-300x300.jpg" },
    { id: 8, name: "Cleo", price: 1350, originalPrice: 1600, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/06/2-copy-4-scaled-e1620057018882-295x300.jpg" },
    { id: 9, name: "Sage Polki Stud", price: 1513, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2021/08/3-300x300.jpg" },
    { id: 10, name: "Aventurine Bracelet", price: 1025, originalPrice: 1300, category: "Bracelet", image: "https://rayfineornates.com/wp-content/uploads/2021/07/15a-300x300.jpg" },
    { id: 11, name: "Fitore Stud", price: 2100, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/DSC00406-300x300.jpg" },
    { id: 12, name: "Hermosa Earring", price: 1770, originalPrice: 2000, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/16-263x300.jpg" },
    { id: 13, name: "Sukayanah Dangler", price: 2500, originalPrice: null, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/1a-300x300.jpg" },
    { id: 14, name: "Marceline Earring", price: 1670, originalPrice: 1900, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/05/13-300x300.jpg" },
    { id: 15, name: "Eloise Necklace Set", price: 2780, originalPrice: null, category: "Necklace", image: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC08595-1-300x300.jpg" },
    { id: 16, name: "Arbre Silver Stud", price: 1290, originalPrice: 1500, category: "Earring", image: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC00383-copy-300x300.jpg" },
    ];

    const CATEGORIES = ["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet"];

    const WALLPAPERS = [
    "https://images.unsplash.com/photo-1617038260897-41a1f14a0d7b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1600&q=80",
    ];

    // ── FIX: messages ko component ke bahar rakha ──
    const ANNOUNCEMENT_MESSAGES = [
    "🎁 Get Additional 15% Discount — Use Code GIFT15",
    "🚚 Free Express Delivery on All Orders",
    ];

    // ── Announcement Bar ──
    function AnnouncementBar() {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIdx(p => (p + 1) % ANNOUNCEMENT_MESSAGES.length), 3000);
        return () => clearInterval(t);
    }, []); // ✅ warning gone — ANNOUNCEMENT_MESSAGES is a constant outside component
    return (
        <div className="announcement-bar">
        <span key={idx} className="announcement-text">{ANNOUNCEMENT_MESSAGES[idx]}</span>
        </div>
    );
    }

    // ── Navbar ──
    function Navbar({ cart, wishlist, onCartOpen }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const loc = useLocation();

    return (
        <nav className="navbar">
        <Link to="/" className="navbar-logo">
            <img
            src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png"
            alt="Ray Fine Ornates"
            style={{ height: "50px", objectFit: "contain" }}
            />
        </Link>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <Link to="/" className={loc.pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/shop" className={loc.pathname === "/shop" ? "active" : ""} onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/shop?cat=sale" onClick={() => setMenuOpen(false)}>Sale</Link>
            <Link to="/about" className={loc.pathname === "/about" ? "active" : ""} onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""} onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
        <div className="nav-actions">
            <Link to="/wishlist" className="nav-icon" title="Wishlist">
            🤍 <span className="badge">{wishlist.length}</span>
            </Link>
            <button className="nav-icon cart-btn" onClick={onCartOpen}>
            🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
            </button>
            <Link to="/admin" className="nav-icon" title="Admin Panel">
            👤
            </Link>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
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

    const updateQty = (id, delta) => {
        setCart(prev => prev
        .map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p)
        .filter(p => p.quantity > 0)
        );
    };

    const placeOrder = async () => {
        if (!customer.name || !customer.phone) {
        alert("Please fill name and phone");
        return;
        }
        try {
        const response = await fetch("http://127.0.0.1:5000/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total })
        });
        const order = await response.json();
        const options = {
            key: "YOUR_KEY_ID",
            amount: order.amount,
            currency: "INR",
            name: "Ray Fine Ornates",
            description: "Jewellery Purchase",
            order_id: order.id,
            handler: function () {
            alert("Payment Successful ✅");
            setCart([]);
            setStep("cart");
            onClose();
            },
            prefill: { name: customer.name, contact: customer.phone },
            theme: { color: "#7B2E3E" }
        };
        const razor = new window.Razorpay(options);
        razor.open();
        } catch {
        alert("Could not connect to server");
        }
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
            <>
                {cart.length === 0
                ? (
                    <div className="cart-empty">
                    <p>🛒 Your cart is empty</p>
                    <Link to="/shop" className="btn-primary" style={{ display: "inline-block", marginTop: "16px" }} onClick={onClose}>
                        Shop Now
                    </Link>
                    </div>
                )
                : cart.map(item => (
                    <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/72x72?text=Item"} />
                    <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                        {item.originalPrice && <p className="cart-item-original">₹{item.originalPrice.toLocaleString()}</p>}
                        </div>
                        <div className="qty-controls">
                        <button onClick={() => updateQty(item.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                    </div>
                    <button className="cart-item-remove" onClick={() => updateQty(item.id, -item.quantity)}>🗑</button>
                    </div>
                ))
                }
                {cart.length > 0 && (
                <div className="cart-footer">
                    {savings > 0 && <div className="cart-savings">🎉 You save ₹{savings.toLocaleString()}!</div>}
                    <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{total.toLocaleString()}</strong>
                    </div>
                    <button className="btn-checkout" onClick={() => setStep("checkout")}>
                    Proceed to Checkout →
                    </button>
                </div>
                )}
            </>
            ) : (
            <div className="checkout-form">
                <h4 style={{ color: "#7B2E3E", marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px" }}>
                Delivery Details
                </h4>
                <input placeholder="Full Name *" value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })} />
                <input placeholder="Phone Number *" value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
                <input placeholder="Delivery Address" value={customer.address}
                onChange={e => setCustomer({ ...customer, address: e.target.value })} />

                <div className="order-summary">
                <h5>Order Summary</h5>
                {cart.map(item => (
                    <div key={item.id} className="order-summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
                <div className="order-summary-total">
                    <span>Total</span>
                    <strong>₹{total.toLocaleString()}</strong>
                </div>
                </div>

                <button className="btn-checkout" onClick={placeOrder}>
                Pay ₹{total.toLocaleString()} →
                </button>
                <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
            </div>
            )}
        </div>
        </>
    );
    }

    // ── Product Card ──
    function ProductCard({ product, cart, setCart, wishlist, setWishlist }) {
    const inWishlist = wishlist.find(w => w.id === product.id);
    const inCart = cart.find(c => c.id === product.id);
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;

    const addToCart = () => {
        if (inCart) setCart(cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
        else setCart([...cart, { ...product, quantity: 1 }]);
    };

    const toggleWishlist = () => {
        if (inWishlist) setWishlist(wishlist.filter(w => w.id !== product.id));
        else setWishlist([...wishlist, product]);
    };

    return (
        <div className="product-card">
        <div className="product-img-wrap">
            <img src={product.image} alt={product.name}
            onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }} />
            <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
            {inWishlist ? "❤️" : "🤍"}
            </button>
            {discount && <div className="sale-badge">-{discount}%</div>}
            <div className="product-category-tag">{product.category}</div>
        </div>
        <div className="product-info">
            <h4>{product.name}</h4>
            <p className="product-desc">{product.description}</p>
            <div className="price-wrap">
            <span className="price-current">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
                <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
            )}
            </div>
            <button className={`btn-add-cart ${inCart ? "added" : ""}`} onClick={addToCart}>
            {inCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>
        </div>
        </div>
    );
    }

    // ── Home Page ──
    function Home({ cart, setCart, wishlist, setWishlist }) {
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setBgIndex(p => (p + 1) % WALLPAPERS.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <>
        <section className="hero" style={{ backgroundImage: `url(${WALLPAPERS[bgIndex]})` }}>
            <div className="hero-overlay">
            <p className="hero-sub">New Collection 2024</p>
            <h1>Elegance<br />Redefined</h1>
            <p className="hero-desc">Luxury fashion jewellery crafted for the modern woman</p>
            <div className="hero-btns">
                <Link to="/shop" className="btn-primary">Shop Now</Link>
                <Link to="/about" className="btn-outline">Our Story</Link>
            </div>
            </div>
            <div className="hero-dots">
            {WALLPAPERS.map((_, i) => (
                <span key={i} className={`dot ${i === bgIndex ? "active" : ""}`} onClick={() => setBgIndex(i)} />
            ))}
            </div>
        </section>

        {/* Sale Banner */}
        <div className="sale-banner">
            <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
            <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
        </div>

        {/* Categories */}
        <section className="categories-section">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
            {[
                { name: "Earrings", img: "https://rayfineornates.com/wp-content/uploads/2021/06/3A-1-scaled-1-300x300.jpg", path: "/shop?cat=Earring" },
                { name: "Necklaces", img: "https://rayfineornates.com/wp-content/uploads/2022/04/DSC08595-1-300x300.jpg", path: "/shop?cat=Necklace" },
                { name: "Bracelets", img: "https://rayfineornates.com/wp-content/uploads/2021/08/2-1-300x300.jpg", path: "/shop?cat=Bracelet" },
                { name: "Rings", img: "https://rayfineornates.com/wp-content/uploads/2021/07/10a-300x300.jpg", path: "/shop?cat=Ring" },
            ].map(cat => (
                <Link to={cat.path} key={cat.name} className="category-card">
                <img src={cat.img} alt={cat.name} />
                <div className="category-overlay"><span>{cat.name}</span></div>
                </Link>
            ))}
            </div>
        </section>

        {/* Featured */}
        <section className="featured-section">
            <h2 className="section-title">Trending Now</h2>
            <div className="products-grid">
            {FEATURED.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
                wishlist={wishlist} setWishlist={setWishlist} />
            ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/shop" className="btn-primary">View All Products</Link>
            </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="testimonials-grid">
            {[
                { name: "Ms. Heena Gupta", text: "When it arrived, it was exactly as shown. So pretty. Very happy with my purchase!", product: "Katherine Bracelet" },
                { name: "Ms. Bhavika Kakurlawala", text: "The earrings are awesome & the bracelet is so elegant and easy to wear! Both pieces are just lovely.", product: "Swarovski Pearl Bracelet" },
                { name: "Ms. Tanya", text: "Found the most perfect gift! The moonstone was her sunshine stone. She was so happy.", product: "Multi Moonlight Bracelet" },
            ].map((t, i) => (
                <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
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
    const [dbProducts, setDbProducts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/products")
        .then(r => r.json())
        .then(d => { if (d.success) setDbProducts(d.data.map((p, i) => ({ ...p, id: p._id || i }))); })
        .catch(() => {});
    }, []);

    const allProducts = [...FEATURED, ...dbProducts];

    let filtered = allProducts.filter(p => {
        const matchCat = category === "All" || category === "sale"
        ? (category === "sale" ? p.originalPrice : true)
        : p.category === category;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

    return (
        <div className="shop-page">
        <div className="shop-hero">
            <h1>Our Collection</h1>
            <p>Discover timeless pieces crafted with love</p>
        </div>

        <div className="shop-controls">
            <input className="shop-search" placeholder="🔍 Search jewellery..."
            value={search} onChange={e => setSearch(e.target.value)} />
            <select className="shop-sort" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            </select>
        </div>

        <div className="category-tabs">
            {[...CATEGORIES, "Sale 🔥"].map(cat => (
            <button key={cat}
                className={`cat-tab ${(cat === "Sale 🔥" ? category === "sale" : category === cat) ? "active sale-tab" : ""}`}
                onClick={() => setCategory(cat === "Sale 🔥" ? "sale" : cat)}>
                {cat}
            </button>
            ))}
        </div>

        <div className="products-grid" style={{ padding: "0 40px 80px" }}>
            {filtered.map(p => (
            <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
                wishlist={wishlist} setWishlist={setWishlist} />
            ))}
        </div>

        {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#999", padding: "60px" }}>No products found.</p>
        )}
        </div>
    );
    }

    // ── Wishlist Page ──
    function Wishlist({ wishlist, setWishlist, cart, setCart }) {
    return (
        <div className="shop-page">
        <div className="shop-hero">
            <h1>Your Wishlist</h1>
            <p>{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
        </div>
        {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <p style={{ color: "#999", fontSize: "18px", marginBottom: "24px" }}>No items in wishlist yet 🤍</p>
            <Link to="/shop" className="btn-primary">Explore Collection</Link>
            </div>
        ) : (
            <div className="products-grid" style={{ padding: "40px" }}>
            {wishlist.map(p => (
                <ProductCard key={p.id} product={p} cart={cart} setCart={setCart}
                wishlist={wishlist} setWishlist={setWishlist} />
            ))}
            </div>
        )}
        </div>
    );
    }

    // ── About Page ──
    function About() {
    return (
        <div className="page-content">
        <div className="shop-hero">
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
            <img src="https://rayfineornates.com/wp-content/uploads/2021/10/shotshop_ray02.webp" alt="Ray Fine Ornates" />
            </div>
        </div>
        <div className="about-stats">
            {[["2021", "Founded"], ["500+", "Products"], ["10,000+", "Happy Customers"], ["Jaipur", "Headquarters"]].map(([n, l]) => (
            <div className="stat-box" key={l}>
                <h3>{n}</h3>
                <p>{l}</p>
            </div>
            ))}
        </div>
        </div>
    );
    }

    // ── Contact Page ──
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

    // ── Footer ──
    function Footer() {
    return (
        <footer className="footer">
        <div className="footer-top">
            <p>🚚 Free Express Delivery &nbsp;|&nbsp; ✨ Use Code <strong>GIFT15</strong> for 15% Off &nbsp;|&nbsp; 🔄 Easy Returns</p>
        </div>
        <div className="footer-grid">
            <div>
            <h4>Ray Fine Ornates</h4>
            <p>Luxury fashion jewellery crafted for the modern woman. Based in Jaipur, India.</p>
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
            </div>
            <div>
            <h4>Categories</h4>
            {["Earrings", "Necklaces", "Bracelets", "Rings", "Anklets"].map(c => (
                <Link to="/shop" key={c}>{c}</Link>
            ))}
            </div>
            <div>
            <h4>Contact</h4>
            <p>info@rayfineornates.com</p>
            <p>+91 8112240112</p>
            <p>Johari Bazar, Jaipur 302003</p>
            <p>10:30 AM – 8:30 PM</p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2021 Ray Fine Ornates. All rights reserved. | Designed with ❤️ in Jaipur</p>
        </div>
        </footer>
    );
    }

    // ── App Root ──
    function AppInner() {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const loc = useLocation();
    const isAdminPage = loc.pathname === "/admin" || loc.pathname === "/login";

    return (
        <>
        {!isAdminPage && <AnnouncementBar />}
        {!isAdminPage && <Navbar cart={cart} wishlist={wishlist} onCartOpen={() => setCartOpen(true)} />}
        {!isAdminPage && <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />}
        <Routes>
            <Route path="/" element={<Home cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
            <Route path="/shop" element={<Shop cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
            <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
        {!isAdminPage && <Footer />}
        </>
    );
    }

    export default function App() {
    return <BrowserRouter><AppInner /></BrowserRouter>;
    }
