 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function Admin() {
    const [tab, setTab] = useState("products");
    const [form, setForm] = useState({
        name: "", price: "", originalPrice: "", image: "",
        description: "", category: "Earring", material: "",
        careInstructions: "", variants: "", inStock: true
    });
    const [editId, setEditId] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [serverError, setServerError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ── Auth check ──
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) { navigate("/login"); return; }
        fetch("https://rayfinesite-3.onrender.com/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(d => {
            if (!d.success) navigate("/login");
        }).catch(() => navigate("/login"));
    }, [navigate]);

    // ── Fetch Products ──
    const fetchProducts = () => {
        setLoading(true);
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
                setLoading(false);
            })
            .catch(() => { setServerError(true); setLoading(false); });
    };

    useEffect(() => { fetchProducts(); }, []);

    // ── Fetch Orders ──
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        fetch("https://rayfinesite-3.onrender.com/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(d => {
            if (d.success) setOrders(d.data);
        }).catch(() => {});
    }, []);

    const handleChange = (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    // ── Add / Update Product ──
    const saveProduct = () => {
        if (!form.name || !form.price || !form.image) {
            alert("Name, price aur image required hai.");
            return;
        }
        const token = localStorage.getItem("admin_token");

        const payload = {
            name: form.name.trim(),
            price: Number(form.price),
            originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
            image: form.image.trim(),
            description: form.description.trim(),
            category: form.category,
            material: form.material.trim(),
            careInstructions: form.careInstructions.trim(),
            // variants: comma-separated string → array
            variants: form.variants
                ? form.variants.split(",").map(v => v.trim()).filter(Boolean)
                : [],
            inStock: form.inStock,
        };

        const isEdit = !!editId;
        const url = isEdit
            ? `https://rayfinesite-3.onrender.com/api/products/${editId}`
            : "https://rayfinesite-3.onrender.com/api/products";
        const method = isEdit ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    alert(isEdit ? "✅ Product update ho gaya!" : "✅ Product add ho gaya!");
                    resetForm();
                    fetchProducts();
                } else {
                    alert("❌ " + (d.error || d.message || "Server error"));
                }
            })
            .catch(() => alert("❌ Server se connect nahi ho pa raha"));
    };

    const resetForm = () => {
        setForm({
            name: "", price: "", originalPrice: "", image: "",
            description: "", category: "Earring", material: "",
            careInstructions: "", variants: "", inStock: true
        });
        setEditId(null);
    };

    // ── Load product into form for editing ──
    const startEdit = (p) => {
        setForm({
            name: p.name || "",
            price: p.price || "",
            originalPrice: p.originalPrice || "",
            image: p.image || "",
            description: p.description || "",
            category: p.category || "Earring",
            material: p.material || "",
            careInstructions: p.careInstructions || "",
            variants: Array.isArray(p.variants) ? p.variants.join(", ") : (p.variants || ""),
            inStock: p.inStock !== undefined ? p.inStock : true,
        });
        setEditId(p._id || p.id);
        setTab("products");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Delete ── FIX: use _id (MongoDB)
    const deleteProduct = (id) => {
        if (!window.confirm("Delete karna chahte ho?")) return;
        const token = localStorage.getItem("admin_token");
        fetch(`https://rayfinesite-3.onrender.com/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    // FIX: filter by _id not id
                    setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
                } else {
                    alert("❌ Delete nahi hua: " + (d.error || "Unknown error"));
                }
            })
            .catch(() => alert("❌ Server error on delete"));
    };

    // ── Toggle inStock ──
    const toggleStock = (p) => {
        const token = localStorage.getItem("admin_token");
        const id = p._id || p.id;
        fetch(`https://rayfinesite-3.onrender.com/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ inStock: !p.inStock })
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setProducts(prev =>
                        prev.map(prod =>
                            (prod._id || prod.id) === id
                                ? { ...prod, inStock: !prod.inStock }
                                : prod
                        )
                    );
                }
            })
            .catch(() => {});
    };

    const logout = () => {
        localStorage.removeItem("admin_token");
        navigate("/login");
    };

    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

    const chartData = orders.reduce((acc, o) => {
        const date = new Date(o.createdAt || o.id).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        const existing = acc.find(a => a.date === date);
        if (existing) existing.revenue += o.total || 0;
        else acc.push({ date, revenue: o.total || 0 });
        return acc;
    }, []);

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f10", color: "#fff", fontFamily: "sans-serif" }}>

            {/* ── Sidebar ── */}
            <div style={{ width: "220px", background: "#111", borderRight: "1px solid #2a2a2a", padding: "30px 20px", display: "flex", flexDirection: "column", gap: "10px", position: "sticky", top: 0, height: "100vh" }}>
                <h2 style={{ color: "#F9CDC2", marginBottom: "30px", fontSize: "18px" }}>⚙️ Admin Panel</h2>
                {[
                    { key: "products", label: "📦 Products" },
                    { key: "orders", label: "📋 Orders" },
                    { key: "analytics", label: "📊 Analytics" },
                ].map(item => (
                    <button key={item.key} onClick={() => setTab(item.key)} style={{
                        padding: "12px", borderRadius: "10px", border: "none",
                        cursor: "pointer", textAlign: "left",
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

            {/* ── Main ── */}
            <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>

                {serverError && (
                    <div style={{ background: "#ff444422", border: "1px solid #ff4444", borderRadius: "10px", padding: "14px 20px", marginBottom: "24px", color: "#ff8888" }}>
                        ⚠️ Server se connect nahi ho pa raha. Render cold start ho sakta hai — thoda wait karo aur refresh karo.
                    </div>
                )}

                {/* ════════════ PRODUCTS TAB ════════════ */}
                {tab === "products" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>
                            {editId ? "✏️ Edit Product" : "📦 Add New Product"}
                        </h2>

                        {/* ── Form ── */}
                        <div style={{ background: "#111", padding: "24px", borderRadius: "16px", border: "1px solid #F9CDC2", maxWidth: "540px", marginBottom: "40px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Product Name *</label>
                                    <input name="name" placeholder="e.g. Pearl Drop Earrings" value={form.name} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Price (₹) *</label>
                                    <input name="price" type="number" placeholder="799" value={form.price} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Original Price (₹)</label>
                                    <input name="originalPrice" type="number" placeholder="999 (for discount)" value={form.originalPrice} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Image URL *</label>
                                    <input name="image" placeholder="https://..." value={form.image} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea name="description" placeholder="Product ka description..." value={form.description} onChange={handleChange} style={{ ...inputStyle, height: "80px", resize: "vertical" }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                                        {["Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Other"].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Material</label>
                                    <input name="material" placeholder="e.g. Gold Plated Brass" value={form.material} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Variants (comma separated)</label>
                                    <input name="variants" placeholder="e.g. Gold, Silver, Rose Gold" value={form.variants} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Care Instructions</label>
                                    <input name="careInstructions" placeholder="e.g. Avoid water and perfume" value={form.careInstructions} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px", margin: "8px 0" }}>
                                    <input type="checkbox" name="inStock" id="inStock" checked={form.inStock} onChange={handleChange} style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#F9CDC2" }} />
                                    <label htmlFor="inStock" style={{ color: "#ccc", cursor: "pointer", fontSize: "14px" }}>In Stock</label>
                                </div>
                            </div>

                            {form.image && (
                                <img src={form.image} alt="preview" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px", marginBottom: "12px", marginTop: "4px" }}
                                    onError={e => e.target.style.display = "none"} />
                            )}

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={saveProduct} style={btnStyle}>
                                    {editId ? "💾 Update Product" : "✨ Add Product"}
                                </button>
                                {editId && (
                                    <button onClick={resetForm} style={{ ...btnStyle, background: "#333", color: "#fff", flex: "0 0 auto", width: "auto", padding: "12px 20px" }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Search ── */}
                        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <input placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ ...inputStyle, maxWidth: "320px", margin: 0 }} />
                            {search && (
                                <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: "#F9CDC2", cursor: "pointer", fontSize: "18px" }}>✕</button>
                            )}
                            <span style={{ color: "#888", fontSize: "14px" }}>{filteredProducts.length} / {products.length} products</span>
                        </div>

                        {/* ── Products Grid ── */}
                        <h3 style={{ marginBottom: "16px", color: "#ccc" }}>All Products ({filteredProducts.length})</h3>

                        {loading && <p style={{ color: "#888" }}>Loading...</p>}
                        {!loading && filteredProducts.length === 0 && <p style={{ color: "#888" }}>Koi product nahi mila</p>}

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "16px" }}>
                            {filteredProducts.map(p => (
                                <div key={p._id || p.id} style={{ background: "#111", borderRadius: "12px", border: `1px solid ${p.inStock ? "#2a2a2a" : "#ff444444"}`, overflow: "hidden", transition: "border 0.2s" }}>
                                    <div style={{ position: "relative" }}>
                                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                                            onError={e => e.target.src = "https://placehold.co/200x140?text=No+Image"} />
                                        <span style={{ position: "absolute", top: "8px", right: "8px", background: p.inStock ? "#22c55e22" : "#ff444422", color: p.inStock ? "#22c55e" : "#ff6666", fontSize: "10px", padding: "3px 8px", borderRadius: "20px", border: `1px solid ${p.inStock ? "#22c55e44" : "#ff444444"}`, fontWeight: 700 }}>
                                            {p.inStock ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>
                                    <div style={{ padding: "12px" }}>
                                        <p style={{ fontWeight: "bold", marginBottom: "2px", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
                                        <p style={{ color: "#F9CDC2", marginBottom: "2px", fontSize: "13px" }}>₹{p.price?.toLocaleString()}
                                            {p.originalPrice && <span style={{ color: "#666", textDecoration: "line-through", marginLeft: "6px", fontSize: "11px" }}>₹{p.originalPrice?.toLocaleString()}</span>}
                                        </p>
                                        <p style={{ color: "#888", fontSize: "11px", marginBottom: "10px" }}>{p.category}</p>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button onClick={() => startEdit(p)} style={{ flex: 1, padding: "7px", background: "#1a2a1a", border: "1px solid #22c55e44", borderRadius: "8px", color: "#22c55e", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                                                ✏️ Edit
                                            </button>
                                            <button onClick={() => toggleStock(p)} style={{ flex: 1, padding: "7px", background: p.inStock ? "#2a1a1a" : "#1a2a1a", border: `1px solid ${p.inStock ? "#ff444444" : "#22c55e44"}`, borderRadius: "8px", color: p.inStock ? "#ff8888" : "#22c55e", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                                                {p.inStock ? "Mark Off" : "Mark On"}
                                            </button>
                                            <button onClick={() => deleteProduct(p._id || p.id)} style={{ padding: "7px 10px", background: "#ff4444", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "13px" }}>
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ════════════ ORDERS TAB ════════════ */}
                {tab === "orders" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>📋 Orders ({orders.length})</h2>
                        {orders.length === 0
                            ? <p style={{ color: "#888" }}>Abhi tak koi order nahi aaya</p>
                            : orders.map((o, i) => (
                                <div key={i} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                        <span style={{ fontWeight: "bold", fontSize: "15px" }}>{o.customer?.name || "N/A"}</span>
                                        <span style={{ color: "#F9CDC2", fontWeight: "bold", fontSize: "16px" }}>₹{(o.total || 0).toLocaleString()}</span>
                                    </div>
                                    <p style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>📞 {o.customer?.phone || "N/A"}</p>
                                    <p style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>📍 {o.customer?.address || "N/A"}</p>
                                    {o.createdAt && <p style={{ color: "#555", fontSize: "12px", marginBottom: "8px" }}>🕒 {new Date(o.createdAt).toLocaleString("en-IN")}</p>}
                                    <p style={{ color: "#aaa", fontSize: "13px", marginTop: "8px" }}>
                                        <strong style={{ color: "#ccc" }}>Items:</strong>{" "}
                                        {Array.isArray(o.items) ? o.items.map(item => `${item.name} ×${item.quantity || 1}`).join(", ") : "N/A"}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* ════════════ ANALYTICS TAB ════════════ */}
                {tab === "analytics" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>📊 Analytics</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "40px" }}>
                            {[
                                { label: "Total Orders", value: orders.length, icon: "📋" },
                                { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰" },
                                { label: "Total Products", value: products.length, icon: "📦" },
                                { label: "In Stock", value: products.filter(p => p.inStock).length, icon: "✅" },
                            ].map(stat => (
                                <div key={stat.label} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                                    <p style={{ color: "#888", marginBottom: "8px", fontSize: "13px" }}>{stat.label}</p>
                                    <h3 style={{ color: "#F9CDC2", fontSize: "24px" }}>{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Category breakdown */}
                        <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
                            <h3 style={{ marginBottom: "20px", color: "#ccc" }}>Products by Category</h3>
                            {["Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Other"].map(cat => {
                                const count = products.filter(p => p.category === cat).length;
                                const pct = products.length ? Math.round((count / products.length) * 100) : 0;
                                return (
                                    <div key={cat} style={{ marginBottom: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                                            <span style={{ color: "#ccc" }}>{cat}</span>
                                            <span style={{ color: "#F9CDC2" }}>{count} ({pct}%)</span>
                                        </div>
                                        <div style={{ height: "6px", background: "#222", borderRadius: "3px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${pct}%`, background: "#F9CDC2", borderRadius: "3px", transition: "width 0.6s ease" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Revenue chart */}
                        <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "24px" }}>
                            <h3 style={{ marginBottom: "20px", color: "#ccc" }}>Revenue Over Time</h3>
                            {chartData.length === 0
                                ? <p style={{ color: "#888" }}>Orders aane ke baad chart dikhega</p>
                                : <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                        <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11 }} />
                                        <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                                        <Tooltip
                                            contentStyle={{ background: "#1a1a1a", border: "1px solid #F9CDC2", borderRadius: "8px" }}
                                            formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#F9CDC2" strokeWidth={2} dot={{ fill: "#F9CDC2", r: 4 }} />
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

const labelStyle = {
    display: "block", fontSize: "11px", color: "#888",
    textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px", marginTop: "6px"
};

const inputStyle = {
    width: "100%", padding: "12px", margin: "4px 0 8px",
    borderRadius: "10px", border: "1px solid #2a2a2a",
    background: "#1a1a1a", color: "#fff",
    boxSizing: "border-box", fontSize: "14px",
    outline: "none", transition: "border 0.2s",
};

const btnStyle = {
    flex: 1, width: "100%", padding: "13px", border: "none",
    background: "#F9CDC2", borderRadius: "30px",
    cursor: "pointer", fontWeight: "bold", fontSize: "15px", marginTop: "8px"
};

export default Admin;
