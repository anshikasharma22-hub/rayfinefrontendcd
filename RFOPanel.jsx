
Import React, { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════
// 🔧 REPLACE THESE WITH YOUR SUPABASE DETAILS
// ══════════════════════════════════════════════
const SUPABASE_URL = "https://ajqqaeejotlghgilgajy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcXFhZWVqb3RsZ2hnaWxnYWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjU2MTUsImV4cCI6MjA5NTY0MTYxNX0.fZ1MmCpMiQnwu7HsaK3zP4HXjxrLK6JseEZSUvIkreY";
const SUPABASE_TABLE = "products"; // your table name in supabase

const API = "https://rayfinesite-3.onrender.com/api";
const ADMIN_PASSWORD = "rayfinejaipur"; // change this!

// ── Supabase helper ──────────────────────────
async function supabaseQuery(path, method = "GET", body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json().catch(() => null);
}

// ── Helpers ──────────────────────────────────
function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 99999,
      background: type === "error" ? "#7f1d1d" : "#14532d",
      color: "#fff", padding: "14px 22px", borderRadius: 8,
      fontSize: 13, fontWeight: 600, letterSpacing: "0.3px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", gap: 10,
      fontFamily: "'DM Sans', sans-serif",
      animation: "toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      borderLeft: `4px solid ${type === "error" ? "#ef4444" : "#22c55e"}`,
    }}>
      <span style={{ fontSize: 16 }}>{type === "error" ? "✕" : "✓"}</span>
      {msg}
    </div>
  );
}

function Badge({ children, color = "#1e3a5f", bg = "#dbeafe" }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: bg, color, letterSpacing: "0.3px",
      fontFamily: "'DM Sans', sans-serif",
    }}>{children}</span>
  );
}

const CATEGORIES = ["Earring","Necklace","Anklet","Gemstone Charm","Bangles","Bracelet","Pendants","Ring"];
const OCCASIONS  = ["Festive","Gifting","Bridal","Everyday","Vacation","Party","Traditional"];

const CSV_HEADERS = "name,price,originalPrice,category,occasion,stock,material,description,image,isBestseller,isTrending,isNew,onSale";

const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard"    },
  { id: "products",  icon: "◈", label: "Products"     },
  { id: "add",       icon: "⊕", label: "Add Product"  },
  { id: "bulk",      icon: "⊞", label: "CSV Import"   },
  { id: "orders",    icon: "⊡", label: "Orders"       },
];

// ═══════════════════════════════════════════════
// MAIN PANEL
// ═══════════════════════════════════════════════
export default function RFOPanel() {
  const [authed, setAuthed]   = useState(() => sessionStorage.getItem("rfo_panel_auth") === "yes");
  const [pw, setPw]           = useState("");
  const [pwErr, setPwErr]     = useState("");
  const [page, setPage]       = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);
  const [sideOpen, setSideOpen] = useState(true);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  // Load products from existing API
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data?.data) ? data.data : [];
        setProducts(list.map(p => ({
          ...p,
          id: p._id || p.id,
          image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim(),
        })));
        setLoading(false);
      })
      .catch(() => { showToast("Could not load products", "error"); setLoading(false); });
  }, [authed, showToast]);

  // ── Password gate ────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0b",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
          @keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
          @keyframes fadeIn  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
        <div style={{
          background: "#111113", border: "1px solid #2a2a2e",
          borderRadius: 16, padding: "52px 48px", maxWidth: 400, width: "100%",
          textAlign: "center", animation: "fadeIn 0.5s ease",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#b07a5a,#e8b84b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 20px",
          }}>⬡</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 400, color: "#f5f0eb", marginBottom: 6 }}>
            RFO Control Panel
          </h2>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 32, letterSpacing: "0.8px" }}>
            RAY FINE ORNATES · STORE MANAGEMENT
          </p>
          <input
            type="password" placeholder="Enter admin password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwErr(""); }}
            onKeyDown={e => e.key === "Enter" && (() => {
              if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("rfo_panel_auth", "yes"); setAuthed(true); }
              else setPwErr("Incorrect password");
            })()}
            style={{
              width: "100%", padding: "13px 16px", background: "#1a1a1e",
              border: "1.5px solid #2a2a2e", borderRadius: 8, color: "#f5f0eb",
              fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 8,
            }}
          />
          {pwErr && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{pwErr}</p>}
          <button
            onClick={() => {
              if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("rfo_panel_auth", "yes"); setAuthed(true); }
              else setPwErr("Incorrect password");
            }}
            style={{
              width: "100%", padding: 14, background: "linear-gradient(135deg,#b07a5a,#e8b84b)",
              border: "none", borderRadius: 8, color: "#fff", fontSize: 12,
              fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Access Panel →
          </button>
          <p style={{ marginTop: 20, fontSize: 11, color: "#444" }}>
            Route: <code style={{ color: "#b07a5a" }}>/rfo-panel</code>
          </p>
        </div>
      </div>
    );
  }

  // ── Layout ───────────────────────────────────
  const S = {
    page: { display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'DM Sans', sans-serif", background: "#0a0a0b" },
    sidebar: {
      width: sideOpen ? 220 : 56, minWidth: sideOpen ? 220 : 56,
      background: "#111113", borderRight: "1px solid #1e1e22",
      display: "flex", flexDirection: "column", transition: "width 0.2s ease",
      overflow: "hidden", flexShrink: 0,
    },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    topbar: {
      background: "#111113", borderBottom: "1px solid #1e1e22",
      padding: "0 24px", height: 56, display: "flex", alignItems: "center",
      justifyContent: "space-between", flexShrink: 0,
    },
    content: { flex: 1, overflowY: "auto", padding: 24, background: "#0a0a0b" },
    card: { background: "#111113", border: "1px solid #1e1e22", borderRadius: 10, padding: "20px 22px", marginBottom: 16 },
    input: {
      width: "100%", padding: "10px 13px", background: "#1a1a1e",
      border: "1.5px solid #2a2a2e", borderRadius: 6, color: "#f5f0eb",
      fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none",
    },
    label: { fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "#555", textTransform: "uppercase", display: "block", marginBottom: 4 },
    btn: (variant = "primary") => ({
      padding: "10px 20px", borderRadius: 6, border: "none",
      cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
      textTransform: "uppercase", fontFamily: "inherit",
      ...(variant === "primary" ? { background: "linear-gradient(135deg,#b07a5a,#c4956a)", color: "#fff" } : {}),
      ...(variant === "ghost"   ? { background: "transparent", border: "1px solid #2a2a2e", color: "#888" } : {}),
      ...(variant === "danger"  ? { background: "#7f1d1d22", border: "1px solid #7f1d1d", color: "#ef4444" } : {}),
    }),
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        @keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        .rfo-nav-item:hover { background: #1a1a1e !important; }
        .rfo-nav-item.active { background: #1e1612 !important; border-left: 3px solid #b07a5a !important; }
        .rfo-tr:hover td { background: #151518 !important; }
        .rfo-input:focus { border-color: #b07a5a !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0b; }
        ::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 4px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={S.sidebar}>
        <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid #1e1e22", display: "flex", alignItems: "center", gap: 10, justifyContent: sideOpen ? "flex-start" : "center" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#b07a5a,#e8b84b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⬡</div>
          {sideOpen && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f5f0eb", letterSpacing: "0.3px", fontFamily: "Cormorant Garamond, serif" }}>RFO Panel</div>
              <div style={{ fontSize: 9, color: "#555", letterSpacing: "1.5px", textTransform: "uppercase" }}>Store Control</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "8px 0" }}>
          {NAV.map(n => (
            <div key={n.id}
              className={`rfo-nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: sideOpen ? "10px 16px" : "10px 0",
                justifyContent: sideOpen ? "flex-start" : "center",
                cursor: "pointer", transition: "all .15s",
                color: page === n.id ? "#b07a5a" : "#555",
                fontSize: 13, borderLeft: page === n.id ? "3px solid #b07a5a" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {sideOpen && <span>{n.label}</span>}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 14px", borderTop: "1px solid #1e1e22", display: "flex", justifyContent: sideOpen ? "flex-end" : "center" }}>
          <button onClick={() => setSideOpen(!sideOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#555", padding: "4px 8px" }}>
            {sideOpen ? "◀" : "▶"}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={S.main}>
        <div style={S.topbar}>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, color: "#f5f0eb", fontWeight: 400 }}>
            {NAV.find(n => n.id === page)?.label}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage("add")} style={S.btn("primary")}>+ Add Product</button>
            <button onClick={() => setPage("bulk")} style={S.btn("ghost")}>CSV Import</button>
            <button onClick={() => { sessionStorage.removeItem("rfo_panel_auth"); setAuthed(false); }} style={S.btn("danger")}>Logout</button>
          </div>
        </div>

        <div style={S.content}>
          {page === "dashboard" && <DashboardPage products={products} loading={loading} S={S} setPage={setPage} />}
          {page === "products"  && <ProductsPage  products={products} loading={loading} S={S} showToast={showToast} setProducts={setProducts} />}
          {page === "add"       && <AddProductPage S={S} showToast={showToast} onSave={p => { setProducts(prev => [p, ...prev]); showToast("Product added!"); setPage("products"); }} />}
          {page === "bulk"      && <BulkImportPage S={S} showToast={showToast} onImport={list => { setProducts(prev => [...list, ...prev]); showToast(`${list.length} products imported to Supabase!`); setPage("products"); }} />}
          {page === "orders"    && <OrdersPage     S={S} showToast={showToast} />}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════
function DashboardPage({ products, loading, S, setPage }) {
  const inStock    = products.filter(p => p.inStock && (p.stock || 0) > 5).length;
  const lowStock   = products.filter(p => p.inStock && (p.stock || 0) <= 5 && (p.stock || 0) > 0).length;
  const outOfStock = products.filter(p => !p.inStock || (p.stock || 0) === 0).length;
  const onSale     = products.filter(p => p.onSale || p.originalPrice).length;

  const statCards = [
    { label: "Total Products", value: loading ? "…" : products.length, sub: "In database",       color: "#b07a5a" },
    { label: "In Stock",       value: loading ? "…" : inStock,          sub: "Ready to ship",     color: "#22c55e" },
    { label: "Low / Out Stock",value: loading ? "…" : lowStock + outOfStock, sub: "Needs attention", color: "#ef4444" },
    { label: "On Sale",        value: loading ? "…" : onSale,           sub: "Discounted items",  color: "#e8b84b" },
  ];

  const catCounts = {};
  products.forEach(p => { const k = p.category || "Other"; catCounts[k] = (catCounts[k] || 0) + 1; });
  const catArr = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const maxCat = catArr[0]?.[1] || 1;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {statCards.map(sc => (
          <div key={sc.label} style={{ ...S.card, margin: 0 }}>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 8 }}>{sc.label}</div>
            <div style={{ fontSize: 30, fontWeight: 400, color: sc.color, fontFamily: "Cormorant Garamond, serif", marginBottom: 3 }}>{sc.value}</div>
            <div style={{ fontSize: 11, color: "#444" }}>{sc.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={S.card}>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, color: "#f5f0eb", marginBottom: 16 }}>Products by Category</div>
          {loading
            ? <p style={{ color: "#555", fontSize: 13, textAlign: "center", padding: 20 }}>Loading…</p>
            : catArr.map(([cat, cnt]) => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: "#ccc" }}>{cat}</span>
                  <span style={{ color: "#555" }}>{cnt}</span>
                </div>
                <div style={{ height: 4, background: "#1e1e22", borderRadius: 4 }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg,#b07a5a,#e8b84b)", width: `${(cnt / maxCat) * 100}%`, borderRadius: 4, transition: "width .6s" }} />
                </div>
              </div>
            ))
          }
        </div>

        <div style={S.card}>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, color: "#f5f0eb", marginBottom: 16 }}>Quick Actions</div>
          {[
            { label: "Add New Product",    icon: "⊕", action: "add"  },
            { label: "Bulk CSV Import",    icon: "⊞", action: "bulk" },
            { label: "View All Products",  icon: "◈", action: "products" },
          ].map(a => (
            <button key={a.label} onClick={() => setPage(a.action)}
              style={{
                width: "100%", padding: "13px 16px", background: "#1a1a1e",
                border: "1px solid #2a2a2e", borderRadius: 7, color: "#ccc",
                fontSize: 13, cursor: "pointer", textAlign: "left", marginBottom: 8,
                display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit",
                transition: "all .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#b07a5a"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2e"}
            >
              <span style={{ color: "#b07a5a", fontSize: 16 }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PRODUCTS PAGE
// ═══════════════════════════════════════════════
function ProductsPage({ products, loading, S, showToast, setProducts }) {
  const [search, setSearch]   = useState("");
  const [catFilter, setCat]   = useState("All");

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (!q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      && (catFilter === "All" || p.category?.toLowerCase() === catFilter.toLowerCase());
  });

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await supabaseQuery(`${SUPABASE_TABLE}?id=eq.${id}`, "DELETE");
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product deleted");
    } catch {
      // fallback: just remove from local state
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Removed from view (check Supabase manually)");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input className="rfo-input" placeholder="🔍 Search products…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...S.input, flex: 1 }} />
        <select value={catFilter} onChange={e => setCat(e.target.value)} style={{ ...S.input, width: 160 }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ alignSelf: "center", fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>
          {filtered.length} products
        </span>
      </div>

      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 40, textAlign: "center", color: "#555", fontStyle: "italic", fontFamily: "Cormorant Garamond,serif", fontSize: 18 }}>
            Loading collection…
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#0d0d0f" }}>
                  {["Image", "Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} style={{ fontSize: 10, color: "#555", fontWeight: 700, textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #1e1e22", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="rfo-tr" style={{ borderBottom: "1px solid #1e1e22" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <img src={p.image} alt={p.name}
                        style={{ width: 42, height: 42, objectFit: "cover", borderRadius: 6, border: "1px solid #2a2a2e", background: "#1a1a1e" }}
                        onError={e => { e.target.src = "https://placehold.co/42x42/111/555?text=?"; }} />
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, color: "#f5f0eb" }}>{p.name}</div>
                      {p.material && <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{p.material}</div>}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#777" }}>{p.category}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#f5f0eb", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {formatINR(p.price)}
                      {p.originalPrice && <div style={{ fontSize: 10, color: "#555", textDecoration: "line-through" }}>{formatINR(p.originalPrice)}</div>}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#ccc" }}>{p.stock || 0}</td>
                    <td style={{ padding: "10px 14px" }}>
                      {p.inStock && (p.stock || 0) > 5
                        ? <Badge bg="#14532d22" color="#22c55e">In Stock</Badge>
                        : p.inStock && (p.stock || 0) > 0
                        ? <Badge bg="#78350f22" color="#f59e0b">Low Stock</Badge>
                        : <Badge bg="#7f1d1d22" color="#ef4444">Out of Stock</Badge>
                      }
                      {p.onSale && <span style={{ marginLeft: 4 }}><Badge bg="#1e1b4b22" color="#818cf8">Sale</Badge></span>}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <button onClick={() => deleteProduct(p.id)}
                        style={{ padding: "5px 10px", border: "1px solid #7f1d1d", borderRadius: 5, background: "transparent", cursor: "pointer", fontSize: 11, color: "#ef4444", fontFamily: "inherit" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p style={{ padding: 30, textAlign: "center", color: "#555", fontSize: 13 }}>No products found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ADD PRODUCT PAGE
// ═══════════════════════════════════════════════
function AddProductPage({ S, showToast, onSave }) {
  const blank = { name:"", price:"", originalPrice:"", category:"", occasion:"", stock:"", material:"", description:"", careInstructions:"", image:"", variants:"", inStock:true, isBestseller:false, isTrending:false, isNew:false, onSale:false };
  const [form, setForm]   = useState(blank);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "Required";
    if (!form.price)        e.price = "Required";
    if (!form.category)     e.category = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    const product = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || null,
      stock: Number(form.stock) || 0,
      variants: form.variants ? form.variants.split(",").map(v => v.trim()) : [],
    };
    try {
      // Try Supabase first
      const [saved] = await supabaseQuery(SUPABASE_TABLE, "POST", [product]);
      onSave({ ...product, id: saved?.id || Date.now() });
    } catch {
      // Fallback: just add to local state
      onSave({ ...product, id: Date.now() });
    }
    setSaving(false);
  };

  const Row = ({ children }) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>{children}</div>;
  const Field = ({ label, err, children, full }) => (
    <div style={full ? { gridColumn: "1/-1" } : {}}>
      <label style={{ ...S.label }}>{label}{err && <span style={{ color: "#ef4444", marginLeft: 6 }}>{err}</span>}</label>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
      <div style={S.card}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "#f5f0eb", marginBottom: 20 }}>Add New Product</h3>

        <Row>
          <Field label="Product Name" err={errors.name}>
            <input className="rfo-input" style={{ ...S.input, borderColor: errors.name ? "#ef4444" : undefined }}
              placeholder="e.g. Kundan Jhumka Set" value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>
          <Field label="Price (₹)" err={errors.price}>
            <input type="number" className="rfo-input" style={{ ...S.input, borderColor: errors.price ? "#ef4444" : undefined }}
              placeholder="1499" value={form.price} onChange={e => set("price", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Original Price (₹) — for discount strikethrough">
            <input type="number" className="rfo-input" style={S.input} placeholder="Leave blank if no discount"
              value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)} />
          </Field>
          <Field label="Stock Quantity">
            <input type="number" className="rfo-input" style={S.input} placeholder="0"
              value={form.stock} onChange={e => set("stock", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Category" err={errors.category}>
            <select className="rfo-input" style={{ ...S.input, borderColor: errors.category ? "#ef4444" : undefined }}
              value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Shop by Occasion">
            <select className="rfo-input" style={S.input} value={form.occasion} onChange={e => set("occasion", e.target.value)}>
              <option value="">Select occasion</option>
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Material">
            <input className="rfo-input" style={S.input} placeholder="e.g. Gold plated, Pearl"
              value={form.material} onChange={e => set("material", e.target.value)} />
          </Field>
          <Field label="Variants (comma-separated)">
            <input className="rfo-input" style={S.input} placeholder="Gold,Silver,Rose Gold"
              value={form.variants} onChange={e => set("variants", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Description" full>
            <textarea className="rfo-input" style={{ ...S.input, resize: "vertical" }} rows={3}
              placeholder="Describe the product…"
              value={form.description} onChange={e => set("description", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Care Instructions" full>
            <input className="rfo-input" style={S.input} placeholder="e.g. Avoid water, store in dry pouch"
              value={form.careInstructions} onChange={e => set("careInstructions", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Image URL" full>
            <input className="rfo-input" style={S.input} placeholder="https://…"
              value={form.image}
              onChange={e => { set("image", e.target.value); setPreview(e.target.value || null); }} />
          </Field>
        </Row>

        {preview && (
          <div style={{ marginBottom: 14 }}>
            <img src={preview} alt="Preview"
              style={{ height: 90, width: 90, objectFit: "cover", borderRadius: 6, border: "1px solid #2a2a2e" }}
              onError={() => setPreview(null)} />
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={S.label}>Tags</label>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
            {[["isBestseller","⭐ Bestseller"],["isTrending","🔥 Trending"],["isNew","✨ New"],["onSale","🏷 On Sale"],["inStock","📦 In Stock"]].map(([k, lbl]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", color: "#888" }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)}
                  style={{ accentColor: "#b07a5a", width: 14, height: 14 }} />
                {lbl}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={save} disabled={saving} style={S.btn("primary")}>
            {saving ? "Saving…" : "Save to Supabase →"}
          </button>
          <button onClick={() => { setForm(blank); setPreview(null); setErrors({}); }} style={S.btn("ghost")}>Clear</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// BULK CSV IMPORT — main feature
// ═══════════════════════════════════════════════
function BulkImportPage({ S, showToast, onImport }) {
  const fileRef  = useRef();
  const [preview, setPreview]   = useState([]);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [errors, setErrors]       = useState([]);

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).filter(l => l.trim()).map((line, i) => {
      // Handle quoted commas
      const vals = [];
      let cur = "", inQ = false;
      for (const ch of line) {
        if (ch === '"') inQ = !inQ;
        else if (ch === "," && !inQ) { vals.push(cur.trim()); cur = ""; }
        else cur += ch;
      }
      vals.push(cur.trim());
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = (vals[idx] || "").replace(/^"|"$/g, "").trim(); });
      return {
        ...obj,
        _rowNum: i + 2,
        price: Number(obj.price) || 0,
        originalPrice: Number(obj.originalPrice) || null,
        stock: Number(obj.stock) || 0,
        inStock: Number(obj.stock) > 0,
        isBestseller: obj.isBestseller === "true" || obj.isBestseller === "1",
        isTrending:   obj.isTrending   === "true" || obj.isTrending   === "1",
        isNew:        obj.isNew        === "true" || obj.isNew        === "1",
        onSale:       obj.onSale       === "true" || obj.onSale       === "1",
      };
    });
  };

  const validateRow = (row) => {
    const errs = [];
    if (!row.name)     errs.push("name missing");
    if (!row.price)    errs.push("price missing");
    if (!row.category) errs.push("category missing");
    return errs;
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) { showToast("Only .csv files allowed", "error"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = parseCSV(e.target.result);
        const rowErrors = [];
        parsed.forEach(row => {
          const errs = validateRow(row);
          if (errs.length) rowErrors.push(`Row ${row._rowNum}: ${errs.join(", ")}`);
        });
        setErrors(rowErrors);
        setPreview(parsed);
        showToast(`${parsed.length} rows parsed${rowErrors.length ? `, ${rowErrors.length} with warnings` : " — looks good!"}`);
      } catch (err) {
        showToast("CSV parse error: " + err.message, "error");
      }
    };
    reader.readAsText(f);
  };

  const importToSupabase = async () => {
    if (!preview.length) return;
    setImporting(true);
    setProgress(0);
    const BATCH = 50;
    const successful = [];
    const failed = [];

    for (let i = 0; i < preview.length; i += BATCH) {
      const batch = preview.slice(i, i + BATCH).map(({ _rowNum, ...rest }) => rest);
      try {
        await supabaseQuery(SUPABASE_TABLE, "POST", batch);
        successful.push(...batch);
      } catch (err) {
        // Try one by one on batch fail
        for (const row of batch) {
          try {
            await supabaseQuery(SUPABASE_TABLE, "POST", [row]);
            successful.push(row);
          } catch {
            failed.push(row.name || "unknown");
          }
        }
      }
      setProgress(Math.round(((i + BATCH) / preview.length) * 100));
    }

    setImporting(false);
    if (failed.length) showToast(`${successful.length} imported, ${failed.length} failed`, "error");
    else onImport(successful);
  };

  const downloadTemplate = () => {
    const sample = `${CSV_HEADERS}\nKundan Jhumka,1499,1999,Earring,Festive,20,Gold plated,Beautiful festive earrings,https://example.com/img.jpg,true,false,true,false\nPearl Necklace,2299,,Necklace,Bridal,15,Pearl,Elegant pearl necklace,https://example.com/necklace.jpg,false,true,false,false`;
    const blob = new Blob([sample], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rfo_products_template.csv";
    a.click();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
      <div style={S.card}>
        <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 400, color: "#f5f0eb", marginBottom: 6 }}>
          Bulk CSV Import → Supabase
        </h3>
        <p style={{ fontSize: 13, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>
          CSV upload karo, preview dekho, phir directly Supabase mein import karo.
          Agar Supabase keys set nahi hain, tab bhi local state mein import ho jaayega.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button onClick={downloadTemplate} style={S.btn("ghost")}>↓ Download CSV Template</button>
          <button onClick={() => fileRef.current?.click()} style={S.btn("primary")}>📂 Choose CSV File</button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#b07a5a" : "#2a2a2e"}`,
            borderRadius: 10, padding: "36px 24px", textAlign: "center", cursor: "pointer",
            background: dragging ? "#1e1612" : "transparent", transition: "all .2s",
            marginBottom: 16,
          }}
        >
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
          <p style={{ fontSize: 14, color: "#555" }}>
            Drop CSV here or <strong style={{ color: "#b07a5a" }}>click to browse</strong>
          </p>
          <p style={{ fontSize: 11, color: "#333", marginTop: 4 }}>Supports quoted values, special characters</p>
        </div>

        {/* Column reference */}
        <div style={{ background: "#0d0d0f", padding: "12px 16px", borderRadius: 7, fontSize: 11, color: "#555", marginBottom: 16, lineHeight: 1.8, border: "1px solid #1e1e22" }}>
          <strong style={{ color: "#b07a5a" }}>Required CSV columns:</strong><br />
          <code style={{ color: "#888" }}>{CSV_HEADERS}</code>
        </div>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div style={{ background: "#7f1d1d22", border: "1px solid #7f1d1d", borderRadius: 7, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>⚠ Validation Warnings ({errors.length})</p>
            {errors.slice(0, 5).map((e, i) => <p key={i} style={{ color: "#fca5a5", fontSize: 11 }}>{e}</p>)}
            {errors.length > 5 && <p style={{ color: "#888", fontSize: 11 }}>+{errors.length - 5} more…</p>}
          </div>
        )}

        {/* Progress */}
        {importing && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 6 }}>
              <span>Importing to Supabase…</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: 6, background: "#1e1e22", borderRadius: 4 }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg,#b07a5a,#e8b84b)", width: `${progress}%`, borderRadius: 4, transition: "width .3s" }} />
            </div>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>
                {preview.length} rows parsed · {errors.length} warnings
              </span>
              <button onClick={importToSupabase} disabled={importing} style={S.btn("primary")}>
                {importing ? `Importing… ${progress}%` : `Import ${preview.length} Products →`}
              </button>
            </div>

            <div style={{ overflowX: "auto", borderRadius: 7, border: "1px solid #1e1e22" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0d0d0f" }}>
                    {["#","Name","Category","Price","Stock","Occasion","Flags"].map(h => (
                      <th key={h} style={{ fontSize: 10, color: "#555", fontWeight: 700, textAlign: "left", padding: "9px 12px", borderBottom: "1px solid #1e1e22", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((p, i) => (
                    <tr key={i} className="rfo-tr" style={{ borderBottom: "1px solid #1e1e22" }}>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#444" }}>{p._rowNum}</td>
                      <td style={{ padding: "8px 12px", fontSize: 13, color: "#f5f0eb" }}>{p.name}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: "#777" }}>{p.category}</td>
                      <td style={{ padding: "8px 12px", fontSize: 13, color: "#b07a5a" }}>{formatINR(p.price)}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: "#ccc" }}>{p.stock}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#666" }}>{p.occasion}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11 }}>
                        {p.isBestseller && <span style={{ color: "#e8b84b", marginRight: 4 }}>⭐</span>}
                        {p.isTrending   && <span style={{ color: "#f97316", marginRight: 4 }}>🔥</span>}
                        {p.isNew        && <span style={{ color: "#22c55e", marginRight: 4 }}>✨</span>}
                        {p.onSale       && <span style={{ color: "#818cf8" }}>🏷</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <p style={{ padding: "8px 12px", fontSize: 11, color: "#555" }}>
                  +{preview.length - 10} more rows not shown
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ORDERS PAGE
// ═══════════════════════════════════════════════
function OrdersPage({ S, showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    // Try fetching orders from Supabase
    supabaseQuery("orders?order=created_at.desc&limit=100")
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => {
        // Fallback sample data
        setOrders([
          { id: "#1041", customer: "Priya Sharma",  items: "Bridal Set × 1",     amount: 8500, status: "new",       date: "Jun 5" },
          { id: "#1040", customer: "Rahul Verma",   items: "Gold Anklet × 2",    amount: 1798, status: "processing", date: "Jun 5" },
          { id: "#1039", customer: "Sunita Patel",  items: "Pearl Earrings × 1", amount: 2200, status: "delivered", date: "Jun 4" },
        ]);
        setLoading(false);
      });
  }, []);

  const STATUS_COLORS = {
    new:        { bg: "#1e3a5f22", color: "#60a5fa" },
    processing: { bg: "#78350f22", color: "#f59e0b" },
    shipped:    { bg: "#14532d22", color: "#22c55e" },
    delivered:  { bg: "#14532d44", color: "#86efac" },
    cancelled:  { bg: "#7f1d1d22", color: "#ef4444" },
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (id, status) => {
    try {
      await supabaseQuery(`orders?id=eq.${id}`, "PATCH", { status });
    } catch { /* fallback */ }
    setOrders(prev => prev.map(o => (o.id === id || o._id === id) ? { ...o, status } : o));
    showToast("Order updated");
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all","new","processing","shipped","delivered","cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "inherit",
              background: filter === s ? "linear-gradient(135deg,#b07a5a,#c4956a)" : "#1a1a1e",
              color: filter === s ? "#fff" : "#666",
            }}>
            {s === "all" ? `All (${orders.length})` : s}
          </button>
        ))}
      </div>

      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 40, textAlign: "center", color: "#555", fontStyle: "italic" }}>Loading orders…</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#0d0d0f" }}>
                  {["Order","Date","Customer","Items","Amount","Status","Update"].map(h => (
                    <th key={h} style={{ fontSize: 10, color: "#555", fontWeight: 700, textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #1e1e22", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const statusStyle = STATUS_COLORS[o.status] || STATUS_COLORS.new;
                  return (
                    <tr key={o.id || o._id} className="rfo-tr" style={{ borderBottom: "1px solid #1e1e22" }}>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#b07a5a", fontWeight: 600 }}>{o.id || o._id}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{o.date || o.created_at?.slice(0,10)}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#f5f0eb" }}>{o.customer || o.customer_name}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#777" }}>{o.items}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#f5f0eb", fontWeight: 500 }}>{formatINR(o.amount)}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: statusStyle.bg, color: statusStyle.color }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <select value={o.status}
                          onChange={e => updateStatus(o.id || o._id, e.target.value)}
                          style={{ ...S.input, width: "auto", padding: "5px 8px", fontSize: 12 }}>
                          {["new","processing","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p style={{ padding: 30, textAlign: "center", color: "#555", fontSize: 13 }}>No orders found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
