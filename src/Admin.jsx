// import { useState, useEffect, useRef } from "react";

// const API_BASE = "https://rayfinesite-3.onrender.com";
// const NOTIFY_EMAIL = "bhaveshgemsonline@gmail.com";

// // ─── helpers ──────────────────────────────────────────────────────────────────
// function formatINR(n) { return "₹" + Number(n).toLocaleString("en-IN"); }

// const EMPTY_PRODUCT = {
//   name: "", price: "", original_price: "", category: "Earring",
//   description: "", material: "", variants: "", care_instructions: "",
//   image: "", in_stock: true, stock_qty: "", tracking_info: "",
// };

// const CATEGORIES = ["Earring", "Necklace", "Bracelet", "Ring", "Anklet", "Other"];

// // ─── CSV bulk parser ───────────────────────────────────────────────────────────
// function parseCSV(text) {
//   const lines = text.trim().split("\n");
//   if (lines.length < 2) return [];
//   const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase().replace(/ /g, "_"));
//   return lines.slice(1).map(line => {
//     // Handle quoted commas
//     const cols = [];
//     let inQuote = false, cur = "";
//     for (let ch of line) {
//       if (ch === '"') { inQuote = !inQuote; continue; }
//       if (ch === "," && !inQuote) { cols.push(cur.trim()); cur = ""; }
//       else cur += ch;
//     }
//     cols.push(cur.trim());
//     const obj = {};
//     headers.forEach((h, i) => { obj[h] = cols[i] ?? ""; });
//     return obj;
//   }).filter(r => r.name);
// }

// // ─── Styles (inline) ──────────────────────────────────────────────────────────
// const S = {
//   page: { minHeight: "100vh", background: "#FDF6F9", fontFamily: "'Jost', 'Segoe UI', sans-serif", color: "#3D1A28" },
//   topbar: { background: "#fff", borderBottom: "1px solid #F2DCE6", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(200,91,130,0.06)" },
//   logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", color: "#C85B82", fontWeight: 500 },
//   badge: { background: "#C85B82", color: "#fff", borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" },
//   sidebar: { width: "220px", background: "#fff", borderRight: "1px solid #F2DCE6", minHeight: "calc(100vh - 64px)", padding: "24px 0", flexShrink: 0 },
//   sideItem: (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "12px 24px", cursor: "pointer", background: active ? "#FAEDF3" : "transparent", color: active ? "#C85B82" : "#5A3040", fontWeight: active ? 700 : 400, fontSize: "13px", letterSpacing: "0.5px", borderLeft: active ? "3px solid #C85B82" : "3px solid transparent", transition: "all 0.2s" }),
//   main: { flex: 1, padding: "32px", overflowY: "auto" },
//   card: { background: "#fff", border: "1px solid #F2DCE6", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 12px rgba(200,91,130,0.04)" },
//   statCard: (color) => ({ background: "#fff", border: `1px solid ${color}22`, borderRadius: "16px", padding: "24px", flex: "1 1 180px", position: "relative", overflow: "hidden" }),
//   h2: { fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, color: "#3D1A28", marginBottom: "4px" },
//   h3: { fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 400, color: "#3D1A28", marginBottom: "16px" },
//   label: { display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#8A6070", marginBottom: "6px" },
//   input: { width: "100%", padding: "11px 16px", border: "1px solid #F2DCE6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Jost', sans-serif", color: "#3D1A28", background: "#FAEDF3", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
//   select: { width: "100%", padding: "11px 16px", border: "1px solid #F2DCE6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Jost', sans-serif", color: "#3D1A28", background: "#FAEDF3", outline: "none", cursor: "pointer", boxSizing: "border-box" },
//   textarea: { width: "100%", padding: "11px 16px", border: "1px solid #F2DCE6", borderRadius: "12px", fontSize: "14px", fontFamily: "'Jost', sans-serif", color: "#3D1A28", background: "#FAEDF3", outline: "none", resize: "vertical", boxSizing: "border-box" },
//   btnPrimary: { padding: "11px 28px", background: "#C85B82", color: "#fff", border: "none", borderRadius: "40px", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", fontFamily: "'Jost', sans-serif" },
//   btnGhost: { padding: "11px 22px", background: "transparent", color: "#C85B82", border: "1.5px solid #C85B82", borderRadius: "40px", fontSize: "12px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", fontFamily: "'Jost', sans-serif" },
//   btnDanger: { padding: "8px 16px", background: "#FFF0F3", color: "#C85B82", border: "1px solid #F2DCE6", borderRadius: "20px", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },
//   btnSuccess: { padding: "8px 16px", background: "#E8F5E9", color: "#2E7D32", border: "1px solid #C8E6CA", borderRadius: "20px", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },
//   table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
//   th: { padding: "12px 14px", background: "#FAEDF3", color: "#8A6070", fontWeight: 700, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", textAlign: "left", borderBottom: "1px solid #F2DCE6" },
//   td: { padding: "12px 14px", borderBottom: "1px solid #F2DCE6", verticalAlign: "middle" },
//   toast: (type) => ({ position: "fixed", bottom: "28px", right: "28px", zIndex: 9999, background: type === "success" ? "#2E7D32" : type === "error" ? "#C62828" : "#1565C0", color: "#fff", padding: "14px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", animation: "fadeIn 0.3s ease" }),
//   gridTwo: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
//   gridThree: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
//   tag: (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", background: color + "22", color }),
// };

// // ─── Toast ─────────────────────────────────────────────────────────────────────
// function Toast({ msg, type, onHide }) {
//   useEffect(() => { if (msg) { const t = setTimeout(onHide, 3000); return () => clearTimeout(t); } }, [msg]);
//   if (!msg) return null;
//   return <div style={S.toast(type)}>{type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"} {msg}</div>;
// }

// // ─── Product Form ───────────────────────────────────────────────────────────────
// function ProductForm({ initial, onSave, onCancel, saving }) {
//   const [form, setForm] = useState(initial || EMPTY_PRODUCT);
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const handleSubmit = () => {
//     if (!form.name || !form.price) { alert("Name and Price are required"); return; }
//     onSave(form);
//   };

//   return (
//     <div>
//       <div style={S.gridTwo}>
//         <div>
//           <label style={S.label}>Product Name *</label>
//           <input style={S.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Pearl Drop Earrings" />
//         </div>
//         <div>
//           <label style={S.label}>Category</label>
//           <select style={S.select} value={form.category} onChange={e => set("category", e.target.value)}>
//             {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//           </select>
//         </div>
//       </div>

//       <div style={{ ...S.gridThree, marginTop: "14px" }}>
//         <div>
//           <label style={S.label}>Price (₹) *</label>
//           <input style={S.input} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="499" />
//         </div>
//         <div>
//           <label style={S.label}>Original Price (₹)</label>
//           <input style={S.input} type="number" value={form.original_price} onChange={e => set("original_price", e.target.value)} placeholder="799" />
//         </div>
//         <div>
//           <label style={S.label}>Stock Quantity</label>
//           <input style={S.input} type="number" value={form.stock_qty} onChange={e => set("stock_qty", e.target.value)} placeholder="10" />
//         </div>
//       </div>

//       <div style={{ marginTop: "14px" }}>
//         <label style={S.label}>Description</label>
//         <textarea style={S.textarea} rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Beautiful handcrafted piece..." />
//       </div>

//       <div style={{ ...S.gridTwo, marginTop: "14px" }}>
//         <div>
//           <label style={S.label}>Material</label>
//           <input style={S.input} value={form.material} onChange={e => set("material", e.target.value)} placeholder="Gold-plated brass" />
//         </div>
//         <div>
//           <label style={S.label}>Variants (comma separated)</label>
//           <input style={S.input} value={form.variants} onChange={e => set("variants", e.target.value)} placeholder="Gold, Silver, Rose Gold" />
//         </div>
//       </div>

//       <div style={{ marginTop: "14px" }}>
//         <label style={S.label}>Care Instructions</label>
//         <input style={S.input} value={form.care_instructions} onChange={e => set("care_instructions", e.target.value)} placeholder="Keep away from water and perfumes." />
//       </div>

//       <div style={{ marginTop: "14px" }}>
//         <label style={S.label}>Tracking Info (shown to customers)</label>
//         <input style={S.input} value={form.tracking_info} onChange={e => set("tracking_info", e.target.value)} placeholder="Ships in 3-5 days via BlueDart / FedEx · Tracking shared after dispatch" />
//       </div>

//       <div style={{ marginTop: "14px" }}>
//         <label style={S.label}>Image URL</label>
//         <input style={S.input} value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://..." />
//       </div>

//       <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
//         <label style={{ ...S.label, margin: 0 }}>In Stock</label>
//         <button
//           onClick={() => set("in_stock", !form.in_stock)}
//           style={{ padding: "8px 20px", borderRadius: "20px", border: "none", cursor: "pointer", background: form.in_stock ? "#C85B82" : "#eee", color: form.in_stock ? "#fff" : "#888", fontWeight: 700, fontSize: "12px", transition: "all 0.2s" }}
//         >
//           {form.in_stock ? "✓ In Stock" : "Out of Stock"}
//         </button>
//       </div>

//       <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
//         <button style={S.btnPrimary} onClick={handleSubmit} disabled={saving}>
//           {saving ? "Saving..." : initial ? "Update Product" : "Add Product"}
//         </button>
//         {onCancel && <button style={S.btnGhost} onClick={onCancel}>Cancel</button>}
//       </div>
//     </div>
//   );
// }

// // ─── Bulk Import Modal ─────────────────────────────────────────────────────────
// function BulkImportModal({ onClose, onImport }) {
//   const [tab, setTab] = useState("csv"); // csv | manual
//   const [csvText, setCsvText] = useState("");
//   const [rows, setRows] = useState([]);
//   const [parsed, setParsed] = useState([]);
//   const [importing, setImporting] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const fileRef = useRef();

//   const TEMPLATE = `name,price,original_price,category,description,material,variants,care_instructions,image,stock_qty,tracking_info
// Pearl Drop Earrings,499,799,Earring,Beautiful handcrafted pearl earrings,Gold-plated brass,"Gold,Silver",Keep away from water,https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400,15,Ships in 3-5 days via BlueDart
// Rose Quartz Bracelet,699,999,Bracelet,Delicate rose quartz bracelet,Sterling silver,"Rose Gold,Silver",Store in airtight pouch,https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400,8,Ships in 2-4 days via FedEx`;

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const text = ev.target.result;
//       setCsvText(text);
//       const p = parseCSV(text);
//       setParsed(p);
//     };
//     reader.readAsText(file);
//   };

//   const handlePasteCSV = (text) => {
//     setCsvText(text);
//     const p = parseCSV(text);
//     setParsed(p);
//   };

//   const downloadTemplate = () => {
//     const blob = new Blob([TEMPLATE], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url; a.download = "bulk_product_template.csv"; a.click();
//     URL.revokeObjectURL(url);
//   };

//   const addManualRow = () => {
//     setRows(r => [...r, { ...EMPTY_PRODUCT, _id: Date.now() }]);
//   };

//   const updateRow = (id, key, val) => {
//     setRows(r => r.map(row => row._id === id ? { ...row, [key]: val } : row));
//   };

//   const removeRow = (id) => setRows(r => r.filter(row => row._id !== id));

//   const doImport = async (products) => {
//     if (!products.length) { alert("No products to import"); return; }
//     setImporting(true);
//     setProgress(0);
//     let successCount = 0;
//     for (let i = 0; i < products.length; i++) {
//       const p = products[i];
//       try {
//         const token = localStorage.getItem("admin_token");
//         const res = await fetch(`${API_BASE}/api/products`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//           body: JSON.stringify({
//             name: p.name, price: Number(p.price), original_price: p.original_price ? Number(p.original_price) : null,
//             category: p.category || "Other", description: p.description || "", material: p.material || "",
//             variants: p.variants || "", care_instructions: p.care_instructions || "",
//             image: p.image || "", in_stock: p.in_stock !== false && p.in_stock !== "false" && p.in_stock !== 0,
//             stock_qty: p.stock_qty ? Number(p.stock_qty) : null,
//             tracking_info: p.tracking_info || "",
//           }),
//         });
//         if (res.ok) successCount++;
//       } catch { /* continue */ }
//       setProgress(Math.round(((i + 1) / products.length) * 100));
//     }
//     setImporting(false);
//     onImport(successCount, products.length);
//   };

//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(42,14,26,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
//       <div style={{ background: "#fff", borderRadius: "20px", width: "min(960px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", padding: "36px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
//           <h2 style={S.h2}>📦 Bulk Import Products</h2>
//           <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#aaa" }}>✕</button>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
//           {[["csv", "📄 CSV / File Upload"], ["manual", "✏️ Manual Grid"]].map(([key, label]) => (
//             <button key={key} onClick={() => setTab(key)} style={{ padding: "10px 20px", borderRadius: "30px", border: "none", cursor: "pointer", background: tab === key ? "#C85B82" : "#FAEDF3", color: tab === key ? "#fff" : "#C85B82", fontWeight: 700, fontSize: "12px", letterSpacing: "1px", transition: "all 0.2s" }}>
//               {label}
//             </button>
//           ))}
//         </div>

//         {tab === "csv" && (
//           <div>
//             <div style={{ background: "#FAEDF3", border: "1px dashed #F4C0D1", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px" }}>
//               <p style={{ fontSize: "13px", color: "#5A3040", marginBottom: "12px", lineHeight: "1.7" }}>
//                 <strong>📋 CSV Format:</strong> Upload a CSV file or paste CSV text below. Columns:<br />
//                 <code style={{ background: "#fff", padding: "2px 6px", borderRadius: "6px", fontSize: "11px" }}>name, price, original_price, category, description, material, variants, care_instructions, image, stock_qty, tracking_info</code>
//               </p>
//               <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//                 <button style={S.btnGhost} onClick={downloadTemplate}>⬇️ Download Template</button>
//                 <button style={S.btnPrimary} onClick={() => fileRef.current.click()}>📁 Upload CSV File</button>
//                 <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleFile} />
//               </div>
//             </div>

//             <label style={S.label}>Paste CSV Text</label>
//             <textarea
//               style={{ ...S.textarea, height: "160px", fontFamily: "monospace", fontSize: "12px" }}
//               placeholder={TEMPLATE}
//               value={csvText}
//               onChange={e => handlePasteCSV(e.target.value)}
//             />

//             {parsed.length > 0 && (
//               <div style={{ marginTop: "16px", background: "#FAEDF3", borderRadius: "12px", padding: "16px" }}>
//                 <p style={{ fontSize: "13px", color: "#5A3040", marginBottom: "12px", fontWeight: 600 }}>✅ {parsed.length} products ready to import:</p>
//                 <div style={{ overflowX: "auto", maxHeight: "200px", overflowY: "auto" }}>
//                   <table style={S.table}>
//                     <thead><tr>
//                       {["Name","Price","Category","Stock"].map(h => <th key={h} style={S.th}>{h}</th>)}
//                     </tr></thead>
//                     <tbody>
//                       {parsed.map((p, i) => (
//                         <tr key={i}>
//                           <td style={S.td}>{p.name}</td>
//                           <td style={S.td}>₹{p.price}</td>
//                           <td style={S.td}>{p.category}</td>
//                           <td style={S.td}>{p.stock_qty || "—"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {importing && (
//               <div style={{ marginTop: "16px" }}>
//                 <div style={{ height: "8px", background: "#F2DCE6", borderRadius: "8px", overflow: "hidden" }}>
//                   <div style={{ height: "100%", width: `${progress}%`, background: "#C85B82", borderRadius: "8px", transition: "width 0.3s" }} />
//                 </div>
//                 <p style={{ fontSize: "12px", color: "#8A6070", marginTop: "6px" }}>Importing... {progress}%</p>
//               </div>
//             )}

//             <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
//               <button style={S.btnPrimary} onClick={() => doImport(parsed)} disabled={importing || !parsed.length}>
//                 {importing ? `Importing... ${progress}%` : `Import ${parsed.length} Products`}
//               </button>
//               <button style={S.btnGhost} onClick={onClose}>Cancel</button>
//             </div>
//           </div>
//         )}

//         {tab === "manual" && (
//           <div>
//             <p style={{ fontSize: "13px", color: "#8A6070", marginBottom: "16px" }}>Add multiple products manually. Click "Add Row" to add a new product.</p>

//             {rows.length === 0 && (
//               <div style={{ textAlign: "center", padding: "40px 20px", color: "#C0A0B0" }}>
//                 <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
//                 <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "18px", fontStyle: "italic" }}>No rows yet. Click "Add Row" to start.</p>
//               </div>
//             )}

//             {rows.map((row, idx) => (
//               <div key={row._id} style={{ border: "1px solid #F2DCE6", borderRadius: "12px", padding: "16px", marginBottom: "12px", background: "#FAEDF3" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//                   <span style={{ fontSize: "12px", fontWeight: 700, color: "#C85B82" }}>Product #{idx + 1}</span>
//                   <button style={S.btnDanger} onClick={() => removeRow(row._id)}>✕ Remove</button>
//                 </div>
//                 <div style={S.gridTwo}>
//                   <div>
//                     <label style={S.label}>Name *</label>
//                     <input style={S.input} value={row.name} onChange={e => updateRow(row._id, "name", e.target.value)} placeholder="Product name" />
//                   </div>
//                   <div>
//                     <label style={S.label}>Category</label>
//                     <select style={S.select} value={row.category} onChange={e => updateRow(row._id, "category", e.target.value)}>
//                       {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//                     </select>
//                   </div>
//                 </div>
//                 <div style={{ ...S.gridThree, marginTop: "10px" }}>
//                   <div>
//                     <label style={S.label}>Price (₹) *</label>
//                     <input style={S.input} type="number" value={row.price} onChange={e => updateRow(row._id, "price", e.target.value)} placeholder="499" />
//                   </div>
//                   <div>
//                     <label style={S.label}>Original (₹)</label>
//                     <input style={S.input} type="number" value={row.original_price} onChange={e => updateRow(row._id, "original_price", e.target.value)} placeholder="799" />
//                   </div>
//                   <div>
//                     <label style={S.label}>Stock Qty</label>
//                     <input style={S.input} type="number" value={row.stock_qty} onChange={e => updateRow(row._id, "stock_qty", e.target.value)} placeholder="10" />
//                   </div>
//                 </div>
//                 <div style={{ marginTop: "10px" }}>
//                   <label style={S.label}>Image URL</label>
//                   <input style={S.input} value={row.image} onChange={e => updateRow(row._id, "image", e.target.value)} placeholder="https://..." />
//                 </div>
//                 <div style={{ marginTop: "10px" }}>
//                   <label style={S.label}>Tracking Info</label>
//                   <input style={S.input} value={row.tracking_info} onChange={e => updateRow(row._id, "tracking_info", e.target.value)} placeholder="Ships in 3-5 days via BlueDart" />
//                 </div>
//               </div>
//             ))}

//             <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
//               <button style={S.btnGhost} onClick={addManualRow}>+ Add Row</button>
//               <button style={S.btnPrimary} onClick={() => doImport(rows)} disabled={importing || !rows.length}>
//                 {importing ? `Importing... ${progress}%` : `Import ${rows.length} Products`}
//               </button>
//               <button style={{ ...S.btnGhost, borderColor: "#ddd", color: "#aaa" }} onClick={onClose}>Cancel</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Stock Update Modal ────────────────────────────────────────────────────────
// function StockModal({ product, onClose, onSave }) {
//   const [qty, setQty] = useState(product.stock_qty ?? product.stockQty ?? "");
//   const [inStock, setInStock] = useState(product.in_stock !== false && product.in_stock !== 0);
//   const [tracking, setTracking] = useState(product.tracking_info || "");
//   const [saving, setSaving] = useState(false);

//   const save = async () => {
//     setSaving(true);
//     try {
//       const token = localStorage.getItem("admin_token");
//       await fetch(`${API_BASE}/api/products/${product.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ ...product, stock_qty: qty === "" ? null : Number(qty), in_stock: inStock, tracking_info: tracking }),
//       });
//       onSave();
//     } catch { alert("Update failed"); }
//     setSaving(false);
//   };

//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(42,14,26,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
//       <div style={{ background: "#fff", borderRadius: "20px", width: "min(480px, 100%)", padding: "36px", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
//           <h3 style={S.h3}>📦 Stock Update</h3>
//           <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#aaa" }}>✕</button>
//         </div>
//         <p style={{ fontSize: "14px", color: "#5A3040", marginBottom: "20px", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "16px" }}>{product.name}</p>

//         <div style={{ marginBottom: "16px" }}>
//           <label style={S.label}>Stock Quantity</label>
//           <input style={S.input} type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Enter quantity (leave blank = unlimited)" min="0" />
//           {qty !== "" && Number(qty) <= 5 && Number(qty) > 0 && (
//             <p style={{ fontSize: "11px", color: "#F57C00", marginTop: "6px" }}>⚠️ Low stock warning!</p>
//           )}
//           {qty === "0" && <p style={{ fontSize: "11px", color: "#C62828", marginTop: "6px" }}>❌ This will mark product as Out of Stock</p>}
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label style={S.label}>Stock Status</label>
//           <div style={{ display: "flex", gap: "10px" }}>
//             <button onClick={() => setInStock(true)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: inStock ? "2px solid #2E7D32" : "1px solid #ddd", background: inStock ? "#E8F5E9" : "#fafafa", color: inStock ? "#2E7D32" : "#888", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>✓ In Stock</button>
//             <button onClick={() => setInStock(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: !inStock ? "2px solid #C62828" : "1px solid #ddd", background: !inStock ? "#FFEBEE" : "#fafafa", color: !inStock ? "#C62828" : "#888", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>✕ Out of Stock</button>
//           </div>
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <label style={S.label}>Tracking Info</label>
//           <input style={S.input} value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Ships in 3-5 days via BlueDart · Tracking shared after dispatch" />
//         </div>

//         <div style={{ display: "flex", gap: "12px" }}>
//           <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
//           <button style={S.btnGhost} onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Order Notification Preview ───────────────────────────────────────────────
// function OrdersPanel({ orders }) {
//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
//         <h2 style={S.h2}>📬 Recent Orders</h2>
//         <div style={{ fontSize: "12px", color: "#8A6070", background: "#FAEDF3", padding: "8px 16px", borderRadius: "20px" }}>
//           Notifications → <strong style={{ color: "#C85B82" }}>{NOTIFY_EMAIL}</strong>
//         </div>
//       </div>

//       {orders.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "80px 20px", color: "#C0A0B0" }}>
//           <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
//           <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}>No orders yet</p>
//           <p style={{ fontSize: "13px", marginTop: "8px" }}>New orders will appear here and be notified to <strong>{NOTIFY_EMAIL}</strong></p>
//         </div>
//       ) : (
//         <div style={{ overflowX: "auto" }}>
//           <table style={S.table}>
//             <thead><tr>
//               {["Order ID", "Customer", "Phone", "Items", "Total", "Status", "Time"].map(h => <th key={h} style={S.th}>{h}</th>)}
//             </tr></thead>
//             <tbody>
//               {orders.map((o, i) => (
//                 <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#FAEDF3" }}>
//                   <td style={S.td}><span style={S.tag("#C85B82")}>#{o.id || i + 1}</span></td>
//                   <td style={S.td}><strong>{o.customer_name || o.name || "—"}</strong></td>
//                   <td style={S.td}>{o.customer_phone || o.phone || "—"}</td>
//                   <td style={S.td}>{o.items?.length || o.item_count || "—"} items</td>
//                   <td style={S.td}><strong style={{ color: "#C85B82" }}>{formatINR(o.total || 0)}</strong></td>
//                   <td style={S.td}><span style={S.tag(o.status === "completed" ? "#2E7D32" : o.status === "cancelled" ? "#C62828" : "#F57C00")}>{o.status || "pending"}</span></td>
//                   <td style={S.td}>{o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN") : "—"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main Admin ────────────────────────────────────────────────────────────────
// export default function Admin() {
//   const [tab, setTab] = useState("dashboard");
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showBulk, setShowBulk] = useState(false);
//   const [stockModal, setStockModal] = useState(null);
//   const [toast, setToast] = useState({ msg: "", type: "success" });
//   const [search, setSearch] = useState("");
//   const [catFilter, setCatFilter] = useState("All");

//   const showToast = (msg, type = "success") => setToast({ msg, type });
//   const hideToast = () => setToast({ msg: "", type: "success" });

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const r = await fetch(`${API_BASE}/api/products`);
//       const d = await r.json();
//       setProducts(Array.isArray(d?.data) ? d.data : []);
//     } catch { showToast("Failed to load products", "error"); }
//     setLoading(false);
//   };

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem("admin_token");
//       const r = await fetch(`${API_BASE}/api/orders`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (r.ok) {
//         const d = await r.json();
//         setOrders(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
//       }
//     } catch { /* orders endpoint may not exist */ }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchOrders();
//   }, []);

//   const addProduct = async (form) => {
//     setSaving(true);
//     try {
//       const token = localStorage.getItem("admin_token");
//       const res = await fetch(`${API_BASE}/api/products`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           ...form,
//           price: Number(form.price),
//           original_price: form.original_price ? Number(form.original_price) : null,
//           stock_qty: form.stock_qty !== "" ? Number(form.stock_qty) : null,
//         }),
//       });
//       if (res.ok) { showToast("Product added!"); setShowAddForm(false); fetchProducts(); }
//       else showToast("Failed to add", "error");
//     } catch { showToast("Network error", "error"); }
//     setSaving(false);
//   };

//   const updateProduct = async (form) => {
//     setSaving(true);
//     try {
//       const token = localStorage.getItem("admin_token");
//       const res = await fetch(`${API_BASE}/api/products/${form.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           ...form,
//           price: Number(form.price),
//           original_price: form.original_price ? Number(form.original_price) : null,
//           stock_qty: form.stock_qty !== "" ? Number(form.stock_qty) : null,
//         }),
//       });
//       if (res.ok) { showToast("Product updated!"); setEditProduct(null); fetchProducts(); }
//       else showToast("Update failed", "error");
//     } catch { showToast("Network error", "error"); }
//     setSaving(false);
//   };

//   const deleteProduct = async (id) => {
//     if (!window.confirm("Delete this product?")) return;
//     try {
//       const token = localStorage.getItem("admin_token");
//       const res = await fetch(`${API_BASE}/api/products/${id}`, {
//         method: "DELETE",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (res.ok) { showToast("Product deleted", "info"); fetchProducts(); }
//       else showToast("Delete failed", "error");
//     } catch { showToast("Network error", "error"); }
//   };

//   const toggleStock = async (p) => {
//     try {
//       const token = localStorage.getItem("admin_token");
//       await fetch(`${API_BASE}/api/products/${p.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ ...p, in_stock: !(p.in_stock !== false && p.in_stock !== 0) }),
//       });
//       fetchProducts();
//     } catch { showToast("Error", "error"); }
//   };

//   // Stats
//   const totalProducts = products.length;
//   const inStockCount = products.filter(p => p.in_stock !== false && p.in_stock !== 0).length;
//   const lowStockCount = products.filter(p => {
//     const qty = p.stock_qty ?? p.stockQty;
//     return qty !== null && qty !== undefined && Number(qty) > 0 && Number(qty) <= 5;
//   }).length;
//   const onSaleCount = products.filter(p => p.original_price).length;

//   // Filtered products
//   let filtered = products.filter(p => {
//     const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase());
//     const matchCat = catFilter === "All" || (p.category || "").toLowerCase() === catFilter.toLowerCase();
//     return matchSearch && matchCat;
//   });

//   const MENU = [
//     { key: "dashboard", icon: "📊", label: "Dashboard" },
//     { key: "products", icon: "💎", label: "Products" },
//     { key: "add", icon: "➕", label: "Add Product" },
//     { key: "orders", icon: "📬", label: "Orders" },
//     { key: "shipping", icon: "🌍", label: "Worldwide Shipping" },
//   ];

//   return (
//     <div style={S.page}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap'); @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }`}</style>

//       {/* Topbar */}
//       <div style={S.topbar}>
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <span style={S.logo}>✦ Ray Fine Ornates</span>
//           <span style={S.badge}>ADMIN</span>
//         </div>
//         <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//           <span style={{ fontSize: "12px", color: "#8A6070" }}>
//             Orders → <strong style={{ color: "#C85B82" }}>{NOTIFY_EMAIL}</strong>
//           </span>
//           <button style={S.btnPrimary} onClick={() => { setShowBulk(true); }}>📦 Bulk Import</button>
//           <a href="/" style={{ ...S.btnGhost, textDecoration: "none", display: "inline-block" }}>← Website</a>
//         </div>
//       </div>

//       <div style={{ display: "flex" }}>
//         {/* Sidebar */}
//         <div style={S.sidebar}>
//           {MENU.map(item => (
//             <div key={item.key} style={S.sideItem(tab === item.key)} onClick={() => { setTab(item.key); if (item.key === "add") setShowAddForm(true); }}>
//               <span style={{ fontSize: "16px" }}>{item.icon}</span>
//               <span>{item.label}</span>
//             </div>
//           ))}
//           <div style={{ margin: "24px 0", borderTop: "1px solid #F2DCE6" }} />
//           <div style={{ padding: "0 24px" }}>
//             <p style={{ fontSize: "11px", color: "#C0A0B0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Stats</p>
//             <p style={{ fontSize: "13px", color: "#5A3040", marginBottom: "4px" }}>📦 {totalProducts} Products</p>
//             <p style={{ fontSize: "13px", color: "#2E7D32", marginBottom: "4px" }}>✅ {inStockCount} In Stock</p>
//             {lowStockCount > 0 && <p style={{ fontSize: "13px", color: "#F57C00", marginBottom: "4px" }}>⚠️ {lowStockCount} Low Stock</p>}
//             <p style={{ fontSize: "13px", color: "#C85B82" }}>🏷️ {onSaleCount} On Sale</p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div style={S.main}>

//           {/* Dashboard */}
//           {tab === "dashboard" && (
//             <div>
//               <h2 style={{ ...S.h2, marginBottom: "24px" }}>Dashboard Overview</h2>

//               <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
//                 {[
//                   { label: "Total Products", value: totalProducts, icon: "💎", color: "#C85B82" },
//                   { label: "In Stock", value: inStockCount, icon: "✅", color: "#2E7D32" },
//                   { label: "Low Stock", value: lowStockCount, icon: "⚠️", color: "#F57C00" },
//                   { label: "On Sale", value: onSaleCount, icon: "🏷️", color: "#1565C0" },
//                   { label: "Total Orders", value: orders.length, icon: "📬", color: "#7B1FA2" },
//                 ].map(s => (
//                   <div key={s.label} style={S.statCard(s.color)}>
//                     <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
//                     <div style={{ fontSize: "32px", fontFamily: "Cormorant Garamond, serif", fontWeight: 300, color: s.color }}>{s.value}</div>
//                     <div style={{ fontSize: "11px", color: "#8A6070", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
//                     <div style={{ position: "absolute", bottom: 0, right: 0, width: "60px", height: "60px", borderRadius: "50%", background: s.color + "10", transform: "translate(20px, 20px)" }} />
//                   </div>
//                 ))}
//               </div>

//               {/* Low stock alert */}
//               {lowStockCount > 0 && (
//                 <div style={{ ...S.card, background: "#FFF8E1", border: "1px solid #FFE082" }}>
//                   <h3 style={{ ...S.h3, color: "#E65100" }}>⚠️ Low Stock Alert</h3>
//                   {products.filter(p => {
//                     const qty = p.stock_qty ?? p.stockQty;
//                     return qty !== null && qty !== undefined && Number(qty) > 0 && Number(qty) <= 5;
//                   }).map(p => (
//                     <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #FFE082" }}>
//                       <span style={{ fontSize: "14px", fontWeight: 600 }}>{p.name}</span>
//                       <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                         <span style={S.tag("#F57C00")}>Only {p.stock_qty ?? p.stockQty} left</span>
//                         <button style={S.btnSuccess} onClick={() => setStockModal(p)}>Update Stock</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Order notification config info */}
//               <div style={{ ...S.card, background: "#E3F2FD", border: "1px solid #BBDEFB" }}>
//                 <h3 style={{ ...S.h3, color: "#1565C0" }}>📧 Order Notifications</h3>
//                 <p style={{ fontSize: "14px", color: "#1565C0", lineHeight: "1.7" }}>
//                   New orders are sent as email notifications to: <strong>{NOTIFY_EMAIL}</strong><br />
//                   <span style={{ fontSize: "12px", opacity: 0.8 }}>Configure your EmailJS credentials in App.js → <code>sendOrderNotification()</code> function to activate email delivery.</span>
//                 </p>
//               </div>

//               {/* Quick actions */}
//               <div style={S.card}>
//                 <h3 style={S.h3}>⚡ Quick Actions</h3>
//                 <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//                   <button style={S.btnPrimary} onClick={() => { setTab("add"); setShowAddForm(true); }}>+ Add Product</button>
//                   <button style={S.btnPrimary} onClick={() => setShowBulk(true)}>📦 Bulk Import</button>
//                   <button style={S.btnGhost} onClick={() => setTab("products")}>View All Products</button>
//                   <button style={S.btnGhost} onClick={() => setTab("orders")}>View Orders</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Products Tab */}
//           {(tab === "products" || tab === "add") && (
//             <div>
//               {/* Add / Edit form */}
//               {(showAddForm && !editProduct) && (
//                 <div style={S.card}>
//                   <h3 style={S.h3}>➕ Add New Product</h3>
//                   <ProductForm onSave={addProduct} onCancel={() => setShowAddForm(false)} saving={saving} />
//                 </div>
//               )}

//               {editProduct && (
//                 <div style={S.card}>
//                   <h3 style={S.h3}>✏️ Edit: {editProduct.name}</h3>
//                   <ProductForm
//                     initial={{
//                       ...editProduct,
//                       stock_qty: editProduct.stock_qty ?? editProduct.stockQty ?? "",
//                       tracking_info: editProduct.tracking_info || "",
//                       original_price: editProduct.original_price ?? editProduct.originalPrice ?? "",
//                     }}
//                     onSave={updateProduct}
//                     onCancel={() => setEditProduct(null)}
//                     saving={saving}
//                   />
//                 </div>
//               )}

//               {/* Products list */}
//               <div style={S.card}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
//                   <h3 style={{ ...S.h3, margin: 0 }}>All Products ({products.length})</h3>
//                   <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//                     <input
//                       style={{ ...S.input, width: "200px", padding: "9px 14px" }}
//                       placeholder="🔍 Search..."
//                       value={search}
//                       onChange={e => setSearch(e.target.value)}
//                     />
//                     <select style={{ ...S.select, width: "140px", padding: "9px 14px" }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
//                       <option value="All">All Categories</option>
//                       {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//                     </select>
//                     <button style={S.btnPrimary} onClick={() => { setShowAddForm(true); setEditProduct(null); }}>+ Add</button>
//                     <button style={S.btnGhost} onClick={() => setShowBulk(true)}>📦 Bulk</button>
//                   </div>
//                 </div>

//                 {loading ? (
//                   <p style={{ textAlign: "center", padding: "60px", color: "#8A6070", fontFamily: "Cormorant Garamond, serif", fontSize: "18px", fontStyle: "italic" }}>Loading products...</p>
//                 ) : (
//                   <div style={{ overflowX: "auto" }}>
//                     <table style={S.table}>
//                       <thead><tr>
//                         {["Image","Name","Category","Price","Stock Qty","Status","Tracking","Actions"].map(h => (
//                           <th key={h} style={S.th}>{h}</th>
//                         ))}
//                       </tr></thead>
//                       <tbody>
//                         {filtered.map((p, i) => {
//                           const isInStock = p.in_stock !== false && p.in_stock !== 0;
//                           const stockQty = p.stock_qty ?? p.stockQty;
//                           return (
//                             <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAEDF3" }}>
//                               <td style={S.td}>
//                                 <img
//                                   src={p.image?.startsWith("http") ? p.image.split(",")[0] : p.image ? `${API_BASE}${p.image.split(",")[0]}` : "https://placehold.co/48x48?text=💎"}
//                                   alt={p.name}
//                                   style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "10px", border: "1px solid #F2DCE6" }}
//                                   onError={e => e.target.src = "https://placehold.co/48x48?text=💎"}
//                                 />
//                               </td>
//                               <td style={S.td}>
//                                 <strong style={{ fontSize: "14px" }}>{p.name}</strong>
//                                 {p.original_price && <div style={{ fontSize: "11px", color: "#8A6070", marginTop: "2px" }}>Sale item</div>}
//                               </td>
//                               <td style={S.td}><span style={S.tag("#C85B82")}>{p.category}</span></td>
//                               <td style={S.td}>
//                                 <strong style={{ color: "#C85B82" }}>₹{Number(p.price).toLocaleString()}</strong>
//                                 {p.original_price && <div style={{ fontSize: "11px", textDecoration: "line-through", color: "#C0A0B0" }}>₹{Number(p.original_price).toLocaleString()}</div>}
//                               </td>
//                               <td style={S.td}>
//                                 {stockQty !== null && stockQty !== undefined ? (
//                                   <span style={S.tag(Number(stockQty) === 0 ? "#C62828" : Number(stockQty) <= 5 ? "#F57C00" : "#2E7D32")}>
//                                     {Number(stockQty) === 0 ? "Out" : stockQty}
//                                   </span>
//                                 ) : (
//                                   <span style={{ color: "#C0A0B0", fontSize: "12px" }}>—</span>
//                                 )}
//                               </td>
//                               <td style={S.td}>
//                                 <button
//                                   onClick={() => toggleStock(p)}
//                                   style={{ ...isInStock ? S.btnSuccess : S.btnDanger, minWidth: "80px" }}
//                                 >
//                                   {isInStock ? "✓ In Stock" : "✕ Out"}
//                                 </button>
//                               </td>
//                               <td style={{ ...S.td, maxWidth: "160px" }}>
//                                 {p.tracking_info ? (
//                                   <span style={{ fontSize: "11px", color: "#1565C0" }}>📦 {p.tracking_info.substring(0, 30)}{p.tracking_info.length > 30 ? "..." : ""}</span>
//                                 ) : (
//                                   <span style={{ fontSize: "11px", color: "#C0A0B0" }}>—</span>
//                                 )}
//                               </td>
//                               <td style={S.td}>
//                                 <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
//                                   <button style={S.btnSuccess} onClick={() => { setEditProduct(p); setShowAddForm(false); }}>✏️</button>
//                                   <button style={{ ...S.btnSuccess, background: "#E3F2FD", color: "#1565C0", border: "1px solid #BBDEFB" }} onClick={() => setStockModal(p)}>📦</button>
//                                   <button style={S.btnDanger} onClick={() => deleteProduct(p.id)}>🗑</button>
//                                 </div>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                     {filtered.length === 0 && !loading && (
//                       <p style={{ textAlign: "center", padding: "40px", color: "#8A6070", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "18px" }}>No products found.</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Orders Tab */}
//           {tab === "orders" && (
//             <div style={S.card}>
//               <OrdersPanel orders={orders} />
//             </div>
//           )}

//           {/* Worldwide Shipping Tab */}
//           {tab === "shipping" && (
//             <div>
//               <h2 style={{ ...S.h2, marginBottom: "24px" }}>🌍 Worldwide Shipping Info</h2>
//               <div style={{ ...S.card, background: "linear-gradient(135deg, #FAEDF3, #fff)" }}>
//                 <h3 style={S.h3}>Our Global Presence</h3>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
//                   {[
//                     ["🇮🇳", "India", "Same Day"],
//                     ["🇺🇸", "USA", "7-12 Days"],
//                     ["🇬🇧", "UK", "7-10 Days"],
//                     ["🇦🇪", "UAE", "5-8 Days"],
//                     ["🇦🇺", "Australia", "10-15 Days"],
//                     ["🇨🇦", "Canada", "8-14 Days"],
//                     ["🇩🇪", "Germany", "8-12 Days"],
//                     ["🇸🇬", "Singapore", "6-10 Days"],
//                     ["🇳🇿", "New Zealand", "10-15 Days"],
//                     ["🇿🇦", "South Africa", "10-16 Days"],
//                     ["🇯🇵", "Japan", "8-12 Days"],
//                     ["+ 140", "More Countries", "Varies"],
//                   ].map(([flag, country, time]) => (
//                     <div key={country} style={{ background: "#fff", border: "1px solid #F2DCE6", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
//                       <div style={{ fontSize: "28px", marginBottom: "6px" }}>{flag}</div>
//                       <div style={{ fontWeight: 700, fontSize: "13px", color: "#3D1A28" }}>{country}</div>
//                       <div style={{ fontSize: "11px", color: "#8A6070", marginTop: "4px" }}>~{time}</div>
//                     </div>
//                   ))}
//                 </div>

//                 <div style={{ background: "#FAEDF3", borderRadius: "12px", padding: "20px" }}>
//                   <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "18px", color: "#C85B82", marginBottom: "12px" }}>Shipping Partners</h4>
//                   <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//                     {["BlueDart", "FedEx", "DHL", "Delhivery", "India Post EMS", "Aramex"].map(s => (
//                       <span key={s} style={S.tag("#C85B82")}>{s}</span>
//                     ))}
//                   </div>
//                 </div>

//                 <div style={{ marginTop: "20px", background: "#E3F2FD", borderRadius: "12px", padding: "20px", border: "1px solid #BBDEFB" }}>
//                   <h4 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "18px", color: "#1565C0", marginBottom: "8px" }}>📦 Tracking</h4>
//                   <p style={{ fontSize: "13px", color: "#1565C0", lineHeight: "1.7" }}>
//                     All international orders include tracking. Tracking details are shared with customers via WhatsApp / Email after dispatch. Update tracking info for each product in the Products tab.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>

//       {/* Modals */}
//       {showBulk && (
//         <BulkImportModal
//           onClose={() => setShowBulk(false)}
//           onImport={(success, total) => {
//             setShowBulk(false);
//             showToast(`✅ Imported ${success}/${total} products!`);
//             fetchProducts();
//           }}
//         />
//       )}

//       {stockModal && (
//         <StockModal
//           product={stockModal}
//           onClose={() => setStockModal(null)}
//           onSave={() => {
//             setStockModal(null);
//             showToast("Stock updated!");
//             fetchProducts();
//           }}
//         />
//       )}

//       <Toast msg={toast.msg} type={toast.type} onHide={hideToast} />
//     </div>
//   );
// }
// ─────────────────────────────────────────────
// Admin.jsx — Ray Fine Ornates Admin Panel
// Drop this file into your src/ folder.
// Route is already /admin in App.js ✓
// ─────────────────────────────────────────────
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

// ── SAMPLE DATA (replace with real API calls) ─
const SAMPLE_ORDERS = [
  { id:"#1041", customer:"Priya Sharma",  items:"Bridal Set × 1",         amount:8500,  status:"new",      date:"Jun 5" },
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

  // Admin password gate
  const [authed, setAuthed]     = useState(() => sessionStorage.getItem("rfo_admin") === "yes");
  const [pwInput, setPwInput]   = useState("");
  const [pwError, setPwError]   = useState("");
  const ADMIN_PASSWORD = "rayfine2024"; // Change this!

  const showToast = useCallback((msg, type="success") => {
    setToast({ msg, type });
  }, []);

  // Fetch products
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
          image: p.image?.replace(/^http:\/\//i,"https://")?.split(",")[0]?.trim(),
        }));
        setProducts(fixed);
        setLoading(false);
      })
      .catch(() => { setLoading(false); showToast("Could not load products","error"); });
  }, [authed]);

  // New order badge count
  const newOrders   = orders.filter(o => o.status === "new").length;
  const unreadNotif = notifs.filter(n => !n.read).length;

  // Password gate
  if (!authed) {
    return (
      <div style={{
        minHeight:"100vh", background:"var(--cream)", display:"flex",
        alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif",
      }}>
        <div style={{
          background:"#fff", border:"1px solid var(--border-light)", borderRadius:12,
          padding:"48px 44px", maxWidth:400, width:"100%", textAlign:"center",
          boxShadow:"0 20px 60px rgba(44,36,24,0.1)",
        }}>
          <div style={{ fontSize:32, marginBottom:10 }}>◈</div>
          <h2 style={{ fontFamily:"Cormorant Garamond, serif", fontSize:28, fontWeight:400, color:"var(--text)", marginBottom:6 }}>
            Admin Access
          </h2>
          <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:28, letterSpacing:"0.5px" }}>
            Ray Fine Ornates · Store Management
          </p>
          <input
            type="password" placeholder="Enter admin password"
            value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(""); }}
            onKeyDown={e => e.key==="Enter" && (() => {
              if (pwInput===ADMIN_PASSWORD) { sessionStorage.setItem("rfo_admin","yes"); setAuthed(true); }
              else setPwError("Incorrect password");
            })()}
            style={{
              width:"100%", boxSizing:"border-box", padding:"12px 16px",
              border:"1.5px solid var(--border)", borderRadius:6, fontSize:14,
              fontFamily:"inherit", outline:"none", marginBottom:8, color:"var(--text)",
            }}
          />
          {pwError && <p style={{ color:"#A32D2D", fontSize:12, marginBottom:8 }}>{pwError}</p>}
          <button
            onClick={() => {
              if (pwInput===ADMIN_PASSWORD) { sessionStorage.setItem("rfo_admin","yes"); setAuthed(true); }
              else setPwError("Incorrect password");
            }}
            style={{
              width:"100%", padding:"12px", background:"var(--text)", color:"#fff",
              border:"none", borderRadius:6, fontSize:11, fontWeight:700,
              letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer",
              fontFamily:"inherit",
            }}
          >
            Login →
          </button>
          <p style={{ marginTop:16, fontSize:11, color:"var(--text-muted)" }}>
            Default password: <code style={{ background:"var(--cream)", padding:"2px 6px", borderRadius:3 }}>rayfine2024</code>
          </p>
        </div>
      </div>
    );
  }

  // ── Filtered products ─────────────────────
  const filtered = products.filter(p => {
    const q = searchQ.toLowerCase();
    const matchQ   = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
    const matchCat = catFilter==="All" || p.category?.toLowerCase().includes(catFilter.toLowerCase());
    return matchQ && matchCat;
  });

  // ── Shared styles ─────────────────────────
  const card = {
    background:"#fff", border:"1px solid var(--border-light)",
    borderRadius:10, padding:"20px 22px", marginBottom:16,
  };
  const inputSt = {
    width:"100%", boxSizing:"border-box", padding:"9px 12px",
    border:"1.5px solid var(--border)", borderRadius:6, fontSize:13,
    fontFamily:"'DM Sans',sans-serif", outline:"none", color:"var(--text)",
    background:"#fff",
  };
  const labelSt = { fontSize:11, fontWeight:700, letterSpacing:"1px", color:"var(--text-muted)", textTransform:"uppercase", display:"block", marginBottom:4 };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'DM Sans',sans-serif", background:"var(--cream)" }}>
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
        background:"#fff", borderRight:"1px solid var(--border-light)",
        display:"flex", flexDirection:"column", transition:"width 0.25s ease",
        overflow:"hidden", zIndex:100, flexShrink:0,
      }}>
        {/* Logo */}
        <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid var(--border-light)", display:"flex", alignItems:"center", gap:10, justifyContent: sideOpen?"flex-start":"center" }}>
          <span style={{ fontSize:20, color:"var(--primary)", flexShrink:0 }}>◈</span>
          {sideOpen && (
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", letterSpacing:"0.5px", fontFamily:"Cormorant Garamond, serif" }}>
                Ray Fine Admin
              </div>
              <div style={{ fontSize:10, color:"var(--text-muted)", letterSpacing:"1px" }}>Store Management</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {NAV.map(n => (
            <div key={n.id}
              className={`admin-nav-item ${page===n.id?"active":""}`}
              onClick={() => setPage(n.id)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding: sideOpen ? "9px 18px" : "9px 0",
                justifyContent: sideOpen?"flex-start":"center",
                cursor:"pointer", transition:"all .15s",
                color: page===n.id ? "var(--primary)" : "var(--text-muted)",
                fontSize:13, borderLeft: page===n.id ? "3px solid var(--primary)" : "3px solid transparent",
                position:"relative",
              }}
            >
              <span style={{ fontSize:16, flexShrink:0 }}>{n.icon}</span>
              {sideOpen && <span>{n.label}</span>}
              {/* Badges */}
              {sideOpen && n.id==="orders" && newOrders>0 && (
                <span style={{ marginLeft:"auto", background:"#A32D2D", color:"#fff", fontSize:10, padding:"1px 6px", borderRadius:10 }}>{newOrders}</span>
              )}
              {sideOpen && n.id==="notifications" && unreadNotif>0 && (
                <span style={{ marginLeft:"auto", background:"#A32D2D", color:"#fff", fontSize:10, padding:"1px 6px", borderRadius:10 }}>{unreadNotif}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse button */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border-light)", display:"flex", justifyContent: sideOpen?"flex-end":"center" }}>
          <button onClick={() => setSideOpen(!sideOpen)}
            style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"var(--text-muted)", padding:"4px 8px", borderRadius:4 }}>
            {sideOpen ? "◀" : "▶"}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Topbar */}
        <div style={{
          background:"#fff", borderBottom:"1px solid var(--border-light)",
          padding:"0 24px", height:58, display:"flex", alignItems:"center",
          justifyContent:"space-between", flexShrink:0,
        }}>
          <span style={{ fontFamily:"Cormorant Garamond, serif", fontSize:18, fontWeight:400, color:"var(--text)" }}>
            {NAV.find(n=>n.id===page)?.label || "Admin"}
          </span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={() => { setPage("upload"); }}
              style={{ padding:"7px 16px", borderRadius:4, border:"none", background:"var(--text)", color:"#fff", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer" }}>
              + Add Product
            </button>
            <button onClick={() => { sessionStorage.removeItem("rfo_admin"); setAuthed(false); }}
              style={{ padding:"7px 14px", borderRadius:4, border:"1px solid var(--border)", background:"transparent", color:"var(--text-muted)", fontSize:11, fontWeight:700, letterSpacing:"1px", cursor:"pointer" }}>
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>

          {/* ══ DASHBOARD ══ */}
          {page==="dashboard" && (
            <DashboardPage products={products} orders={orders} loading={loading} setPage={setPage} />
          )}

          {/* ══ PRODUCTS ══ */}
          {page==="products" && (
            <ProductsPage
              products={filtered} loading={loading}
              searchQ={searchQ} setSearchQ={setSearchQ}
              catFilter={catFilter} setCatFilter={setCatFilter}
              showToast={showToast}
              onToggleSale={id => {
                setProducts(prev => prev.map(p => p.id===id ? {...p, onSale:!p.onSale} : p));
                showToast("Sale status updated");
              }}
              onToggleStock={id => {
                setProducts(prev => prev.map(p => p.id===id ? {...p, inStock:!p.inStock} : p));
                showToast("Stock status updated");
              }}
              card={card} inputSt={inputSt}
            />
          )}

          {/* ══ UPLOAD (MANUAL) ══ */}
          {page==="upload" && (
            <UploadPage
              onSave={product => {
                setProducts(prev => [{ ...product, id: Date.now(), inStock: product.stock > 0 }, ...prev]);
                showToast("Product saved successfully!");
                setPage("products");
              }}
              card={card} inputSt={inputSt} labelSt={labelSt}
            />
          )}

          {/* ══ BULK UPLOAD ══ */}
          {page==="bulk" && (
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

          {/* ══ CATEGORIES ══ */}
          {page==="categories" && (
            <CategoriesPage card={card} showToast={showToast} />
          )}

          {/* ══ COLLECTIONS ══ */}
          {page==="collections" && (
            <CollectionsPage
              products={products} setProducts={setProducts}
              card={card} showToast={showToast}
            />
          )}

          {/* ══ ORDERS ══ */}
          {page==="orders" && (
            <OrdersPage
              orders={orders} setOrders={setOrders}
              card={card} showToast={showToast}
            />
          )}

          {/* ══ NOTIFICATIONS ══ */}
          {page==="notifications" && (
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
  const inStock   = products.filter(p => p.inStock && p.stock > 5).length;
  const lowStock  = products.filter(p => p.inStock && p.stock <= 5).length;
  const outOfStock= products.filter(p => !p.inStock).length;
  const onSale    = products.filter(p => p.onSale || p.originalPrice).length;
  const newOrders = orders.filter(o => o.status==="new").length;

  const StatCard = ({ label, value, sub, color }) => (
    <div style={{
      background:"#fff", border:"1px solid var(--border-light)", borderRadius:10,
      padding:"18px 20px", cursor:"pointer",
    }}>
      <div style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:500, color: color||"var(--text)", marginBottom:3, fontFamily:"Cormorant Garamond, serif" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"var(--text-muted)" }}>{sub}</div>}
    </div>
  );

  const catCounts = {};
  products.forEach(p => {
    const k = p.category || "Other";
    catCounts[k] = (catCounts[k]||0)+1;
  });
  const catArr = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxCat = catArr[0]?.[1] || 1;

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <StatCard label="Total Products" value={loading?"...":products.length} sub="+8 this week" />
        <StatCard label="New Orders"     value={newOrders} sub="Needs attention" color={newOrders>0?"#A32D2D":undefined} />
        <StatCard label="Out of Stock"   value={loading?"...":outOfStock} sub="Needs restock" color={outOfStock>0?"#A32D2D":undefined} />
        <StatCard label="Active Sales"   value={loading?"...":onSale} sub="Discounted items" color="#3B6D11" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {/* Recent orders */}
        <div style={{ background:"#fff", border:"1px solid var(--border-light)", borderRadius:10, padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:17, color:"var(--text)" }}>Recent Orders</span>
            <button onClick={() => setPage("orders")} style={{ background:"none", border:"none", color:"var(--primary)", fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:"0.5px" }}>View all →</button>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>{["Order","Customer","Amount","Status"].map(h => (
                <th key={h} style={{ fontSize:10, color:"var(--text-muted)", fontWeight:700, textAlign:"left", padding:"5px 8px", borderBottom:"1px solid var(--border-light)", textTransform:"uppercase", letterSpacing:"0.8px" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.slice(0,5).map(o => (
                <tr key={o.id} className="admin-table">
                  <td style={{ padding:"8px 8px", fontSize:13, color:"var(--text-muted)" }}>{o.id}</td>
                  <td style={{ padding:"8px 8px", fontSize:13, color:"var(--text)" }}>{o.customer}</td>
                  <td style={{ padding:"8px 8px", fontSize:13, color:"var(--text)", fontWeight:500 }}>{formatINR(o.amount)}</td>
                  <td style={{ padding:"8px 8px" }}>
                    <Badge type={o.status==="new"?"order-new":o.status==="processing"?"order-proc":o.status==="shipped"?"order-ship":"order-del"}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stock by category */}
        <div style={{ background:"#fff", border:"1px solid var(--border-light)", borderRadius:10, padding:"18px 20px" }}>
          <div style={{ marginBottom:14 }}>
            <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:17, color:"var(--text)" }}>Products by Category</span>
          </div>
          {loading ? <p style={{ color:"var(--text-muted)", fontSize:13, textAlign:"center", padding:20 }}>Loading...</p> :
          catArr.map(([cat, cnt]) => (
            <div key={cat} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                <span style={{ color:"var(--text)" }}>{cat}</span>
                <span style={{ color:"var(--text-muted)" }}>{cnt} products</span>
              </div>
              <div style={{ height:5, background:"var(--cream2)", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", background:"var(--primary)", width:`${(cnt/maxCat)*100}%`, borderRadius:4, transition:"width .6s" }} />
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
function ProductsPage({ products, loading, searchQ, setSearchQ, catFilter, setCatFilter, onToggleSale, onToggleStock, card, inputSt }) {

  function stockBadge(p) {
    if (!p.inStock) return <Badge type="out">Out of Stock</Badge>;
    if ((p.stock||0) <= 5) return <Badge type="low">Low Stock</Badge>;
    return <Badge type="in-stock">In Stock</Badge>;
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <input
          placeholder="🔍  Search products..."
          value={searchQ} onChange={e => setSearchQ(e.target.value)}
          style={{ ...inputSt, flex:1, minWidth:200 }}
        />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ ...inputSt, width:160 }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ alignSelf:"center", fontSize:12, color:"var(--text-muted)", whiteSpace:"nowrap" }}>
          {products.length} product{products.length!==1?"s":""}
        </span>
      </div>

      {/* Table */}
      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        {loading ? (
          <p style={{ padding:40, textAlign:"center", color:"var(--text-muted)", fontStyle:"italic", fontFamily:"Cormorant Garamond,serif", fontSize:18 }}>
            Loading collection...
          </p>
        ) : products.length===0 ? (
          <p style={{ padding:40, textAlign:"center", color:"var(--text-muted)", fontSize:14 }}>No products found.</p>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
              <thead>
                <tr style={{ background:"var(--cream)" }}>
                  {["Image","Product","Category","Price","Stock","Status","Actions"].map(h => (
                    <th key={h} style={{ fontSize:10, color:"var(--text-muted)", fontWeight:700, textAlign:"left", padding:"10px 14px", borderBottom:"1px solid var(--border-light)", textTransform:"uppercase", letterSpacing:"0.8px", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="admin-table" style={{ borderBottom:"1px solid var(--border-light)" }}>
                    <td style={{ padding:"10px 14px" }}>
                      <img src={p.image} alt={p.name}
                        style={{ width:44, height:44, objectFit:"cover", borderRadius:6, border:"1px solid var(--border-light)", background:"var(--cream)" }}
                        onError={e => { e.target.src="https://placehold.co/44x44?text=?"; }} />
                    </td>
                    <td style={{ padding:"10px 14px", fontSize:13, color:"var(--text)", fontWeight:500, maxWidth:180 }}>
                      <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:15 }}>{p.name}</div>
                      {p.material && <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>{p.material}</div>}
                    </td>
                    <td style={{ padding:"10px 14px", fontSize:12, color:"var(--text-muted)" }}>{p.category}</td>
                    <td style={{ padding:"10px 14px", fontSize:13, color:"var(--text)", fontWeight:500, whiteSpace:"nowrap" }}>
                      {formatINR(p.price)}
                      {p.originalPrice && <div style={{ fontSize:10, color:"var(--text-muted)", textDecoration:"line-through" }}>{formatINR(p.originalPrice)}</div>}
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{p.stock||0}</span>
                        <span style={{ fontSize:10, color:"var(--text-muted)" }}>units</span>
                      </div>
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      {stockBadge(p)}
                      {p.onSale && <span style={{ marginLeft:5 }}><Badge type="sale">Sale</Badge></span>}
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <div style={{ display:"flex", gap:5 }}>
                        <button className="admin-btn-icon" onClick={() => onToggleStock(p.id)}
                          title={p.inStock?"Mark Out of Stock":"Mark In Stock"}
                          style={{ padding:"5px 8px", border:"1px solid var(--border-light)", borderRadius:5, background:"transparent", cursor:"pointer", fontSize:13, color:"var(--text-muted)" }}>
                          {p.inStock ? "📦" : "🚫"}
                        </button>
                        <button className="admin-btn-icon" onClick={() => onToggleSale(p.id)}
                          title="Toggle Sale"
                          style={{ padding:"5px 8px", border:"1px solid var(--border-light)", borderRadius:5, background:"transparent", cursor:"pointer", fontSize:13, color:"var(--text-muted)" }}>
                          🏷
                        </button>
                        <button className="admin-btn-icon"
                          title="Edit"
                          style={{ padding:"5px 8px", border:"1px solid var(--border-light)", borderRadius:5, background:"transparent", cursor:"pointer", fontSize:13, color:"var(--text-muted)" }}>
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
  const [form, setForm]     = useState(blankProduct());
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name = "Required";
    if (!form.price)           e.price = "Required";
    if (!form.category)        e.category = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageURL = e => {
    const url = e.target.value;
    set("image", url);
    setImgPreview(url || null);
  };

  const Row = ({ children }) => (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>{children}</div>
  );
  const Field = ({ label, error, children, full }) => (
    <div style={ full ? { gridColumn:"1/-1" } : {} }>
      <label style={labelSt}>{label}{error&&<span style={{ color:"#A32D2D", marginLeft:6, fontWeight:700 }}>{error}</span>}</label>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={card}>
        <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20, fontWeight:400, color:"var(--text)", marginBottom:20 }}>
          Add New Product
        </h3>

        <Row>
          <Field label="Product Name" error={errors.name}>
            <input style={{ ...inputSt, borderColor: errors.name?"#A32D2D":undefined }}
              placeholder="e.g. Kundan Jhumka Set"
              value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>
          <Field label="Price (₹)" error={errors.price}>
            <input type="number" style={{ ...inputSt, borderColor: errors.price?"#A32D2D":undefined }}
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
            <select style={{ ...inputSt, borderColor: errors.category?"#A32D2D":undefined }}
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
            <textarea style={{ ...inputSt, resize:"vertical" }} rows={3}
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
          <div style={{ marginBottom:14 }}>
            <img src={imgPreview} alt="Preview"
              style={{ height:100, width:100, objectFit:"cover", borderRadius:6, border:"1px solid var(--border-light)" }}
              onError={() => setImgPreview(null)} />
          </div>
        )}

        {/* Tags */}
        <div style={{ marginBottom:18 }}>
          <label style={labelSt}>Tags</label>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:6 }}>
            {[
              ["isBestseller","⭐ Best Seller"],
              ["isTrending","🔥 Trending"],
              ["isNew","✨ New Arrival"],
              ["onSale","🏷 On Sale"],
              ["inStock","📦 In Stock"],
            ].map(([k,label]) => (
              <label key={k} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, cursor:"pointer", color:"var(--text-muted)" }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)}
                  style={{ accentColor:"var(--primary)", width:15, height:15 }} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button
            onClick={() => { if (validate()) onSave({ ...form, price:Number(form.price), originalPrice:Number(form.originalPrice)||undefined, stock:Number(form.stock), variants: form.variants ? form.variants.split(",").map(v=>v.trim()) : [] }); }}
            style={{ padding:"10px 24px", background:"var(--text)", color:"#fff", border:"none", borderRadius:5, fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer" }}>
            Save Product
          </button>
          <button onClick={() => setForm(blankProduct())}
            style={{ padding:"10px 20px", background:"transparent", color:"var(--text-muted)", border:"1px solid var(--border)", borderRadius:5, fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer" }}>
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
        ...obj, id: Date.now()+i,
        price: Number(obj.price)||0,
        originalPrice: Number(obj.originalPrice)||undefined,
        stock: Number(obj.stock)||0,
        inStock: Number(obj.stock)>0,
        isBestseller: obj.isBestseller==="true",
        isTrending: obj.isTrending==="true",
        isNew: obj.isNew==="true",
        onSale: obj.onSale==="true",
      };
    });
  };

  const handleFile = f => {
    if (!f || !f.name.endsWith(".csv")) { showToast("Please upload a .csv file","error"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = parseCSV(e.target.result);
        setPreview(parsed);
        showToast(`${parsed.length} products ready to import`);
      } catch { showToast("CSV format error","error"); }
    };
    reader.readAsText(f);
  };

  const downloadTemplate = () => {
    const sample = `${CSV_HEADERS}\nKundan Jhumka,1499,1999,Earring,Festive,20,Gold plated,Beautiful earrings,https://example.com/img.jpg,true,false,true,false`;
    const blob = new Blob([sample], { type:"text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "rfo_products_template.csv"; a.click();
  };

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>
      <div style={card}>
        <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20, fontWeight:400, color:"var(--text)", marginBottom:8 }}>
          Bulk Upload via CSV
        </h3>
        <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:18, lineHeight:1.6 }}>
          Upload multiple products at once. Download the template, fill in your products, then upload.
        </p>

        <button onClick={downloadTemplate}
          style={{ padding:"9px 20px", border:"1px solid var(--border)", borderRadius:5, background:"transparent", color:"var(--text-muted)", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", marginBottom:20 }}>
          ↓ Download CSV Template
        </button>

        {/* Drop zone */}
        <div
          className="upload-drop"
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging?"var(--primary)":"var(--border)"}`,
            borderRadius:8, padding:"36px 24px", textAlign:"center", cursor:"pointer",
            background: dragging?"#fdf8f4":"transparent", transition:"all .2s",
            marginBottom:16,
          }}>
          <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }}
            onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize:28, marginBottom:8, color:"var(--text-muted)" }}>📄</div>
          <p style={{ fontSize:14, color:"var(--text-muted)" }}>Drop your CSV file here or <strong style={{ color:"var(--primary)" }}>click to browse</strong></p>
          <p style={{ fontSize:11, color:"var(--text-light)", marginTop:4 }}>Only .csv files supported</p>
        </div>

        {/* CSV columns reference */}
        <div style={{ background:"var(--cream)", padding:"14px 16px", borderRadius:6, fontSize:12, color:"var(--text-muted)", marginBottom:16, lineHeight:1.7 }}>
          <strong style={{ color:"var(--text)" }}>Required CSV columns:</strong><br />
          {CSV_HEADERS}
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{preview.length} products parsed</span>
              <button onClick={() => onImport(preview)}
                style={{ padding:"9px 20px", background:"var(--text)", color:"#fff", border:"none", borderRadius:5, fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer" }}>
                Import All →
              </button>
            </div>
            <div style={{ overflowX:"auto", borderRadius:6, border:"1px solid var(--border-light)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"var(--cream)" }}>
                    {["Name","Category","Price","Stock","Occasion"].map(h=>(
                      <th key={h} style={{ fontSize:10, color:"var(--text-muted)", fontWeight:700, textAlign:"left", padding:"8px 12px", borderBottom:"1px solid var(--border-light)", textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0,8).map((p,i) => (
                    <tr key={i} style={{ borderBottom:"1px solid var(--border-light)" }}>
                      <td style={{ padding:"7px 12px", fontSize:13, color:"var(--text)" }}>{p.name}</td>
                      <td style={{ padding:"7px 12px", fontSize:12, color:"var(--text-muted)" }}>{p.category}</td>
                      <td style={{ padding:"7px 12px", fontSize:13 }}>{formatINR(p.price)}</td>
                      <td style={{ padding:"7px 12px", fontSize:13 }}>{p.stock}</td>
                      <td style={{ padding:"7px 12px", fontSize:12, color:"var(--text-muted)" }}>{p.occasion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length>8 && <p style={{ padding:"8px 12px", fontSize:11, color:"var(--text-muted)" }}>+{preview.length-8} more rows...</p>}
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
  const [occs,  setOccs]  = useState(OCCASIONS.map(o=>({ name:o, on:true })));
  const [cats,  setCats]  = useState(CATEGORIES.map(c=>({ name:c, on:true })));

  const Chip = ({ item, onToggle }) => (
    <div onClick={onToggle}
      style={{
        padding:"9px 14px", border:`1.5px solid ${item.on?"var(--primary)":"var(--border)"}`,
        borderRadius:7, fontSize:12, textAlign:"center", cursor:"pointer",
        background: item.on?"#FDF8F4":"transparent", color: item.on?"var(--primary)":"var(--text-muted)",
        fontWeight: item.on?700:400, transition:"all .15s",
        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      }}>
      <span>{item.on?"✓":""}</span>
      {item.name}
    </div>
  );

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>
      <div style={card}>
        <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontWeight:400, color:"var(--text)", marginBottom:6 }}>Shop by Occasion</h3>
        <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:14 }}>Click to toggle visibility on the homepage.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
          {occs.map((o,i) => <Chip key={o.name} item={o} onToggle={() => setOccs(prev => prev.map((x,j)=>j===i?{...x,on:!x.on}:x))} />)}
        </div>
        <button onClick={() => showToast("Occasion visibility saved!")}
          style={{ padding:"9px 20px", background:"var(--text)", color:"#fff", border:"none", borderRadius:5, fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer" }}>
          Save Changes
        </button>
      </div>

      <div style={card}>
        <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontWeight:400, color:"var(--text)", marginBottom:6 }}>Shop by Category</h3>
        <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:14 }}>Click to show/hide categories in the shop.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
          {cats.map((c,i) => <Chip key={c.name} item={c} onToggle={() => setCats(prev => prev.map((x,j)=>j===i?{...x,on:!x.on}:x))} />)}
        </div>
        <button onClick={() => showToast("Category visibility saved!")}
          style={{ padding:"9px 20px", background:"var(--text)", color:"#fff", border:"none", borderRadius:5, fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer" }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// COLLECTIONS PAGE (Best Sellers + Trending)
// ═════════════════════════════════════════════
function CollectionsPage({ products, setProducts, card, showToast }) {
  const toggle = (id, field) => {
    setProducts(prev => prev.map(p => p.id===id ? { ...p, [field]:!p[field] } : p));
  };

  const Toggle = ({ checked, onChange }) => (
    <label style={{ position:"relative", display:"inline-block", width:36, height:20, flexShrink:0 }}>
      <input type="checkbox" className="toggle-check" checked={checked} onChange={onChange}
        style={{ opacity:0, width:0, height:0 }} />
      <span className="toggle-slider"
        style={{ position:"absolute", inset:0, background: checked?"var(--primary)":"var(--border)", borderRadius:20, cursor:"pointer", transition:".2s" }} />
    </label>
  );

  const display = products.slice(0,20);

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border-light)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, color:"var(--text)" }}>Best Sellers &amp; Trending</span>
          <button onClick={() => showToast("Collections updated!")}
            style={{ padding:"8px 18px", background:"var(--text)", color:"#fff", border:"none", borderRadius:5, fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer" }}>
            Save
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:560 }}>
            <thead>
              <tr style={{ background:"var(--cream)" }}>
                {["Product","Category","Best Seller","Trending","New Arrival","On Sale"].map(h=>(
                  <th key={h} style={{ fontSize:10, color:"var(--text-muted)", fontWeight:700, textAlign:"left", padding:"9px 14px", borderBottom:"1px solid var(--border-light)", textTransform:"uppercase", letterSpacing:"0.8px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {display.map(p => (
                <tr key={p.id} className="admin-table" style={{ borderBottom:"1px solid var(--border-light)" }}>
                  <td style={{ padding:"9px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <img src={p.image} alt={p.name}
                        style={{ width:36, height:36, objectFit:"cover", borderRadius:5, border:"1px solid var(--border-light)", background:"var(--cream)", flexShrink:0 }}
                        onError={e=>e.target.src="https://placehold.co/36x36?text=?"} />
                      <span style={{ fontSize:13, color:"var(--text)", fontFamily:"Cormorant Garamond,serif", fontSize:14 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"9px 14px", fontSize:12, color:"var(--text-muted)" }}>{p.category}</td>
                  <td style={{ padding:"9px 14px" }}><Toggle checked={!!p.isBestseller} onChange={() => toggle(p.id,"isBestseller")} /></td>
                  <td style={{ padding:"9px 14px" }}><Toggle checked={!!p.isTrending}   onChange={() => toggle(p.id,"isTrending")} /></td>
                  <td style={{ padding:"9px 14px" }}><Toggle checked={!!p.isNew}         onChange={() => toggle(p.id,"isNew")} /></td>
                  <td style={{ padding:"9px 14px" }}><Toggle checked={!!p.onSale}        onChange={() => toggle(p.id,"onSale")} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// ORDERS PAGE
// ═════════════════════════════════════════════
const ORDER_STATUSES = ["new","processing","shipped","delivered","cancelled"];

function OrdersPage({ orders, setOrders, card, showToast }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id===id ? {...o, status} : o));
    showToast("Order status updated");
  };

  const filtered = orders.filter(o => {
    const matchF = filter==="all" || o.status===filter;
    const matchS = !search || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const total = orders.reduce((s,o)=>s+o.amount,0);

  return (
    <div>
      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:16 }}>
        {[["All",orders.length,"var(--text)"],["New",orders.filter(o=>o.status==="new").length,"#A32D2D"],["Processing",orders.filter(o=>o.status==="processing").length,"#854F0B"],["Shipped",orders.filter(o=>o.status==="shipped").length,"#0F6E56"],["Delivered",orders.filter(o=>o.status==="delivered").length,"#3B6D11"]].map(([l,v,c]) => (
          <div key={l} onClick={() => setFilter(l.toLowerCase())} style={{ background:"#fff", border:`1px solid ${filter===l.toLowerCase()?"var(--primary)":"var(--border-light)"}`, borderRadius:8, padding:"12px 14px", cursor:"pointer", transition:"all .15s" }}>
            <div style={{ fontSize:10, color:"var(--text-muted)", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:5 }}>{l}</div>
            <div style={{ fontSize:22, fontWeight:500, color:c, fontFamily:"Cormorant Garamond,serif" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        <input placeholder="Search by order ID or customer..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, padding:"9px 12px", border:"1.5px solid var(--border)", borderRadius:6, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", color:"var(--text)" }} />
        <span style={{ alignSelf:"center", fontSize:12, color:"var(--text-muted)", whiteSpace:"nowrap" }}>
          Total: <strong style={{ color:"var(--text)" }}>{formatINR(total)}</strong>
        </span>
      </div>

      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
            <thead>
              <tr style={{ background:"var(--cream)" }}>
                {["Order ID","Date","Customer","Items","Amount","Status","Update"].map(h=>(
                  <th key={h} style={{ fontSize:10, color:"var(--text-muted)", fontWeight:700, textAlign:"left", padding:"10px 14px", borderBottom:"1px solid var(--border-light)", textTransform:"uppercase", letterSpacing:"0.8px", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="admin-table" style={{ borderBottom:"1px solid var(--border-light)" }}>
                  <td style={{ padding:"10px 14px", fontSize:13, color:"var(--text)", fontWeight:600 }}>{o.id}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"var(--text-muted)" }}>{o.date}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, color:"var(--text)" }}>{o.customer}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"var(--text-muted)" }}>{o.items}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, color:"var(--text)", fontWeight:500 }}>{formatINR(o.amount)}</td>
                  <td style={{ padding:"10px 14px" }}>
                    <Badge type={o.status==="new"?"order-new":o.status==="processing"?"order-proc":o.status==="shipped"?"order-ship":o.status==="cancelled"?"order-can":"order-del"}>
                      {o.status}
                    </Badge>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      style={{ padding:"5px 8px", border:"1px solid var(--border)", borderRadius:5, fontSize:12, fontFamily:"'DM Sans',sans-serif", color:"var(--text)", background:"#fff", cursor:"pointer", outline:"none" }}>
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <p style={{ padding:"30px", textAlign:"center", color:"var(--text-muted)", fontSize:13 }}>No orders found.</p>}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════
// NOTIFICATIONS PAGE
// ═════════════════════════════════════════════
function NotificationsPage({ notifs, setNotifs, card }) {
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read:true })));
  const markOne = id => setNotifs(prev => prev.map(n => n.id===id ? {...n, read:true} : n));
  const clear   = id => setNotifs(prev => prev.filter(n => n.id!==id));

  return (
    <div style={{ maxWidth:780, margin:"0 auto" }}>
      <div style={{ ...card }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, color:"var(--text)" }}>
            All Notifications
            <span style={{ marginLeft:10, fontSize:12, color:"var(--text-muted)", fontFamily:"'DM Sans',sans-serif" }}>
              {notifs.filter(n=>!n.read).length} unread
            </span>
          </span>
          <button onClick={markAll}
            style={{ padding:"7px 16px", border:"1px solid var(--border)", borderRadius:5, background:"transparent", color:"var(--text-muted)", fontSize:11, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer" }}>
            Mark all read
          </button>
        </div>

        {notifs.map(n => (
          <div key={n.id} style={{
            display:"flex", alignItems:"flex-start", gap:12,
            padding:"12px 0", borderBottom:"1px solid var(--border-light)",
            opacity: n.read ? 0.55 : 1,
          }}>
            <div style={{
              width:9, height:9, borderRadius:"50%", marginTop:5, flexShrink:0,
              background: n.read ? "var(--border)" : n.type==="stock"?"#E24B4A":"var(--primary)",
            }} />
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, color:"var(--text)", lineHeight:1.5 }}>{n.text}</p>
              <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{n.time}</p>
            </div>
            <div style={{ display:"flex", gap:5, flexShrink:0 }}>
              {!n.read && (
                <button onClick={() => markOne(n.id)}
                  style={{ padding:"4px 8px", border:"1px solid var(--border-light)", borderRadius:4, background:"transparent", cursor:"pointer", fontSize:11, color:"var(--text-muted)" }}>
                  Read
                </button>
              )}
              <button onClick={() => clear(n.id)}
                style={{ padding:"4px 8px", border:"1px solid var(--border-light)", borderRadius:4, background:"transparent", cursor:"pointer", fontSize:11, color:"#A32D2D" }}>
                ✕
              </button>
            </div>
          </div>
        ))}

        {notifs.length===0 && (
          <p style={{ textAlign:"center", padding:"40px 0", color:"var(--text-muted)", fontSize:14 }}>
            No notifications
          </p>
        )}
      </div>
    </div>
  );
}
