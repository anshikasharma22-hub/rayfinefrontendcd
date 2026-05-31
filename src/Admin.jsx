import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function Admin() {
    const [tab, setTab] = useState("products");
    const [form, setForm] = useState({ name: "", price: "", image: "", description: "", category: "Earring" });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [serverError, setServerError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) { navigate("/login"); return; }
        fetch("https://rayfinesite-3.onrender.com/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(d => {
            if (!d.success) navigate("/login");
        }).catch(() => navigate("/login"));
    }, [navigate]);

    const fetchProducts = () => {
        fetch("https://rayfinesite-3.onrender.com/api/products")
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    const fixed = d.data.map(p => ({
                        ...p,
                        image: p.image?.split(",")[0].trim()
                    }));
                    setProducts(fixed);
                    setServerError(false);
                }
            })
            .catch(() => setServerError(true));
    };

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        fetch("https://rayfinesite-3.onrender.com/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(d => {
            if (d.success) setOrders(d.data);
        }).catch(() => {});
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const addProduct = () => {
        if (!form.name || !form.price || !form.image) { alert("Name, price and image required."); return; }
        const token = localStorage.getItem("admin_token");
        fetch("https://rayfinesite-3.onrender.com/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...form, price: Number(form.price) })
        }).then(r => r.json()).then(d => {
            if (d.success) { alert("✅ Product Added!"); setForm({ name: "", price: "", image: "", description: "", category: "Earring" }); fetchProducts(); }
            else alert("❌ " + (d.error || "Error"));
        }).catch(() => alert("Server error"));
    };

    const deleteProduct = (id) => {
        if (!window.confirm("Delete karna chahte ho?")) return;
        const token = localStorage.getItem("admin_token");
        fetch(`https://rayfinesite-3.onrender.com/api/products/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        }).then(r => r.json()).then(d => {
            if (d.success) setProducts(prev => prev.filter(p => p.id !== id));
        });
    };

    const logout = () => { localStorage.removeItem("admin_token"); navigate("/login"); };

    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

    const chartData = orders.reduce((acc, o) => {
        const date = o.id?.toString().substring(0, 8) || "N/A";
        const existing = acc.find(a => a.date === date);
        if (existing) existing.revenue += o.total || 0;
        else acc.push({ date, revenue: o.total || 0 });
        return acc;
    }, []);

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f10", color: "#fff", fontFamily: "sans-serif" }}>

            {/* Sidebar */}
            <div style={{ width: "220px", background: "#111", borderRight: "1px solid #F9CDC2", padding: "30px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h2 style={{ color: "#F9CDC2", marginBottom: "30px", fontSize: "18px" }}>⚙️ Admin Panel</h2>
                {[
                    { key: "products", label: "📦 Products" },
                    { key: "orders", label: "📋 Orders" },
                    { key: "analytics", label: "📊 Analytics" },
                ].map(item => (
                    <button key={item.key} onClick={() => setTab(item.key)} style={{
                        padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left",
                        background: tab === item.key ? "#F9CDC2" : "#1a1a1a",
                        color: tab === item.key ? "#000" : "#fff", fontWeight: "bold"
                    }}>{item.label}</button>
                ))}
                <button onClick={logout} style={{
                    marginTop: "auto", padding: "12px", borderRadius: "10px",
                    border: "1px solid #F9CDC2", background: "transparent",
                    color: "#F9CDC2", cursor: "pointer", fontWeight: "bold"
                }}>🚪 Logout</button>
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>

                {serverError && (
                    <div style={{ background: "#ff444422", border: "1px solid #ff4444", borderRadius: "10px", padding: "14px 20px", marginBottom: "24px", color: "#ff8888" }}>
                        ⚠️ Server se connect nahi ho raha
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {tab === "products" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>📦 Products</h2>

                        {/* Add Product Form */}
                        <div style={{ background: "#111", padding: "24px", borderRadius: "16px", border: "1px solid #F9CDC2", maxWidth: "500px", marginBottom: "40px" }}>
                            <h3 style={{ marginBottom: "16px" }}>Add New Product</h3>
                            <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} style={inputStyle} />
                            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} style={inputStyle} />
                            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} style={inputStyle} />
                            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, height: "80px" }} />
                            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                                {["Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Other"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            {form.image && (
                                <img src={form.image} alt="preview" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }}
                                    onError={e => e.target.style.display = "none"} />
                            )}
                            <button onClick={addProduct} style={btnStyle}>Add Product ✨</button>
                        </div>

                        {/* Search */}
                        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <input placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ ...inputStyle, maxWidth: "320px", margin: 0 }} />
                            {search && <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: "#F9CDC2", cursor: "pointer", fontSize: "18px" }}>✕</button>}
                            <span style={{ color: "#888", fontSize: "14px" }}>{filteredProducts.length} / {products.length} products</span>
                        </div>

                        {/* Products Grid */}
                        <h3 style={{ marginBottom: "16px" }}>All Products ({filteredProducts.length})</h3>
                        {filteredProducts.length === 0 && <p style={{ color: "#888" }}>Koi product nahi mila</p>}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                            {filteredProducts.map(p => (
                                <div key={p.id} style={{ background: "#111", borderRadius: "12px", border: "1px solid #333", overflow: "hidden" }}>
                                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover" }}
                                        onError={e => e.target.src = "https://placehold.co/200x140?text=No+Image"} />
                                    <div style={{ padding: "12px" }}>
                                        <p style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "13px" }}>{p.name}</p>
                                        <p style={{ color: "#F9CDC2", marginBottom: "4px" }}>₹{p.price}</p>
                                        <p style={{ color: "#888", fontSize: "11px", marginBottom: "10px" }}>{p.category}</p>
                                        <button onClick={() => deleteProduct(p.id)} style={{ width: "100%", padding: "8px", background: "#ff4444", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {tab === "orders" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>📋 Orders ({orders.length})</h2>
                        {orders.length === 0
                            ? <p style={{ color: "#888" }}>Abhi tak koi order nahi</p>
                            : orders.map((o, i) => (
                                <div key={i} style={{ background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <span style={{ fontWeight: "bold" }}>{o.customer?.name || "N/A"}</span>
                                        <span style={{ color: "#F9CDC2", fontWeight: "bold" }}>₹{o.total}</span>
                                    </div>
                                    <p style={{ color: "#888", fontSize: "13px" }}>📞 {o.customer?.phone || "N/A"}</p>
                                    <p style={{ color: "#888", fontSize: "13px" }}>📍 {o.customer?.address || "N/A"}</p>
                                    <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>
                                        Items: {Array.isArray(o.items) ? o.items.map(item => item.name).join(", ") : "N/A"}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* ANALYTICS TAB */}
                {tab === "analytics" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>📊 Analytics</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
                            {[
                                { label: "Total Orders", value: orders.length },
                                { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
                                { label: "Total Products", value: products.length },
                            ].map(stat => (
                                <div key={stat.label} style={{ background: "#111", border: "1px solid #F9CDC2", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                                    <p style={{ color: "#888", marginBottom: "8px" }}>{stat.label}</p>
                                    <h3 style={{ color: "#F9CDC2", fontSize: "28px" }}>{stat.value}</h3>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "24px" }}>
                            <h3 style={{ marginBottom: "20px" }}>Revenue Over Time</h3>
                            {chartData.length === 0
                                ? <p style={{ color: "#888" }}>Orders aane ke baad chart dikhega</p>
                                : <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="date" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #F9CDC2" }} />
                                        <Line type="monotone" dataKey="revenue" stroke="#F9CDC2" strokeWidth={2} dot={{ fill: "#F9CDC2" }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%", padding: "12px", margin: "8px 0",
    borderRadius: "10px", border: "1px solid #F9CDC2",
    background: "#1a1a1a", color: "#fff", boxSizing: "border-box", fontSize: "14px"
};

const btnStyle = {
    width: "100%", padding: "12px", border: "none",
    background: "#F9CDC2", borderRadius: "30px",
    cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "8px"
};

export default Admin;