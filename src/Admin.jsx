import { useState, useEffect, useRef } from "react";

const API_BASE = "https://rayfinesite-3.onrender.com";
const NOTIFY_EMAIL = "bhaveshgemsonline@gmail.com";

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatINR(n) { return "₹" + Number(n).toLocaleString("en-IN"); }

const EMPTY_PRODUCT = {
  name: "", price: "", original_price: "", category: "Earring",
  description: "", material: "", variants: "", care_instructions: "",
  image: "", in_stock: true, stock_qty: "", tracking_info: "",
};

const CATEGORIES = ["Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Other"];

// ─── CSV bulk parser ───────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase().replace(/ /g, "_"));
  return lines.slice(1).map(line => {
    // Handle quoted commas
    const cols = [];
    let inQuote = false, cur = "";
    for (let ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === "," && !inQuote) { cols.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    cols.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] ?? ""; });
    return obj;
  }).filter(r => r.name);
}

// ─── Styles (inline) ──────────────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#FDF6F9", fontFamily: "'Jost', 'Segoe UI', sans-serif", color: "#3D1A28" },
  topbar: { background: "#fff", borderBottom: "1px solid #F2DCE6", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(200,91,130,0.06)" },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", color: "#C85B82", fontWeight: 500 },
  badge: { background: "#C85B82", color: "#fff", borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" },
  sidebar: { width: "220px", background: "#fff", borderRight: "1px solid #F2DCE6", minHeight: "calc(100vh - 64px)", padding: "24px 0", flexShrink: 0 },
  sideItem: (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "12px 24px", cursor: "pointer", background: active ? "#FAEDF3" : "transparent", color: active ? "#C85B82" : "#5A3040", fontWeight: active ? 700 : 400, fontSize: "13px", letterSpacing: "0.5px", borderLeft: active ? "3px solid #C85B82" : "3px solid transparent", transition: "all 0.2s" }),
  main: { flex: 1, padding: "32px", overflowY: "auto" },
  card: { background: "#fff", border: "1px solid #F2DCE6", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 12px rgba(200,91,130,0.04)" },
  statCard: (color) => ({ background: "#fff", border: `1px solid ${color}22`, borderRadius: "16px", padding: "24px", flex: "1 1 180px", position: "relative", overflow: "hidden" }),
  h2: { fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, color: "#3D1A28", marginBottom: "4px" },
  h3: { fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 400, color: "#3D1A28", marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#8A6070", marginBottom: "6px" },
  input: { width: "100%", padding: "11px 16px", border: "1px solid #F2DCE6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Jost', sans-serif", color: "#3D1A28", background: "#FAEDF3", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  select: { width: "100%", padding: "11px 16px", border: "1px solid #F2DCE6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Jost', sans-serif", color: "#3D1A28", background: "#FAEDF3", outline: "none", cursor: "pointer", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "11px 16px", border: "1px solid #F2DCE6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Jost', sans-serif", color: "#3D1A28", background: "#FAEDF3", outline: "none", resize: "vertical", boxSizing: "border-box" },
  btnPrimary: { padding: "11px 28px", background: "#C85B82", color: "#fff", border: "none", borderRadius: "40px", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", fontFamily: "'Jost', sans-serif" },
  btnGhost: { padding: "11px 22px", background: "transparent", color: "#C85B82", border: "1.5px solid #C85B82", borderRadius: "40px", fontSize: "12px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", fontFamily: "'Jost', sans-serif" },
  btnDanger: { padding: "8px 16px", background: "#FFF0F3", color: "#C85B82", border: "1px solid #F2DCE6", borderRadius: "20px", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },
  btnSuccess: { padding: "8px 16px", background: "#E8F5E9", color: "#2E7D32", border: "1px solid #C8E6CA", borderRadius: "20px", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { padding: "12px 14px", background: "#FAEDF3", color: "#8A6070", fontWeight: 700, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", textAlign: "left", borderBottom: "1px solid #F2DCE6" },
  td: { padding: "12px 14px", borderBottom: "1px solid #F2DCE6", verticalAlign: "middle" },
  toast: (type) => ({ position: "fixed", bottom: "28px", right: "28px", zIndex: 9999, background: type === "success" ? "#2E7D32" : type === "error" ? "#C62828" : "#1565C0", color: "#fff", padding: "14px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", animation: "fadeIn 0.3s ease" }),
  gridTwo: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  gridThree: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
  tag: (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", background: color + "22", color }),
};

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onHide }) {
  useEffect(() => { if (msg) { const t = setTimeout(onHide, 3000); return () => clearTimeout(t); } }, [msg]);
  if (!msg) return null;
  return <div style={S.toast(type)}>{type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"} {msg}</div>;
}

// ─── Product Form ───────────────────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_PRODUCT);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.price) { alert("Name and Price are required"); return; }
    onSave(form);
  };

  return (
    <div>
      <div style={S.gridTwo}>
        <div>
          <label style={S.label}>Product Name *</label>
          <input style={S.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Pearl Drop Earrings" />
        </div>
        <div>
          <label style={S.label}>Category</label>
          <select style={S.select} value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ ...S.gridThree, marginTop: "14px" }}>
        <div>
          <label style={S.label}>Price (₹) *</label>
          <input style={S.input} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="499" />
        </div>
        <div>
          <label style={S.label}>Original Price (₹)</label>
          <input style={S.input} type="number" value={form.original_price} onChange={e => set("original_price", e.target.value)} placeholder="799" />
        </div>
        <div>
          <label style={S.label}>Stock Quantity</label>
          <input style={S.input} type="number" value={form.stock_qty} onChange={e => set("stock_qty", e.target.value)} placeholder="10" />
        </div>
      </div>

      <div style={{ marginTop: "14px" }}>
        <label style={S.label}>Description</label>
        <textarea style={S.textarea} rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Beautiful handcrafted piece..." />
      </div>

      <div style={{ ...S.gridTwo, marginTop: "14px" }}>
        <div>
          <label style={S.label}>Material</label>
          <input style={S.input} value={form.material} onChange={e => set("material", e.target.value)} placeholder="Gold-plated brass" />
        </div>
        <div>
          <label style={S.label}>Variants (comma separated)</label>
          <input style={S.input} value={form.variants} onChange={e => set("variants", e.target.value)} placeholder="Gold, Silver, Rose Gold" />
        </div>
      </div>

      <div style={{ marginTop: "14px" }}>
        <label style={S.label}>Care Instructions</label>
        <input style={S.input} value={form.care_instructions} onChange={e => set("care_instructions", e.target.value)} placeholder="Keep away from water and perfumes." />
      </div>

      <div style={{ marginTop: "14px" }}>
        <label style={S.label}>Tracking Info (shown to customers)</label>
        <input style={S.input} value={form.tracking_info} onChange={e => set("tracking_info", e.target.value)} placeholder="Ships in 3-5 days via BlueDart / FedEx · Tracking shared after dispatch" />
      </div>

      <div style={{ marginTop: "14px" }}>
        <label style={S.label}>Image URL</label>
        <input style={S.input} value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://..." />
      </div>

      <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <label style={{ ...S.label, margin: 0 }}>In Stock</label>
        <button
          onClick={() => set("in_stock", !form.in_stock)}
          style={{ padding: "8px 20px", borderRadius: "20px", border: "none", cursor: "pointer", background: form.in_stock ? "#C85B82" : "#eee", color: form.in_stock ? "#fff" : "#888", fontWeight: 700, fontSize: "12px", transition: "all 0.2s" }}
        >
          {form.in_stock ? "✓ In Stock" : "Out of Stock"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button style={S.btnPrimary} onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : initial ? "Update Product" : "Add Product"}
        </button>
        {onCancel && <button style={S.btnGhost} onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

// ─── Bulk Import Modal ─────────────────────────────────────────────────────────
function BulkImportModal({ onClose, onImport }) {
  const [tab, setTab] = useState("csv"); // csv | manual
  const [csvText, setCsvText] = useState("");
  const [rows, setRows] = useState([]);
  const [parsed, setParsed] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const TEMPLATE = `name,price,original_price,category,description,material,variants,care_instructions,image,stock_qty,tracking_info
Pearl Drop Earrings,499,799,Earring,Beautiful handcrafted pearl earrings,Gold-plated brass,"Gold,Silver",Keep away from water,https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400,15,Ships in 3-5 days via BlueDart
Rose Quartz Bracelet,699,999,Bracelet,Delicate rose quartz bracelet,Sterling silver,"Rose Gold,Silver",Store in airtight pouch,https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400,8,Ships in 2-4 days via FedEx`;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setCsvText(text);
      const p = parseCSV(text);
      setParsed(p);
    };
    reader.readAsText(file);
  };

  const handlePasteCSV = (text) => {
    setCsvText(text);
    const p = parseCSV(text);
    setParsed(p);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bulk_product_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const addManualRow = () => {
    setRows(r => [...r, { ...EMPTY_PRODUCT, _id: Date.now() }]);
  };

  const updateRow = (id, key, val) => {
    setRows(r => r.map(row => row._id === id ? { ...row, [key]: val } : row));
  };

  const removeRow = (id) => setRows(r => r.filter(row => row._id !== id));

  const doImport = async (products) => {
    if (!products.length) { alert("No products to import"); return; }
    setImporting(true);
    setProgress(0);
    let successCount = 0;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${API_BASE}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({
            name: p.name, price: Number(p.price), original_price: p.original_price ? Number(p.original_price) : null,
            category: p.category || "Other", description: p.description || "", material: p.material || "",
            variants: p.variants || "", care_instructions: p.care_instructions || "",
            image: p.image || "", in_stock: p.in_stock !== false && p.in_stock !== "false" && p.in_stock !== 0,
            stock_qty: p.stock_qty ? Number(p.stock_qty) : null,
            tracking_info: p.tracking_info || "",
          }),
        });
        if (res.ok) successCount++;
      } catch { /* continue */ }
      setProgress(Math.round(((i + 1) / products.length) * 100));
    }
    setImporting(false);
    onImport(successCount, products.length);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(42,14,26,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "min(960px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", padding: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={S.h2}>📦 Bulk Import Products</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#aaa" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[["csv", "📄 CSV / File Upload"], ["manual", "✏️ Manual Grid"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: "10px 20px", borderRadius: "30px", border: "none", cursor: "pointer", background: tab === key ? "#C85B82" : "#FAEDF3", color: tab === key ? "#fff" : "#C85B82", fontWeight: 700, fontSize: "12px", letterSpacing: "1px", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "csv" && (
          <div>
            <div style={{ background: "#FAEDF3", border: "1px dashed #F4C0D1", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: "#5A3040", marginBottom: "12px", lineHeight: "1.7" }}>
                <strong>📋 CSV Format:</strong> Upload a CSV file or paste CSV text below. Columns:<br />
                <code style={{ background: "#fff", padding: "2px 6px", borderRadius: "6px", fontSize: "11px" }}>name, price, original_price, category, description, material, variants, care_instructions, image, stock_qty, tracking_info</code>
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button style={S.btnGhost} onClick={downloadTemplate}>⬇️ Download Template</button>
                <button style={S.btnPrimary} onClick={() => fileRef.current.click()}>📁 Upload CSV File</button>
                <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleFile} />
              </div>
            </div>

            <label style={S.label}>Paste CSV Text</label>
            <textarea
              style={{ ...S.textarea, height: "160px", fontFamily: "monospace", fontSize: "12px" }}
              placeholder={TEMPLATE}
              value={csvText}
              onChange={e => handlePasteCSV(e.target.value)}
            />

            {parsed.length > 0 && (
              <div style={{ marginTop: "16px", background: "#FAEDF3", borderRadius: "12px", padding: "16px" }}>
                <p style={{ fontSize: "13px", color: "#5A3040", marginBottom: "12px", fontWeight: 600 }}>✅ {parsed.length} products ready to import:</p>
                <div style={{ overflowX: "auto", maxHeight: "200px", overflowY: "auto" }}>
                  <table style={S.table}>
                    <thead><tr>
                      {["Name","Price","Category","Stock"].map(h => <th key={h} style={S.th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {parsed.map((p, i) => (
                        <tr key={i}>
                          <td style={S.td}>{p.name}</td>
                          <td style={S.td}>₹{p.price}</td>
                          <td style={S.td}>{p.category}</td>
                          <td style={S.td}>{p.stock_qty || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {importing && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ height: "8px", background: "#F2DCE6", borderRadius: "8px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: "#C85B82", borderRadius: "8px", transition: "width 0.3s" }} />
                </div>
                <p style={{ fontSize: "12px", color: "#8A6070", marginTop: "6px" }}>Importing... {progress}%</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button style={S.btnPrimary} onClick={() => doImport(parsed)} disabled={importing || !parsed.length}>
                {importing ? `Importing... ${progress}%` : `Import ${parsed.length} Products`}
              </button>
              <button style={S.btnGhost} onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}

        {tab === "manual" && (
          <div>
            <p style={{ fontSize: "13px", color: "#8A6070", marginBottom: "16px" }}>Add multiple products manually. Click "Add Row" to add a new product.</p>

            {rows.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#C0A0B0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "18px", fontStyle: "italic" }}>No rows yet. Click "Add Row" to start.</p>
              </div>
            )}

            {rows.map((row, idx) => (
              <div key={row._id} style={{ border: "1px solid #F2DCE6", borderRadius: "12px", padding: "16px", marginBottom: "12px", background: "#FAEDF3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#C85B82" }}>Product #{idx + 1}</span>
                  <button style={S.btnDanger} onClick={() => removeRow(row._id)}>✕ Remove</button>
                </div>
                <div style={S.gridTwo}>
                  <div>
                    <label style={S.label}>Name *</label>
                    <input style={S.input} value={row.name} onChange={e => updateRow(row._id, "name", e.target.value)} placeholder="Product name" />
                  </div>
                  <div>
                    <label style={S.label}>Category</label>
                    <select style={S.select} value={row.category} onChange={e => updateRow(row._id, "category", e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ ...S.gridThree, marginTop: "10px" }}>
                  <div>
                    <label style={S.label}>Price (₹) *</label>
                    <input style={S.input} type="number" value={row.price} onChange={e => updateRow(row._id, "price", e.target.value)} placeholder="499" />
                  </div>
                  <div>
                    <label style={S.label}>Original (₹)</label>
                    <input style={S.input} type="number" value={row.original_price} onChange={e => updateRow(row._id, "original_price", e.target.value)} placeholder="799" />
                  </div>
                  <div>
                    <label style={S.label}>Stock Qty</label>
                    <input style={S.input} type="number" value={row.stock_qty} onChange={e => updateRow(row._id, "stock_qty", e.target.value)} placeholder="10" />
                  </div>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <label style={S.label}>Image URL</label>
                  <input style={S.input} value={row.image} onChange={e => updateRow(row._id, "image", e.target.value)} placeholder="https://..." />
                </div>
                <div style={{ marginTop: "10px" }}>
                  <label style={S.label}>Tracking Info</label>
                  <input style={S.input} value={row.tracking_info} onChange={e => updateRow(row._id, "tracking_info", e.target.value)} placeholder="Ships in 3-5 days via BlueDart" />
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button style={S.btnGhost} onClick={addManualRow}>+ Add Row</button>
              <button style={S.btnPrimary} onClick={() => doImport(rows)} disabled={importing || !rows.length}>
                {importing ? `Importing... ${progress}%` : `Import ${rows.length} Products`}
              </button>
              <button style={{ ...S.btnGhost, borderColor: "#ddd", color: "#aaa" }} onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stock Update Modal ────────────────────────────────────────────────────────
function StockModal({ product, onClose, onSave }) {
  const [qty, setQty] = useState(product.stock_qty ?? product.stockQty ?? "");
  const [inStock, setInStock] = useState(product.in_stock !== false && product.in_stock !== 0);
  const [tracking, setTracking] = useState(product.tracking_info || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API_BASE}/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ ...product, stock_qty: qty === "" ? null : Number(qty), in_stock: inStock, tracking_info: tracking }),
      });
      onSave();
    } catch { alert("Update failed"); }
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(42,14,26,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "min(480px, 100%)", padding: "36px", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={S.h3}>📦 Stock Update</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
        </div>
        <p style={{ fontSize: "14px", color: "#5A3040", marginBottom: "20px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "16px" }}>{product.name}</p>

        <div style={{ marginBottom: "16px" }}>
          <label style={S.label}>Stock Quantity</label>
          <input style={S.input} type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Enter quantity (leave blank = unlimited)" min="0" />
          {qty !== "" && Number(qty) <= 5 && Number(qty) > 0 && (
            <p style={{ fontSize: "11px", color: "#F57C00", marginTop: "6px" }}>⚠️ Low stock warning!</p>
          )}
          {qty === "0" && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "6px" }}>❌ This will mark product as Out of Stock</p>}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={S.label}>Stock Status</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setInStock(true)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: inStock ? "2px solid #2E7D32" : "1px solid #ddd", background: inStock ? "#E8F5E9" : "#fafafa", color: inStock ? "#2E7D32" : "#888", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>✓ In Stock</button>
            <button onClick={() => setInStock(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: !inStock ? "2px solid #C62828" : "1px solid #ddd", background: !inStock ? "#FFEBEE" : "#fafafa", color: !inStock ? "#C62828" : "#888", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>✕ Out of Stock</button>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={S.label}>Tracking Info</label>
          <input style={S.input} value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Ships in 3-5 days via BlueDart · Tracking shared after dispatch" />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Notification Preview ───────────────────────────────────────────────
function OrdersPanel({ orders }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={S.h2}>📬 Recent Orders</h2>
        <div style={{ fontSize: "12px", color: "#8A6070", background: "#FAEDF3", padding: "8px 16px", borderRadius: "20px" }}>
          Notifications → <strong style={{ color: "#C85B82" }}>{NOTIFY_EMAIL}</strong>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#C0A0B0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>No orders yet</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>New orders will appear here and be notified to <strong>{NOTIFY_EMAIL}</strong></p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>
              {["Order ID", "Customer", "Phone", "Items", "Total", "Status", "Time"].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#FAEDF3" }}>
                  <td style={S.td}><span style={S.tag("#C85B82")}>#{o.id || i + 1}</span></td>
                  <td style={S.td}><strong>{o.customer_name || o.name || "—"}</strong></td>
                  <td style={S.td}>{o.customer_phone || o.phone || "—"}</td>
                  <td style={S.td}>{o.items?.length || o.item_count || "—"} items</td>
                  <td style={S.td}><strong style={{ color: "#C85B82" }}>{formatINR(o.total || 0)}</strong></td>
                  <td style={S.td}><span style={S.tag(o.status === "completed" ? "#2E7D32" : o.status === "cancelled" ? "#C62828" : "#F57C00")}>{o.status || "pending"}</span></td>
                  <td style={S.td}>{o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin ────────────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [stockModal, setStockModal] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const showToast = (msg, type = "success") => setToast({ msg, type });
  const hideToast = () => setToast({ msg: "", type: "success" });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/products`);
      const d = await r.json();
      setProducts(Array.isArray(d?.data) ? d.data : []);
    } catch { showToast("Failed to load products", "error"); }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const r = await fetch(`${API_BASE}/api/orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (r.ok) {
        const d = await r.json();
        setOrders(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }
    } catch { /* orders endpoint may not exist */ }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const addProduct = async (form) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          original_price: form.original_price ? Number(form.original_price) : null,
          stock_qty: form.stock_qty !== "" ? Number(form.stock_qty) : null,
        }),
      });
      if (res.ok) { showToast("Product added!"); setShowAddForm(false); fetchProducts(); }
      else showToast("Failed to add", "error");
    } catch { showToast("Network error", "error"); }
    setSaving(false);
  };

  const updateProduct = async (form) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/products/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          original_price: form.original_price ? Number(form.original_price) : null,
          stock_qty: form.stock_qty !== "" ? Number(form.stock_qty) : null,
        }),
      });
      if (res.ok) { showToast("Product updated!"); setEditProduct(null); fetchProducts(); }
      else showToast("Update failed", "error");
    } catch { showToast("Network error", "error"); }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) { showToast("Product deleted", "info"); fetchProducts(); }
      else showToast("Delete failed", "error");
    } catch { showToast("Network error", "error"); }
  };

  const toggleStock = async (p) => {
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API_BASE}/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ ...p, in_stock: !(p.in_stock !== false && p.in_stock !== 0) }),
      });
      fetchProducts();
    } catch { showToast("Error", "error"); }
  };

  // Stats
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.in_stock !== false && p.in_stock !== 0).length;
  const lowStockCount = products.filter(p => {
    const qty = p.stock_qty ?? p.stockQty;
    return qty !== null && qty !== undefined && Number(qty) > 0 && Number(qty) <= 5;
  }).length;
  const onSaleCount = products.filter(p => p.original_price).length;

  // Filtered products
  let filtered = products.filter(p => {
    const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || (p.category || "").toLowerCase() === catFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  const MENU = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "products", icon: "💎", label: "Products" },
    { key: "add", icon: "➕", label: "Add Product" },
    { key: "orders", icon: "📬", label: "Orders" },
    { key: "shipping", icon: "🌍", label: "Worldwide Shipping" },
  ];

  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap'); @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Topbar */}
      <div style={S.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={S.logo}>✦ Ray Fine Ornates</span>
          <span style={S.badge}>ADMIN</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#8A6070" }}>
            Orders → <strong style={{ color: "#C85B82" }}>{NOTIFY_EMAIL}</strong>
          </span>
          <button style={S.btnPrimary} onClick={() => { setShowBulk(true); }}>📦 Bulk Import</button>
          <a href="/" style={{ ...S.btnGhost, textDecoration: "none", display: "inline-block" }}>← Website</a>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          {MENU.map(item => (
            <div key={item.key} style={S.sideItem(tab === item.key)} onClick={() => { setTab(item.key); if (item.key === "add") setShowAddForm(true); }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div style={{ margin: "24px 0", borderTop: "1px solid #F2DCE6" }} />
          <div style={{ padding: "0 24px" }}>
            <p style={{ fontSize: "11px", color: "#C0A0B0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Stats</p>
            <p style={{ fontSize: "13px", color: "#5A3040", marginBottom: "4px" }}>📦 {totalProducts} Products</p>
            <p style={{ fontSize: "13px", color: "#2E7D32", marginBottom: "4px" }}>✅ {inStockCount} In Stock</p>
            {lowStockCount > 0 && <p style={{ fontSize: "13px", color: "#F57C00", marginBottom: "4px" }}>⚠️ {lowStockCount} Low Stock</p>}
            <p style={{ fontSize: "13px", color: "#C85B82" }}>🏷️ {onSaleCount} On Sale</p>
          </div>
        </div>

        {/* Main Content */}
        <div style={S.main}>

          {/* Dashboard */}
          {tab === "dashboard" && (
            <div>
              <h2 style={{ ...S.h2, marginBottom: "24px" }}>Dashboard Overview</h2>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
                {[
                  { label: "Total Products", value: totalProducts, icon: "💎", color: "#C85B82" },
                  { label: "In Stock", value: inStockCount, icon: "✅", color: "#2E7D32" },
                  { label: "Low Stock", value: lowStockCount, icon: "⚠️", color: "#F57C00" },
                  { label: "On Sale", value: onSaleCount, icon: "🏷️", color: "#1565C0" },
                  { label: "Total Orders", value: orders.length, icon: "📬", color: "#7B1FA2" },
                ].map(s => (
                  <div key={s.label} style={S.statCard(s.color)}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
                    <div style={{ fontSize: "32px", fontFamily: "Cormorant Garamond, serif", fontWeight: 300, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#8A6070", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: "60px", height: "60px", borderRadius: "50%", background: s.color + "10", transform: "translate(20px, 20px)" }} />
                  </div>
                ))}
              </div>

              {/* Low stock alert */}
              {lowStockCount > 0 && (
                <div style={{ ...S.card, background: "#FFF8E1", border: "1px solid #FFE082" }}>
                  <h3 style={{ ...S.h3, color: "#E65100" }}>⚠️ Low Stock Alert</h3>
                  {products.filter(p => {
                    const qty = p.stock_qty ?? p.stockQty;
                    return qty !== null && qty !== undefined && Number(qty) > 0 && Number(qty) <= 5;
                  }).map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #FFE082" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>{p.name}</span>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={S.tag("#F57C00")}>Only {p.stock_qty ?? p.stockQty} left</span>
                        <button style={S.btnSuccess} onClick={() => setStockModal(p)}>Update Stock</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order notification config info */}
              <div style={{ ...S.card, background: "#E3F2FD", border: "1px solid #BBDEFB" }}>
                <h3 style={{ ...S.h3, color: "#1565C0" }}>📧 Order Notifications</h3>
                <p style={{ fontSize: "14px", color: "#1565C0", lineHeight: "1.7" }}>
                  New orders are sent as email notifications to: <strong>{NOTIFY_EMAIL}</strong><br />
                  <span style={{ fontSize: "12px", opacity: 0.8 }}>Configure your EmailJS credentials in App.js → <code>sendOrderNotification()</code> function to activate email delivery.</span>
                </p>
              </div>

              {/* Quick actions */}
              <div style={S.card}>
                <h3 style={S.h3}>⚡ Quick Actions</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button style={S.btnPrimary} onClick={() => { setTab("add"); setShowAddForm(true); }}>+ Add Product</button>
                  <button style={S.btnPrimary} onClick={() => setShowBulk(true)}>📦 Bulk Import</button>
                  <button style={S.btnGhost} onClick={() => setTab("products")}>View All Products</button>
                  <button style={S.btnGhost} onClick={() => setTab("orders")}>View Orders</button>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {(tab === "products" || tab === "add") && (
            <div>
              {/* Add / Edit form */}
              {(showAddForm && !editProduct) && (
                <div style={S.card}>
                  <h3 style={S.h3}>➕ Add New Product</h3>
                  <ProductForm onSave={addProduct} onCancel={() => setShowAddForm(false)} saving={saving} />
                </div>
              )}

              {editProduct && (
                <div style={S.card}>
                  <h3 style={S.h3}>✏️ Edit: {editProduct.name}</h3>
                  <ProductForm
                    initial={{
                      ...editProduct,
                      stock_qty: editProduct.stock_qty ?? editProduct.stockQty ?? "",
                      tracking_info: editProduct.tracking_info || "",
                      original_price: editProduct.original_price ?? editProduct.originalPrice ?? "",
                    }}
                    onSave={updateProduct}
                    onCancel={() => setEditProduct(null)}
                    saving={saving}
                  />
                </div>
              )}

              {/* Products list */}
              <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <h3 style={{ ...S.h3, margin: 0 }}>All Products ({products.length})</h3>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input
                      style={{ ...S.input, width: "200px", padding: "9px 14px" }}
                      placeholder="🔍 Search..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <select style={{ ...S.select, width: "140px", padding: "9px 14px" }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                      <option value="All">All Categories</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button style={S.btnPrimary} onClick={() => { setShowAddForm(true); setEditProduct(null); }}>+ Add</button>
                    <button style={S.btnGhost} onClick={() => setShowBulk(true)}>📦 Bulk</button>
                  </div>
                </div>

                {loading ? (
                  <p style={{ textAlign: "center", padding: "60px", color: "#8A6070", fontFamily: "Cormorant Garamond, serif", fontSize: "18px", fontStyle: "italic" }}>Loading products...</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={S.table}>
                      <thead><tr>
                        {["Image","Name","Category","Price","Stock Qty","Status","Tracking","Actions"].map(h => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {filtered.map((p, i) => {
                          const isInStock = p.in_stock !== false && p.in_stock !== 0;
                          const stockQty = p.stock_qty ?? p.stockQty;
                          return (
                            <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAEDF3" }}>
                              <td style={S.td}>
                                <img
                                  src={p.image?.startsWith("http") ? p.image.split(",")[0] : p.image ? `${API_BASE}${p.image.split(",")[0]}` : "https://placehold.co/48x48?text=💎"}
                                  alt={p.name}
                                  style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "10px", border: "1px solid #F2DCE6" }}
                                  onError={e => e.target.src = "https://placehold.co/48x48?text=💎"}
                                />
                              </td>
                              <td style={S.td}>
                                <strong style={{ fontSize: "14px" }}>{p.name}</strong>
                                {p.original_price && <div style={{ fontSize: "11px", color: "#8A6070", marginTop: "2px" }}>Sale item</div>}
                              </td>
                              <td style={S.td}><span style={S.tag("#C85B82")}>{p.category}</span></td>
                              <td style={S.td}>
                                <strong style={{ color: "#C85B82" }}>₹{Number(p.price).toLocaleString()}</strong>
                                {p.original_price && <div style={{ fontSize: "11px", textDecoration: "line-through", color: "#C0A0B0" }}>₹{Number(p.original_price).toLocaleString()}</div>}
                              </td>
                              <td style={S.td}>
                                {stockQty !== null && stockQty !== undefined ? (
                                  <span style={S.tag(Number(stockQty) === 0 ? "#C62828" : Number(stockQty) <= 5 ? "#F57C00" : "#2E7D32")}>
                                    {Number(stockQty) === 0 ? "Out" : stockQty}
                                  </span>
                                ) : (
                                  <span style={{ color: "#C0A0B0", fontSize: "12px" }}>—</span>
                                )}
                              </td>
                              <td style={S.td}>
                                <button
                                  onClick={() => toggleStock(p)}
                                  style={{ ...isInStock ? S.btnSuccess : S.btnDanger, minWidth: "80px" }}
                                >
                                  {isInStock ? "✓ In Stock" : "✕ Out"}
                                </button>
                              </td>
                              <td style={{ ...S.td, maxWidth: "160px" }}>
                                {p.tracking_info ? (
                                  <span style={{ fontSize: "11px", color: "#1565C0" }}>📦 {p.tracking_info.substring(0, 30)}{p.tracking_info.length > 30 ? "..." : ""}</span>
                                ) : (
                                  <span style={{ fontSize: "11px", color: "#C0A0B0" }}>—</span>
                                )}
                              </td>
                              <td style={S.td}>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  <button style={S.btnSuccess} onClick={() => { setEditProduct(p); setShowAddForm(false); }}>✏️</button>
                                  <button style={{ ...S.btnSuccess, background: "#E3F2FD", color: "#1565C0", border: "1px solid #BBDEFB" }} onClick={() => setStockModal(p)}>📦</button>
                                  <button style={S.btnDanger} onClick={() => deleteProduct(p.id)}>🗑</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {filtered.length === 0 && !loading && (
                      <p style={{ textAlign: "center", padding: "40px", color: "#8A6070", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "18px" }}>No products found.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div style={S.card}>
              <OrdersPanel orders={orders} />
            </div>
          )}

          {/* Worldwide Shipping Tab */}
          {tab === "shipping" && (
            <div>
              <h2 style={{ ...S.h2, marginBottom: "24px" }}>🌍 Worldwide Shipping Info</h2>
              <div style={{ ...S.card, background: "linear-gradient(135deg, #FAEDF3, #fff)" }}>
                <h3 style={S.h3}>Our Global Presence</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                  {[
                    ["🇮🇳", "India", "Same Day"],
                    ["🇺🇸", "USA", "7-12 Days"],
                    ["🇬🇧", "UK", "7-10 Days"],
                    ["🇦🇪", "UAE", "5-8 Days"],
                    ["🇦🇺", "Australia", "10-15 Days"],
                    ["🇨🇦", "Canada", "8-14 Days"],
                    ["🇩🇪", "Germany", "8-12 Days"],
                    ["🇸🇬", "Singapore", "6-10 Days"],
                    ["🇳🇿", "New Zealand", "10-15 Days"],
                    ["🇿🇦", "South Africa", "10-16 Days"],
                    ["🇯🇵", "Japan", "8-12 Days"],
                    ["+ 140", "More Countries", "Varies"],
                  ].map(([flag, country, time]) => (
                    <div key={country} style={{ background: "#fff", border: "1px solid #F2DCE6", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: "28px", marginBottom: "6px" }}>{flag}</div>
                      <div style={{ fontWeight: 700, fontSize: "13px", color: "#3D1A28" }}>{country}</div>
                      <div style={{ fontSize: "11px", color: "#8A6070", marginTop: "4px" }}>~{time}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#FAEDF3", borderRadius: "12px", padding: "20px" }}>
                  <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "18px", color: "#C85B82", marginBottom: "12px" }}>Shipping Partners</h4>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {["BlueDart", "FedEx", "DHL", "Delhivery", "India Post EMS", "Aramex"].map(s => (
                      <span key={s} style={S.tag("#C85B82")}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "20px", background: "#E3F2FD", borderRadius: "12px", padding: "20px", border: "1px solid #BBDEFB" }}>
                  <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "18px", color: "#1565C0", marginBottom: "8px" }}>📦 Tracking</h4>
                  <p style={{ fontSize: "13px", color: "#1565C0", lineHeight: "1.7" }}>
                    All international orders include tracking. Tracking details are shared with customers via WhatsApp / Email after dispatch. Update tracking info for each product in the Products tab.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      {showBulk && (
        <BulkImportModal
          onClose={() => setShowBulk(false)}
          onImport={(success, total) => {
            setShowBulk(false);
            showToast(`✅ Imported ${success}/${total} products!`);
            fetchProducts();
          }}
        />
      )}

      {stockModal && (
        <StockModal
          product={stockModal}
          onClose={() => setStockModal(null)}
          onSave={() => {
            setStockModal(null);
            showToast("Stock updated!");
            fetchProducts();
          }}
        />
      )}

      <Toast msg={toast.msg} type={toast.type} onHide={hideToast} />
    </div>
  );
}
