import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ── Config ────────────────────────────────────
const SUPABASE_URL = "https://ajqqaeejotlghgilgajy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcXFhZWVqb3RsZ2hnaWxnYWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjU2MTUsImV4cCI6MjA5NTY0MTYxNX0.fZ1MmCpMiQnwu7HsaK3zP4HXjxrLK6JseEZSUvIkreY";
const SUPABASE_TABLE = "rayfinedatabase";

const PRODUCT_COLUMNS = ["name","price","original_price","image","description","category","in_stock","stock","variants","material","occasion","is_bestseller","is_trending","is_new"];

function sanitizeProduct(p){
  const out = {};
  for(const k of PRODUCT_COLUMNS){ if(p[k] !== undefined) out[k] = p[k]; }
  return out;
}

function toDbRow(p){
  let originalPrice = p.originalPrice ?? null;
  if (p.onSale && !originalPrice && p.price) originalPrice = Math.round(p.price * 1.25);
  if (!p.onSale) originalPrice = p.originalPrice || null;
  return sanitizeProduct({
    name: p.name,
    price: p.price,
    original_price: originalPrice,
    image: p.image,
    description: p.description,
    category: p.category,
    in_stock: p.inStock,
    stock: Math.max(0, p.stock || 0),
    variants: Array.isArray(p.variants) ? p.variants.join(", ") : (p.variants || ""),
    material: p.material || "",
    occasion: p.occasion || "",
    is_bestseller: !!p.isBestseller,
    is_trending: !!p.isTrending,
    is_new: !!p.isNew,
  });
}

function fromDbRow(r){
  const stockVal = r.stock || 0;
  return {
    ...r,
    id: r.id,
    originalPrice: r.original_price,
    inStock: r.in_stock && stockVal > 0,
    stock: stockVal,
    isBestseller: !!r.is_bestseller,
    isTrending: !!r.is_trending,
    isNew: !!r.is_new,
    onSale: !!r.original_price,
  };
}

const USD_TO_INR_DEFAULT = 83.5;
const API = "https://rayfinesite-3.onrender.com/api";
const ADMIN_PASSWORD = "rayfine@20";

async function supabaseQuery(path, method = "GET", body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : method === "PATCH" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const e = await res.text();
    throw new Error(e || `HTTP ${res.status}`);
  }
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}

function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

const CATEGORIES = ["Earring", "Necklace", "Anklet", "Gemstone Charm", "Bangles", "Bracelet", "Pendants", "Ring"];
const OCCASIONS = ["Festive", "Gifting", "Bridal", "Everyday", "Vacation", "Party", "Traditional"];

const CAT_COLORS = {
  Earring: "#d4a574", Necklace: "#b07a5a", Bangles: "#c4956a", Bracelet: "#8fac88",
  Ring: "#9b8bb5", Anklet: "#7fb3c8", Pendants: "#c47a8a", "Gemstone Charm": "#6bb5a0",
};

const NAV = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  { id: "products", icon: "✦", label: "Products" },
  { id: "add", icon: "＋", label: "Add Product" },
  { id: "bulk", icon: "⊞", label: "Bulk Upload" },
  { id: "orders", icon: "◻", label: "Orders" },
];

const TAG_TO_CATEGORY = {
  earring: "Earring", jhumka: "Earring", stud_earring: "Earring", dangle_earring: "Earring", ear_stud: "Earring", hoop: "Earring", chandbali: "Earring",
  necklace: "Necklace", choker: "Necklace", locket: "Necklace", pendant: "Pendants", pendent: "Pendants", haar: "Necklace",
  anklet: "Anklet", payal: "Anklet",
  bangle: "Bangles", bangle_set: "Bangles", kangan: "Bangles",
  bracelet: "Bracelet", kada: "Bracelet",
  ring: "Ring", adjustable_ring: "Ring",
  gemstone: "Gemstone Charm", charm: "Gemstone Charm",
};

const TAG_TO_OCCASION = {
  bridal: "Bridal", wedding: "Bridal", bride: "Bridal",
  festive: "Festive", diwali: "Festive", navratri: "Festive", eid: "Festive", festival: "Festive",
  gift: "Gifting", gifting: "Gifting", gift_for_her: "Gifting", return_gift: "Gifting",
  party: "Party", party_wear: "Party",
  everyday: "Everyday", daily_wear: "Everyday", office: "Everyday",
  vacation: "Vacation", travel: "Vacation", boho: "Vacation",
  traditional: "Traditional", ethnic: "Traditional", saree: "Traditional",
};

const BESTSELLER_TAGS = ["bestseller", "best_seller", "popular", "top_seller", "most_loved"];
const TRENDING_TAGS = ["trending", "new_arrival", "new_launch", "viral", "hot"];
const NEW_TAGS = ["new", "new_arrival", "new_launch", "just_arrived", "newly_listed"];

function detectFromTags(tagsStr = "") {
  const tags = tagsStr.toLowerCase().replace(/\s/g, "_").split(",").map(t => t.trim());
  let category = "", occasion = "", isBestseller = false, isTrending = false, isNew = false;
  for (const tag of tags) {
    if (!category) for (const [k, v] of Object.entries(TAG_TO_CATEGORY)) { if (tag.includes(k)) { category = v; break; } }
    if (!occasion) for (const [k, v] of Object.entries(TAG_TO_OCCASION)) { if (tag.includes(k)) { occasion = v; break; } }
    if (!isBestseller && BESTSELLER_TAGS.some(k => tag.includes(k))) isBestseller = true;
    if (!isTrending && TRENDING_TAGS.some(k => tag.includes(k))) isTrending = true;
    if (!isNew && NEW_TAGS.some(k => tag.includes(k))) isNew = true;
  }
  return { category, occasion, isBestseller, isTrending, isNew };
}

function guessCategoryFromTitle(title = "") {
  const t = title.toLowerCase();
  if (t.includes("earring") || t.includes("jhumka") || t.includes("stud") || t.includes("chandbali")) return "Earring";
  if (t.includes("necklace") || t.includes("haar") || t.includes("choker")) return "Necklace";
  if (t.includes("bracelet") || t.includes("kada")) return "Bracelet";
  if (t.includes("bangle")) return "Bangles";
  if (t.includes("ring")) return "Ring";
  if (t.includes("anklet") || t.includes("payal")) return "Anklet";
  if (t.includes("pendant") || t.includes("pendent") || t.includes("locket")) return "Pendants";
  return "";
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  const t = text.replace(/\r\n/g, "\n");
  for (let i = 0; i < t.length; i++) {
    const ch = t[i], next = t[i + 1];
    if (inQ) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') { inQ = false; }
      else field += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += ch;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const filtered = rows.filter(r => r.some(c => c.trim() !== ""));
  if (!filtered.length) return { headers: [], rows: [] };
  const headers = filtered[0].map(h => h.trim());
  const dataRows = filtered.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] ?? "").trim(); });
    return obj;
  });
  return { headers, rows: dataRows };
}

const PRODUCT_FIELDS = [
  { key: "name", label: "Product Name", required: true, type: "text" },
  { key: "description", label: "Description", required: false, type: "text" },
  { key: "price", label: "Price", required: true, type: "number" },
  { key: "originalPrice", label: "Original Price", required: false, type: "number" },
  { key: "stock", label: "Stock / Quantity", required: false, type: "number" },
  { key: "category", label: "Category", required: false, type: "category" },
  { key: "occasion", label: "Occasion", required: false, type: "occasion" },
  { key: "material", label: "Material", required: false, type: "text" },
  { key: "image", label: "Image URL", required: false, type: "text" },
  { key: "tags", label: "Tags (for auto-detect)", required: false, type: "text" },
];

function autoMapHeaders(headers) {
  const map = {};
  const norm = h => h.toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases = {
    name: ["title", "name", "productname", "itemname"],
    description: ["description", "desc"],
    price: ["price", "amount", "cost"],
    originalPrice: ["originalprice", "compareatprice", "mrp", "listprice"],
    stock: ["quantity", "qty", "stock", "inventory", "available"],
    category: ["category", "type", "producttype"],
    occasion: ["occasion"],
    material: ["materials", "material"],
    image: ["image1", "image", "imageurl", "mainimage", "photo"],
    tags: ["tags", "tag", "keywords"],
  };
  for (const field of PRODUCT_FIELDS) {
    const opts = aliases[field.key] || [field.key];
    const found = headers.find(h => opts.includes(norm(h)));
    map[field.key] = found || "";
  }
  return map;
}

function isUSDPriceCSV(headers) {
  return headers.some(h => /currency/i.test(h)) || headers.some(h => /^TITLE$/i.test(h));
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, left: 24, maxWidth: 360, margin: "0 auto", zIndex: 99999, background: type === "error" ? "#3d1515" : "#1a2e1a", color: "#f5f0eb", padding: "14px 18px", borderRadius: 12, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans',sans-serif", borderLeft: `3px solid ${type === "error" ? "#e07070" : "#7dba7d"}`, animation: "slideUp .3s ease" }}>
      <span style={{ fontSize: 15 }}>{type === "error" ? "✕" : "✓"}</span>{msg}
    </div>
  );
}

export default function RFOAdmin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("rfo_auth") === "yes");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  const loadProducts = useCallback(() => {
    setLoading(true);
    supabaseQuery(`${SUPABASE_TABLE}?select=*&order=id.desc`)
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list.map(r => {
          const p = fromDbRow(r);
          return { ...p, image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim() };
        }));
        setLoading(false);
      })
      .catch(() => {
        fetch(`${API}/products`).then(r => r.json()).then(data => {
          const list = Array.isArray(data?.data) ? data.data : [];
          setProducts(list.map(r => {
            const p = fromDbRow(r);
            return { ...p, id: p._id || p.id, image: p.image?.replace(/^http:\/\//i, "https://")?.split(",")[0]?.trim() };
          }));
          setLoading(false);
        }).catch(() => { setLoading(false); showToast("Could not load products", "error"); });
      });
  }, [showToast]);

  useEffect(() => { if (authed) loadProducts(); }, [authed, loadProducts]);

  const tryLogin = () => {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("rfo_auth", "yes"); setAuthed(true); }
    else setPwErr("Incorrect password");
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100svh", background: "#faf7f4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: 20 }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
          @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          *{box-sizing:border-box;margin:0;padding:0;}
        `}</style>
        <div style={{ background: "#fff", borderRadius: 20, padding: "48px 40px", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", border: "1px solid #ede8e3", animation: "slideUp .5s ease" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#d4a574,#b07a5a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 16px" }}>✦</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 400, color: "#2d2018", marginBottom: 4 }}>Ray Fine Ornates</h1>
            <p style={{ fontSize: 11, color: "#b8a898", letterSpacing: "2.5px", textTransform: "uppercase" }}>Admin Panel</p>
          </div>
          <input type="password" placeholder="Enter admin password" value={pw}
            onChange={e => { setPw(e.target.value); setPwErr(""); }}
            onKeyDown={e => e.key === "Enter" && tryLogin()}
            style={{ width: "100%", padding: "13px 16px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#2d2018", outline: "none", background: "#faf7f4", marginBottom: 8 }}
          />
          {pwErr && <p style={{ color: "#d46060", fontSize: 12, marginBottom: 10 }}>{pwErr}</p>}
          <button onClick={tryLogin}
            style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#d4a574,#b07a5a)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: "1px", cursor: "pointer", fontFamily: "inherit" }}>
            Sign In →
          </button>
          <p style={{ marginTop: 18, fontSize: 11, color: "#c8b8a8" }}>Ray Fine Ornates · Jewellery</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100svh", background: "#faf7f4", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#f0ebe5}
        ::-webkit-scrollbar-thumb{background:#d4a574;border-radius:4px}
        .am-nav:hover{background:#f5ede5!important;}
        .am-nav.active{background:#fdf0e6!important;color:#b07a5a!important;}
        .am-tr:hover td{background:#fdf8f4!important;}
        .am-inp:focus{border-color:#d4a574!important;outline:none;}
        .am-btn-pri{background:linear-gradient(135deg,#d4a574,#b07a5a)!important;color:#fff!important;}
        .am-btn-pri:hover{opacity:.92!important;}
        .am-btn-pri:disabled{opacity:.5!important;cursor:not-allowed!important;}
        .am-card{background:#fff;border:1px solid #ede8e3;border-radius:14px;padding:20px;}
        input,select,textarea{font-family:'DM Sans',sans-serif;}
        @media(max-width:768px){
          .sidebar-desktop{display:none!important;}
          .mobile-nav{display:flex!important;}
          .main-content{padding:16px!important;}
          .grid-4{grid-template-columns:1fr 1fr!important;}
          .grid-2{grid-template-columns:1fr!important;}
          .topbar-actions{display:none!important;}
          .table-wrap{overflow-x:auto;}
        }
        @media(min-width:769px){
          .mobile-nav{display:none!important;}
          .mobile-topbar-hamburger{display:none!important;}
        }
      `}</style>

      <nav className="mobile-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #ede8e3", zIndex: 1000, padding: "6px 0 env(safe-area-inset-bottom)", justifyContent: "space-around" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px", cursor: "pointer", color: page === n.id ? "#b07a5a" : "#b8a898", flex: 1 }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>{n.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ display: "flex", height: "100svh", overflow: "hidden" }}>
        <aside className="sidebar-desktop" style={{ width: 220, background: "#fff", borderRight: "1px solid #ede8e3", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid #f0ebe5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#d4a574,#b07a5a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: "#2d2018", fontWeight: 400 }}>Ray Fine Ornates</div>
                <div style={{ fontSize: 9, color: "#c8b8a8", letterSpacing: "1.5px", textTransform: "uppercase" }}>Admin</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "10px 0" }}>
            {NAV.map(n => (
              <div key={n.id} className={`am-nav ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", cursor: "pointer", color: page === n.id ? "#b07a5a" : "#8a7a6e", fontSize: 13, borderRight: page === n.id ? "3px solid #b07a5a" : "3px solid transparent", fontWeight: page === n.id ? 600 : 400 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </nav>
          <div style={{ padding: "12px 20px", borderTop: "1px solid #f0ebe5" }}>
            <button onClick={() => { sessionStorage.removeItem("rfo_auth"); setAuthed(false); }}
              style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid #e8e0d8", background: "none", cursor: "pointer", fontSize: 12, color: "#b8a898", fontFamily: "inherit" }}>
              Sign out
            </button>
          </div>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <header style={{ background: "#fff", borderBottom: "1px solid #ede8e3", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mobile-topbar-hamburger" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#d4a574,#b07a5a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✦</div>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#2d2018" }}>Ray Fine Ornates</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, color: "#2d2018" }}>{NAV.find(n => n.id === page)?.label}</h2>
            </div>
            <div className="topbar-actions" style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPage("add")} className="am-btn-pri" style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", fontFamily: "inherit" }}>+ Add Product</button>
              <button onClick={() => setPage("bulk")} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e8e0d8", background: "none", cursor: "pointer", fontSize: 11, color: "#8a7a6e", fontFamily: "inherit" }}>⊞ Bulk Upload</button>
            </div>
          </header>

          <main className="main-content" style={{ flex: 1, overflowY: "auto", padding: "20px", paddingBottom: 80 }}>
            {page === "dashboard" && <DashboardPage products={products} loading={loading} setPage={setPage} />}
            {page === "products" && <ProductsPage products={products} loading={loading} showToast={showToast} setProducts={setProducts} />}
            {page === "add" && <AddProductPage showToast={showToast} onSave={p => { setProducts(prev => [p, ...prev]); showToast("Product saved!"); setPage("products"); }} />}
            {page === "bulk" && <BulkImportPage showToast={showToast} onImport={() => { showToast("Import complete!"); loadProducts(); setPage("products"); }} />}
            {page === "orders" && <OrdersPage showToast={showToast} />}
          </main>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

function DashboardPage({ products, loading, setPage }) {
  const inStock = products.filter(p => p.inStock).length;
  const outOfStock = products.filter(p => !p.inStock).length;
  const onSale = products.filter(p => p.onSale || p.originalPrice).length;
  const bestsellers = products.filter(p => p.isBestseller).length;
  const trending = products.filter(p => p.isTrending).length;
  const catCounts = {};
  products.forEach(p => { const k = p.category || "Other"; catCounts[k] = (catCounts[k] || 0) + 1; });
  const catArr = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const maxCat = catArr[0]?.[1] || 1;
  const stats = [
    { label: "Total Products", val: loading ? "…" : products.length, color: "#d4a574", icon: "✦" },
    { label: "In Stock", val: loading ? "…" : inStock, color: "#7dba7d", icon: "✓" },
    { label: "Out of Stock", val: loading ? "…" : outOfStock, color: "#e07070", icon: "!" },
    { label: "On Sale", val: loading ? "…" : onSale, color: "#b07a5a", icon: "🏷" },
    { label: "Bestsellers", val: loading ? "…" : bestsellers, color: "#e0b070", icon: "⭐" },
    { label: "Trending", val: loading ? "…" : trending, color: "#c4706a", icon: "🔥" },
  ];
  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} className="am-card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "#b8a898", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>{s.label}</span>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: s.color, flexShrink: 0 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontFamily: "'Playfair Display',serif", color: "#2d2018", fontWeight: 400 }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="am-card">
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, color: "#2d2018", marginBottom: 16 }}>By Category</h3>
          {loading ? <p style={{ color: "#c8b8a8", fontSize: 13, textAlign: "center", padding: 20 }}>Loading…</p>
            : catArr.length === 0 ? <p style={{ color: "#c8b8a8", fontSize: 13, textAlign: "center", padding: 20 }}>No products yet.</p>
            : catArr.map(([cat, cnt]) => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#5a4a3e" }}>{cat}</span>
                  <span style={{ color: "#c8b8a8", fontWeight: 600 }}>{cnt}</span>
                </div>
                <div style={{ height: 5, background: "#f0ebe5", borderRadius: 4 }}>
                  <div style={{ height: "100%", background: `linear-gradient(90deg,${CAT_COLORS[cat] || "#d4a574"},${CAT_COLORS[cat] || "#b07a5a"})`, width: `${(cnt / maxCat) * 100}%`, borderRadius: 4, transition: "width .6s" }} />
                </div>
              </div>
            ))
          }
        </div>
        <div className="am-card">
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, color: "#2d2018", marginBottom: 16 }}>Quick Actions</h3>
          {[{ label: "Add new product", icon: "＋", desc: "Single product entry", id: "add" }, { label: "Bulk CSV upload", icon: "⊞", desc: "Import any CSV with flexible mapping", id: "bulk" }, { label: "View all products", icon: "✦", desc: "Browse & manage catalogue", id: "products" }].map(a => (
            <button key={a.id} onClick={() => setPage(a.id)}
              style={{ width: "100%", padding: "13px 14px", background: "#faf7f4", border: "1px solid #ede8e3", borderRadius: 10, cursor: "pointer", textAlign: "left", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, fontFamily: "inherit", transition: "all .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#d4a574"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#ede8e3"}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#d4a574,#b07a5a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, flexShrink: 0 }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#2d2018" }}>{a.label}</div>
                <div style={{ fontSize: 11, color: "#b8a898" }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsPage({ products, loading, showToast, setProducts }) {
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (!q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      && (catF === "All" || p.category?.toLowerCase() === catF.toLowerCase());
  });

  const toggleSelect = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await supabaseQuery(`${SUPABASE_TABLE}?id=eq.${id}`, "DELETE");
      setProducts(prev => prev.filter(p => p.id !== id));
      setSelected(prev => { const s = new Set(prev); s.delete(id); return s; });
      showToast("Product deleted");
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    }
  };

  const bulkDelete = async () => {
    if (!selected.size) { showToast("No products selected", "error"); return; }
    if (!window.confirm(`Delete ${selected.size} product(s)?`)) return;
    
    let ok = 0, fail = 0;
    for (const id of selected) {
      try {
        await supabaseQuery(`${SUPABASE_TABLE}?id=eq.${id}`, "DELETE");
        ok++;
      } catch (err) {
        console.error("Delete failed for", id, err.message);
        fail++;
      }
    }
    
    setProducts(prev => prev.filter(p => !selected.has(p.id)));
    setSelected(new Set());
    if (fail) showToast(`${ok} deleted, ${fail} failed`, fail === selected.size ? "error" : "success");
    else showToast(`${ok} product(s) deleted!`);
  };

  const openEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({ ...product });
  };

  const saveEdit = async () => {
    if (!editForm.name.trim()) { showToast("Name required", "error"); return; }
    if (!editForm.price) { showToast("Price required", "error"); return; }

    try {
      const row = toDbRow(editForm);
      await supabaseQuery(`${SUPABASE_TABLE}?id=eq.${editForm.id}`, "PATCH", row);
      setProducts(prev => prev.map(p => p.id === editForm.id ? { ...editForm } : p));
      setEditingProduct(null);
      setEditForm(null);
      showToast("Product updated!");
    } catch (err) {
      showToast("Update failed: " + err.message, "error");
    }
  };

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input className="am-inp" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, padding: "10px 14px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#fff", color: "#2d2018" }} />
        <select className="am-inp" value={catF} onChange={e => setCatF(e.target.value)}
          style={{ padding: "10px 12px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#fff", color: "#2d2018", minWidth: 140 }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ alignSelf: "center", fontSize: 12, color: "#c8b8a8", whiteSpace: "nowrap" }}>{filtered.length} items</span>
      </div>

      {selected.size > 0 && (
        <div className="am-card" style={{ marginBottom: 14, background: "#fdf5ee", border: "1.5px solid #d4a574", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#b07a5a" }}>{selected.size} selected</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setSelected(new Set())} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #d4a574", background: "#fff", cursor: "pointer", fontSize: 12, color: "#b07a5a", fontFamily: "inherit", fontWeight: 600 }}>Deselect All</button>
            <button onClick={bulkDelete} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#e07070", cursor: "pointer", fontSize: 12, color: "#fff", fontFamily: "inherit", fontWeight: 600 }}>🗑 Delete Selected</button>
          </div>
        </div>
      )}

      <div className="am-card table-wrap" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <p style={{ padding: 40, textAlign: "center", color: "#c8b8a8", fontFamily: "'Playfair Display',serif", fontSize: 16, fontStyle: "italic" }}>Loading collection…</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead><tr style={{ background: "#faf7f4" }}>
                <th style={{ fontSize: 10, color: "#c8b8a8", fontWeight: 700, textAlign: "center", padding: "10px 10px", borderBottom: "1px solid #ede8e3", width: 40 }}>
                  <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} 
                    onChange={toggleSelectAll} style={{ accentColor: "#d4a574", width: 16, height: 16, cursor: "pointer" }} />
                </th>
                {["Image", "Product", "Category", "Price", "Stock", "Status", ""].map(h => (
                  <th key={h} style={{ fontSize: 10, color: "#c8b8a8", fontWeight: 700, textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #ede8e3", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="am-tr" style={{ borderBottom: "1px solid #f5f0ea", background: selected.has(p.id) ? "#fdf5ee" : "transparent" }}>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} 
                        style={{ accentColor: "#d4a574", width: 16, height: 16, cursor: "pointer" }} />
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <img src={p.image || "https://placehold.co/44x44/f5f0ea/c8b8a8?text=%E2%9C%A6"} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #ede8e3", background: "#f5f0ea" }} onError={e => { e.target.src = "https://placehold.co/44x44/f5f0ea/c8b8a8?text=%E2%9C%A6"; }} />
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: "#2d2018" }}>{p.name}</div>
                      {p.material && <div style={{ fontSize: 11, color: "#c8b8a8", marginTop: 1 }}>{p.material}</div>}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: `${CAT_COLORS[p.category] || "#d4a574"}18`, color: CAT_COLORS[p.category] || "#d4a574" }}>{p.category || "—"}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#2d2018", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {formatINR(p.price)}
                      {p.originalPrice && <div style={{ fontSize: 10, color: "#c8b8a8", textDecoration: "line-through" }}>{formatINR(p.originalPrice)}</div>}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#5a4a3e" }}>{p.stock || 0}</td>
                    <td style={{ padding: "10px 14px" }}>
                      {p.inStock ? <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "#e8f5e8", color: "#4a8f4a" }}>In Stock</span>
                        : <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "#fde8e8", color: "#c44a4a" }}>Out</span>}
                    </td>
                    <td style={{ padding: "10px 14px", display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: "5px 10px", border: "1px solid #d4a574", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 11, color: "#b07a5a", fontFamily: "inherit", fontWeight: 600 }}>✏ Edit</button>
                      <button onClick={() => del(p.id)} style={{ padding: "5px 10px", border: "1px solid #e8d8d8", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 11, color: "#c44a4a", fontFamily: "inherit" }}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p style={{ padding: 30, textAlign: "center", color: "#c8b8a8", fontSize: 13 }}>No products found.</p>}
          </div>
        )}
      </div>

      {editingProduct && editForm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", animation: "slideUp .3s ease" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, color: "#2d2018", marginBottom: 20 }}>Edit Product</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Product Name</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Price (₹)</label>
                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Original Price (₹)</label>
                <input type="number" value={editForm.originalPrice || ""} onChange={e => setEditForm({ ...editForm, originalPrice: Number(e.target.value) || null })}
                  style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Stock</label>
                <input type="number" value={editForm.stock || 0} onChange={e => {
                  const val = Number(e.target.value) || 0;
                  setEditForm({ ...editForm, stock: val, inStock: val > 0 });
                }} style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Category</label>
                <select value={editForm.category || ""} onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Occasion</label>
                <select value={editForm.occasion || ""} onChange={e => setEditForm({ ...editForm, occasion: e.target.value })}
                  style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }}>
                  <option value="">Select occasion</option>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Material</label>
                <input value={editForm.material || ""} onChange={e => setEditForm({ ...editForm, material: e.target.value })}
                  style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Description</label>
              <textarea rows={3} value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018", resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["inStock", "📦 In Stock"], ["isBestseller", "⭐ Bestseller"], ["isTrending", "🔥 Trending"], ["isNew", "✨ New"], ["onSale", "🏷 On Sale"]].map(([k, lbl]) => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", color: "#5a4a3e" }}>
                  <input type="checkbox" checked={!!editForm[k]} onChange={e => setEditForm({ ...editForm, [k]: e.target.checked })} style={{ accentColor: "#d4a574", width: 15, height: 15 }} />{lbl}
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setEditingProduct(null); setEditForm(null); }} style={{ padding: "11px 20px", borderRadius: 10, border: "1px solid #e8e0d8", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#b8a898", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={saveEdit} style={{ padding: "11px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#d4a574,#b07a5a)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "inherit" }}>Save Changes →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddProductPage({ showToast, onSave }) {
  const blank = { name: "", price: "", originalPrice: "", category: "", occasion: "", stock: "", material: "", description: "", image: "", variants: "", inStock: true, isBestseller: false, isTrending: false, isNew: false, onSale: false };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image too large (max 5MB)", "error"); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => { const base64 = e.target.result; setPreview(base64); set("image", base64); };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.price) e.price = "Required";
    if (!form.category) e.category = "Required";
    if (!form.image) e.image = "Image required";
    setErrors(e);
    return !Object.keys(e).length;
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
      const savedData = await supabaseQuery(SUPABASE_TABLE, "POST", [toDbRow(product)]);
      const saved = Array.isArray(savedData) ? savedData[0] : null;
      showToast("✓ Product saved!");
      onSave({ ...product, id: saved?.id || Date.now() });
    } catch (err) {
      showToast(`Save failed: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const inp = (label, key, props = {}) => (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>
        {label}
        {errors[key] && <span style={{ color: "#e07070", marginLeft: 6, fontWeight: 400 }}>{errors[key]}</span>}
      </label>
      <input className="am-inp" {...props} value={form[key]} onChange={e => set(key, e.target.value)}
        style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${errors[key] ? "#e07070" : "#e8e0d8"}`, borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", animation: "fadeIn .3s ease" }}>
      <div className="am-card">
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 400, color: "#2d2018", marginBottom: 20 }}>Add New Product</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {inp("Product Name", "name", { placeholder: "e.g. Kundan Jhumka Set" })}
          {inp("Price (₹)", "price", { type: "number", placeholder: "1499" })}
          {inp("Original Price (₹)", "originalPrice", { type: "number", placeholder: "Leave blank if no discount" })}
          {inp("Stock Quantity", "stock", { type: "number", placeholder: "0" })}

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>
              Category
              {errors.category && <span style={{ color: "#e07070", marginLeft: 6, fontWeight: 400 }}>{errors.category}</span>}
            </label>
            <select className="am-inp" value={form.category} onChange={e => set("category", e.target.value)}
              style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${errors.category ? "#e07070" : "#e8e0d8"}`, borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Occasion</label>
            <select className="am-inp" value={form.occasion} onChange={e => set("occasion", e.target.value)}
              style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018" }}>
              <option value="">Select occasion</option>
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {inp("Material", "material", { placeholder: "e.g. Gold plated, Pearl" })}
          {inp("Variants (comma separated)", "variants", { placeholder: "Gold, Silver, Rose Gold" })}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 8 }}>
            Product Image
            {errors.image && <span style={{ color: "#e07070", marginLeft: 6, fontWeight: 400 }}>{errors.image}</span>}
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ border: "2px dashed #e8e0d8", borderRadius: 10, padding: "24px 16px", textAlign: "center", cursor: "pointer", background: "#faf7f4" }}>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleImageFile(e.target.files[0])} />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
            <p style={{ fontSize: 13, color: "#5a4a3e", marginBottom: 4 }}>Click to select image or drag & drop</p>
            <p style={{ fontSize: 11, color: "#b8a898" }}>JPG, PNG, WebP (max 5MB)</p>
            {imageFile && <p style={{ fontSize: 12, color: "#4a8f4a", marginTop: 8, fontWeight: 600 }}>✓ {imageFile.name}</p>}
          </div>
          {preview && <img src={preview} alt="Preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10, border: "1px solid #ede8e3", marginTop: 12 }} />}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 5 }}>Description</label>
          <textarea className="am-inp" rows={3} placeholder="Describe the product…" value={form.description} onChange={e => set("description", e.target.value)}
            style={{ width: "100%", padding: "11px 13px", border: "1.5px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "#faf7f4", color: "#2d2018", resize: "vertical" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#b8a898", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 8 }}>Tags</label>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[["isBestseller", "⭐ Bestseller"], ["isTrending", "🔥 Trending"], ["isNew", "✨ New"], ["onSale", "🏷 On Sale"], ["inStock", "📦 In Stock"]].map(([k, lbl]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "#5a4a3e" }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} style={{ accentColor: "#d4a574", width: 15, height: 15 }} />{lbl}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={save} disabled={saving} className="am-btn-pri" style={{ padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.8px", fontFamily: "inherit" }}>
            {saving ? "Saving…" : "Save Product →"}
          </button>
          <button onClick={() => { setForm(blank); setPreview(null); setImageFile(null); setErrors({}); }} style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid #e8e0d8", background: "none", cursor: "pointer", fontSize: 12, color: "#b8a898", fontFamily: "inherit" }}>Clear</button>
        </div>
      </div>
    </div>
  );
}

function BulkImportPage({ showToast, onImport }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.name.toLowerCase().endsWith(".csv"));
    if (!files.length) { showToast("Only .csv files please", "error"); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const { headers, rows } = parseCSV(e.target.result);
          if (!headers.length || !rows.length) { showToast(`${file.name}: empty or unreadable CSV`, "error"); return; }
          const mapping = autoMapHeaders(headers);
          const isUSD = isUSDPriceCSV(headers);
          const batchId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const built = buildRows(rows, mapping, isUSD ? USD_TO_INR_DEFAULT : 1);
          const newBatch = {
            id: batchId,
            fileName: file.name,
            headers,
            rawRows: rows,
            mapping,
            isUSD,
            usdRate: USD_TO_INR_DEFAULT,
            overrideCat: "",
            overrideOcc: "",
            overrideBestseller: null,
            overrideTrending: null,
            overrideOnSale: null,
            defaultInStock: true,
            rows: built,
          };
          setBatches(prev => [...prev, newBatch]);
          setActiveBatch(batchId);
          showToast(`${file.name}: ${rows.length} rows loaded`);
        } catch (err) {
          showToast(`${file.name}: parse error — ${err.message}`, "error");
        }
      };
      reader.readAsText(file);
    });
  };

  function buildRows(rawRows, mapping, usdRate) {
    return rawRows.map((raw, i) => {
      const get = (key) => mapping[key] ? (raw[mapping[key]] ?? "") : "";
      const tags = get("tags");
      const detected = detectFromTags(tags);
      const title = get("name").trim();
      const priceRaw = parseFloat(get("price")) || 0;
      const price = usdRate !== 1 ? Math.round(priceRaw * usdRate) : Math.round(priceRaw);
      const origRaw = parseFloat(get("originalPrice")) || 0;
      const originalPrice = origRaw ? (usdRate !== 1 ? Math.round(origRaw * usdRate) : Math.round(origRaw)) : null;
      const stockVal = parseInt(get("stock")) || 0;
      const imageField = get("image");
      const image = imageField.split(",")[0]?.trim().replace(/^http:\/\//i, "https://")?.split("?")[0] || "";
      return {
        _rowNum: i + 2,
        name: title,
        description: get("description").replace(/\n/g, " ").trim().slice(0, 1000),
        price,
        originalPrice,
        stock: stockVal,
        inStock: stockVal > 0,
        category: get("category") || detected.category || guessCategoryFromTitle(title) || "",
        occasion: get("occasion") || detected.occasion || "",
        material: get("material"),
        image,
        isBestseller: detected.isBestseller,
        isTrending: detected.isTrending,
        isNew: detected.isNew,
        onSale: !!originalPrice,
      };
    });
  }

  const updateBatch = (id, patch) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== id) return b;
      const next = { ...b, ...patch };
      if (patch.mapping || patch.usdRate !== undefined) {
        next.rows = buildRows(next.rawRows, next.mapping, next.usdRate);
      }
      return next;
    }));
  };

  const updateRow = (batchId, rowIdx, patch) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const rows = b.rows.map((r, i) => i === rowIdx ? { ...r, ...patch } : r);
      return { ...b, rows };
    }));
  };

  const removeBatch = (id) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    if (activeBatch === id) setActiveBatch(null);
  };

  const totalRows = useMemo(() => batches.reduce((s, b) => s + b.rows.length, 0), [batches]);

  const getReadyRows = (batch) => batch.rows.map(({ _rowNum, ...row }) => toDbRow({
    ...row,
    category: batch.overrideCat || row.category,
    occasion: batch.overrideOcc || row.occasion,
    isBestseller: batch.overrideBestseller !== null ? batch.overrideBestseller : row.isBestseller,
    isTrending: batch.overrideTrending !== null ? batch.overrideTrending : row.isTrending,
    onSale: batch.overrideOnSale !== null ? batch.overrideOnSale : row.onSale,
  })).filter(r => r.name && r.price);

  const doImport = async () => {
    const allRows = batches.flatMap(b => getReadyRows(b));
    if (!allRows.length) { showToast("No valid rows to import", "error"); return; }
    setImporting(true); setProgress(0);
    const BATCH = 50;
    let ok = 0, fail = 0;
    for (let i = 0; i < allRows.length; i += BATCH) {
      const chunk = allRows.slice(i, i + BATCH);
      try {
        await supabaseQuery(SUPABASE_TABLE, "POST", chunk);
        ok += chunk.length;
      } catch (err) {
        console.error("Batch insert failed:", err.message);
        for (const row of chunk) {
          try { await supabaseQuery(SUPABASE_TABLE, "POST", [row]); ok++; }
          catch (err2) { console.error("Row failed:", row.name, err2.message); fail++; }
        }
      }
      setProgress(Math.min(100, Math.round(((i + BATCH) / allRows.length) * 100)));
    }
    setImporting(false);
    if (fail) showToast(`${ok} imported, ${fail} failed`, fail === allRows.length ? "error" : "success");
    else showToast(`${ok} products imported!`);
    if (ok) { setBatches([]); setActiveBatch(null); onImport(); }
  };

  const active = batches.find(b => b.id === activeBatch);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeIn .3s ease" }}>
      <div className="am-card" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 400, color: "#2d2018", marginBottom: 4 }}>Bulk Upload</h3>
          <p style={{ fontSize: 12, color: "#b8a898" }}>Drop any CSV — Etsy export or your own format. Columns auto-detect, fully adjustable per row before uploading.</p>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{ border: `2px dashed ${dragging ? "#d4a574" : "#e8e0d8"}`, borderRadius: 14, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: dragging ? "#fdf5ee" : "#faf7f4", transition: "all .2s" }}>
          <input ref={fileRef} type="file" accept=".csv" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
          <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
          <p style={{ fontSize: 14, color: "#8a7a6e" }}>Drop CSV file(s) here or <strong style={{ color: "#d4a574" }}>tap to browse</strong></p>
          <p style={{ fontSize: 11, color: "#c8b8a8", marginTop: 6 }}>Multiple files supported</p>
        </div>
      </div>

      {batches.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {batches.map(b => (
              <button key={b.id} onClick={() => setActiveBatch(b.id)}
                style={{ padding: "8px 14px", borderRadius: 10, border: activeBatch === b.id ? "1.5px solid #d4a574" : "1px solid #e8e0d8", background: activeBatch === b.id ? "#fdf5ee" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: activeBatch === b.id ? "#b07a5a" : "#8a7a6e", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                📄 {b.fileName} <span style={{ color: "#c8b8a8", fontWeight: 400 }}>({b.rows.length})</span>
                <span onClick={e => { e.stopPropagation(); removeBatch(b.id); }} style={{ color: "#e07070", fontWeight: 700, marginLeft: 4 }}>✕</span>
              </button>
            ))}
          </div>

          {active && <BatchEditor batch={active} onUpdateBatch={updateBatch} onUpdateRow={updateRow} />}

          {importing && (
            <div style={{ margin: "14px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#b8a898", marginBottom: 6 }}><span>Uploading…</span><span>{progress}%</span></div>
              <div style={{ height: 6, background: "#f0ebe5", borderRadius: 4 }}><div style={{ height: "100%", background: "linear-gradient(90deg,#d4a574,#b07a5a)", width: `${progress}%`, borderRadius: 4, transition: "width .3s" }} /></div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#5a4a3e", fontWeight: 600 }}>{totalRows} total rows</span>
            <button onClick={doImport} disabled={importing} className="am-btn-pri"
              style={{ padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.8px", fontFamily: "inherit" }}>
              {importing ? `Uploading… ${progress}%` : `🚀 Upload All (${totalRows})`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function BatchEditor({ batch, onUpdateBatch, onUpdateRow }) {
  const [showMapper, setShowMapper] = useState(false);
  const validRows = batch.rows.filter(r => r.name && r.price).length;
  const invalidRows = batch.rows.length - validRows;

  const setMapping = (fieldKey, header) => {
    onUpdateBatch(batch.id, { mapping: { ...batch.mapping, [fieldKey]: header } });
  };

  return (
    <div className="am-card" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#2d2018" }}>{batch.fileName}</p>
          <p style={{ fontSize: 11, color: "#c8b8a8" }}>{validRows} ready{invalidRows ? `, ${invalidRows} incomplete (skipped)` : ""}</p>
        </div>
        <button onClick={() => setShowMapper(s => !s)}
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #d4a574", background: showMapper ? "#d4a574" : "#fff", color: showMapper ? "#fff" : "#d4a574", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.6px" }}>
          ⚙ {showMapper ? "Hide" : "Edit"} Mapping
        </button>
      </div>

      {showMapper && (
        <div style={{ background: "#faf7f4", border: "1px solid #ede8e3", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {PRODUCT_FIELDS.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, color: "#b8a898", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  {f.label}{f.required && <span style={{ color: "#e07070" }}> *</span>}
                </label>
                <select value={batch.mapping[f.key] || ""} onChange={e => setMapping(f.key, e.target.value)}
                  className="am-inp" style={{ width: "100%", padding: "9px 10px", border: "1.5px solid #e8e0d8", borderRadius: 8, fontSize: 12, background: "#fff", color: "#2d2018" }}>
                  <option value="">— Not mapped —</option>
                  {batch.headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: "#b8a898", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Override Category</label>
              <select value={batch.overrideCat} onChange={e => onUpdateBatch(batch.id, { overrideCat: e.target.value })}
                className="am-inp" style={{ width: "100%", padding: "9px 10px", border: "1.5px solid #e8e0d8", borderRadius: 8, fontSize: 12, background: "#fff", color: "#2d2018" }}>
                <option value="">Auto / per-row</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#b8a898", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Override Occasion</label>
              <select value={batch.overrideOcc} onChange={e => onUpdateBatch(batch.id, { overrideOcc: e.target.value })}
                className="am-inp" style={{ width: "100%", padding: "9px 10px", border: "1.5px solid #e8e0d8", borderRadius: 8, fontSize: 12, background: "#fff", color: "#2d2018" }}>
                <option value="">Auto / per-row</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#b8a898", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                {batch.isUSD ? "USD → INR" : "Price Multiplier"}
              </label>
              <input type="number" step="0.1" value={batch.usdRate}
                onChange={e => onUpdateBatch(batch.id, { usdRate: Number(e.target.value) || 1 })}
                className="am-inp" style={{ width: "100%", padding: "9px 10px", border: "1.5px solid #e8e0d8", borderRadius: 8, fontSize: 12, background: "#fff", color: "#2d2018" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#b8a898", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Tag Override</label>
              <select onChange={e => {
                const val = e.target.value;
                if (val === "bestseller") onUpdateBatch(batch.id, { overrideBestseller: true, overrideTrending: null, overrideOnSale: null });
                else if (val === "trending") onUpdateBatch(batch.id, { overrideTrending: true, overrideBestseller: null, overrideOnSale: null });
                else if (val === "sale") onUpdateBatch(batch.id, { overrideOnSale: true, overrideBestseller: null, overrideTrending: null });
                else onUpdateBatch(batch.id, { overrideBestseller: null, overrideTrending: null, overrideOnSale: null });
              }}
                className="am-inp" style={{ width: "100%", padding: "9px 10px", border: "1.5px solid #e8e0d8", borderRadius: 8, fontSize: 12, background: "#fff", color: "#2d2018" }}>
                <option value="">Auto / per-row</option>
                <option value="bestseller">⭐ Bestseller</option>
                <option value="trending">🔥 Trending</option>
                <option value="sale">🏷 On Sale</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #ede8e3" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead><tr style={{ background: "#faf7f4" }}>
            {["#", "Image", "Name", "Category", "Occasion", "Price (₹)", "Stock", "Tags"].map(h => (
              <th key={h} style={{ fontSize: 10, color: "#c8b8a8", fontWeight: 700, textAlign: "left", padding: "9px 10px", borderBottom: "1px solid #ede8e3", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {batch.rows.map((row, i) => {
              const dc = batch.overrideCat || row.category;
              const docc = batch.overrideOcc || row.occasion;
              const isBestseller = batch.overrideBestseller !== null ? batch.overrideBestseller : row.isBestseller;
              const isTrending = batch.overrideTrending !== null ? batch.overrideTrending : row.isTrending;
              const onSale = batch.overrideOnSale !== null ? batch.overrideOnSale : row.onSale;
              const incomplete = !row.name || !row.price;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f5f0ea", background: incomplete ? "#fdf3f0" : "transparent" }}>
                  <td style={{ padding: "8px 10px", fontSize: 11, color: "#c8b8a8" }}>{row._rowNum}</td>
                  <td style={{ padding: "8px 10px" }}>
                    {row.image ? <img src={row.image} alt="" style={{ width: 34, height: 34, objectFit: "cover", borderRadius: 6, border: "1px solid #ede8e3" }} onError={e => { e.target.style.display = "none"; }} /> : <div style={{ width: 34, height: 34, background: "#f5f0ea", borderRadius: 6, border: "1px solid #ede8e3" }} />}
                  </td>
                  <td style={{ padding: "8px 10px", maxWidth: 200 }}>
                    <input value={row.name} onChange={e => onUpdateRow(batch.id, i, { name: e.target.value })}
                      style={{ width: "100%", border: incomplete && !row.name ? "1.5px solid #e07070" : "1px solid #ede8e3", borderRadius: 6, padding: "5px 7px", fontSize: 12, fontFamily: "'Playfair Display',serif", color: "#2d2018", background: "#fff" }} />
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <select value={dc} onChange={e => onUpdateRow(batch.id, i, { category: e.target.value })} disabled={!!batch.overrideCat}
                      style={{ fontSize: 11, fontWeight: 600, padding: "4px 6px", borderRadius: 6, border: "1px solid #ede8e3", background: batch.overrideCat ? "#f5f0ea" : "#fff", color: CAT_COLORS[dc] || "#5a4a3e", cursor: batch.overrideCat ? "not-allowed" : "pointer" }}>
                      <option value="">—</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <select value={docc} onChange={e => onUpdateRow(batch.id, i, { occasion: e.target.value })} disabled={!!batch.overrideOcc}
                      style={{ fontSize: 11, padding: "4px 6px", borderRadius: 6, border: "1px solid #ede8e3", background: batch.overrideOcc ? "#f5f0ea" : "#fff", color: "#5a4a3e", cursor: batch.overrideOcc ? "not-allowed" : "pointer" }}>
                      <option value="">—</option>
                      {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <input type="number" value={row.price} onChange={e => onUpdateRow(batch.id, i, { price: Number(e.target.value) || 0 })}
                      style={{ width: 80, border: incomplete && !row.price ? "1.5px solid #e07070" : "1px solid #ede8e3", borderRadius: 6, padding: "5px 7px", fontSize: 12, color: "#b07a5a", fontWeight: 600, background: "#fff" }} />
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <input type="number" value={row.stock} onChange={e => onUpdateRow(batch.id, i, { stock: Number(e.target.value) || 0, inStock: (Number(e.target.value) || 0) > 0 })}
                      style={{ width: 60, border: "1px solid #ede8e3", borderRadius: 6, padding: "5px 7px", fontSize: 12, color: row.stock > 0 ? "#4a8f4a" : "#c44a4a", fontWeight: 600, background: "#fff" }} />
                  </td>
                  <td style={{ padding: "8px 10px", display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {isBestseller && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "#e0b07022", color: "#c4906a", fontWeight: 600 }}>⭐</span>}
                    {isTrending && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "#c4706a22", color: "#c4706a", fontWeight: 600 }}>🔥</span>}
                    {onSale && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "#d4a57422", color: "#b07a5a", fontWeight: 600 }}>🏷</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersPage({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    supabaseQuery("orders?select=*&order=created_at.desc&limit=100")
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setOrders([]); setLoading(false); });
  }, []);

  const STATUS = { new: { bg: "#e8f0fd", color: "#5a7fc4" }, processing: { bg: "#fdf3e3", color: "#c47a2a" }, shipped: { bg: "#e8f5e8", color: "#4a8f4a" }, delivered: { bg: "#d4edda", color: "#2a6a2a" }, cancelled: { bg: "#fde8e8", color: "#c44a4a" } };
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const update = async (id, status) => {
    try {
      await supabaseQuery(`orders?id=eq.${id}`, "PATCH", { status });
      setOrders(prev => prev.map(o => (o.id === id || o._id === id) ? { ...o, status } : o));
      showToast("Order updated");
    } catch (err) {
      showToast("Update failed: " + err.message, "error");
    }
  };

  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "new", "processing", "shipped", "delivered", "cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.6px", textTransform: "capitalize", fontFamily: "inherit", background: filter === s ? "linear-gradient(135deg,#d4a574,#b07a5a)" : "#fff", color: filter === s ? "#fff" : "#b8a898", border: filter === s ? "none" : "1px solid #e8e0d8" }}>
            {s === "all" ? `All (${orders.length})` : s}
          </button>
        ))}
      </div>
      <div className="am-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <p style={{ padding: 40, textAlign: "center", color: "#c8b8a8", fontStyle: "italic" }}>Loading orders…</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
              <thead><tr style={{ background: "#faf7f4" }}>
                {["Order", "Date", "Customer", "Items", "Amount", "Status", "Update"].map(h => (
                  <th key={h} style={{ fontSize: 10, color: "#c8b8a8", fontWeight: 700, textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #ede8e3", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(o => {
                  const sc = STATUS[o.status] || STATUS.new;
                  return (
                    <tr key={o.id || o._id} className="am-tr" style={{ borderBottom: "1px solid #f5f0ea" }}>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#b07a5a", fontWeight: 600 }}>{o.id || o._id}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#c8b8a8" }}>{o.date || o.created_at?.slice(0, 10)}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#2d2018" }}>{o.customer || o.customer_name}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#8a7a6e" }}>{o.items}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#2d2018", fontWeight: 600 }}>{formatINR(o.amount)}</td>
                      <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.color }}>{o.status}</span></td>
                      <td style={{ padding: "10px 14px" }}>
                        <select value={o.status} onChange={e => update(o.id || o._id, e.target.value)}
                          className="am-inp"
                          style={{ padding: "6px 8px", border: "1.5px solid #e8e0d8", borderRadius: 7, fontSize: 12, background: "#faf7f4", color: "#2d2018" }}>
                          {["new", "processing", "shipped", "delivered", "cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p style={{ padding: 30, textAlign: "center", color: "#c8b8a8", fontSize: 13 }}>No orders found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
