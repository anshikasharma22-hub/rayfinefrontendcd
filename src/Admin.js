import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API = "https://rayfinesite-3.onrender.com";

const EMPTY_FORM = {
    name: "", price: "", originalPrice: "", image: "", imagePreview: "",
    description: "", category: "Earring", inStock: true,
    variants: "", material: "", careInstructions: ""
};

function Admin() {
    const [tab, setTab] = useState("products");
    const [form, setForm] = useState(EMPTY_FORM);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [serverError, setServerError] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = () => localStorage.getItem("admin_token");

    useEffect(() => {
        if (!token()) { navigate("/login"); return; }
        fetch(`${API}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token()}` }
        }).then(r => r.json()).then(d => {
            if (!d.success) navigate("/login");
        }).catch(() => navigate("/login"));
    }, [navigate]);

    const fetchProducts = () => {
        fetch(`${API}/api/products`)
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setProducts(d.data.map(p => ({
                        ...p,
                        image: p.image?.split(",")[0].trim()
                    })));
                    setServerError(false);
                }
            })
            .catch(() => setServerError(true));
    };

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        fetch(`${API}/api/orders`, {
            headers: { Authorization: `Bearer ${token()}` }
        }).then(r => r.json()).then(d => {
            if (d.success) setOrders(d.data);
        }).catch(() => {});
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleImageFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setForm(f => ({ ...f, image: ev.target.result, imagePreview: ev.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageUrl = (e) => {
        const url = e.target.value;
        setForm(f => ({ ...f, image: url, imagePreview: url }));
    };

    const saveProduct = async () => {
        if (!form.name || !form.price || !form.image) {
            alert("Name, price and image are required.");
            return;
        }
        setLoading(true);
        const payload = {
            name: form.name,
            price: Number(form.price),
            originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
            image: form.image,
            description: form.description,
            category: form.category,
            inStock: form.inStock,
            variants: form.variants,
            material: form.material,
            careInstructions: form.careInstructions,
        };

        const url = editId ? `${API}/api/products/${editId}` : `${API}/api/products`;
        const method = editId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
                body: JSON.stringify(payload)
            });
            const d = await res.json();
            if (d.success) {
                alert(editId ? "Product updated!" : "Product added!");
                setForm(EMPTY_FORM);
                setEditId(null);
                fetchProducts();
            } else {
                alert("Error: " + (d.error || "Unknown error"));
            }
        } catch {
            alert("Server error");
        }
        setLoading(false);
    };

    const startEdit = (p) => {
        setEditId(p.id);
        setForm({
            name: p.name || "",
            price: p.price || "",
            originalPrice: p.original_price || "",
            image: p.image || "",
            imagePreview: p.image || "",
            description: p.description || "",
            category: p.category || "Earring",
            inStock: p.in_stock !== false,
            variants: p.variants || "",
            material: p.material || "",
            careInstructions: p.care_instructions || "",
        });
        setTab("products");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => { setForm(EMPTY_FORM); setEditId(null); };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        const res = await fetch(`${API}/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token()}` }
        });
        const d = await res.json();
        if (d.success) setProducts(prev => prev.filter(p => p.id !== id));
    };

    const logout = () => { localStorage.removeItem("admin_token"); navigate("/login"); };

    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const chartData = orders.reduce((acc, o) => {
        const date = new Date(o.created_at || Date.now()).toLocaleDateString();
        const ex = acc.find(a => a.date === date);
        if (ex) ex.revenue += o.total || 0;
        else acc.push({ date, revenue: o.total || 0 });
        return acc;
    }, []);

    const filteredProducts = products.filter(p =>
        (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f10", color: "#fff", fontFamily: "sans-serif" }}>

            {/* Sidebar */}
            <div style={{ width: "220px", background: "#111", borderRight: "1px solid #F9CDC2", padding: "30px 20px", display: "flex", flexDirection: "column", gap: "10px", position: "sticky", top: 0, height: "100vh" }}>
                <h2 style={{ color: "#F9CDC2", marginBottom: "30px", fontSize: "18px" }}>Admin Panel</h2>
                {[
                    { key: "products", label: "Products" },
                    { key: "orders", label: "Orders" },
                    { key: "analytics", label: "Analytics" },
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
                }}>Logout</button>
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>

                {serverError && (
                    <div style={{ background: "#ff444422", border: "1px solid #ff4444", borderRadius: "10px", padding: "14px 20px", marginBottom: "24px", color: "#ff8888" }}>
                        Cannot connect to server
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {tab === "products" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>
                            {editId ? "Edit Product" : "Add New Product"}
                        </h2>

                        {/* Form */}
                        <div style={{ background: "#111", padding: "28px", borderRadius: "16px", border: "1px solid #F9CDC2", maxWidth: "560px", marginBottom: "40px" }}>

                            {editId && (
                                <div style={{ background: "#F9CDC222", border: "1px solid #F9CDC2", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#F9CDC2" }}>
                                    Editing product ID: {editId}
                                </div>
                            )}

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Product Name *</label>
                                    <input name="name" placeholder="e.g. Gold Pearl Earring" value={form.name} onChange={handleChange} style={inputStyle} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Price (₹) *</label>
                                    <input name="price" type="number" placeholder="999" value={form.price} onChange={handleChange} style={inputStyle} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Original Price (₹)</label>
                                    <input name="originalPrice" type="number" placeholder="1299 (for discount)" value={form.originalPrice} onChange={handleChange} style={inputStyle} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                                        {["Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Other"].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "28px" }}>
                                    <input type="checkbox" name="inStock" id="inStock" checked={form.inStock} onChange={handleChange}
                                        style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                                    <label htmlFor="inStock" style={{ color: "#ccc", fontSize: "14px", cursor: "pointer" }}>In Stock</label>
                                </div>

                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea name="description" placeholder="Product description..." value={form.description} onChange={handleChange}
                                        style={{ ...inputStyle, height: "80px", resize: "vertical" }} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Material</label>
                                    <input name="material" placeholder="e.g. 18K Gold Plated" value={form.material} onChange={handleChange} style={inputStyle} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Variants (comma separated)</label>
                                    <input name="variants" placeholder="Gold, Silver, Rose Gold" value={form.variants} onChange={handleChange} style={inputStyle} />
                                </div>

                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={labelStyle}>Care Instructions</label>
                                    <input name="careInstructions" placeholder="Keep away from water and perfumes" value={form.careInstructions} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            {/* Image Section */}
                            <div style={{ marginTop: "8px" }}>
                                <label style={labelStyle}>Product Image *</label>

                                {/* Upload file */}
                                <div style={{ border: "2px dashed #F9CDC255", borderRadius: "10px", padding: "20px", textAlign: "center", marginBottom: "10px", cursor: "pointer", position: "relative" }}
                                    onClick={() => document.getElementById("imgFileInput").click()}>
                                    <input id="imgFileInput" type="file" accept="image/*" onChange={handleImageFile}
                                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                                    <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                                        Click to upload image from device
                                    </p>
                                    <p style={{ color: "#F9CDC2", fontSize: "12px", margin: "4px 0 0" }}>JPG, PNG, WEBP supported</p>
                                </div>

                                {/* OR image URL */}
                                <p style={{ color: "#555", fontSize: "12px", textAlign: "center", margin: "8px 0" }}>— OR paste image URL —</p>
                                <input
                                    placeholder="https://example.com/image.jpg"
                                    value={form.image.startsWith("data:") ? "" : form.image}
                                    onChange={handleImageUrl}
                                    style={inputStyle}
                                />

                                {/* Preview */}
                                {form.imagePreview && (
                                    <div style={{ marginTop: "12px", position: "relative", display: "inline-block", width: "100%" }}>
                                        <img src={form.imagePreview} alt="preview"
                                            style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }}
                                            onError={e => e.target.style.display = "none"} />
                                        <button onClick={() => setForm(f => ({ ...f, image: "", imagePreview: "" }))}
                                            style={{ position: "absolute", top: "8px", right: "8px", background: "#ff4444", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "#fff", fontSize: "14px" }}>
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                                <button onClick={saveProduct} disabled={loading} style={{
                                    flex: 1, padding: "14px", border: "none",
                                    background: loading ? "#888" : "#F9CDC2",
                                    borderRadius: "30px", cursor: loading ? "not-allowed" : "pointer",
                                    fontWeight: "bold", fontSize: "15px", color: "#000"
                                }}>
                                    {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
                                </button>
                                {editId && (
                                    <button onClick={cancelEdit} style={{
                                        padding: "14px 20px", border: "1px solid #F9CDC2",
                                        background: "transparent", borderRadius: "30px",
                                        cursor: "pointer", color: "#F9CDC2", fontWeight: "bold"
                                    }}>Cancel</button>
                                )}
                            </div>
                        </div>

                        {/* Search */}
                        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ ...inputStyle, maxWidth: "300px", margin: 0 }} />
                            {search && <button onClick={() => setSearch("")}
                                style={{ background: "transparent", border: "none", color: "#F9CDC2", cursor: "pointer", fontSize: "18px" }}>✕</button>}
                            <span style={{ color: "#888", fontSize: "13px" }}>{filteredProducts.length} / {products.length} products</span>
                        </div>

                        {/* Products Grid */}
                        <h3 style={{ marginBottom: "16px", color: "#F9CDC2" }}>All Products ({filteredProducts.length})</h3>
                        {filteredProducts.length === 0 && <p style={{ color: "#888" }}>No products found</p>}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                            {filteredProducts.map(p => (
                                <div key={p.id} style={{ background: "#111", borderRadius: "12px", border: "1px solid #333", overflow: "hidden" }}>
                                    <div style={{ position: "relative" }}>
                                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover" }}
                                            onError={e => e.target.src = "https://placehold.co/200x140?text=No+Image"} />
                                        {!p.in_stock && (
                                            <div style={{ position: "absolute", top: "6px", left: "6px", background: "#333", color: "#fff", fontSize: "10px", padding: "3px 8px", borderRadius: "10px" }}>
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: "12px" }}>
                                        <p style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "13px" }}>{p.name}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                            <span style={{ color: "#F9CDC2" }}>₹{p.price}</span>
                                            {p.original_price && <span style={{ textDecoration: "line-through", color: "#555", fontSize: "11px" }}>₹{p.original_price}</span>}
                                        </div>
                                        <p style={{ color: "#888", fontSize: "11px", marginBottom: "10px" }}>{p.category}</p>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button onClick={() => startEdit(p)} style={{ flex: 1, padding: "7px", background: "#1a1a1a", border: "1px solid #F9CDC2", borderRadius: "8px", color: "#F9CDC2", cursor: "pointer", fontSize: "12px" }}>
                                                Edit
                                            </button>
                                            <button onClick={() => deleteProduct(p.id)} style={{ flex: 1, padding: "7px", background: "#ff4444", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "12px" }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {tab === "orders" && (
                    <div>
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>Orders ({orders.length})</h2>
                        {orders.length === 0
                            ? <p style={{ color: "#888" }}>No orders yet</p>
                            : orders.map((o, i) => (
                                <div key={i} style={{ background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <span style={{ fontWeight: "bold" }}>{o.customer?.name || "N/A"}</span>
                                        <span style={{ color: "#F9CDC2", fontWeight: "bold" }}>₹{o.total}</span>
                                    </div>
                                    <p style={{ color: "#888", fontSize: "13px" }}>Phone: {o.customer?.phone || "N/A"}</p>
                                    <p style={{ color: "#888", fontSize: "13px" }}>Address: {o.customer?.address || "N/A"}</p>
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
                        <h2 style={{ color: "#F9CDC2", marginBottom: "24px" }}>Analytics</h2>
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
                                ? <p style={{ color: "#888" }}>Chart will appear once orders come in</p>
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

const labelStyle = {
    display: "block", fontSize: "12px", color: "#888",
    marginBottom: "4px", marginTop: "8px", fontWeight: 600
};

const inputStyle = {
    width: "100%", padding: "11px 14px", margin: "0 0 4px",
    borderRadius: "10px", border: "1px solid #333",
    background: "#1a1a1a", color: "#fff",
    boxSizing: "border-box", fontSize: "14px", outline: "none"
};

export default Admin;
