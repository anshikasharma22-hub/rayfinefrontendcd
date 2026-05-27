    // import { useState } from "react";

    // export default function Checkout({ cart = [] }) {
    // const [form, setForm] = useState({
    //     name: "",
    //     address: "",
    //     phone: ""
    // });

    // const placeOrder = async () => {
    //     const total = cart.reduce(
    //     (sum, item) => sum + Number(item.price || 0),
    //     0
    //     );

    //     const order = {
    //     customer: form,
    //     items: cart,
    //     total: totaly
    
    //     };

    //     try {
    //     await fetch("http://127.0.0.1:5000/api/orders", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(order)
    //     });

    //     alert("Order placed!");
    //     } catch (err) {
    //     alert("Error placing order");
    //     }
    // };

    // return (
    //     <div>
    //     <h1>Checkout</h1>

    //     <input
    //         placeholder="Name"
    //         onChange={(e) => setForm({ ...form, name: e.target.value })}
    //     />

    //     <input
    //         placeholder="Address"
    //         onChange={(e) => setForm({ ...form, address: e.target.value })}
    //     />

    //     <input
    //         placeholder="Phone"
    //         onChange={(e) => setForm({ ...form, phone: e.target.value })}
    //     />

    //     <button onClick={placeOrder}>Place Order</button>
    //     </div>
    // );
    // }
            import { BrowserRouter, Routes, Route } from "react-router-dom";
    import { useEffect, useState } from "react";
    import Admin from "./Admin";
    import "./App.css";

    /* ================= HERO WALLPAPERS ================= */
    const wallpapers = [
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
    "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d",
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a"
    ];

    const tags = ["What's New", "Jewellery", "Collections", "Best Sellers"];

    function App() {
    /* ================= STATES ================= */
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [bgIndex, setBgIndex] = useState(0);
    const [search, setSearch] = useState("");

    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem("cart")) || [];
    });

    const [customer, setCustomer] = useState({
        name: "",
        address: "",
        phone: ""
    });

    /* ================= API CALLS ================= */
    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/products")
        .then(res => res.json())
        .then(data => setProducts(data || []));
    }, []);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/reviews")
        .then(res => res.json())
        .then(data => setReviews(data || []));
    }, []);

    /* ================= HERO SLIDER ================= */
    useEffect(() => {
        const interval = setInterval(() => {
        setBgIndex(prev => (prev + 1) % wallpapers.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    /* ================= CART SAVE ================= */
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    /* ================= CART ================= */
    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const total = cart.reduce((sum, i) => sum + i.price, 0);

    /* ================= SEARCH ================= */
    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= ORDER ================= */
    const placeOrder = () => {
        if (!customer.name || !customer.phone || !customer.address) {
        alert("Please fill all details");
        return;
        }

        const orderData = {
        customer,
        items: cart,
        total
        };

        fetch("http://127.0.0.1:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
        })
        .then(() => {
            alert("✨ Order placed successfully!");
            setCart([]);
            setCustomer({ name: "", address: "", phone: "" });
        })
        .catch(err => console.log(err));
    };

    return (
        <BrowserRouter>

        {/* ================= NAVBAR ================= */}
        <nav className="navbar">
            <h2>Ray Fine</h2>

            <input
            placeholder="Search jewellery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

            <div className="nav-right">
            🛒 {cart.length}
            </div>
        </nav>

        {/* ================= OFFER BAR ================= */}
        <div className="discount-bar">
            ✨ Flat 20% OFF | Luxury Jewellery Collection ✨
        </div>

        <Routes>

            <Route path="/" element={
            <>
                {/* ================= HERO ================= */}
                <section
                className="hero"
                style={{ backgroundImage: `url(${wallpapers[bgIndex]})` }}
                >
                <div className="hero-overlay">
                    <h1>Ray Fine Ornates</h1>

                    <div className="hero-menu">
                    {tags.map((t, i) => (
                        <span key={i}>{t}</span>
                    ))}
                    </div>

                    <p>Luxury Jewellery Crafted for Elegance</p>

                    <button>Shop Collection</button>
                </div>
                </section>

                {/* ================= PRODUCTS ================= */}
                <section className="products">
                <h2>Our Collection</h2>

                <div className="grid">
                    {filtered.map((p) => (
                    <div className="card" key={p._id}>
                        <img src={p.image} alt={p.name} />
                        <h3>{p.name}</h3>
                        <p>₹{p.price}</p>
                        <button onClick={() => addToCart(p)}>
                        Add to Cart
                        </button>
                    </div>
                    ))}
                </div>
                </section>

                {/* ================= CHECKOUT ================= */}
                <section className="checkout">
                <h2>Checkout</h2>

                <div className="checkout-box">

                    <input
                    placeholder="Full Name"
                    value={customer.name}
                    onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                    }
                    />

                    <input
                    placeholder="Phone"
                    value={customer.phone}
                    onChange={(e) =>
                        setCustomer({ ...customer, phone: e.target.value })
                    }
                    />

                    <input
                    placeholder="Address"
                    value={customer.address}
                    onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                    }
                    />

                    <h3>Total: ₹{total}</h3>

                    <button onClick={placeOrder}>
                    Place Order ✨
                    </button>

                </div>
                </section>

                {/* ================= REVIEWS ================= */}
                <section className="section">
                <h2>Client Stories</h2>

                <div className="test-grid">
                    {reviews.map(r => (
                    <div className="test-card" key={r._id}>
                        <h4>{r.name}</h4>
                        <p>{"★".repeat(r.rating)}</p>
                        <p>{r.comment}</p>
                    </div>
                    ))}
                </div>
                </section>

                {/* ================= FOLLOW ================= */}
                <section className="section follow">
                <h2>Follow Us</h2>
                <div className="socials">
                    <span>📸 Instagram</span>
                    <span>📘 Facebook</span>
                    <span>📌 Pinterest</span>
                </div>
                </section>

                {/* ================= CONTACT ================= */}
                <section className="section contact">
                <h2>Contact Us</h2>
                <p>📍 Johari Bazaar, Jaipur</p>
                <p>📧 info@rayfineornates.com</p>
                <p>📞 +91 8112240112</p>
                </section>

                {/* ================= FOOTER ================= */}
                <footer className="footer">
                <h3>Ray Fine Ornates</h3>
                <p>Luxury jewellery crafted with elegance & trust.</p>
                <p>© 2026 Ray Fine Ornates</p>
                </footer>

                {/* WHATSAPP */}
                <a
                className="whatsapp"
                href="https://wa.me/918112240112"
                target="_blank"
                >
                💬
                </a>

            </>
            } />

            <Route path="/admin" element={<Admin />} />

        </Routes>
        </BrowserRouter>
    );
    }

    export default App;