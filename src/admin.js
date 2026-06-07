import React, { useState, useEffect, useRef, useCallback } from "react";

const API = "https://rayfinesite-3.onrender.com/api";

// ── Helpers ──────────────────────────────────
function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function Badge({ type, children }) {
  const map = {
    "in-stock":  { bg: "#EAF3DE", color: "#3B6D11" },
    "low":       { bg: "#FAEEDA", color: "#854F0B" },
    "out":       { bg: "#FCEBEB", color: "#A32D2D" },
    "sale":      { bg: "#EEEDFE", color: "#534AB7" },
    "new":       { bg: "#E1F5EE", color: "#0F6E56" },
    "bestseller":{ bg: "#FFF3CD", color: "#8B6914" },
    "trending":  { bg: "#FCE4FF", color: "#7B2D8B" },
    "order-new": { bg: "#E6F1FB", color: "#185FA5" },
    "order-proc":{ bg: "#FAEEDA", color: "#854F0B" },
    "order-ship":{ bg: "#E1F5EE", color: "#0F6E56" },
    "order-del": { bg: "#EAF3DE", color: "#3B6D11" },
    "order-can": { bg: "#FCEBEB", color: "#A32D2D" },
  };
  const s = map[type] || { bg: "#F1EFE8", color: "#5F5E5A" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 20, background: s.bg, color: s.color,
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.3px",
    }}>
      {children}
    </span>
  );
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 99999,
      background: type === "error" ? "#A32D2D" : "#2C2418",
      color: "#fff", padding: "12px 20px", borderRadius: 6,
      fontSize: 13, fontWeight: 600, letterSpacing: "0.4px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
      display: "flex", alignItems: "center", gap: 8,
      fontFamily: "'DM Sans', sans-serif",
      animation: "slideUp 0.3s ease",
    }}>
      <span>{type === "error" ? "✕" : "✓"}</span>
      {msg}
    </div>
  );
}

// ── SIDEBAR NAV ───────────────────────────────
const NAV = [
  { id: "dashboard",     icon: "◈",  label: "Dashboard" },
  { id: "products",      icon: "◇",  label: "Products" },
  { id: "upload",        icon: "⊕",  label: "Add Product" },
  { id: "bulk",          icon: "⊞",  label: "Bulk Upload" },
  { id: "categories",    icon: "◉",  label: "Categories" },
  { id: "collections",   icon: "★",  label: "Collections" },
  { id: "orders",        icon: "⊡",  label: "Orders" },
  { id: "notifications", icon: "◎",  label: "Notifications" },
];

const OCCASIONS = ["Festive","Gifting","Bridal","Everyday","Vacation","Party","Traditional"];
const CATEGORIES = ["Earring","Necklace","Anklet","Gemstone Charm","Bangles","Bracelet","Pendants","Ring"];

// ── SAMPLE DATA ───────────────────────────────
const SAMPLE_ORDERS = [
  { id:"#1041", customer:"Priya Sharma",  items:"Bridal Set × 1",         amount:8500,  status:"new",       date:"Jun 5" },
  { id:"#1040", customer:"Rahul Verma",   items:"Gold Anklet × 2",        amount:1798,  status:"processing",date:"Jun 5" },
  { id:"#1039", customer:"Sunita Patel",  items:"Pearl Earrings × 1",     amount:2200,  status:"delivered", date:"Jun 4" },
  { id:"#1038", customer:"Anjali Singh",  items:"Ruby Pendant × 1",       amount:4500,  status:"processing",date:"Jun 4" },
  { id:"#1037", customer:"Meena Das",     items:"Meenakari Bangles × 3",  amount:6300,  status:"new",       date:"Jun 4" },
  { id:"#1036", customer:"Kavya Nair",    items:"Silver Anklet × 1",      amount:899,   status:"shipped",   date:"Jun 3" },
  { id:"#1035", customer:"Reena Shah",    items:"Gemstone Charm × 2",     amount:9000,  status:"delivered", date:"Jun 3" },
];

const SAMPLE_NOTIFS = [
  { id:1, text:"New order #1041 — Bridal Set (₹8,500) from Priya Sharma",       time:"2 min ago",  read:false, type:"order" },
  { id:2, text:"New order #1040 — Gold Anklet × 2 from Rahul Verma",            time:"15 min ago", read:false, type:"order" },
  { id:3, text:"⚠ Low stock: Pearl Choker — only 2 units remaining",             time:"1 hr ago",   read:false, type:"stock" },
  { id:4, text:"⚠ Out of stock: Silver Anklet — restock needed",                 time:"3 hr ago",   read:false, type:"stock" },
  { id:5, text:"New order #1037 — Meenakari Bangles × 3 from Meena Das",        time:"5 hr ago",   read:false, type:"order" },
  { id:6, text:"Order #1035 delivered to Reena Shah",                            time:"Yesterday",  read:true,  type:"info"  },
  { id:7, text:"Bulk upload complete — 12 new products added",                   time:"2 days ago", read:true,  type:"info"  },
];

// ── BLANK PRODUCT FORM ────────────────────────
function blankProduct() {
  return {
    name: "", price: "", originalPrice: "", category: "", occasion: "",
    stock: "", material: "", description: "", careInstructions: "",
    inStock: true, isBestseller: false, isTrending: false, isNew: false, onSale: false,
    image: "", variants: "",
  };
}

// ═════════════════════════════════════════════
// ADMIN COMPONENT
// ═════════════════════════════════════════════
export default function Admin() {
  const [page, setPage]           = useState("dashboard");
  const [products, setProducts]   = useState([]);
  const [orders, setOrders]       = useState(SAMPLE_ORDERS);
  const [notifs, setNotifs]       = useState(SAMPLE_NOTIFS);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [sideOpen, setSideOpen]   = useState(true);
  const [searchQ, setSearchQ]     = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const [authed, setAuthed]   = useState(() => sessionStorage.getItem("rfo_admin") === "yes");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const ADMIN_PASSWORD = "rayfine2024";

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const fixed = list.map(p => ({
          ...p,
          id: p._id || p.id,
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim(),
        }));
        setProducts(fixed);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showToast("Could not load products", "error");
      });
  }, [authed]);

  const newOrders   = orders.filter(o => o.status === "new").length;
  const unreadNotif = notifs.filter(n => !n.read).length;

  // ── Password gate ─────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--cream)", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{
          background: "#fff", border: "1px solid var(--border-light)", borderRadius: 12,
          padding: "48px 44px", maxWidth: 400, width: "100%", textAlign: "center",
          boxShadow: "0 20px 60px rgba(44,36,24,0.1)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>◈</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>
            Admin Access
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 28, letterSpacing: "0.5px" }}>
            Ray Fine Ornates · Store Management
          </p>
          <input
            type="password" placeholder="Enter admin password"
            value={pwInput}
            onChange={e => { setPwInput(e.target.value); setPwError(""); }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (pwInput === ADMIN_PASSWORD) { sessionStorage.setItem("rfo_admin", "yes"); setAuthed(true); }
                else setPwError("Incorrect password");
              }
            }}
            style={{
              width: "100%", boxSizing: "border-box", padding: "12px 16px",
              border: "1.5px solid var(--border)", borderRadius: 6, fontSize: 14,
              fontFamily: "inherit", outline: "none", marginBottom: 8, color: "var(--text)",
            }}
          />
          {pwError && <p style={{ color: "#A32D2D", fontSize: 12, marginBottom: 8 }}>{pwError}</p>}
          <button
            onClick={() => {
              if (pwInput === ADMIN_PASSWORD) { sessionStorage.setItem("rfo_admin", "yes"); setAuthed(true); }
              else setPwError("Incorrect password");
            }}
            style={{
              width: "100%", padding: "12px", background: "var(--text)", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700,
              letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Login →
          </button>
          <p style={{ marginTop: 16, fontSize: 11, color: "var(--text-muted)" }}>
            Default password: <code style={{ background: "var(--cream)", padding: "2px 6px", borderRadius: 3 }}>rayfine2024</code>
          </p>
        </div>
      </div>
    );
  }

  // ── Filtered products ─────────────────────
  const filtered = products.filter(p => {
    const q = searchQ.toLowerCase();
    const matchQ   = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
    const matchCat = catFilter === "All" || p.category?.toLowerCase().includes(catFilter.toLowerCase());
    return matchQ && matchCat;
  });

  // ── Shared styles ─────────────────────────
  const card = {
    background: "#fff", border: "1px solid var(--border-light)",
    borderRadius: 10, padding: "20px 22px", marginBottom: 16,
  };
  const inputSt = {
    width: "100%", boxSizing: "border-box", padding: "9px 12px",
    border: "1.5px solid var(--border)", borderRadius: 6, fontSize: 13,
    fontFamily: "'DM Sans',sans-serif", outline: "none", color: "var(--text)",
    background: "#fff",
  };
  const labelSt = {
    fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "var(--text-muted)",
    textTransform: "uppercase", display: "block", marginBottom: 4,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans',sans-serif", background: "var(--cream)" }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .admin-nav-item:hover { background: var(--cream2) !important; color: var(--text) !important; }
        .admin-nav-item.active { background: #F5EFE6 !important; color: var(--primary) !important; border-left: 3px solid var(--primary) !important; }
        .admin-table tr:hover td { background: #faf7f2; }
        .admin-btn-icon:hover { background: var(--cream2) !important; }
        .toggle-check:checked + .toggle-slider { background: #B07A5A !important; }
        .toggle-slider:before { content:''; position:absolute; width:14px; height:14px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:.2s; }
        .toggle-check:checked + .toggle-slider:before { transform: translateX(16px); }
        input:focus, select:focus, textarea:focus { border-color: var(--primary) !important; }
        .upload-drop:hover { border-color: var(--primary) !important; background: #fdf8f4 !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: var(--cream); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius:4px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: sideOpen ? 224 : 60, minWidth: sideOpen ? 224 : 60,
        background: "#fff", borderRight: "1px solid var(--border-light)",
        display: "flex", flexDirection: "column", transition: "width 0.25s ease",
        overflow: "hidden", zIndex: 100, flexShrink: 0,
      }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 10, justifyContent: sideOpen ? "flex-start" : "center" }}>
          <span style={{ fontSize: 20, color: "var(--primary)", flexShrink: 0 }}>◈</span>
          {sideOpen && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "0.5px", fontFamily: "Cormorant Garamond, serif" }}>
                Ray Fine Admin
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "1px" }}>Store Management</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {NAV.map(n => (
            <div key={n.id}
              className={`admin-nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: sideOpen ? "9px 18px" : "9px 0",
                justifyContent: sideOpen ? "flex-start" : "center",
                cursor: "pointer", transition: "all .15s",
                color: page === n.id ? "var(--primary)" : "var(--text-muted)",
                fontSize: 13, borderLeft: page === n.id ? "3px solid var(--primary)" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {sideOpen && <span>{n.label}</span>}
              {sideOpen && n.id === "orders" && newOrders > 0 && (
                <span style={{ marginLeft: "auto", background: "#A32D2D", color: "#fff", fontSize: 10, padding: "1px 6px", borderRadius: 10 }}>{newOrders}</span>
              )}
              {sideOpen && n.id === "notifications" && unreadNotif > 0 && (
                <span style={{ marginLeft: "auto", background: "#A32D2D", color: "#fff", fontSize: 10, padding: "1px 6px", borderRadius: 10 }}>{unreadNotif}</span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: sideOpen ? "flex-end" : "center" }}>
          <button onClick={() => setSideOpen(!sideOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text-muted)", padding: "4px 8px", borderRadius: 4 }}>
            {sideOpen ? "◀" : "▶"}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid var(--border-light)",
          padding: "0 24px", height: 58, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 400, color: "var(--text)" }}>
            {NAV.find(n => n.id === page)?.label || "Admin"}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage("upload")}
              style={{ padding: "7px 16px", borderRadius: 4, border: "none", background: "var(--text)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>
              + Add Product
            </button>
            <button onClick={() => { sessionStorage.removeItem("rfo_admin"); setAuthed(false); }}
              style={{ padding: "7px 14px", borderRadius: 4, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "1px", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {page === "dashboard" && (
            <DashboardPage products={products} orders={orders} loading={loading} setPage={setPage} />
          )}

          {page === "products" && (
            <ProductsPage
              products={filtered} loading={loading}
              searchQ={searchQ} setSearchQ={setSearchQ}
              catFilter={catFilter} setCatFilter={setCatFilter}
              setPage={setPage}
              showToast={showToast}
              onToggleSale={id => {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, onSale: !p.onSale } : p));
                showToast("Sale status updated");
              }}
              onToggleStock={id => {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
                showToast("Stock status updated");
              }}
              card={card} inputSt={inputSt}
            />
          )}

          {page === "upload" && (
            <UploadPage
              onSave={product => {
                setProducts(prev => [{ ...product, id: Date.now(), inStock: product.stock > 0 }, ...prev]);
                showToast("Product saved successfully!");
                setPage("products");
              }}
              card={card} inputSt={inputSt} labelSt={labelSt}
            />
          )}

          {page === "bulk" && (
            <BulkUploadPage
              card={card} inputSt={inputSt}
              showToast={showToast}
              onImport={imported => {
                setProducts(prev => [...imported, ...prev]);
                showToast(`${imported.length} products imported!`);
                setPage("products");
              }}
            />
          )}

          {page === "categories" && (
            <CategoriesPage card={card} showToast={showToast} />
          )}

          {page === "collections" && (
            <CollectionsPage
              products={products} setProducts={setProducts}
              card={card} showToast={showToast}
            />
          )}

          {page === "orders" && (
            <OrdersPage
              orders={orders} setOrders={setOrders}
              card={card} showToast={showToast}
            />
          )}

          {page === "notifications" && (
            <NotificationsPage
              notifs={notifs} setNotifs={setNotifs}
              card={card}
            />
          )}

        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ═════════════════════════════════════════════
// DASHBOARD PAGE
// ═════════════════════════════════════════════
function DashboardPage({ products, orders, loading, setPage }) {
  const outOfStock = products.filter(p => !p.inStock).length;
  const onSale     = products.filter(p => p.onSale || p.originalPrice).length;
  const newOrders  = orders.filter(o => o.status === "new").length;

  const StatCard = ({ label, value, sub, color }) => (
    <div style={{
      background: "#fff", border: "1px solid var(--border-light)", borderRadius: 10,
      padding: "18px 20px", cursor: "pointer",
    }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: color || "var(--text)", marginBottom: 3, fontFamily: "Cormorant Garamond, serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );

  const catCounts = {};
  products.forEach(p => { const k = p.category || "Other"; catCounts[k] = (catCounts[k] || 0) + 1; });
  const catArr = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCat = catArr[0]?.[1] || 1;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Products" value={loading ? "..." : products.length} sub="+8 this week" />
        <StatCard label="New Orders"     value={newOrders} sub="Needs attention" color={newOrders > 0 ? "#A32D2D" : undefined} />
        <StatCard label="Out of Stock"   value={loading ? "..." : outOfStock} sub="Needs restock" color={outOfStock > 0 ? "#A32D2D" : undefined} />
        <StatCard label="Active Sales"   value={loading ? "..." : onSale} sub="Discounted items" color="#3B6D11" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Recent orders */}
        <div style={{ background: "#fff", border: "1px solid var(--border-light)", borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, color: "var(--text)" }}>Recent Orders</span>
            <button onClick={() => setPage("orders")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.5px" }}>View all →</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Order", "Customer", "Amount", "Status"].map(h => (
                <th key={h} style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textAlign: "left", padding: "5px 8px", borderBottom: "1px solid var(--border-light)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id}>
                  <td style={{ padding: "8px 8px", fontSize: 13, color: "var(--text-muted)" }}>{o.id}</td>
                  <td style={{ padding: "8px 8px", fontSize: 13, color: "var(--text)" }}>{o.customer}</td>
                  <td style={{ padding: "8px 8px", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{formatINR(o.amount)}</td>
                  <td style={{ padding: "8px 8px" }}>
                    <Badge type={o.status === "new" ? "order-new" : o.status === "processing" ? "order-proc" : o.status === "shipped" ? "order-ship" : "order-del"}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products by category */}
        <div style={{ background: "#fff", border: "1px solid var(--border-light)", borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 17, color: "var(--text)" }}>Products by Category</span>
          </div>
          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: 20 }}>Loading...</p>
          ) : catArr.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No products yet</p>
            </div>
          ) : catArr.map(([cat, cnt]) => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span style={{ color: "var(--text)" }}>{cat}</span>
                <span style={{ color: "var(--text-muted)" }}>{cnt} products</span>
              </div>
              <div style={{ height: 5, background: "var(--cream2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "var(--primary)", width: `${(cnt / maxCat) * 100}%`, borderRadius: 4, transition: "width .6s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// PRODUCTS PAGE
// ═════════════════════════════════════════════
function ProductsPage({ products, loading, searchQ, setSearchQ, catFilter, setCatFilter, setPage, onToggleSale, onToggleStock, card, inputSt }) {

  function stockBadge(p) {
    if (!p.inStock) return <Badge type="out">Out of Stock</Badge>;
    if ((p.stock || 0) <= 5) return <Badge type="low">Low Stock</Badge>;
    return <Badge type="in-stock">In Stock</Badge>;
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="🔍  Search products..."
          value={searchQ} onChange={e => setSearchQ(e.target.value)}
          style={{ ...inputSt, flex: 1, minWidth: 200 }}
        />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ ...inputSt, width: 160 }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ alignSelf: "center", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {products.length} product{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontStyle: "italic", fontFamily: "Cormorant Garamond,serif", fontSize: 18 }}>
            Loading collection...
          </p>
        ) : products.length === 0 ? (
          // ── NO PRODUCTS PLACEHOLDER ──
          <div style={{
            padding: "70px 20px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          }}>
            <div style={{ fontSize: 52, opacity: 0.18, color: "var(--text)", lineHeight: 1 }}>◇</div>
            <p style={{
              fontFamily: "Cormorant Garamond, serif", fontSize: 24,
              fontWeight: 400, color: "var(--text)", margin: 0,
            }}>
              No products yet
            </p>
            <p style={{
              fontSize: 13, color: "var(--text-muted)", maxWidth: 280,
              lineHeight: 1.7, margin: 0,
            }}>
              Your collection is empty. The client can add products here when ready.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button
                onClick={() => setPage("upload")}
                style={{
                  padding: "10px 22px", background: "var(--text)", color: "#fff",
                  border: "none", borderRadius: 5, fontSize: 11, fontWeight: 700,
                  letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                + Add Product
              </button>
              <button
                onClick={() => setPage("bulk")}
                style={{
                  padding: "10px 22px", background: "transparent", color: "var(--text-muted)",
                  border: "1px solid var(--border)", borderRadius: 5, fontSize: 11, fontWeight: 700,
                  letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                Bulk Upload
              </button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "var(--cream)" }}>
                  {["Image", "Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textAlign: "left", padding: "10px 14px", borderBottom: "1px solid var(--border-light)", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="admin-table" style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <img src={p.image} alt={p.name}
                        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border-light)", background: "var(--cream)" }}
                        onError={e => { e.target.src = "https://placehold.co/44x44?text=?"; }} />
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text)", fontWeight: 500, maxWidth: 180 }}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15 }}>{p.name}</div>
                      {p.material && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{p.material}</div>}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)" }}>{p.category}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text)", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {formatINR(p.price)}
                      {p.originalPrice && <div style={{ fontSize: 10, color: "var(--text-muted)", textDecoration: "line-through" }}>{formatINR(p.originalPrice)}</div>}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{p.stock || 0}</span>
                        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>units</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      {stockBadge(p)}
                      {p.onSale && <span style={{ marginLeft: 5 }}><Badge type="sale">Sale</Badge></span>}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button className="admin-btn-icon" onClick={() => onToggleStock(p.id)}
                          title={p.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                          style={{ padding: "5px 8px", border: "1px solid var(--border-light)", borderRadius: 5, background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--text-muted)" }}>
                          {p.inStock ? "📦" : "🚫"}
                        </button>
                        <button className="admin-btn-icon" onClick={() => onToggleSale(p.id)}
                          title="Toggle Sale"
                          style={{ padding: "5px 8px", border: "1px solid var(--border-light)", borderRadius: 5, background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--text-muted)" }}>
                          🏷
                        </button>
                        <button className="admin-btn-icon"
                          title="Edit"
                          style={{ padding: "5px 8px", border: "1px solid var(--border-light)", borderRadius: 5, background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--text-muted)" }}>
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// UPLOAD PAGE (MANUAL)
// ═════════════════════════════════════════════
function UploadPage({ onSave, card, inputSt, labelSt }) {
  const [form, setForm]         = useState(blankProduct());
  const [errors, setErrors]     = useState({});
  const [imgPreview, setImgPreview] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.price)       e.price = "Required";
    if (!form.category)    e.category = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageURL = e => {
    const url = e.target.value;
    set("image", url);
    setImgPreview(url || null);
  };

  const Row = ({ children }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>{children}</div>
  );
  const Field = ({ label, error, children, full }) => (
    <div style={full ? { gridColumn: "1/-1" } : {}}>
      <label style={labelSt}>{label}{error && <span style={{ color: "#A32D2D", marginLeft: 6, fontWeight: 700 }}>{error}</span>}</label>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={card}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "var(--text)", marginBottom: 20 }}>
          Add New Product
        </h3>

        <Row>
          <Field label="Product Name" error={errors.name}>
            <input style={{ ...inputSt, borderColor: errors.name ? "#A32D2D" : undefined }}
              placeholder="e.g. Kundan Jhumka Set"
              value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>
          <Field label="Price (₹)" error={errors.price}>
            <input type="number" style={{ ...inputSt, borderColor: errors.price ? "#A32D2D" : undefined }}
              placeholder="1499" value={form.price} onChange={e => set("price", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Original Price (₹) — leave blank if no discount">
            <input type="number" style={inputSt} placeholder="0 = no strike-through"
              value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)} />
          </Field>
          <Field label="Stock Quantity">
            <input type="number" style={inputSt} placeholder="0"
              value={form.stock} onChange={e => set("stock", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Category" error={errors.category}>
            <select style={{ ...inputSt, borderColor: errors.category ? "#A32D2D" : undefined }}
              value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Shop by Occasion">
            <select style={inputSt} value={form.occasion} onChange={e => set("occasion", e.target.value)}>
              <option value="">Select occasion</option>
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Material">
            <input style={inputSt} placeholder="e.g. Gold plated, Pearl stone"
              value={form.material} onChange={e => set("material", e.target.value)} />
          </Field>
          <Field label="Variants (comma-separated)">
            <input style={inputSt} placeholder="e.g. Gold,Silver,Rose Gold"
              value={form.variants} onChange={e => set("variants", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Description" full>
            <textarea style={{ ...inputSt, resize: "vertical" }} rows={3}
              placeholder="Describe the product..."
              value={form.description} onChange={e => set("description", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Care Instructions" full>
            <input style={inputSt} placeholder="e.g. Avoid water, store in dry pouch"
              value={form.careInstructions} onChange={e => set("careInstructions", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Image URL" full>
            <input style={inputSt} placeholder="https://..."
              value={form.image} onChange={handleImageURL} />
          </Field>
        </Row>

        {imgPreview && (
          <div style={{ marginBottom: 14 }}>
            <img src={imgPreview} alt="Preview"
              style={{ height: 100, width: 100, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border-light)" }}
              onError={() => setImgPreview(null)} />
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={labelSt}>Tags</label>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
            {[
              ["isBestseller", "⭐ Best Seller"],
              ["isTrending",   "🔥 Trending"],
              ["isNew",        "✨ New Arrival"],
              ["onSale",       "🏷 On Sale"],
              ["inStock",      "📦 In Stock"],
            ].map(([k, label]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "var(--text-muted)" }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)}
                  style={{ accentColor: "var(--primary)", width: 15, height: 15 }} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              if (validate()) onSave({
                ...form,
                price: Number(form.price),
                originalPrice: Number(form.originalPrice) || undefined,
                stock: Number(form.stock),
                variants: form.variants ? form.variants.split(",").map(v => v.trim()) : [],
              });
            }}
            style={{ padding: "10px 24px", background: "var(--text)", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
            Save Product
          </button>
          <button onClick={() => setForm(blankProduct())}
            style={{ padding: "10px 20px", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// BULK UPLOAD PAGE
// ═════════════════════════════════════════════
function BulkUploadPage({ card, inputSt, showToast, onImport }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState([]);
  const [dragging, setDragging] = useState(false);

  const CSV_HEADERS = "name,price,originalPrice,category,occasion,stock,material,description,image,isBestseller,isTrending,isNew,onSale";

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map((line, i) => {
      const vals = line.split(",").map(v => v.trim());
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = vals[idx] || ""; });
      return {
        ...obj, id: Date.now() + i,
        price: Number(obj.price) || 0,
        originalPrice: Number(obj.originalPrice) || undefined,
        stock: Number(obj.stock) || 0,
        inStock: Number(obj.stock) > 0,
        isBestseller: obj.isBestseller === "true",
        isTrending:   obj.isTrending === "true",
        isNew:        obj.isNew === "true",
        onSale:       obj.onSale === "true",
      };
    });
  };

  const handleFile = f => {
    if (!f || !f.name.endsWith(".csv")) { showToast("Please upload a .csv file", "error"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = parseCSV(e.target.result);
        setPreview(parsed);
        showToast(`${parsed.length} products ready to import`);
      } catch { showToast("CSV format error", "error"); }
    };
    reader.readAsText(f);
  };

  const downloadTemplate = () => {
    const sample = `${CSV_HEADERS}\nKundan Jhumka,1499,1999,Earring,Festive,20,Gold plated,Beautiful earrings,https://example.com/img.jpg,true,false,true,false`;
    const blob = new Blob([sample], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rfo_products_template.csv"; a.click();
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={card}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>
          Bulk Upload via CSV
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18, lineHeight: 1.6 }}>
          Upload multiple products at once. Download the template, fill in your products, then upload.
        </p>

        <button onClick={downloadTemplate}
          style={{ padding: "9px 20px", border: "1px solid var(--border)", borderRadius: 5, background: "transparent", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", marginBottom: 20 }}>
          ↓ Download CSV Template
        </button>

        <div
          className="upload-drop"
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "var(--primary)" : "var(--border)"}`,
            borderRadius: 8, padding: "36px 24px", textAlign: "center", cursor: "pointer",
            background: dragging ? "#fdf8f4" : "transparent", transition: "all .2s", marginBottom: 16,
          }}>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 28, marginBottom: 8, color: "var(--text-muted)" }}>📄</div>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Drop your CSV file here or <strong style={{ color: "var(--primary)" }}>click to browse</strong></p>
          <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 4 }}>Only .csv files supported</p>
        </div>

        <div style={{ background: "var(--cream)", padding: "14px 16px", borderRadius: 6, fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.7 }}>
          <strong style={{ color: "var(--text)" }}>Required CSV columns:</strong><br />
          {CSV_HEADERS}
        </div>

        {preview.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{preview.length} products parsed</span>
              <button onClick={() => onImport(preview)}
                style={{ padding: "9px 20px", background: "var(--text)", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>
                Import All →
              </button>
            </div>
            <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid var(--border-light)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--cream)" }}>
                    {["Name", "Category", "Price", "Stock", "Occasion"].map(h => (
                      <th key={h} style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textAlign: "left", padding: "8px 12px", borderBottom: "1px solid var(--border-light)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 8).map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "7px 12px", fontSize: 13, color: "var(--text)" }}>{p.name}</td>
                      <td style={{ padding: "7px 12px", fontSize: 12, color: "var(--text-muted)" }}>{p.category}</td>
                      <td style={{ padding: "7px 12px", fontSize: 13 }}>{formatINR(p.price)}</td>
                      <td style={{ padding: "7px 12px", fontSize: 13 }}>{p.stock}</td>
                      <td style={{ padding: "7px 12px", fontSize: 12, color: "var(--text-muted)" }}>{p.occasion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 8 && <p style={{ padding: "8px 12px", fontSize: 11, color: "var(--text-muted)" }}>+{preview.length - 8} more rows...</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// CATEGORIES PAGE
// ═════════════════════════════════════════════
function CategoriesPage({ card, showToast }) {
  const [occs, setOccs] = useState(OCCASIONS.map(o => ({ name: o, on: true })));
  const [cats, setCats] = useState(CATEGORIES.map(c => ({ name: c, on: true })));

  const Chip = ({ item, onToggle }) => (
    <div onClick={onToggle}
      style={{
        padding: "9px 14px", border: `1.5px solid ${item.on ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 7, fontSize: 12, textAlign: "center", cursor: "pointer",
        background: item.on ? "#FDF8F4" : "transparent", color: item.on ? "var(--primary)" : "var(--text-muted)",
        fontWeight: item.on ? 700 : 400, transition: "all .15s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
      <span>{item.on ? "✓" : ""}</span>
      {item.name}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={card}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>Shop by Occasion</h3>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>Click to toggle visibility on the homepage.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {occs.map((o, i) => <Chip key={o.name} item={o} onToggle={() => setOccs(prev => prev.map((x, j) => j === i ? { ...x, on: !x.on } : x))} />)}
        </div>
        <button onClick={() => showToast("Occasion visibility saved!")}
          style={{ padding: "9px 20px", background: "var(--text)", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>
          Save Changes
        </button>
      </div>

      <div style={card}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>Shop by Category</h3>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>Click to show/hide categories in the shop.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
          {cats.map((c, i) => <Chip key={c.name} item={c} onToggle={() => setCats(prev => prev.map((x, j) => j === i ? { ...x, on: !x.on } : x))} />)}
        </div>
        <button onClick={() => showToast("Category visibility saved!")}
          style={{ padding: "9px 20px", background: "var(--text)", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// COLLECTIONS PAGE
// ═════════════════════════════════════════════
function CollectionsPage({ products, setProducts, card, showToast }) {
  const toggle = (id, field) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: !p[field] } : p));
  };

  const Toggle = ({ checked, onChange }) => (
    <label style={{ position: "relative", display: "inline-block", width: 36, height: 20, flexShrink: 0 }}>
      <input type="checkbox" className="toggle-check" checked={checked} onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }} />
      <span className="toggle-slider"
        style={{ position: "absolute", inset: 0, background: checked ? "var(--primary)" : "var(--border)", borderRadius: 20, cursor: "pointer", transition: ".2s" }} />
    </label>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "var(--text)" }}>Best Sellers &amp; Trending</span>
          <button onClick={() => showToast("Collections updated!")}
            style={{ padding: "8px 18px", background: "var(--text)", color: "#fff", border: "none", borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>
            Save
          </button>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center" }}>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "var(--text-muted)", fontWeight: 400 }}>No products to configure yet</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Add products first, then manage collections here.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr style={{ background: "var(--cream)" }}>
                  {["Product", "Category", "Best Seller", "Trending", "New Arrival", "On Sale"].map(h => (
                    <th key={h} style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textAlign: "left", padding: "9px 14px", borderBottom: "1px solid var(--border-light)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 20).map(p => (
                  <tr key={p.id} className="admin-table" style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "9px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={p.image} alt={p.name}
                          style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 5, border: "1px solid var(--border-light)", background: "var(--cream)", flexShrink: 0 }}
                          onError={e => e.target.src = "https://placehold.co/36x36?text=?"} />
                        <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 14, color: "var(--text)" }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--text-muted)" }}>{p.category}</td>
                    <td style={{ padding: "9px 14px" }}><Toggle checked={!!p.isBestseller} onChange={() => toggle(p.id, "isBestseller")} /></td>
                    <td style={{ padding: "9px 14px" }}><Toggle checked={!!p.isTrending}   onChange={() => toggle(p.id, "isTrending")} /></td>
                    <td style={{ padding: "9px 14px" }}><Toggle checked={!!p.isNew}         onChange={() => toggle(p.id, "isNew")} /></td>
                    <td style={{ padding: "9px 14px" }}><Toggle checked={!!p.onSale}        onChange={() => toggle(p.id, "onSale")} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// ORDERS PAGE
// ═════════════════════════════════════════════
const ORDER_STATUSES = ["new", "processing", "shipped", "delivered", "cancelled"];

function OrdersPage({ orders, setOrders, card, showToast }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast("Order status updated");
  };

  const filtered = orders.filter(o => {
    const matchF = filter === "all" || o.status === filter;
    const matchS = !search || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const total = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          ["All",         orders.length,                                    "var(--text)"],
          ["New",         orders.filter(o => o.status === "new").length,         "#A32D2D"],
          ["Processing",  orders.filter(o => o.status === "processing").length,  "#854F0B"],
          ["Shipped",     orders.filter(o => o.status === "shipped").length,     "#0F6E56"],
          ["Delivered",   orders.filter(o => o.status === "delivered").length,   "#3B6D11"],
        ].map(([l, v, c]) => (
          <div key={l} onClick={() => setFilter(l.toLowerCase())}
            style={{ background: "#fff", border: `1px solid ${filter === l.toLowerCase() ? "var(--primary)" : "var(--border-light)"}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer", transition: "all .15s" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: c, fontFamily: "Cormorant Garamond,serif" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input placeholder="Search by order ID or customer..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: "9px 12px", border: "1.5px solid var(--border)", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", color: "var(--text)" }} />
        <span style={{ alignSelf: "center", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          Total: <strong style={{ color: "var(--text)" }}>{formatINR(total)}</strong>
        </span>
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "var(--cream)" }}>
                {["Order ID", "Date", "Customer", "Items", "Amount", "Status", "Update"].map(h => (
                  <th key={h} style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textAlign: "left", padding: "10px 14px", borderBottom: "1px solid var(--border-light)", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="admin-table" style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{o.id}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)" }}>{o.date}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text)" }}>{o.customer}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)" }}>{o.items}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{formatINR(o.amount)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <Badge type={o.status === "new" ? "order-new" : o.status === "processing" ? "order-proc" : o.status === "shipped" ? "order-ship" : o.status === "cancelled" ? "order-can" : "order-del"}>
                      {o.status}
                    </Badge>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      style={{ padding: "5px 8px", border: "1px solid var(--border)", borderRadius: 5, fontSize: 12, fontFamily: "'DM Sans',sans-serif", color: "var(--text)", background: "#fff", cursor: "pointer", outline: "none" }}>
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// NOTIFICATIONS PAGE
// ═════════════════════════════════════════════
function NotificationsPage({ notifs, setNotifs, card }) {
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markOne = id => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clear   = id => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, color: "var(--text)" }}>
            All Notifications
            <span style={{ marginLeft: 10, fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif" }}>
              {notifs.filter(n => !n.read).length} unread
            </span>
          </span>
          <button onClick={markAll}
            style={{ padding: "7px 16px", border: "1px solid var(--border)", borderRadius: 5, background: "transparent", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
            Mark all read
          </button>
        </div>

        {notifs.map(n => (
          <div key={n.id} style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "12px 0", borderBottom: "1px solid var(--border-light)",
            opacity: n.read ? 0.55 : 1,
          }}>
            <div style={{
              width: 9, height: 9, borderRadius: "50%", marginTop: 5, flexShrink: 0,
              background: n.read ? "var(--border)" : n.type === "stock" ? "#E24B4A" : "var(--primary)",
            }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, margin: 0 }}>{n.text}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, marginBottom: 0 }}>{n.time}</p>
            </div>
            <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
              {!n.read && (
                <button onClick={() => markOne(n.id)}
                  style={{ padding: "4px 8px", border: "1px solid var(--border-light)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-muted)" }}>
                  Read
                </button>
              )}
              <button onClick={() => clear(n.id)}
                style={{ padding: "4px 8px", border: "1px solid var(--border-light)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "#A32D2D" }}>
                ✕
              </button>
            </div>
          </div>
        ))}

        {notifs.length === 0 && (
          <p style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 14 }}>No notifications</p>
        )}
      </div>
    </div>
  );
}
