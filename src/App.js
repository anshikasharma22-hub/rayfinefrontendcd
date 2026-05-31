import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from "react-router-dom";
import "./App.css";
import Login from "./login";
import Admin from "./Admin";
import Chatbot from "./Chatbot";
const FEATURED = [];
    const CATEGORIES = ["All", "Earring", "Necklace", "Bracelet", "Ring", "Anklet"];
    const WALLPAPERS = [
"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=80",
"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=80",
"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80"
    
    ];
    const ANNOUNCEMENT_MESSAGES = [
    "🎁 Get Additional 15% Discount — Use Code GIFT15",
    "🚚 Free Express Delivery on All Orders",
    ];

    // ── Product Modal (Full Screen) ──
    function ProductModal({ product, onClose, cart, setCart, wishlist, setWishlist }) {
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || "");
    const inWishlist = wishlist.find(w => w.id === product.id);
    const inCart = cart.find(
    c =>
        c.id === product.id &&
        c.selectedVariant === selectedVariant
);
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

    const addToCart = () => {
    if (!product.inStock) return;

    if (inCart) {
        setCart(
            cart.map(c =>
                c.id === product.id &&
                c.selectedVariant === selectedVariant
                    ? { ...c, quantity: c.quantity + 1 }
                    : c
            )
        );
    } else {
        setCart([
            ...cart,
            {
                ...product,
                quantity: 1,
                selectedVariant
            }
        ]);
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        onClick={onClose}>
        <div style={{ background: "#fff", borderRadius: "20px", maxWidth: "900px", width: "100%", maxHeight: "90vh", overflow: "auto", display: "flex", flexWrap: "wrap" }}
            onClick={e => e.stopPropagation()}>

            {/* Image */}
            <div style={{ flex: "1 1 350px", position: "relative" }}>
            <img src={product.image} alt={product.name}
                style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "20px 0 0 20px" }}
                onError={e => { e.target.src = "https://placehold.co/400x400?text=Jewellery"; }} />
            {!product.inStock && (
                <div style={{ position: "absolute", top: "16px", left: "16px", background: "#333", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 700 }}>
                Out of Stock
                </div>
            )}
            {discount && product.inStock && (
                <div style={{ position: "absolute", top: "16px", left: "16px", background: "#7B2E3E", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 700 }}>
                -{discount}% OFF
                </div>
            )}
            </div>

            {/* Details */}
            <div style={{ flex: "1 1 300px", padding: "32px" }}>
            <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#999" }}>✕</button>

            <div style={{ fontSize: "12px", color: "#c9a96e", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>{product.category}</div>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#1a0a0f", fontSize: "26px", marginBottom: "12px" }}>{product.name}</h2>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "24px", fontWeight: 700, color: "#7B2E3E" }}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice && <span style={{ textDecoration: "line-through", color: "#bbb", fontSize: "16px" }}>₹{product.originalPrice.toLocaleString()}</span>}
            </div>

            <p style={{ color: "#555", lineHeight: "1.7", marginBottom: "20px", fontSize: "14px" }}>{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Finish / Variant:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {product.variants.map(v => (
                    <button key={v} onClick={() => setSelectedVariant(v)} style={{
                        padding: "6px 14px", borderRadius: "20px", fontSize: "13px", cursor: "pointer",
                        background: selectedVariant === v ? "#7B2E3E" : "#f5f0eb",
                        color: selectedVariant === v ? "#fff" : "#333",
                        border: selectedVariant === v ? "2px solid #7B2E3E" : "2px solid #e0d8d0",
                        fontWeight: selectedVariant === v ? 700 : 400
                    }}>{v}</button>
                    ))}
                </div>
                </div>
            )}

            {/* Material */}
            {product.material && (
                <div style={{ marginBottom: "12px", fontSize: "13px", color: "#666" }}>
                <strong>Material:</strong> {product.material}
                </div>
            )}

            {/* Care */}
            {product.careInstructions && (
                <div style={{ marginBottom: "20px", fontSize: "13px", color: "#666", background: "#f9f5f0", padding: "12px", borderRadius: "8px" }}>
                <strong>✨ Care Instructions:</strong> {product.careInstructions}
                </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={addToCart} disabled={!product.inStock} style={{
                flex: 1, padding: "14px", borderRadius: "30px", border: "none", cursor: product.inStock ? "pointer" : "not-allowed",
                background: product.inStock ? "#7B2E3E" : "#ccc", color: "#fff", fontWeight: 700, fontSize: "15px"
                }}>
                {!product.inStock ? "Out of Stock" : inCart ? "✓ Added to Cart" : "Add to Cart"}
                </button>
                <button onClick={toggleWishlist} style={{
                padding: "14px 18px", borderRadius: "30px", border: "2px solid #7B2E3E",
                background: inWishlist ? "#7B2E3E" : "transparent", color: inWishlist ? "#fff" : "#7B2E3E",
                cursor: "pointer", fontSize: "18px"
                }}>
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
        const t = setInterval(() => setIdx(p => (p + 1) % ANNOUNCEMENT_MESSAGES.length), 3000);
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
    const loc = useLocation();
    return (
        <nav className="navbar">
        <Link to="/" className="navbar-logo">
            <img src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png" alt="Ray Fine Ornates" style={{ height: "50px", objectFit: "contain" }} />
        </Link>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <Link to="/" className={loc.pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/shop" className={loc.pathname === "/shop" ? "active" : ""} onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/shop?cat=sale" onClick={() => setMenuOpen(false)}>Sale</Link>
            <Link to="/about" className={loc.pathname === "/about" ? "active" : ""} onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className={loc.pathname === "/contact" ? "active" : ""} onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
        <div className="nav-actions">
            <Link to="/wishlist" className="nav-icon" title="Wishlist">🤍 <span className="badge">{wishlist.length}</span></Link>
            <button className="nav-icon cart-btn" onClick={onCartOpen}>🛒 <span className="badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span></button>
            <Link to="/admin" className="nav-icon" title="Admin Panel">👤</Link>
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
        setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + delta } : p).filter(p => p.quantity > 0));
    };

    const placeOrder = async () => {
        if (!customer.name || !customer.phone) { alert("Please fill name and phone"); return; }
        try {
        const response = await fetch("https://rayfinesite-3.onrender.com/api/create-order", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total })
        });
        const order = await response.json();
        const options = {
            key: "YOUR_KEY_ID", amount: order.amount, currency: "INR",
            name: "Ray Fine Ornates", description: "Jewellery Purchase", order_id: order.id,
            handler: function () { alert("Payment Successful ✅"); setCart([]); setStep("cart"); onClose(); },
            prefill: { name: customer.name, contact: customer.phone },
            theme: { color: "#7B2E3E" }
        };
        const razor = new window.Razorpay(options);
        razor.open();
        } catch { alert("Could not connect to server"); }
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
                {cart.length === 0 ? (
                <div className="cart-empty">
                    <p>🛒 Your cart is empty</p>
                    <Link to="/shop" className="btn-primary" style={{ display: "inline-block", marginTop: "16px" }} onClick={onClose}>Shop Now</Link>
                </div>
                ) : cart.map(item => (
                <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} onError={e => e.target.src = "https://placehold.co/72x72?text=Item"} />
                    <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    {item.selectedVariant && <p style={{ fontSize: "12px", color: "#888" }}>{item.selectedVariant}</p>}
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
                ))}
                {cart.length > 0 && (
                <div className="cart-footer">
                    {savings > 0 && <div className="cart-savings">🎉 You save ₹{savings.toLocaleString()}!</div>}
                    <div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
                    <button className="btn-checkout" onClick={() => setStep("checkout")}>Proceed to Checkout →</button>
                </div>
                )}
            </>
            ) : (
            <div className="checkout-form">
                <h4 style={{ color: "#7B2E3E", marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "20px" }}>Delivery Details</h4>
                <input placeholder="Full Name *" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
                <input placeholder="Phone Number *" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
                <input placeholder="Delivery Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
                <div className="order-summary">
                <h5>Order Summary</h5>
                {cart.map(item => (
                    <div key={item.id} className="order-summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
                <div className="order-summary-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
                </div>
                <button className="btn-checkout" onClick={placeOrder}>Pay ₹{total.toLocaleString()} →</button>
                <button className="btn-ghost" onClick={() => setStep("cart")}>← Back to Cart</button>
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
        {showModal && <ProductModal product={product} onClose={() => setShowModal(false)} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />}
        <div className="product-card" onClick={() => setShowModal(true)} style={{ cursor: "pointer", opacity: product.inStock ? 1 : 0.75 }}>
            <div className="product-img-wrap">
            <img src={product.image} alt={product.name} onError={e => { e.target.src = "https://placehold.co/300x300?text=Jewellery"; }} />
            <button className={`wishlist-btn ${inWishlist ? "active" : ""}`} onClick={toggleWishlist} title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                {inWishlist ? "❤️" : "🤍"}
            </button>
            {!product.inStock && <div className="sale-badge" style={{ background: "#555" }}>Out of Stock</div>}
            {discount && product.inStock && <div className="sale-badge">-{discount}%</div>}
            <div className="product-category-tag">{product.category}</div>
            <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "11px", padding: "4px 8px", borderRadius: "10px" }}>
                👁 View Details
            </div>
            </div>
            <div className="product-info">
            <h4>{product.name}</h4>
            <p className="product-desc">{product.description?.substring(0, 80)}...</p>
            {product.variants && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
                {product.variants.slice(0, 3).map(v => (
                    <span key={v} style={{ fontSize: "11px", background: "#f5f0eb", padding: "2px 8px", borderRadius: "10px", color: "#666" }}>{v}</span>
                ))}
                </div>
            )}
            <div className="price-wrap">
                <span className="price-current">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>}
            </div>
            <button className={`btn-add-cart ${inCart ? "added" : ""} ${!product.inStock ? "disabled" : ""}`}
                onClick={addToCart} disabled={!product.inStock}
                style={{ opacity: product.inStock ? 1 : 0.5, cursor: product.inStock ? "pointer" : "not-allowed" }}>
                {!product.inStock ? "Out of Stock" : inCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            </div>
        </div>
        </>
    );
    }

        // ── Home Page ──
        


//     function Home({ cart, setCart, wishlist, setWishlist }) {
//     const [bgIndex, setBgIndex] = useState(0);
//     const [featured, setFeatured] = useState([]);

//     useEffect(() => {
//     fetch("https://rayfinesite-3.onrender.com/api/products")
//         .then(res => res.json())
//         .then(data => {
//             console.log("API RESPONSE:", data);

//             const list = Array.isArray(data?.data)
//                 ? data.data
//                 : [];

//             const fixedProducts = list.map(product => ({
//                 ...product,
//                 image: product.image
//                     ?.replace(/^http:\/\//i, "https://")
//                     ?.split(",")[0]
//                     ?.trim()
//             }));

//             console.log("FIXED PRODUCTS:", fixedProducts);

//             setProducts(fixedProducts);
//             setLoading(false);
//         })
//         .catch(err => {
//             console.error("FETCH ERROR:", err);
//             setLoading(false);
//         });
// }, []);
function Home({ cart, setCart, wishlist, setWishlist }) {
    const [bgIndex, setBgIndex] = useState(0);
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        const t = setInterval(
            () => setBgIndex(p => (p + 1) % WALLPAPERS.length),
            5000
        );
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        fetch("https://rayfinesite-3.onrender.com/api/products")
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data?.data)
                    ? data.data
                    : [];

                const fixedProducts = list.map(product => ({
                    ...product,
                    image: product.image
                        ?.replace(/^http:\/\//i, "https://")
                        ?.split(",")[0]
                        ?.trim()
                }));

                setFeatured(fixedProducts.slice(0, 8));
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <>
        <section className="hero" style={{ backgroundImage: `url(${WALLPAPERS[bgIndex]})` }}>
            <div className="hero-overlay">
            <p className="hero-sub">New Collection</p>
            <h1>Elegance<br />Redefined</h1>
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

        <div className="sale-banner">
            <span>🔥 SALE IS LIVE — Use Code <strong>GIFT15</strong> for Extra 15% Off!</span>
            <Link to="/shop?cat=sale" className="sale-banner-btn">Shop Sale</Link>
        </div>

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

        <section className="featured-section">
            <h2 className="section-title">Trending Now</h2>
            <div className="products-grid">
            {featured.map(p => (
                <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
            ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/shop" className="btn-primary">View All Products</Link>
            </div>
        </section>

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
    function Shop({ cart, setCart, wishlist, setWishlist }) {
        const [searchParams] = useSearchParams();

        const [category, setCategory] = useState(
            searchParams.get("cat") || "All"
        );

        const [search, setSearch] = useState("");
        const [sort, setSort] = useState("default");
        const [products, setProducts] = useState([]);
        const [showInStock, setShowInStock] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetch("https://rayfinesite-3.onrender.com/api/products")
                .then(res => res.json())
                .then(data => {
                    console.log("API RESPONSE:", data);

                const list = Array.isArray(data?.data)
                    ? data.data
                    : [];

                // FIX IMAGE URLS
                const fixedProducts = list.map(product => ({
    ...product,
    image: product.image
        ?.replace(/^http:\/\//i, "https://")
        ?.split(",")[0]
        ?.trim()
}));

                console.log("FIXED PRODUCTS:", fixedProducts);

                setProducts(fixedProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error("FETCH ERROR:", err);
                setLoading(false);
            });
    }, []);

    const allProducts = products;

    let filtered = allProducts.filter(p => {

        // CATEGORY MATCH
        const matchCat =
            category === "All"
                ? true
                : category === "sale"
                ? p.originalPrice
                : (p.category || "")
                        .toLowerCase()
                        .trim() ===
                    category.toLowerCase().trim();

        // SEARCH MATCH
        const matchSearch = (p.name || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        // STOCK MATCH
        const matchStock = showInStock
            ? p.inStock
            : true;

        return matchCat && matchSearch && matchStock;
    });

    // SORTING
    if (sort === "low") {
        filtered = [...filtered].sort(
            (a, b) => a.price - b.price
        );
    }

    if (sort === "high") {
        filtered = [...filtered].sort(
            (a, b) => b.price - a.price
        );
    }

    return (
        <div className="shop-page">

            {/* HERO */}
            <div className="shop-hero">
                <h1>Our Collection</h1>
                <p>
                    Discover timeless pieces crafted
                    with love
                </p>
            </div>

            {/* CONTROLS */}
            <div className="shop-controls">

                <input
                    className="shop-search"
                    placeholder="🔍 Search jewellery..."
                    value={search}
                    onChange={e =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    className="shop-sort"
                    value={sort}
                    onChange={e =>
                        setSort(e.target.value)
                    }
                >
                    <option value="default">
                        Sort: Featured
                    </option>

                    <option value="low">
                        Price: Low to High
                    </option>

                    <option value="high">
                        Price: High to Low
                    </option>
                </select>

                <button
                    onClick={() =>
                        setShowInStock(!showInStock)
                    }
                    style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        background: showInStock
                            ? "#7B2E3E"
                            : "#f0ebe6",
                        color: showInStock
                            ? "#fff"
                            : "#333",
                        fontWeight: 600,
                        fontSize: "13px"
                    }}
                >
                    {showInStock
                        ? "✓ In Stock Only"
                        : "All Products"}
                </button>
            </div>

            {/* CATEGORY TABS */}
            <div className="category-tabs">

                {[
                    "All",
                    "Earring",
                    "Necklace",
                    "Bracelet",
                    "Ring",
                    "Anklet",
                    "Sale 🔥"
                ].map(cat => (

                    <button
                        key={cat}
                        className={`cat-tab ${
                            (
                                cat === "Sale 🔥"
                                    ? category === "sale"
                                    : category === cat
                            )
                                ? "active sale-tab"
                                : ""
                        }`}
                        onClick={() =>
                            setCategory(
                                cat === "Sale 🔥"
                                    ? "sale"
                                    : cat
                            )
                        }
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* LOADING */}
            {loading && (
                <p
                    style={{
                        textAlign: "center",
                        padding: "60px",
                        color: "#777"
                    }}
                >
                    Loading products...
                </p>
            )}

            {/* PRODUCTS */}
            {!loading && (
                <div
                    className="products-grid"
                    style={{
                        padding: "0 40px 80px"
                    }}
                >
                    {filtered.map(p => (
                        <ProductCard
                            key={p._id || p.id}
                            product={p}
                            cart={cart}
                            setCart={setCart}
                            wishlist={wishlist}
                            setWishlist={setWishlist}
                        />
                    ))}
                </div>
            )}

            {/* EMPTY */}
            {!loading && filtered.length === 0 && (
                <p
                    style={{
                        textAlign: "center",
                        color: "#999",
                        padding: "60px"
                    }}
                >
                    No products found.
                </p>
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
                <ProductCard key={p.id} product={p} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />
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
        <div className="shop-hero"><h1>Our Story</h1><p>Crafting elegance since 2021</p></div>
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
            <div className="stat-box" key={l}><h3>{n}</h3><p>{l}</p></div>
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
        <div className="shop-hero"><h1>Get in Touch</h1><p>We'd love to hear from you</p></div>
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

    
    //  ── Terms Page ──
    function Terms() {
    return (
        <div className="page-content">
        <div className="shop-hero">
            <h1>Terms &amp; Conditions</h1>
            <p>Ray Fine Ornates Policies &amp; Information</p>
        </div>
        <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px", lineHeight: "1.8" }}>

            <h2>Terms &amp; Conditions</h2>

            <h3>1. General Information</h3>
            <p>Ray Fine Ornates is a Jaipur-based jewelry brand specializing in handcrafted jewelry made with precious, semi-precious, natural, and lab-created stones. All products are handcrafted and may have slight variations, making each piece unique.</p>

            <h3>2. Product Information</h3>
            <p>We make every effort to display product images, colors, materials, and descriptions accurately. However, slight differences may occur due to lighting, screen settings, photography, and the handmade nature of our jewelry.</p>

            <h3>3. Pricing</h3>
            <p>All prices displayed on the website are subject to change without prior notice. Prices may vary during promotions, sales, or special offers. Taxes, shipping charges, and customs duties (if applicable) may be charged separately.</p>

            <h3>4. Orders &amp; Payments</h3>
            <p>Orders are confirmed only after successful payment verification. Ray Fine Ornates reserves the right to cancel or refuse any order due to payment issues, product unavailability, or suspicious activity. Custom-made and personalized orders cannot be canceled once production has started.</p>

            <h3>5. Shipping &amp; Delivery</h3>
            <p>We aim to dispatch orders within the mentioned processing time. Delivery timelines may vary depending on the shipping destination, customs clearance, or courier delays. Customers are responsible for providing accurate shipping information.</p>

            <h3>6. Returns &amp; Exchanges</h3>
            <p>We accept returns or exchanges only according to our Return Policy. Customized, personalized, made-to-order, and worn items are generally non-returnable unless damaged or incorrect. Customers must contact us within the specified period after delivery.</p>

            <h3>7. Handmade Jewelry Disclaimer</h3>
            <p>As our jewelry is handcrafted, slight irregularities, minor imperfections, and variations in stone shape, color, or finish are natural characteristics and should not be considered defects.</p>

            <h3>8. Intellectual Property</h3>
            <p>All website content, including images, logos, product designs, text, and graphics, belongs to Ray Fine Ornates and may not be copied or reproduced without written permission.</p>

            <h3>9. Privacy</h3>
            <p>Customer information is kept secure and used only for order processing, communication, and service-related purposes. We do not sell or share customer information with unauthorized third parties.</p>

            <h3>10. Limitation of Liability</h3>
            <p>Ray Fine Ornates shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>

            <h3>11. Governing Law</h3>
            <p>These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Jaipur, Rajasthan.</p>

            <h3>12. Contact Information</h3>
            <p>For any questions regarding these Terms &amp; Conditions, please contact us through the contact information available on our website.</p>

            <hr style={{ margin: "40px 0" }} />

            <h2>Refund &amp; Cancellation Policy</h2>
            <p>Thank you for shopping with Ray Fine Ornates. Please read our Refund &amp; Cancellation Policy carefully before placing an order.</p>

            <h3>Order Cancellation</h3>
            <p>Customers may request order cancellation within 24 hours of placing the order by contacting us directly at +91 8690666771. Cancellation requests made after 24 hours may not be accepted if the order has already been processed or dispatched.</p>

            <h3>Refund Policy</h3>
            <p>Refunds are accepted only in genuine cases and will be reviewed after verification. Customers must contact us immediately if:</p>
            <ul>
            <li>The package is received in damaged condition</li>
            <li>The product received is different from the item ordered</li>
            <li>There is a genuine issue with the order</li>
            </ul>

            <h3>Non-Refundable Items</h3>
            <ul>
            <li>Customized or made-to-order jewelry</li>
            <li>Personalized products</li>
            <li>Used or worn jewelry</li>
            <li>Orders damaged due to customer mishandling</li>
            </ul>

            <h3>Refund Processing</h3>
            <p>If approved, refunds will be processed through the original payment method.</p>

            <h3>Contact Us</h3>
            <p><strong>Phone:</strong> +91 8690666771</p>
            <p>Ray Fine Ornates – Jaipur, Rajasthan, India</p>

            <hr style={{ margin: "40px 0" }} />

            <h2>Frequently Asked Questions (FAQs)</h2>

            <details><summary>1. What type of jewelry does Ray Fine Ornates offer?</summary><p>We specialize in handcrafted gold-plated jewelry featuring precious, semi-precious, natural, and lab-created stones. Our collection includes necklaces, bracelets, earrings, rings, bridal jewelry, spiritual jewelry, and custom-made designs.</p></details>
            <details><summary>2. Are your jewelry pieces handmade?</summary><p>Yes, all our jewelry pieces are handcrafted by skilled artisans in Jaipur, India. Slight variations are natural characteristics of handmade jewelry.</p></details>
            <details><summary>3. Do you use real gemstones?</summary><p>We work with a variety of natural, semi-precious, precious, and lab-created stones. Product descriptions clearly mention the type of stones used.</p></details>
            <details><summary>4. Do you accept custom or personalized orders?</summary><p>Yes, we offer made-to-order and customized jewelry services. Customers can request changes in stone colors, sizes, finishes, and designs.</p></details>
            <details><summary>5. How can I place a custom order?</summary><p>You can contact us directly through WhatsApp or phone at +91 8690666771.</p></details>
            <details><summary>6. Do you ship internationally?</summary><p>Yes, we ship worldwide. Shipping timelines may vary depending on the destination country and customs clearance process.</p></details>
            <details><summary>7. How long does shipping take?</summary><p>Processing and delivery times depend on the product and shipping location. Customized orders may require additional production time.</p></details>
            <details><summary>8. Can I cancel my order?</summary><p>Yes, orders can be canceled within 24 hours of placing the order by contacting us at +91 8690666771.</p></details>
            <details><summary>9. Do you accept returns or refunds?</summary><p>Refunds and returns are accepted only in genuine cases such as receiving a damaged package or an incorrect product.</p></details>
            <details><summary>10. What should I do if my package arrives damaged?</summary><p>Please contact us immediately with clear photos or videos of the damaged package and product.</p></details>
            <details><summary>11. How should I care for my jewelry?</summary><p>To maintain the shine and quality: keep away from water and perfumes, store in a dry airtight pouch, avoid moisture and rough surfaces.</p></details>
            <details><summary>12. Where is your store located?</summary><p>223, 1st Floor, Memiyon Ka Darwaja, Haldiyon Ka Rasta, Johari Bazar, Jaipur – 302003, Rajasthan, India</p></details>

            <hr style={{ margin: "40px 0" }} />

            <h2>Bulk Order Services</h2>
            <ul>
            <li>Corporate gifting</li>
            <li>Wedding gifting</li>
            <li>Boutique orders</li>
            <li>Event giveaways</li>
            <li>Retail partnerships</li>
            <li>Customized employee gifts</li>
            <li>Fashion and retail partnerships</li>
            </ul>

            <h3>Customization Available</h3>
            <ul>
            <li>Stone selection and color customization</li>
            <li>Gold-plated finishes</li>
            <li>Personalized designs</li>
            <li>Custom packaging</li>
            <li>Bulk quantity production</li>
            <li>Branding support for businesses and events</li>
            </ul>

            <h2>Why Choose Ray Fine Ornates?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px", marginTop: "20px" }}>
            <div className="feature-box"><h4>✨ Handmade Craftsmanship</h4><p>Handcrafted with care in Jaipur, India.</p></div>
            <div className="feature-box"><h4>💎 Premium Quality</h4><p>High-quality materials with fine finishing.</p></div>
            <div className="feature-box"><h4>💍 Wide Collection</h4><p>Extensive range of gemstone and fashion jewelry.</p></div>
            <div className="feature-box"><h4>💰 Competitive Pricing</h4><p>Affordable bulk and wholesale pricing options.</p></div>
            <div className="feature-box"><h4>🌍 Worldwide Shipping</h4><p>Reliable shipping available across the globe.</p></div>
            <div className="feature-box"><h4>❤️ Personalized Support</h4><p>Dedicated customer assistance and customization support.</p></div>
            </div>

            <p style={{ marginTop: "30px", lineHeight: "1.8" }}>
            Whether you are looking for elegant gifting options or sourcing handcrafted jewelry in bulk, our team is dedicated to providing unique designs and reliable service tailored to your needs.
            </p>

            <h2>Contact Information</h2>
            <p><strong>Phone:</strong> +91 8690666771</p>
            <p><strong>Address:</strong><br />223, 1st Floor, Memiyon Ka Darwaja,<br />Haldiyon Ka Rasta, Johari Bazar,<br />Jaipur – 302003, Rajasthan, India</p>
            <p><strong>Business Hours:</strong> Monday–Saturday, 10:00 AM–7:00 PM</p>
            <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="btn-primary">WhatsApp Us</a>
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
            <Link to="/terms">Terms &amp; Conditions</Link>
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

    // ── WhatsApp Float ──
    function WhatsAppFloat({ onOpenChat }) {
    return (
        <>
        <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" className="whatsapp-float">
            <span style={{ fontSize: "30px" }}>💬</span>
        </a>
        <button className="chat-float-btn" onClick={onOpenChat}>🤖</button>
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
            <Route path="/" element={<Home cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
            <Route path="/shop" element={<Shop cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
            <Route path="/wishlist" element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/terms" element={<Terms />} />
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