 import React, { useState, useEffect, useRef, useCallback } from "react";

// ── Config ───────────────────────────────────
const SUPABASE_URL = "https://ajqqaeejotlghgilgajy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcXFhZWVqb3RsZ2hnaWxnYWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjU2MTUsImV4cCI6MjA5NTY0MTYxNX0.fZ1MmCpMiQnwu7HsaK3zP4HXjxrLK6JseEZSUvIkreY";
const SUPABASE_TABLE = "products";
const USD_TO_INR = 83.5;

const API = "https://rayfinesite-3.onrender.com/api";
const ADMIN_PASSWORD = "rayfine2024";

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
  if (!res.ok) { const err = await res.text(); throw new Error(err); }
  return res.json().catch(() => null);
}

// ── Helpers ──────────────────────────────────
function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
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
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "products",  icon: "◈", label: "Products"  },
  { id: "add",       icon: "⊕", label: "Add Product"},
  { id: "bulk",      icon: "⊞", label: "CSV Import" },
  { id: "orders",    icon: "⊡", label: "Orders"    },
];

// ── Etsy CSV mapping ─────────────────────────
const TAG_TO_CATEGORY = {
  earring:"Earring", jhumka:"Earring", stud_earring:"Earring", dangle_earring:"Earring",
  ear_stud:"Earring", hoop:"Earring", chandbali:"Earring",
  necklace:"Necklace", choker:"Necklace", locket:"Necklace", pendant:"Pendants",
  pendent:"Pendants", haar:"Necklace",
  anklet:"Anklet", payal:"Anklet",
  bangle:"Bangles", bangle_set:"Bangles", kangan:"Bangles",
  bracelet:"Bracelet", kada:"Bracelet",
  ring:"Ring", adjustable_ring:"Ring",
  gemstone:"Gemstone Charm", charm:"Gemstone Charm",
};
const TAG_TO_OCCASION = {
  bridal:"Bridal", wedding:"Bridal", bride:"Bridal",
  festive:"Festive", diwali:"Festive", navratri:"Festive", eid:"Festive", festival:"Festive",
  gift:"Gifting", gifting:"Gifting", gift_for_her:"Gifting", return_gift:"Gifting",
  party:"Party", party_wear:"Party",
  everyday:"Everyday", daily_wear:"Everyday", office:"Everyday",
  vacation:"Vacation", travel:"Vacation", boho:"Vacation",
  traditional:"Traditional", ethnic:"Traditional", saree:"Traditional",
};
const BESTSELLER_TAGS = ["bestseller","best_seller","popular","top_seller","most_loved"];
const TRENDING_TAGS   = ["trending","new_arrival","new_launch","viral","hot"];
const NEW_TAGS        = ["new","new_arrival","new_launch","just_arrived","newly_listed"];

function detectFromTags(tagsStr = "") {
  const tags = tagsStr.toLowerCase().replace(/\s/g,"_").split(",").map(t => t.trim());
  let category = "", occasion = "", isBestseller = false, isTrending = false, isNew = false;
  for (const tag of tags) {
    if (!category) for (const [k,v] of Object.entries(TAG_TO_CATEGORY)) { if (tag.includes(k)) { category=v; break; } }
    if (!occasion) for (const [k,v] of Object.entries(TAG_TO_OCCASION)) { if (tag.includes(k)) { occasion=v; break; } }
    if (!isBestseller && BESTSELLER_TAGS.some(k => tag.includes(k))) isBestseller = true;
    if (!isTrending   && TRENDING_TAGS.some(k => tag.includes(k)))   isTrending   = true;
    if (!isNew        && NEW_TAGS.some(k => tag.includes(k)))         isNew        = true;
  }
  return { category, occasion, isBestseller, isTrending, isNew };
}

function guessCategoryFromTitle(title = "") {
  const t = title.toLowerCase();
  if (t.includes("earring")||t.includes("jhumka")||t.includes("stud")||t.includes("chandbali")) return "Earring";
  if (t.includes("necklace")||t.includes("haar")||t.includes("choker")) return "Necklace";
  if (t.includes("bracelet")||t.includes("kada")) return "Bracelet";
  if (t.includes("bangle")) return "Bangles";
  if (t.includes("ring")) return "Ring";
  if (t.includes("anklet")||t.includes("payal")) return "Anklet";
  if (t.includes("pendant")||t.includes("pendent")||t.includes("locket")) return "Pendants";
  return "Earring";
}

function isEtsyCSV(headers) {
  return headers.some(h => h.toUpperCase() === "TITLE");
}

function convertEtsyRow(row, index) {
  const title    = (row.TITLE||row.title||"").trim();
  const desc     = (row.DESCRIPTION||row.description||"").replace(/\n/g," ").trim();
  const priceUSD = parseFloat(row.PRICE||row.price) || 0;
  const qty      = parseInt(row.QUANTITY||row.quantity) || 0;
  const tags     = row.TAGS||row.tags||"";
  const materials= row.MATERIALS||row.materials||"";
  const image    = (row.IMAGE1||row.image1||"").trim();
  const sku      = (row.SKU||row.sku||"").trim();
  const { category, occasion, isBestseller, isTrending, isNew } = detectFromTags(tags);
  return {
    name: title, description: desc.slice(0,500),
    price: Math.round(priceUSD * USD_TO_INR), originalPrice: null,
    category: category || guessCategoryFromTitle(title),
    occasion: occasion || "Festive",
    stock: qty, inStock: qty > 0,
    material: materials, image, isBestseller, isTrending, isNew, onSale: false, sku,
    _rowNum: index + 2, _source: "etsy",
  };
}

function convertRFORow(row, index) {
  return {
    ...row, _rowNum: index + 2,
    price: Number(row.price)||0,
    originalPrice: Number(row.originalPrice)||null,
    stock: Number(row.stock)||0,
    inStock: Number(row.stock)>0,
    isBestseller: row.isBestseller==="true"||row.isBestseller==="1",
    isTrending:   row.isTrending==="true"  ||row.isTrending==="1",
    isNew:        row.isNew==="true"       ||row.isNew==="1",
    onSale:       row.onSale==="true"      ||row.onSale==="1",
  };
}

function parseCSV(text) {
  const lines = [];
  let cur = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch==='"') { inQ=!inQ; cur+=ch; }
    else if (ch==="\n"&&!inQ) { lines.push(cur); cur=""; }
    else cur+=ch;
  }
  if (cur) lines.push(cur);
  const parseRow = (line) => {
    const vals=[]; let field="", inQF=false;
    for (const ch of line) {
      if (ch==='"') inQF=!inQF;
      else if (ch===","&&!inQF) { vals.push(field.replace(/^"|"$/g,"").trim()); field=""; }
      else field+=ch;
    }
    vals.push(field.replace(/^"|"$/g,"").trim());
    return vals;
  };
  const headers = parseRow(lines[0]).map(h=>h.replace(/^"|"$/g,"").trim());
  const rows = lines.slice(1).filter(l=>l.trim()).map((line,i)=>{
    const vals=parseRow(line), obj={};
    headers.forEach((h,idx)=>{ obj[h]=(vals[idx]||"").replace(/^"|"$/g,"").trim(); });
    return obj;
  });
  return { headers, rows };
}

// ═══════════════════════════════════════════════
// MAIN PANEL
// ═══════════════════════════════════════════════
export default function RFOPanel() {
  const [authed,   setAuthed]   = useState(() => sessionStorage.getItem("rfo_panel_auth")==="yes");
  const [pw,       setPw]       = useState("");
  const [pwErr,    setPwErr]    = useState("");
  const [page,     setPage]     = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);
  const [sideOpen, setSideOpen] = useState(true);

  const showToast = useCallback((msg, type="success") => setToast({msg,type}), []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch(`${API}/products`)
      .then(r=>r.json())
      .then(data=>{
        const list = Array.isArray(data?.data) ? data.data : [];
        setProducts(list.map(p=>({
          ...p, id: p._id||p.id,
          image: p.image?.replace(/^http:\/\//i,"https://")?.split(",")[0]?.trim(),
        })));
        setLoading(false);
      })
      .catch(()=>{ showToast("Could not load products","error"); setLoading(false); });
  }, [authed, showToast]);

  if (!authed) {
    return (
      <div style={{ minHeight:"100vh", background:"#0a0a0b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
          @keyframes toastIn { from{opacity:0;transform:translateY(12px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes fadeIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          * { box-sizing:border-box; margin:0; padding:0; }
        `}</style>
        <div style={{ background:"#111113", border:"1px solid #2a2a2e", borderRadius:16, padding:"52px 48px", maxWidth:400, width:"100%", textAlign:"center", animation:"fadeIn 0.5s ease", boxShadow:"0 40px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ width:56, height:56, borderRadius:14, background:"linear-gradient(135deg,#b07a5a,#e8b84b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 20px" }}>⬡</div>
          <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:28, fontWeight:400, color:"#f5f0eb", marginBottom:6 }}>RFO Control Panel</h2>
          <p style={{ fontSize:12, color:"#666", marginBottom:32, letterSpacing:"0.8px" }}>RAY FINE ORNATES · STORE MANAGEMENT</p>
          <input type="password" placeholder="Enter admin password" value={pw}
            onChange={e=>{setPw(e.target.value);setPwErr("");}}
            onKeyDown={e=>{ if(e.key==="Enter"){ if(pw===ADMIN_PASSWORD){sessionStorage.setItem("rfo_panel_auth","yes");setAuthed(true);}else setPwErr("Incorrect password"); }}}
            style={{ width:"100%", padding:"13px 16px", background:"#1a1a1e", border:"1.5px solid #2a2a2e", borderRadius:8, color:"#f5f0eb", fontSize:14, fontFamily:"inherit", outline:"none", marginBottom:8 }} />
          {pwErr && <p style={{color:"#ef4444",fontSize:12,marginBottom:8}}>{pwErr}</p>}
          <button onClick={()=>{ if(pw===ADMIN_PASSWORD){sessionStorage.setItem("rfo_panel_auth","yes");setAuthed(true);}else setPwErr("Incorrect password"); }}
            style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#b07a5a,#e8b84b)", border:"none", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}>
            Access Panel →
          </button>
          <p style={{marginTop:20,fontSize:11,color:"#444"}}>Route: <code style={{color:"#b07a5a"}}>/rfo-panel</code></p>
        </div>
      </div>
    );
  }

  const S = {
    page: { display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'DM Sans',sans-serif", background:"#0a0a0b" },
    sidebar: { width:sideOpen?220:56, minWidth:sideOpen?220:56, background:"#111113", borderRight:"1px solid #1e1e22", display:"flex", flexDirection:"column", transition:"width 0.2s ease", overflow:"hidden", flexShrink:0 },
    main: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
    topbar: { background:"#111113", borderBottom:"1px solid #1e1e22", padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
    content: { flex:1, overflowY:"auto", padding:24, background:"#0a0a0b" },
    card: { background:"#111113", border:"1px solid #1e1e22", borderRadius:10, padding:"20px 22px", marginBottom:16 },
    input: { width:"100%", padding:"10px 13px", background:"#1a1a1e", border:"1.5px solid #2a2a2e", borderRadius:6, color:"#f5f0eb", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" },
    label: { fontSize:11, fontWeight:700, letterSpacing:"1px", color:"#555", textTransform:"uppercase", display:"block", marginBottom:4 },
    btn: (v="primary") => ({
      padding:"10px 20px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", fontFamily:"inherit",
      ...(v==="primary"?{background:"linear-gradient(135deg,#b07a5a,#c4956a)",color:"#fff"}:{}),
      ...(v==="ghost"  ?{background:"transparent",border:"1px solid #2a2a2e",color:"#888"}:{}),
      ...(v==="danger" ?{background:"#7f1d1d22",border:"1px solid #7f1d1d",color:"#ef4444"}:{}),
    }),
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        @keyframes toastIn{from{opacity:0;transform:translateY(12px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;}
        .rfo-nav-item:hover{background:#1a1a1e!important;}
        .rfo-nav-item.active{background:#1e1612!important;border-left:3px solid #b07a5a!important;}
        .rfo-tr:hover td{background:#151518!important;}
        .rfo-input:focus{border-color:#b07a5a!important;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#0a0a0b;}
        ::-webkit-scrollbar-thumb{background:#2a2a2e;border-radius:4px;}
      `}</style>

      {/* SIDEBAR */}
      <div style={S.sidebar}>
        <div style={{padding:"16px 14px 12px",borderBottom:"1px solid #1e1e22",display:"flex",alignItems:"center",gap:10,justifyContent:sideOpen?"flex-start":"center"}}>
          <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#b07a5a,#e8b84b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>⬡</div>
          {sideOpen&&<div><div style={{fontSize:12,fontWeight:700,color:"#f5f0eb",letterSpacing:"0.3px",fontFamily:"Cormorant Garamond,serif"}}>RFO Panel</div><div style={{fontSize:9,color:"#555",letterSpacing:"1.5px",textTransform:"uppercase"}}>Store Control</div></div>}
        </div>
        <nav style={{flex:1,padding:"8px 0"}}>
          {NAV.map(n=>(
            <div key={n.id} className={`rfo-nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:sideOpen?"10px 16px":"10px 0",justifyContent:sideOpen?"flex-start":"center",cursor:"pointer",transition:"all .15s",color:page===n.id?"#b07a5a":"#555",fontSize:13,borderLeft:page===n.id?"3px solid #b07a5a":"3px solid transparent"}}>
              <span style={{fontSize:16,flexShrink:0}}>{n.icon}</span>
              {sideOpen&&<span>{n.label}</span>}
            </div>
          ))}
        </nav>
        <div style={{padding:"12px 14px",borderTop:"1px solid #1e1e22",display:"flex",justifyContent:sideOpen?"flex-end":"center"}}>
          <button onClick={()=>setSideOpen(!sideOpen)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#555",padding:"4px 8px"}}>{sideOpen?"◀":"▶"}</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>
        <div style={S.topbar}>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,color:"#f5f0eb",fontWeight:400}}>{NAV.find(n=>n.id===page)?.label}</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setPage("add")} style={S.btn("primary")}>+ Add Product</button>
            <button onClick={()=>setPage("bulk")} style={S.btn("ghost")}>CSV Import</button>
            <button onClick={()=>{sessionStorage.removeItem("rfo_panel_auth");setAuthed(false);}} style={S.btn("danger")}>Logout</button>
          </div>
        </div>
        <div style={S.content}>
          {page==="dashboard"&&<DashboardPage products={products} loading={loading} S={S} setPage={setPage}/>}
          {page==="products" &&<ProductsPage  products={products} loading={loading} S={S} showToast={showToast} setProducts={setProducts}/>}
          {page==="add"      &&<AddProductPage S={S} showToast={showToast} onSave={p=>{setProducts(prev=>[p,...prev]);showToast("Product added!");setPage("products");}}/>}
          {page==="bulk"     &&<BulkImportPage S={S} showToast={showToast} onImport={list=>{setProducts(prev=>[...list,...prev]);showToast(`${list.length} products imported!`);setPage("products");}}/>}
          {page==="orders"   &&<OrdersPage S={S} showToast={showToast}/>}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════
function DashboardPage({ products, loading, S, setPage }) {
  const inStock    = products.filter(p=>p.inStock&&(p.stock||0)>5).length;
  const lowStock   = products.filter(p=>p.inStock&&(p.stock||0)<=5&&(p.stock||0)>0).length;
  const outOfStock = products.filter(p=>!p.inStock||(p.stock||0)===0).length;
  const onSale     = products.filter(p=>p.onSale||p.originalPrice).length;
  const statCards  = [
    {label:"Total Products",value:loading?"…":products.length,sub:"In database",      color:"#b07a5a"},
    {label:"In Stock",      value:loading?"…":inStock,        sub:"Ready to ship",    color:"#22c55e"},
    {label:"Low/Out Stock", value:loading?"…":lowStock+outOfStock,sub:"Needs attention",color:"#ef4444"},
    {label:"On Sale",       value:loading?"…":onSale,         sub:"Discounted items", color:"#e8b84b"},
  ];
  const catCounts={};
  products.forEach(p=>{const k=p.category||"Other";catCounts[k]=(catCounts[k]||0)+1;});
  const catArr=Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,7);
  const maxCat=catArr[0]?.[1]||1;
  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {statCards.map(sc=>(
          <div key={sc.label} style={{...S.card,margin:0}}>
            <div style={{fontSize:11,color:"#555",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:8}}>{sc.label}</div>
            <div style={{fontSize:30,fontWeight:400,color:sc.color,fontFamily:"Cormorant Garamond,serif",marginBottom:3}}>{sc.value}</div>
            <div style={{fontSize:11,color:"#444"}}>{sc.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={S.card}>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,color:"#f5f0eb",marginBottom:16}}>Products by Category</div>
          {loading?<p style={{color:"#555",fontSize:13,textAlign:"center",padding:20}}>Loading…</p>
            :catArr.map(([cat,cnt])=>(
              <div key={cat} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                  <span style={{color:"#ccc"}}>{cat}</span><span style={{color:"#555"}}>{cnt}</span>
                </div>
                <div style={{height:4,background:"#1e1e22",borderRadius:4}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#b07a5a,#e8b84b)",width:`${(cnt/maxCat)*100}%`,borderRadius:4,transition:"width .6s"}}/>
                </div>
              </div>
            ))
          }
        </div>
        <div style={S.card}>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,color:"#f5f0eb",marginBottom:16}}>Quick Actions</div>
          {[{label:"Add New Product",icon:"⊕",action:"add"},{label:"Bulk CSV Import",icon:"⊞",action:"bulk"},{label:"View All Products",icon:"◈",action:"products"}].map(a=>(
            <button key={a.label} onClick={()=>setPage(a.action)}
              style={{width:"100%",padding:"13px 16px",background:"#1a1a1e",border:"1px solid #2a2a2e",borderRadius:7,color:"#ccc",fontSize:13,cursor:"pointer",textAlign:"left",marginBottom:8,display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#b07a5a"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#2a2a2e"}>
              <span style={{color:"#b07a5a",fontSize:16}}>{a.icon}</span>{a.label}
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
  const [search,setSearch]=useState("");
  const [catFilter,setCat]=useState("All");
  const filtered=products.filter(p=>{
    const q=search.toLowerCase();
    return (!q||p.name?.toLowerCase().includes(q)||p.category?.toLowerCase().includes(q))
      &&(catFilter==="All"||p.category?.toLowerCase()===catFilter.toLowerCase());
  });
  const deleteProduct=async(id)=>{
    if(!window.confirm("Delete this product?"))return;
    try{await supabaseQuery(`${SUPABASE_TABLE}?id=eq.${id}`,"DELETE");setProducts(prev=>prev.filter(p=>p.id!==id));showToast("Product deleted");}
    catch{setProducts(prev=>prev.filter(p=>p.id!==id));showToast("Removed from view");}
  };
  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <input className="rfo-input" placeholder="🔍 Search products…" value={search} onChange={e=>setSearch(e.target.value)} style={{...S.input,flex:1}}/>
        <select value={catFilter} onChange={e=>setCat(e.target.value)} style={{...S.input,width:160}}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{alignSelf:"center",fontSize:12,color:"#555",whiteSpace:"nowrap"}}>{filtered.length} products</span>
      </div>
      <div style={{...S.card,padding:0,overflow:"hidden"}}>
        {loading?<p style={{padding:40,textAlign:"center",color:"#555",fontStyle:"italic",fontFamily:"Cormorant Garamond,serif",fontSize:18}}>Loading collection…</p>:(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead><tr style={{background:"#0d0d0f"}}>
                {["Image","Product","Category","Price","Stock","Status","Actions"].map(h=>(
                  <th key={h} style={{fontSize:10,color:"#555",fontWeight:700,textAlign:"left",padding:"10px 14px",borderBottom:"1px solid #1e1e22",textTransform:"uppercase",letterSpacing:"0.8px",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(p=>(
                  <tr key={p.id} className="rfo-tr" style={{borderBottom:"1px solid #1e1e22"}}>
                    <td style={{padding:"10px 14px"}}><img src={p.image} alt={p.name} style={{width:42,height:42,objectFit:"cover",borderRadius:6,border:"1px solid #2a2a2e",background:"#1a1a1e"}} onError={e=>{e.target.src="https://placehold.co/42x42/111/555?text=?"}}/></td>
                    <td style={{padding:"10px 14px"}}><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,color:"#f5f0eb"}}>{p.name}</div>{p.material&&<div style={{fontSize:11,color:"#555",marginTop:1}}>{p.material}</div>}</td>
                    <td style={{padding:"10px 14px",fontSize:12,color:"#777"}}>{p.category}</td>
                    <td style={{padding:"10px 14px",fontSize:13,color:"#f5f0eb",fontWeight:500,whiteSpace:"nowrap"}}>{formatINR(p.price)}{p.originalPrice&&<div style={{fontSize:10,color:"#555",textDecoration:"line-through"}}>{formatINR(p.originalPrice)}</div>}</td>
                    <td style={{padding:"10px 14px",fontSize:13,color:"#ccc"}}>{p.stock||0}</td>
                    <td style={{padding:"10px 14px"}}>
                      {p.inStock&&(p.stock||0)>5?<Badge bg="#14532d22" color="#22c55e">In Stock</Badge>
                        :p.inStock&&(p.stock||0)>0?<Badge bg="#78350f22" color="#f59e0b">Low Stock</Badge>
                        :<Badge bg="#7f1d1d22" color="#ef4444">Out of Stock</Badge>}
                      {p.onSale&&<span style={{marginLeft:4}}><Badge bg="#1e1b4b22" color="#818cf8">Sale</Badge></span>}
                    </td>
                    <td style={{padding:"10px 14px"}}><button onClick={()=>deleteProduct(p.id)} style={{padding:"5px 10px",border:"1px solid #7f1d1d",borderRadius:5,background:"transparent",cursor:"pointer",fontSize:11,color:"#ef4444",fontFamily:"inherit"}}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0&&<p style={{padding:30,textAlign:"center",color:"#555",fontSize:13}}>No products found.</p>}
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
  const blank={name:"",price:"",originalPrice:"",category:"",occasion:"",stock:"",material:"",description:"",careInstructions:"",image:"",variants:"",inStock:true,isBestseller:false,isTrending:false,isNew:false,onSale:false};
  const [form,setForm]=useState(blank);
  const [errors,setErrors]=useState({});
  const [saving,setSaving]=useState(false);
  const [preview,setPreview]=useState(null);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const validate=()=>{const e={};if(!form.name.trim())e.name="Required";if(!form.price)e.price="Required";if(!form.category)e.category="Required";setErrors(e);return Object.keys(e).length===0;};
  const save=async()=>{
    if(!validate())return;
    setSaving(true);
    const product={...form,price:Number(form.price),originalPrice:Number(form.originalPrice)||null,stock:Number(form.stock)||0,variants:form.variants?form.variants.split(",").map(v=>v.trim()):[]};
    try{const[saved]=await supabaseQuery(SUPABASE_TABLE,"POST",[product]);onSave({...product,id:saved?.id||Date.now()});}
    catch{onSave({...product,id:Date.now()});}
    setSaving(false);
  };
  const Row=({children})=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>{children}</div>;
  const Field=({label,err,children,full})=>(<div style={full?{gridColumn:"1/-1"}:{}}><label style={{...S.label}}>{label}{err&&<span style={{color:"#ef4444",marginLeft:6}}>{err}</span>}</label>{children}</div>);
  return (
    <div style={{maxWidth:860,margin:"0 auto",animation:"fadeIn 0.4s ease"}}>
      <div style={S.card}>
        <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:400,color:"#f5f0eb",marginBottom:20}}>Add New Product</h3>
        <Row><Field label="Product Name" err={errors.name}><input className="rfo-input" style={{...S.input,borderColor:errors.name?"#ef4444":undefined}} placeholder="e.g. Kundan Jhumka Set" value={form.name} onChange={e=>set("name",e.target.value)}/></Field>
        <Field label="Price (₹)" err={errors.price}><input type="number" className="rfo-input" style={{...S.input,borderColor:errors.price?"#ef4444":undefined}} placeholder="1499" value={form.price} onChange={e=>set("price",e.target.value)}/></Field></Row>
        <Row><Field label="Original Price (₹)"><input type="number" className="rfo-input" style={S.input} placeholder="Leave blank if no discount" value={form.originalPrice} onChange={e=>set("originalPrice",e.target.value)}/></Field>
        <Field label="Stock Quantity"><input type="number" className="rfo-input" style={S.input} placeholder="0" value={form.stock} onChange={e=>set("stock",e.target.value)}/></Field></Row>
        <Row><Field label="Category" err={errors.category}><select className="rfo-input" style={{...S.input,borderColor:errors.category?"#ef4444":undefined}} value={form.category} onChange={e=>set("category",e.target.value)}><option value="">Select category</option>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Shop by Occasion"><select className="rfo-input" style={S.input} value={form.occasion} onChange={e=>set("occasion",e.target.value)}><option value="">Select occasion</option>{OCCASIONS.map(o=><option key={o} value={o}>{o}</option>)}</select></Field></Row>
        <Row><Field label="Material"><input className="rfo-input" style={S.input} placeholder="e.g. Gold plated, Pearl" value={form.material} onChange={e=>set("material",e.target.value)}/></Field>
        <Field label="Variants (comma-separated)"><input className="rfo-input" style={S.input} placeholder="Gold,Silver,Rose Gold" value={form.variants} onChange={e=>set("variants",e.target.value)}/></Field></Row>
        <Row><Field label="Description" full><textarea className="rfo-input" style={{...S.input,resize:"vertical"}} rows={3} placeholder="Describe the product…" value={form.description} onChange={e=>set("description",e.target.value)}/></Field></Row>
        <Row><Field label="Care Instructions" full><input className="rfo-input" style={S.input} placeholder="e.g. Avoid water, store in dry pouch" value={form.careInstructions} onChange={e=>set("careInstructions",e.target.value)}/></Field></Row>
        <Row><Field label="Image URL" full><input className="rfo-input" style={S.input} placeholder="https://…" value={form.image} onChange={e=>{set("image",e.target.value);setPreview(e.target.value||null);}}/></Field></Row>
        {preview&&<div style={{marginBottom:14}}><img src={preview} alt="Preview" style={{height:90,width:90,objectFit:"cover",borderRadius:6,border:"1px solid #2a2a2e"}} onError={()=>setPreview(null)}/></div>}
        <div style={{marginBottom:18}}>
          <label style={S.label}>Tags</label>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:6}}>
            {[["isBestseller","⭐ Bestseller"],["isTrending","🔥 Trending"],["isNew","✨ New"],["onSale","🏷 On Sale"],["inStock","📦 In Stock"]].map(([k,lbl])=>(
              <label key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,cursor:"pointer",color:"#888"}}>
                <input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} style={{accentColor:"#b07a5a",width:14,height:14}}/>{lbl}
              </label>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={save} disabled={saving} style={S.btn("primary")}>{saving?"Saving…":"Save to Supabase →"}</button>
          <button onClick={()=>{setForm(blank);setPreview(null);setErrors({});}} style={S.btn("ghost")}>Clear</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// BULK IMPORT PAGE — Etsy CSV Auto-Convert
// ═══════════════════════════════════════════════
function BulkImportPage({ S, showToast, onImport }) {
  const fileRef=useRef();
  const [preview,setPreview]=useState([]);
  const [dragging,setDragging]=useState(false);
  const [importing,setImporting]=useState(false);
  const [progress,setProgress]=useState(0);
  const [errors,setErrors]=useState([]);
  const [mode,setMode]=useState(null);
  const [overrideCategory,setOverrideCategory]=useState("");
  const [overrideOccasion,setOverrideOccasion]=useState("");
  const [flagBestseller,setFlagBestseller]=useState(false);
  const [flagTrending,setFlagTrending]=useState(false);
  const [flagNew,setFlagNew]=useState(false);
  const [usdRate,setUsdRate]=useState(83.5);

  const categoryBadgeColor={Earring:"#e8b84b",Necklace:"#b07a5a",Bangles:"#22c55e",Bracelet:"#60a5fa",Ring:"#f97316",Anklet:"#c084fc",Pendants:"#f472b6","Gemstone Charm":"#34d399"};

  const handleFile=(f)=>{
    if(!f)return;
    if(!f.name.endsWith(".csv")){showToast("Only .csv files allowed","error");return;}
    const reader=new FileReader();
    reader.onload=e=>{
      try{
        const{headers,rows}=parseCSV(e.target.result);
        const etsy=isEtsyCSV(headers);
        setMode(etsy?"etsy":"rfo");
        const parsed=rows.map((row,i)=>etsy?convertEtsyRow(row,i):convertRFORow(row,i));
        const rowErrors=[];
        parsed.forEach(row=>{if(!row.name)rowErrors.push(`Row ${row._rowNum}: name missing`);if(!row.price)rowErrors.push(`Row ${row._rowNum}: price missing`);});
        setErrors(rowErrors);
        setPreview(parsed);
        showToast(`${parsed.length} rows parsed (${etsy?"Etsy CSV detected 🛍️":"RFO format"})${rowErrors.length?`, ${rowErrors.length} warnings`:" — ready to import!"}`);
      }catch(err){showToast("CSV parse error: "+err.message,"error");}
    };
    reader.readAsText(f);
  };

  const getReadyRows=()=>preview.map(({_rowNum,_source,...row})=>({
    ...row,
    price: mode==="etsy"?Math.round(row.price*(usdRate/USD_TO_INR)):row.price,
    category: overrideCategory||row.category,
    occasion: overrideOccasion||row.occasion,
    isBestseller: flagBestseller||row.isBestseller,
    isTrending:   flagTrending  ||row.isTrending,
    isNew:        flagNew       ||row.isNew,
  }));

  const importToSupabase=async()=>{
    if(!preview.length)return;
    setImporting(true);setProgress(0);
    const rows=getReadyRows(),BATCH=50,successful=[],failed=[];
    for(let i=0;i<rows.length;i+=BATCH){
      const batch=rows.slice(i,i+BATCH);
      try{await supabaseQuery(SUPABASE_TABLE,"POST",batch);successful.push(...batch);}
      catch{for(const row of batch){try{await supabaseQuery(SUPABASE_TABLE,"POST",[row]);successful.push(row);}catch{failed.push(row.name||"unknown");}}}
      setProgress(Math.min(100,Math.round(((i+BATCH)/rows.length)*100)));
    }
    setImporting(false);
    if(failed.length)showToast(`${successful.length} imported, ${failed.length} failed`,"error");
    else onImport(successful);
  };

  return (
    <div style={{maxWidth:960,margin:"0 auto",animation:"fadeIn 0.4s ease"}}>
      <div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:400,color:"#f5f0eb",marginBottom:4}}>Bulk Import → Supabase</h3>
            <p style={{fontSize:12,color:"#555"}}>Etsy CSV ya RFO CSV — dono auto-detect hoga. Categories, occasions, flags sab map honge.</p>
          </div>
          {mode&&<span style={{fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:20,background:mode==="etsy"?"#1e3a5f44":"#14532d44",color:mode==="etsy"?"#60a5fa":"#22c55e",letterSpacing:"1px",textTransform:"uppercase",border:`1px solid ${mode==="etsy"?"#60a5fa44":"#22c55e44"}`}}>{mode==="etsy"?"🛍️ Etsy CSV":"✓ RFO CSV"}</span>}
        </div>

        {/* Drop zone */}
        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
          onClick={()=>fileRef.current?.click()}
          style={{border:`2px dashed ${dragging?"#b07a5a":"#2a2a2e"}`,borderRadius:10,padding:"40px 24px",textAlign:"center",cursor:"pointer",background:dragging?"#1e1612":"transparent",transition:"all .2s",marginBottom:20}}>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          <div style={{fontSize:36,marginBottom:10}}>📄</div>
          <p style={{fontSize:14,color:"#888"}}>Etsy CSV ya RFO CSV drop karo, ya <strong style={{color:"#b07a5a"}}>click karo browse karne ke liye</strong></p>
          <p style={{fontSize:11,color:"#444",marginTop:6}}>Etsy ka TITLE, PRICE, TAGS, IMAGE1 auto-map hoga • USD → INR auto-convert</p>
        </div>

        {/* Override controls */}
        {preview.length>0&&(
          <div style={{background:"#0d0d0f",border:"1px solid #1e1e22",borderRadius:8,padding:"16px 18px",marginBottom:20}}>
            <p style={{fontSize:11,fontWeight:700,color:"#b07a5a",letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>⚙ Bulk Override — sab rows pe apply hoga</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <label style={{fontSize:11,color:"#555",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",display:"block",marginBottom:4}}>Category Override</label>
                <select value={overrideCategory} onChange={e=>setOverrideCategory(e.target.value)} style={{...S.input,padding:"8px 10px"}}>
                  <option value="">Auto-detect (rakhne do)</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,color:"#555",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",display:"block",marginBottom:4}}>Occasion Override</label>
                <select value={overrideOccasion} onChange={e=>setOverrideOccasion(e.target.value)} style={{...S.input,padding:"8px 10px"}}>
                  <option value="">Auto-detect (rakhne do)</option>
                  {OCCASIONS.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {mode==="etsy"&&<div>
                <label style={{fontSize:11,color:"#555",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",display:"block",marginBottom:4}}>USD → INR Rate</label>
                <input type="number" value={usdRate} onChange={e=>setUsdRate(Number(e.target.value))} style={{...S.input,padding:"8px 10px"}} placeholder="83.5"/>
              </div>}
            </div>
            <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
              {[[flagBestseller,setFlagBestseller,"⭐ Sab Bestseller"],[flagTrending,setFlagTrending,"🔥 Sab Trending"],[flagNew,setFlagNew,"✨ Sab New"]].map(([val,setter,label])=>(
                <label key={label} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,cursor:"pointer",color:"#888"}}>
                  <input type="checkbox" checked={val} onChange={e=>setter(e.target.checked)} style={{accentColor:"#b07a5a",width:14,height:14}}/>{label}
                </label>
              ))}
            </div>
          </div>
        )}

        {errors.length>0&&(
          <div style={{background:"#7f1d1d22",border:"1px solid #7f1d1d44",borderRadius:7,padding:"12px 16px",marginBottom:16}}>
            <p style={{color:"#ef4444",fontSize:12,fontWeight:700,marginBottom:6}}>⚠ Warnings ({errors.length})</p>
            {errors.slice(0,5).map((e,i)=><p key={i} style={{color:"#fca5a5",fontSize:11}}>{e}</p>)}
            {errors.length>5&&<p style={{color:"#888",fontSize:11}}>+{errors.length-5} more…</p>}
          </div>
        )}

        {importing&&(
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#888",marginBottom:6}}><span>Supabase mein import ho raha hai…</span><span>{progress}%</span></div>
            <div style={{height:6,background:"#1e1e22",borderRadius:4}}><div style={{height:"100%",background:"linear-gradient(90deg,#b07a5a,#e8b84b)",width:`${progress}%`,borderRadius:4,transition:"width .3s"}}/></div>
          </div>
        )}

        {preview.length>0&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:13,fontWeight:600,color:"#ccc"}}>{preview.length} products ready · {errors.length} warnings</span>
              <button onClick={importToSupabase} disabled={importing}
                style={{padding:"10px 22px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",fontFamily:"inherit",background:"linear-gradient(135deg,#b07a5a,#c4956a)",color:"#fff"}}>
                {importing?`Importing… ${progress}%`:`🚀 Import ${preview.length} Products → Supabase`}
              </button>
            </div>
            <div style={{overflowX:"auto",borderRadius:8,border:"1px solid #1e1e22"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
                <thead><tr style={{background:"#0d0d0f"}}>
                  {["#","Image","Name","Category","Occasion","Price","Stock","Flags"].map(h=>(
                    <th key={h} style={{fontSize:10,color:"#555",fontWeight:700,textAlign:"left",padding:"9px 12px",borderBottom:"1px solid #1e1e22",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {preview.slice(0,15).map((p,i)=>{
                    const displayCat=overrideCategory||p.category;
                    const displayOcc=overrideOccasion||p.occasion;
                    const displayPrice=mode==="etsy"?Math.round(p.price*(usdRate/USD_TO_INR)):p.price;
                    return(
                      <tr key={i} style={{borderBottom:"1px solid #1e1e22"}}>
                        <td style={{padding:"8px 12px",fontSize:11,color:"#444"}}>{p._rowNum}</td>
                        <td style={{padding:"8px 12px"}}>{p.image?<img src={p.image} alt="" style={{width:38,height:38,objectFit:"cover",borderRadius:5,border:"1px solid #2a2a2e",background:"#1a1a1e"}} onError={e=>{e.target.style.display="none";}}/>:<div style={{width:38,height:38,background:"#1a1a1e",borderRadius:5,border:"1px solid #2a2a2e"}}/>}</td>
                        <td style={{padding:"8px 12px",maxWidth:240}}><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:14,color:"#f5f0eb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>{p.material&&<div style={{fontSize:10,color:"#555"}}>{p.material.slice(0,40)}</div>}</td>
                        <td style={{padding:"8px 12px"}}><span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:`${categoryBadgeColor[displayCat]||"#888"}22`,color:categoryBadgeColor[displayCat]||"#888"}}>{displayCat||"—"}</span></td>
                        <td style={{padding:"8px 12px",fontSize:11,color:"#777"}}>{displayOcc||"—"}</td>
                        <td style={{padding:"8px 12px",fontSize:13,color:"#b07a5a",fontWeight:600,whiteSpace:"nowrap"}}>{formatINR(displayPrice)}</td>
                        <td style={{padding:"8px 12px",fontSize:12,color:p.stock>0?"#22c55e":"#ef4444"}}>{p.stock}</td>
                        <td style={{padding:"8px 12px",fontSize:14}}>
                          {(flagBestseller||p.isBestseller)&&<span title="Bestseller">⭐</span>}
                          {(flagTrending  ||p.isTrending)  &&<span title="Trending">🔥</span>}
                          {(flagNew       ||p.isNew)       &&<span title="New">✨</span>}
                          {p.onSale&&<span title="On Sale">🏷</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {preview.length>15&&<p style={{padding:"8px 12px",fontSize:11,color:"#555",textAlign:"center",borderTop:"1px solid #1e1e22"}}>+{preview.length-15} more rows (sab import honge)</p>}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}>
              {Object.entries(preview.reduce((acc,p)=>{const k=overrideCategory||p.category||"Unknown";acc[k]=(acc[k]||0)+1;return acc;},{})).map(([cat,cnt])=>(
                <span key={cat} style={{fontSize:11,padding:"4px 12px",borderRadius:20,fontWeight:600,background:`${categoryBadgeColor[cat]||"#888"}22`,color:categoryBadgeColor[cat]||"#888",border:`1px solid ${categoryBadgeColor[cat]||"#888"}44`}}>{cat}: {cnt}</span>
              ))}
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
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  useEffect(()=>{
    supabaseQuery("orders?order=created_at.desc&limit=100")
      .then(data=>{setOrders(Array.isArray(data)?data:[]);setLoading(false);})
      .catch(()=>{
        setOrders([
          {id:"#1041",customer:"Priya Sharma", items:"Bridal Set × 1",    amount:8500,status:"new",       date:"Jun 5"},
          {id:"#1040",customer:"Rahul Verma",  items:"Gold Anklet × 2",   amount:1798,status:"processing",date:"Jun 5"},
          {id:"#1039",customer:"Sunita Patel", items:"Pearl Earrings × 1",amount:2200,status:"delivered", date:"Jun 4"},
        ]);
        setLoading(false);
      });
  },[]);
  const STATUS_COLORS={new:{bg:"#1e3a5f22",color:"#60a5fa"},processing:{bg:"#78350f22",color:"#f59e0b"},shipped:{bg:"#14532d22",color:"#22c55e"},delivered:{bg:"#14532d44",color:"#86efac"},cancelled:{bg:"#7f1d1d22",color:"#ef4444"}};
  const filtered=filter==="all"?orders:orders.filter(o=>o.status===filter);
  const updateStatus=async(id,status)=>{
    try{await supabaseQuery(`orders?id=eq.${id}`,"PATCH",{status});}catch{}
    setOrders(prev=>prev.map(o=>(o.id===id||o._id===id)?{...o,status}:o));
    showToast("Order updated");
  };
  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {["all","new","processing","shipped","delivered","cancelled"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            style={{padding:"7px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",fontFamily:"inherit",background:filter===s?"linear-gradient(135deg,#b07a5a,#c4956a)":"#1a1a1e",color:filter===s?"#fff":"#666"}}>
            {s==="all"?`All (${orders.length})`:s}
          </button>
        ))}
      </div>
      <div style={{...S.card,padding:0,overflow:"hidden"}}>
        {loading?<p style={{padding:40,textAlign:"center",color:"#555",fontStyle:"italic"}}>Loading orders…</p>:(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead><tr style={{background:"#0d0d0f"}}>
                {["Order","Date","Customer","Items","Amount","Status","Update"].map(h=>(
                  <th key={h} style={{fontSize:10,color:"#555",fontWeight:700,textAlign:"left",padding:"10px 14px",borderBottom:"1px solid #1e1e22",textTransform:"uppercase",letterSpacing:"0.8px",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(o=>{
                  const sc=STATUS_COLORS[o.status]||STATUS_COLORS.new;
                  return(
                    <tr key={o.id||o._id} className="rfo-tr" style={{borderBottom:"1px solid #1e1e22"}}>
                      <td style={{padding:"10px 14px",fontSize:13,color:"#b07a5a",fontWeight:600}}>{o.id||o._id}</td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#555"}}>{o.date||o.created_at?.slice(0,10)}</td>
                      <td style={{padding:"10px 14px",fontSize:13,color:"#f5f0eb"}}>{o.customer||o.customer_name}</td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#777"}}>{o.items}</td>
                      <td style={{padding:"10px 14px",fontSize:13,color:"#f5f0eb",fontWeight:500}}>{formatINR(o.amount)}</td>
                      <td style={{padding:"10px 14px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:sc.bg,color:sc.color}}>{o.status}</span></td>
                      <td style={{padding:"10px 14px"}}>
                        <select value={o.status} onChange={e=>updateStatus(o.id||o._id,e.target.value)} style={{...S.input,width:"auto",padding:"5px 8px",fontSize:12}}>
                          {["new","processing","shipped","delivered","cancelled"].map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length===0&&<p style={{padding:30,textAlign:"center",color:"#555",fontSize:13}}>No orders found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
