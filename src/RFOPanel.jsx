import React, { useState, useEffect, useRef, useCallback } from "react";

// ── Config ────────────────────────────────────
const SUPABASE_URL = "https://ajqqaeejotlghgilgajy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcXFhZWVqb3RsZ2hnaWxnYWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjU2MTUsImV4cCI6MjA5NTY0MTYxNX0.fZ1MmCpMiQnwu7HsaK3zP4HXjxrLK6JseEZSUvIkreY";
const SUPABASE_TABLE = "products";
const USD_TO_INR = 83.5;
const API = "https://rayfinesite-3.onrender.com/api";
const ADMIN_PASSWORD = "rayfine@20";

// ── Supabase helper ───────────────────────────
async function supabaseQuery(path, method = "GET", body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  return res.json().catch(() => null);
}

function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

// ── Etsy CSV helpers (same logic, reused) ────
const TAG_TO_CATEGORY = {
  earring:"Earring",jhumka:"Earring",stud_earring:"Earring",dangle_earring:"Earring",ear_stud:"Earring",hoop:"Earring",chandbali:"Earring",
  necklace:"Necklace",choker:"Necklace",locket:"Necklace",pendant:"Pendants",pendent:"Pendants",haar:"Necklace",
  anklet:"Anklet",payal:"Anklet",
  bangle:"Bangles",bangle_set:"Bangles",kangan:"Bangles",
  bracelet:"Bracelet",kada:"Bracelet",
  ring:"Ring",adjustable_ring:"Ring",
  gemstone:"Gemstone Charm",charm:"Gemstone Charm",
};
const TAG_TO_OCCASION = {
  bridal:"Bridal",wedding:"Bridal",bride:"Bridal",
  festive:"Festive",diwali:"Festive",navratri:"Festive",eid:"Festive",festival:"Festive",
  gift:"Gifting",gifting:"Gifting",gift_for_her:"Gifting",return_gift:"Gifting",
  party:"Party",party_wear:"Party",
  everyday:"Everyday",daily_wear:"Everyday",office:"Everyday",
  vacation:"Vacation",travel:"Vacation",boho:"Vacation",
  traditional:"Traditional",ethnic:"Traditional",saree:"Traditional",
};
const BESTSELLER_TAGS=["bestseller","best_seller","popular","top_seller","most_loved"];
const TRENDING_TAGS=["trending","new_arrival","new_launch","viral","hot"];
const NEW_TAGS=["new","new_arrival","new_launch","just_arrived","newly_listed"];

function detectFromTags(tagsStr=""){
  const tags=tagsStr.toLowerCase().replace(/\s/g,"_").split(",").map(t=>t.trim());
  let category="",occasion="",isBestseller=false,isTrending=false,isNew=false;
  for(const tag of tags){
    if(!category)for(const[k,v]of Object.entries(TAG_TO_CATEGORY)){if(tag.includes(k)){category=v;break;}}
    if(!occasion)for(const[k,v]of Object.entries(TAG_TO_OCCASION)){if(tag.includes(k)){occasion=v;break;}}
    if(!isBestseller&&BESTSELLER_TAGS.some(k=>tag.includes(k)))isBestseller=true;
    if(!isTrending&&TRENDING_TAGS.some(k=>tag.includes(k)))isTrending=true;
    if(!isNew&&NEW_TAGS.some(k=>tag.includes(k)))isNew=true;
  }
  return{category,occasion,isBestseller,isTrending,isNew};
}
function guessCategoryFromTitle(title=""){
  const t=title.toLowerCase();
  if(t.includes("earring")||t.includes("jhumka")||t.includes("stud")||t.includes("chandbali"))return"Earring";
  if(t.includes("necklace")||t.includes("haar")||t.includes("choker"))return"Necklace";
  if(t.includes("bracelet")||t.includes("kada"))return"Bracelet";
  if(t.includes("bangle"))return"Bangles";
  if(t.includes("ring"))return"Ring";
  if(t.includes("anklet")||t.includes("payal"))return"Anklet";
  if(t.includes("pendant")||t.includes("pendent")||t.includes("locket"))return"Pendants";
  return"Earring";
}
function isEtsyCSV(headers){return headers.some(h=>h.toUpperCase()==="TITLE");}
function convertEtsyRow(row,i){
  const title=(row.TITLE||row.title||"").trim();
  const desc=(row.DESCRIPTION||row.description||"").replace(/\n/g," ").trim();
  const priceUSD=parseFloat(row.PRICE||row.price)||0;
  const qty=parseInt(row.QUANTITY||row.quantity)||0;
  const tags=row.TAGS||row.tags||"";
  const materials=row.MATERIALS||row.materials||"";
  const image=(row.IMAGE1||row.image1||"").trim();
  const{category,occasion,isBestseller,isTrending,isNew}=detectFromTags(tags);
  return{name:title,description:desc.slice(0,500),price:Math.round(priceUSD*USD_TO_INR),originalPrice:null,category:category||guessCategoryFromTitle(title),occasion:occasion||"Festive",stock:qty,inStock:qty>0,material:materials,image,isBestseller,isTrending,isNew,onSale:false,_rowNum:i+2,_source:"etsy"};
}
function convertRFORow(row,i){
  return{...row,_rowNum:i+2,price:Number(row.price)||0,originalPrice:Number(row.originalPrice)||null,stock:Number(row.stock)||0,inStock:Number(row.stock)>0,isBestseller:row.isBestseller==="true"||row.isBestseller==="1",isTrending:row.isTrending==="true"||row.isTrending==="1",isNew:row.isNew==="true"||row.isNew==="1",onSale:row.onSale==="true"||row.onSale==="1"};
}
function parseCSV(text){
  const lines=[];let cur="",inQ=false;
  for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){inQ=!inQ;cur+=ch;}else if(ch==="\n"&&!inQ){lines.push(cur);cur="";}else cur+=ch;}
  if(cur)lines.push(cur);
  const parseRow=(line)=>{const vals=[];let field="",inQF=false;for(const ch of line){if(ch==='"')inQF=!inQF;else if(ch===","&&!inQF){vals.push(field.replace(/^"|"$/g,"").trim());field="";}else field+=ch;}vals.push(field.replace(/^"|"$/g,"").trim());return vals;};
  const headers=parseRow(lines[0]).map(h=>h.replace(/^"|"$/g,"").trim());
  const rows=lines.slice(1).filter(l=>l.trim()).map((line,i)=>{const vals=parseRow(line),obj={};headers.forEach((h,idx)=>{obj[h]=(vals[idx]||"").replace(/^"|"$/g,"").trim();});return obj;});
  return{headers,rows};
}

const CATEGORIES=["Earring","Necklace","Anklet","Gemstone Charm","Bangles","Bracelet","Pendants","Ring"];
const OCCASIONS=["Festive","Gifting","Bridal","Everyday","Vacation","Party","Traditional"];

const CAT_COLORS={
  Earring:"#d4a574",Necklace:"#b07a5a",Bangles:"#c4956a",Bracelet:"#8fac88",
  Ring:"#9b8bb5",Anklet:"#7fb3c8",Pendants:"#c47a8a","Gemstone Charm":"#6bb5a0"
};

const NAV=[
  {id:"dashboard",icon:"◈",label:"Dashboard"},
  {id:"products",icon:"✦",label:"Products"},
  {id:"add",icon:"＋",label:"Add Product"},
  {id:"bulk",icon:"⊞",label:"Bulk Upload"},
  {id:"orders",icon:"◻",label:"Orders"},
];

// ── Toast ─────────────────────────────────────
function Toast({msg,type,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,3200);return()=>clearTimeout(t);},[onDone]);
  return(
    <div style={{position:"fixed",bottom:24,right:24,left:24,maxWidth:360,margin:"0 auto",zIndex:99999,background:type==="error"?"#3d1515":"#1a2e1a",color:"#f5f0eb",padding:"14px 18px",borderRadius:12,fontSize:13,fontWeight:500,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",display:"flex",alignItems:"center",gap:10,fontFamily:"'DM Sans',sans-serif",borderLeft:`3px solid ${type==="error"?"#e07070":"#7dba7d"}`,animation:"slideUp .3s ease"}}>
      <span style={{fontSize:15}}>{type==="error"?"✕":"✓"}</span>{msg}
    </div>
  );
}

// ── Main App ──────────────────────────────────
export default function RFOAdmin(){
  const[authed,setAuthed]=useState(()=>sessionStorage.getItem("rfo_auth")==="yes");
  const[pw,setPw]=useState("");
  const[pwErr,setPwErr]=useState("");
  const[page,setPage]=useState("dashboard");
  const[products,setProducts]=useState([]);
  const[loading,setLoading]=useState(true);
  const[toast,setToast]=useState(null);
  const[menuOpen,setMenuOpen]=useState(false);
  const showToast=useCallback((msg,type="success")=>setToast({msg,type}),[]);

  useEffect(()=>{
    if(!authed)return;
    setLoading(true);
    fetch(`${API}/products`)
      .then(r=>r.json())
      .then(data=>{
        const list=Array.isArray(data?.data)?data.data:[];
        setProducts(list.map(p=>({...p,id:p._id||p.id,image:p.image?.replace(/^http:\/\//i,"https://")?.split(",")[0]?.trim()})));
        setLoading(false);
      })
      .catch(()=>{setLoading(false);showToast("Could not load products","error");});
  },[authed,showToast]);

  const tryLogin=()=>{
    if(pw===ADMIN_PASSWORD){sessionStorage.setItem("rfo_auth","yes");setAuthed(true);}
    else setPwErr("Incorrect password");
  };

  if(!authed){
    return(
      <div style={{minHeight:"100svh",background:"#faf7f4",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
          @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          *{box-sizing:border-box;margin:0;padding:0;}
        `}</style>
        <div style={{background:"#fff",borderRadius:20,padding:"48px 40px",maxWidth:380,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.08)",border:"1px solid #ede8e3",animation:"slideUp .5s ease"}}>
          <div style={{marginBottom:24}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#d4a574,#b07a5a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px"}}>✦</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:400,color:"#2d2018",marginBottom:4}}>Ray Fine Ornates</h1>
            <p style={{fontSize:11,color:"#b8a898",letterSpacing:"2.5px",textTransform:"uppercase"}}>Admin Panel</p>
          </div>
          <input type="password" placeholder="Enter admin password" value={pw}
            onChange={e=>{setPw(e.target.value);setPwErr("");}}
            onKeyDown={e=>e.key==="Enter"&&tryLogin()}
            style={{width:"100%",padding:"13px 16px",border:"1.5px solid #e8e0d8",borderRadius:10,fontSize:14,fontFamily:"inherit",color:"#2d2018",outline:"none",background:"#faf7f4",marginBottom:8,transition:"border .2s"}}
            onFocus={e=>e.target.style.borderColor="#d4a574"}
            onBlur={e=>e.target.style.borderColor="#e8e0d8"}
          />
          {pwErr&&<p style={{color:"#d46060",fontSize:12,marginBottom:10}}>{pwErr}</p>}
          <button onClick={tryLogin}
            style={{width:"100%",padding:14,background:"linear-gradient(135deg,#d4a574,#b07a5a)",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,letterSpacing:"1px",cursor:"pointer",fontFamily:"inherit"}}>
            Sign In →
          </button>
          <p style={{marginTop:18,fontSize:11,color:"#c8b8a8"}}>Ray Fine Ornates · Jewellery</p>
        </div>
      </div>
    );
  }

  const isMobile=typeof window!=="undefined"&&window.innerWidth<768;

  return(
    <div style={{minHeight:"100svh",background:"#faf7f4",fontFamily:"'DM Sans',sans-serif"}}>
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

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #ede8e3",zIndex:1000,padding:"6px 0 env(safe-area-inset-bottom)",justifyContent:"space-around"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 8px",cursor:"pointer",color:page===n.id?"#b07a5a":"#b8a898",flex:1}}>
            <span style={{fontSize:18}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>{n.label}</span>
          </button>
        ))}
      </nav>

      <div style={{display:"flex",height:"100svh",overflow:"hidden"}}>
        {/* DESKTOP SIDEBAR */}
        <aside className="sidebar-desktop" style={{width:220,background:"#fff",borderRight:"1px solid #ede8e3",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"22px 20px 16px",borderBottom:"1px solid #f0ebe5"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#d4a574,#b07a5a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✦</div>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#2d2018",fontWeight:400}}>Ray Fine Ornates</div>
                <div style={{fontSize:9,color:"#c8b8a8",letterSpacing:"1.5px",textTransform:"uppercase"}}>Admin</div>
              </div>
            </div>
          </div>
          <nav style={{flex:1,padding:"10px 0"}}>
            {NAV.map(n=>(
              <div key={n.id} className={`am-nav ${page===n.id?"active":""}`}
                onClick={()=>setPage(n.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"11px 20px",cursor:"pointer",transition:"all .15s",color:page===n.id?"#b07a5a":"#8a7a6e",fontSize:13,borderRight:page===n.id?"3px solid #b07a5a":"3px solid transparent",fontWeight:page===n.id?600:400}}>
                <span style={{fontSize:15,flexShrink:0}}>{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </nav>
          <div style={{padding:"12px 20px",borderTop:"1px solid #f0ebe5"}}>
            <button onClick={()=>{sessionStorage.removeItem("rfo_auth");setAuthed(false);}}
              style={{width:"100%",padding:"9px",borderRadius:8,border:"1px solid #e8e0d8",background:"none",cursor:"pointer",fontSize:12,color:"#b8a898",fontFamily:"inherit"}}>
              Sign out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* TOPBAR */}
          <header style={{background:"#fff",borderBottom:"1px solid #ede8e3",padding:"0 20px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {/* mobile logo */}
              <div className="mobile-topbar-hamburger" style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#d4a574,#b07a5a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✦</div>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"#2d2018"}}>Ray Fine Ornates</span>
              </div>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:400,color:"#2d2018"}}>{NAV.find(n=>n.id===page)?.label}</h2>
            </div>
            <div className="topbar-actions" style={{display:"flex",gap:8}}>
              <button onClick={()=>setPage("add")} className="am-btn-pri" style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:"0.8px",fontFamily:"inherit"}}>+ Add Product</button>
              <button onClick={()=>setPage("bulk")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #e8e0d8",background:"none",cursor:"pointer",fontSize:11,color:"#8a7a6e",fontFamily:"inherit"}}>⊞ Bulk Upload</button>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="main-content" style={{flex:1,overflowY:"auto",padding:"20px",paddingBottom:80}}>
            {page==="dashboard"&&<DashboardPage products={products} loading={loading} setPage={setPage}/>}
            {page==="products"&&<ProductsPage products={products} loading={loading} showToast={showToast} setProducts={setProducts}/>}
            {page==="add"&&<AddProductPage showToast={showToast} onSave={p=>{setProducts(prev=>[p,...prev]);showToast("Product saved!");setPage("products");}}/>}
            {page==="bulk"&&<BulkImportPage showToast={showToast} onImport={list=>{setProducts(prev=>[...list,...prev]);showToast(`${list.length} products imported!`);setPage("products");}}/>}
            {page==="orders"&&<OrdersPage showToast={showToast}/>}
          </main>
        </div>
      </div>

      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────
function DashboardPage({products,loading,setPage}){
  const inStock=products.filter(p=>p.inStock&&(p.stock||0)>5).length;
  const lowStock=products.filter(p=>p.inStock&&(p.stock||0)<=5&&(p.stock||0)>0).length;
  const outOfStock=products.filter(p=>!p.inStock||(p.stock||0)===0).length;
  const onSale=products.filter(p=>p.onSale||p.originalPrice).length;
  const catCounts={};products.forEach(p=>{const k=p.category||"Other";catCounts[k]=(catCounts[k]||0)+1;});
  const catArr=Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,7);
  const maxCat=catArr[0]?.[1]||1;
  const stats=[
    {label:"Total Products",val:loading?"…":products.length,color:"#d4a574",icon:"✦"},
    {label:"In Stock",val:loading?"…":inStock,color:"#7dba7d",icon:"✓"},
    {label:"Low / Out of Stock",val:loading?"…":lowStock+outOfStock,color:"#e07070",icon:"!"},
    {label:"On Sale",val:loading?"…":onSale,color:"#b07a5a",icon:"🏷"},
  ];
  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div className="grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {stats.map(s=>(
          <div key={s.label} className="am-card" style={{padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <span style={{fontSize:11,color:"#b8a898",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.6px"}}>{s.label}</span>
              <span style={{width:28,height:28,borderRadius:"50%",background:`${s.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:s.color,flexShrink:0}}>{s.icon}</span>
            </div>
            <div style={{fontSize:32,fontFamily:"'Playfair Display',serif",color:"#2d2018",fontWeight:400}}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div className="am-card">
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:400,color:"#2d2018",marginBottom:16}}>By Category</h3>
          {loading?<p style={{color:"#c8b8a8",fontSize:13,textAlign:"center",padding:20}}>Loading…</p>
            :catArr.map(([cat,cnt])=>(
              <div key={cat} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                  <span style={{color:"#5a4a3e"}}>{cat}</span>
                  <span style={{color:"#c8b8a8",fontWeight:600}}>{cnt}</span>
                </div>
                <div style={{height:5,background:"#f0ebe5",borderRadius:4}}>
                  <div style={{height:"100%",background:`linear-gradient(90deg,${CAT_COLORS[cat]||"#d4a574"},${CAT_COLORS[cat]||"#b07a5a"})`,width:`${(cnt/maxCat)*100}%`,borderRadius:4,transition:"width .6s"}}/>
                </div>
              </div>
            ))
          }
        </div>
        <div className="am-card">
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:400,color:"#2d2018",marginBottom:16}}>Quick Actions</h3>
          {[{label:"Add new product",icon:"＋",desc:"Single product entry",id:"add"},{label:"Bulk CSV upload",icon:"⊞",desc:"Import Etsy or custom CSV",id:"bulk"},{label:"View all products",icon:"✦",desc:"Browse & manage catalogue",id:"products"}].map(a=>(
            <button key={a.id} onClick={()=>setPage(a.id)}
              style={{width:"100%",padding:"13px 14px",background:"#faf7f4",border:"1px solid #ede8e3",borderRadius:10,cursor:"pointer",textAlign:"left",marginBottom:8,display:"flex",alignItems:"center",gap:12,fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#d4a574"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#ede8e3"}>
              <span style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#d4a574,#b07a5a)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,flexShrink:0}}>{a.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#2d2018"}}>{a.label}</div>
                <div style={{fontSize:11,color:"#b8a898"}}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Products Page ─────────────────────────────
function ProductsPage({products,loading,showToast,setProducts}){
  const[search,setSearch]=useState("");
  const[catF,setCatF]=useState("All");
  const filtered=products.filter(p=>{
    const q=search.toLowerCase();
    return(!q||p.name?.toLowerCase().includes(q)||p.category?.toLowerCase().includes(q))
      &&(catF==="All"||p.category?.toLowerCase()===catF.toLowerCase());
  });
  const del=async(id)=>{
    if(!window.confirm("Delete this product?"))return;
    try{await supabaseQuery(`${SUPABASE_TABLE}?id=eq.${id}`,"DELETE");}catch{}
    setProducts(prev=>prev.filter(p=>p.id!==id));
    showToast("Product deleted");
  };
  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <input className="am-inp" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:180,padding:"10px 14px",border:"1.5px solid #e8e0d8",borderRadius:10,fontSize:13,background:"#fff",color:"#2d2018"}}/>
        <select className="am-inp" value={catF} onChange={e=>setCatF(e.target.value)}
          style={{padding:"10px 12px",border:"1.5px solid #e8e0d8",borderRadius:10,fontSize:13,background:"#fff",color:"#2d2018",minWidth:140}}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{alignSelf:"center",fontSize:12,color:"#c8b8a8",whiteSpace:"nowrap"}}>{filtered.length} items</span>
      </div>
      <div className="am-card table-wrap" style={{padding:0,overflow:"hidden"}}>
        {loading?<p style={{padding:40,textAlign:"center",color:"#c8b8a8",fontFamily:"'Playfair Display',serif",fontSize:16,fontStyle:"italic"}}>Loading collection…</p>:(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
              <thead><tr style={{background:"#faf7f4"}}>
                {["Image","Product","Category","Price","Stock","Status",""].map(h=>(
                  <th key={h} style={{fontSize:10,color:"#c8b8a8",fontWeight:700,textAlign:"left",padding:"10px 14px",borderBottom:"1px solid #ede8e3",textTransform:"uppercase",letterSpacing:"0.8px",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(p=>(
                  <tr key={p.id} className="am-tr" style={{borderBottom:"1px solid #f5f0ea"}}>
                    <td style={{padding:"10px 14px"}}>
                      <img src={p.image} alt={p.name} style={{width:44,height:44,objectFit:"cover",borderRadius:8,border:"1px solid #ede8e3",background:"#f5f0ea"}} onError={e=>{e.target.src="https://placehold.co/44x44/f5f0ea/c8b8a8?text=✦"}}/>
                    </td>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:"#2d2018"}}>{p.name}</div>
                      {p.material&&<div style={{fontSize:11,color:"#c8b8a8",marginTop:1}}>{p.material}</div>}
                    </td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:`${CAT_COLORS[p.category]||"#d4a574"}18`,color:CAT_COLORS[p.category]||"#d4a574"}}>{p.category}</span>
                    </td>
                    <td style={{padding:"10px 14px",fontSize:13,color:"#2d2018",fontWeight:600,whiteSpace:"nowrap"}}>
                      {formatINR(p.price)}
                      {p.originalPrice&&<div style={{fontSize:10,color:"#c8b8a8",textDecoration:"line-through"}}>{formatINR(p.originalPrice)}</div>}
                    </td>
                    <td style={{padding:"10px 14px",fontSize:13,color:"#5a4a3e"}}>{p.stock||0}</td>
                    <td style={{padding:"10px 14px"}}>
                      {p.inStock&&(p.stock||0)>5
                        ?<span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:"#e8f5e8",color:"#4a8f4a"}}>In Stock</span>
                        :p.inStock&&(p.stock||0)>0
                        ?<span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:"#fdf3e3",color:"#c47a2a"}}>Low</span>
                        :<span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:"#fde8e8",color:"#c44a4a"}}>Out</span>}
                    </td>
                    <td style={{padding:"10px 14px"}}>
                      <button onClick={()=>del(p.id)} style={{padding:"5px 12px",border:"1px solid #e8d8d8",borderRadius:6,background:"none",cursor:"pointer",fontSize:11,color:"#c44a4a",fontFamily:"inherit"}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0&&<p style={{padding:30,textAlign:"center",color:"#c8b8a8",fontSize:13}}>No products found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Product Page ──────────────────────────
function AddProductPage({showToast,onSave}){
  const blank={name:"",price:"",originalPrice:"",category:"",occasion:"",stock:"",material:"",description:"",image:"",variants:"",inStock:true,isBestseller:false,isTrending:false,isNew:false,onSale:false};
  const[form,setForm]=useState(blank);
  const[errors,setErrors]=useState({});
  const[saving,setSaving]=useState(false);
  const[preview,setPreview]=useState(null);
  const[imageFile,setImageFile]=useState(null);
  const fileInputRef=useRef();

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const handleImageFile=async(file)=>{
    if(!file)return;
    console.log("File selected:", file.name, "Size:", file.size);
    
    // Check file size (max 5MB)
    if(file.size>5*1024*1024){
      showToast("Image too large (max 5MB)","error");
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader=new FileReader();
    reader.onload=(e)=>{
      const base64=e.target.result;
      setPreview(base64);
      set("image",base64);
      console.log("Image converted to base64, length:", base64.length);
    };
    reader.readAsDataURL(file);
  };

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(!form.price)e.price="Required";
    if(!form.category)e.category="Required";
    if(!form.image)e.image="Image required";
    setErrors(e);
    return!Object.keys(e).length;
  };

  const testSupabase=async()=>{
    try{
      console.log("Testing Supabase connection...");
      console.log("SUPABASE_URL:", SUPABASE_URL);
      console.log("SUPABASE_TABLE:", SUPABASE_TABLE);
      
      const res=await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?limit=1`, {
        method:"GET",
        headers:{
          apikey:SUPABASE_ANON_KEY,
          Authorization:`Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      
      console.log("Supabase response status:", res.status);
      const data=await res.json();
      console.log("Supabase response:", data);
      
      if(res.ok){
        showToast("✓ Supabase connected!","success");
        return true;
      }else{
        showToast(`✗ Supabase error: ${res.status}`,"error");
        console.error("Error:", data);
        return false;
      }
    }catch(err){
      console.error("Connection error:", err);
      showToast(`Connection error: ${err.message}`,"error");
      return false;
    }
  };

  const save=async()=>{
    if(!validate())return;
    
    // Check Supabase first
    const connected=await testSupabase();
    if(!connected)return;
    
    setSaving(true);
    const product={
      ...form,
      price:Number(form.price),
      originalPrice:Number(form.originalPrice)||null,
      stock:Number(form.stock)||0,
      variants:form.variants?form.variants.split(",").map(v=>v.trim()):[]
    };
    
    try{
      console.log("Sending product to Supabase...");
      const res=await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
        method:"POST",
        headers:{
          apikey:SUPABASE_ANON_KEY,
          Authorization:`Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type":"application/json",
          Prefer:"return=representation"
        },
        body:JSON.stringify([product])
      });
      
      console.log("Save response status:", res.status);
      const savedData=await res.json();
      console.log("Saved data:", savedData);
      
      if(!res.ok){
        throw new Error(`${res.status}: ${JSON.stringify(savedData)}`);
      }
      
      const saved=savedData[0];
      showToast("✓ Product saved!");
      onSave({...product,id:saved?.id||Date.now()});
      setSaving(false);
    }catch(err){
      console.error("Save error:", err);
      showToast(`Save failed: ${err.message}`,"error");
      setSaving(false);
    }
  };

  const inp=(label,key,props={})=>(
    <div>
      <label style={{fontSize:11,fontWeight:700,color:"#b8a898",textTransform:"uppercase",letterSpacing:"0.8px",display:"block",marginBottom:5}}>
        {label}
        {errors[key]&&<span style={{color:"#e07070",marginLeft:6,fontWeight:400}}>{errors[key]}</span>}
      </label>
      <input className="am-inp" {...props} value={form[key]} onChange={e=>set(key,e.target.value)}
        style={{width:"100%",padding:"11px 13px",border:`1.5px solid ${errors[key]?"#e07070":"#e8e0d8"}`,borderRadius:10,fontSize:13,background:"#faf7f4",color:"#2d2018",...(props.style||{})}}/>
    </div>
  );

  return(
    <div style={{maxWidth:800,margin:"0 auto",animation:"fadeIn .3s ease"}}>
      <div className="am-card">
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:400,color:"#2d2018",marginBottom:20}}>Add New Product</h3>
        
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {inp("Product Name","name",{placeholder:"e.g. Kundan Jhumka Set"})}
          {inp("Price (₹)","price",{type:"number",placeholder:"1499"})}
          {inp("Original Price (₹)","originalPrice",{type:"number",placeholder:"Leave blank if no discount"})}
          {inp("Stock Quantity","stock",{type:"number",placeholder:"0"})}
          
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#b8a898",textTransform:"uppercase",letterSpacing:"0.8px",display:"block",marginBottom:5}}>
              Category
              {errors.category&&<span style={{color:"#e07070",marginLeft:6,fontWeight:400}}>{errors.category}</span>}
            </label>
            <select className="am-inp" value={form.category} onChange={e=>set("category",e.target.value)}
              style={{width:"100%",padding:"11px 13px",border:`1.5px solid ${errors.category?"#e07070":"#e8e0d8"}`,borderRadius:10,fontSize:13,background:"#faf7f4",color:"#2d2018"}}>
              <option value="">Select category</option>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#b8a898",textTransform:"uppercase",letterSpacing:"0.8px",display:"block",marginBottom:5}}>Occasion</label>
            <select className="am-inp" value={form.occasion} onChange={e=>set("occasion",e.target.value)}
              style={{width:"100%",padding:"11px 13px",border:"1.5px solid #e8e0d8",borderRadius:10,fontSize:13,background:"#faf7f4",color:"#2d2018"}}>
              <option value="">Select occasion</option>
              {OCCASIONS.map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          
          {inp("Material","material",{placeholder:"e.g. Gold plated, Pearl"})}
          {inp("Variants (comma separated)","variants",{placeholder:"Gold, Silver, Rose Gold"})}
        </div>

        {/* IMAGE UPLOAD */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:700,color:"#b8a898",textTransform:"uppercase",letterSpacing:"0.8px",display:"block",marginBottom:8}}>
            Product Image
            {errors.image&&<span style={{color:"#e07070",marginLeft:6,fontWeight:400}}>{errors.image}</span>}
          </label>
          <div
            onClick={()=>fileInputRef.current?.click()}
            style={{border:"2px dashed #e8e0d8",borderRadius:10,padding:"24px 16px",textAlign:"center",cursor:"pointer",background:"#faf7f4",transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#d4a574"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#e8e0d8"}>
            <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImageFile(e.target.files[0])}/>
            <div style={{fontSize:32,marginBottom:8}}>📸</div>
            <p style={{fontSize:13,color:"#5a4a3e",marginBottom:4}}>Click to select image or drag & drop</p>
            <p style={{fontSize:11,color:"#b8a898"}}>JPG, PNG, WebP (max 5MB)</p>
            {imageFile&&<p style={{fontSize:12,color:"#4a8f4a",marginTop:8,fontWeight:600}}>✓ {imageFile.name}</p>}
          </div>
          {preview&&<img src={preview} alt="Preview" style={{width:100,height:100,objectFit:"cover",borderRadius:10,border:"1px solid #ede8e3",marginTop:12}} onError={()=>setPreview(null)}/>}
        </div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:700,color:"#b8a898",textTransform:"uppercase",letterSpacing:"0.8px",display:"block",marginBottom:5}}>Description</label>
          <textarea className="am-inp" rows={3} placeholder="Describe the product…" value={form.description} onChange={e=>set("description",e.target.value)}
            style={{width:"100%",padding:"11px 13px",border:"1.5px solid #e8e0d8",borderRadius:10,fontSize:13,background:"#faf7f4",color:"#2d2018",resize:"vertical"}}/>
        </div>

        <div style={{marginBottom:14}}>
          {inp("Care Instructions","careInstructions",{placeholder:"e.g. Avoid water, store in dry pouch"})}
        </div>

        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,fontWeight:700,color:"#b8a898",textTransform:"uppercase",letterSpacing:"0.8px",display:"block",marginBottom:8}}>Tags</label>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {[["isBestseller","⭐ Bestseller"],["isTrending","🔥 Trending"],["isNew","✨ New"],["onSale","🏷 On Sale"],["inStock","📦 In Stock"]].map(([k,lbl])=>(
              <label key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",color:"#5a4a3e"}}>
                <input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} style={{accentColor:"#d4a574",width:15,height:15}}/>{lbl}
              </label>
            ))}
          </div>
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button onClick={save} disabled={saving} className="am-btn-pri" style={{padding:"12px 24px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,letterSpacing:"0.8px",fontFamily:"inherit"}}>
            {saving?"Saving…":"Save Product →"}
          </button>
          <button onClick={()=>{setForm(blank);setPreview(null);setImageFile(null);setErrors({});}} style={{padding:"12px 20px",borderRadius:10,border:"1px solid #e8e0d8",background:"none",cursor:"pointer",fontSize:12,color:"#b8a898",fontFamily:"inherit"}}>Clear</button>
          <button onClick={testSupabase} style={{padding:"12px 20px",borderRadius:10,border:"1px solid #d4a574",background:"#d4a574",color:"#fff",cursor:"pointer",fontSize:12,color:"#fff",fontFamily:"inherit",fontWeight:600}}>🔗 Test DB</button>
        </div>
      </div>
    </div>
  );
}

// ── Bulk Import Page ──────────────────────────
function BulkImportPage({showToast,onImport}){
  const fileRef=useRef();
  const[preview,setPreview]=useState([]);
  const[dragging,setDragging]=useState(false);
  const[importing,setImporting]=useState(false);
  const[progress,setProgress]=useState(0);
  const[errors,setErrors]=useState([]);
  const[mode,setMode]=useState(null);
  const[overrideCat,setOverrideCat]=useState("");
  const[overrideOcc,setOverrideOcc]=useState("");
  const[flagBest,setFlagBest]=useState(false);
  const[flagTrend,setFlagTrend]=useState(false);
  const[flagNew,setFlagNew]=useState(false);
  const[usdRate,setUsdRate]=useState(83.5);

  const handleFile=(f)=>{
    if(!f)return;
    if(!f.name.endsWith(".csv")){showToast("Only .csv files please","error");return;}
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
        showToast(`${parsed.length} rows parsed (${etsy?"Etsy CSV":"RFO format"})${rowErrors.length?`, ${rowErrors.length} warnings`:" — ready!"}`);
      }catch(err){showToast("CSV parse error: "+err.message,"error");}
    };
    reader.readAsText(f);
  };

  const getReadyRows=()=>preview.map(({_rowNum,_source,...row})=>({
    ...row,
    price:mode==="etsy"?Math.round(row.price*(usdRate/USD_TO_INR)):row.price,
    category:overrideCat||row.category,
    occasion:overrideOcc||row.occasion,
    isBestseller:flagBest||row.isBestseller,
    isTrending:flagTrend||row.isTrending,
    isNew:flagNew||row.isNew,
  }));

  const doImport=async()=>{
    if(!preview.length)return;
    setImporting(true);setProgress(0);
    const rows=getReadyRows(),BATCH=50,ok=[],fail=[];
    for(let i=0;i<rows.length;i+=BATCH){
      const batch=rows.slice(i,i+BATCH);
      try{await supabaseQuery(SUPABASE_TABLE,"POST",batch);ok.push(...batch);}
      catch{for(const row of batch){try{await supabaseQuery(SUPABASE_TABLE,"POST",[row]);ok.push(row);}catch{fail.push(row.name||"unknown");}}}
      setProgress(Math.min(100,Math.round(((i+BATCH)/rows.length)*100)));
    }
    setImporting(false);
    if(fail.length)showToast(`${ok.length} imported, ${fail.length} failed`,"error");
    else onImport(ok);
  };

  return(
    <div style={{maxWidth:920,margin:"0 auto",animation:"fadeIn .3s ease"}}>
      <div className="am-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:20}}>
          <div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:400,color:"#2d2018",marginBottom:4}}>Bulk Upload</h3>
            <p style={{fontSize:12,color:"#b8a898"}}>Drop an Etsy CSV or RFO-format CSV — categories, occasions and flags auto-map.</p>
          </div>
          {mode&&<span style={{fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:20,background:mode==="etsy"?"#e8f0fd":"#e8f5e8",color:mode==="etsy"?"#5a7fc4":"#4a8f4a",letterSpacing:"0.8px",textTransform:"uppercase",border:`1px solid ${mode==="etsy"?"#c4d4f0":"#b0d4b0"}`}}>{mode==="etsy"?"🛍 Etsy CSV":"✓ RFO CSV"}</span>}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
          onClick={()=>fileRef.current?.click()}
          style={{border:`2px dashed ${dragging?"#d4a574":"#e8e0d8"}`,borderRadius:14,padding:"36px 20px",textAlign:"center",cursor:"pointer",background:dragging?"#fdf5ee":"#faf7f4",transition:"all .2s",marginBottom:20}}>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          <div style={{fontSize:40,marginBottom:10}}>📄</div>
          <p style={{fontSize:14,color:"#8a7a6e"}}>Drop your CSV here or <strong style={{color:"#d4a574"}}>tap to browse</strong></p>
          <p style={{fontSize:11,color:"#c8b8a8",marginTop:6}}>Etsy: TITLE, PRICE, TAGS, IMAGE1 auto-mapped · USD → INR auto-converted</p>
        </div>

        {/* Overrides */}
        {preview.length>0&&(
          <div style={{background:"#faf7f4",border:"1px solid #ede8e3",borderRadius:12,padding:"16px",marginBottom:16}}>
            <p style={{fontSize:11,fontWeight:700,color:"#d4a574",letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>⚙ Bulk Overrides</p>
            <div className="grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
              <div>
                <label style={{fontSize:11,color:"#b8a898",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",display:"block",marginBottom:4}}>Category</label>
                <select className="am-inp" value={overrideCat} onChange={e=>setOverrideCat(e.target.value)} style={{width:"100%",padding:"9px 10px",border:"1.5px solid #e8e0d8",borderRadius:8,fontSize:12,background:"#fff",color:"#2d2018"}}>
                  <option value="">Auto-detect</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,color:"#b8a898",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",display:"block",marginBottom:4}}>Occasion</label>
                <select className="am-inp" value={overrideOcc} onChange={e=>setOverrideOcc(e.target.value)} style={{width:"100%",padding:"9px 10px",border:"1.5px solid #e8e0d8",borderRadius:8,fontSize:12,background:"#fff",color:"#2d2018"}}>
                  <option value="">Auto-detect</option>
                  {OCCASIONS.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {mode==="etsy"&&<div>
                <label style={{fontSize:11,color:"#b8a898",fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",display:"block",marginBottom:4}}>USD → INR Rate</label>
                <input type="number" className="am-inp" value={usdRate} onChange={e=>setUsdRate(Number(e.target.value))} style={{width:"100%",padding:"9px 10px",border:"1.5px solid #e8e0d8",borderRadius:8,fontSize:12,background:"#fff",color:"#2d2018"}}/>
              </div>}
            </div>
            <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
              {[[flagBest,setFlagBest,"⭐ All Bestseller"],[flagTrend,setFlagTrend,"🔥 All Trending"],[flagNew,setFlagNew,"✨ All New"]].map(([val,setter,lbl])=>(
                <label key={lbl} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,cursor:"pointer",color:"#5a4a3e"}}>
                  <input type="checkbox" checked={val} onChange={e=>setter(e.target.checked)} style={{accentColor:"#d4a574",width:14,height:14}}/>{lbl}
                </label>
              ))}
            </div>
          </div>
        )}

        {errors.length>0&&(
          <div style={{background:"#fde8e8",border:"1px solid #f0c0c0",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <p style={{color:"#c44a4a",fontSize:12,fontWeight:700,marginBottom:6}}>⚠ Warnings ({errors.length})</p>
            {errors.slice(0,5).map((e,i)=><p key={i} style={{color:"#d07070",fontSize:11}}>{e}</p>)}
            {errors.length>5&&<p style={{color:"#c8b8a8",fontSize:11,marginTop:4}}>+{errors.length-5} more</p>}
          </div>
        )}

        {importing&&(
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#b8a898",marginBottom:6}}><span>Uploading to Supabase…</span><span>{progress}%</span></div>
            <div style={{height:6,background:"#f0ebe5",borderRadius:4}}><div style={{height:"100%",background:"linear-gradient(90deg,#d4a574,#b07a5a)",width:`${progress}%`,borderRadius:4,transition:"width .3s"}}/></div>
          </div>
        )}

        {preview.length>0&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
              <span style={{fontSize:13,color:"#5a4a3e",fontWeight:600}}>{preview.length} products ready{errors.length?` · ${errors.length} warnings`:""}</span>
              <button onClick={doImport} disabled={importing} className="am-btn-pri"
                style={{padding:"11px 22px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,letterSpacing:"0.8px",fontFamily:"inherit"}}>
                {importing?`Uploading… ${progress}%`:`🚀 Upload ${preview.length} Products`}
              </button>
            </div>
            <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #ede8e3"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                <thead><tr style={{background:"#faf7f4"}}>
                  {["#","Image","Name","Category","Occasion","Price","Stock","Tags"].map(h=>(
                    <th key={h} style={{fontSize:10,color:"#c8b8a8",fontWeight:700,textAlign:"left",padding:"9px 12px",borderBottom:"1px solid #ede8e3",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {preview.slice(0,15).map((p,i)=>{
                    const dc=overrideCat||p.category;
                    const docc=overrideOcc||p.occasion;
                    const dp=mode==="etsy"?Math.round(p.price*(usdRate/USD_TO_INR)):p.price;
                    return(
                      <tr key={i} style={{borderBottom:"1px solid #f5f0ea"}}>
                        <td style={{padding:"8px 12px",fontSize:11,color:"#c8b8a8"}}>{p._rowNum}</td>
                        <td style={{padding:"8px 12px"}}>{p.image?<img src={p.image} alt="" style={{width:36,height:36,objectFit:"cover",borderRadius:7,border:"1px solid #ede8e3"}} onError={e=>{e.target.style.display="none";}}/>:<div style={{width:36,height:36,background:"#f5f0ea",borderRadius:7,border:"1px solid #ede8e3"}}/>}</td>
                        <td style={{padding:"8px 12px",maxWidth:220}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:13,color:"#2d2018",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>{p.material&&<div style={{fontSize:10,color:"#c8b8a8"}}>{p.material.slice(0,40)}</div>}</td>
                        <td style={{padding:"8px 12px"}}><span style={{fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,background:`${CAT_COLORS[dc]||"#d4a574"}18`,color:CAT_COLORS[dc]||"#d4a574"}}>{dc||"—"}</span></td>
                        <td style={{padding:"8px 12px",fontSize:11,color:"#8a7a6e"}}>{docc||"—"}</td>
                        <td style={{padding:"8px 12px",fontSize:13,color:"#b07a5a",fontWeight:600,whiteSpace:"nowrap"}}>{formatINR(dp)}</td>
                        <td style={{padding:"8px 12px",fontSize:12,color:p.stock>0?"#4a8f4a":"#c44a4a"}}>{p.stock}</td>
                        <td style={{padding:"8px 12px",fontSize:14,lineHeight:1.4}}>
                          {(flagBest||p.isBestseller)&&"⭐"}
                          {(flagTrend||p.isTrending)&&"🔥"}
                          {(flagNew||p.isNew)&&"✨"}
                          {p.onSale&&"🏷"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {preview.length>15&&<p style={{padding:"8px 12px",fontSize:11,color:"#c8b8a8",textAlign:"center",borderTop:"1px solid #ede8e3"}}>+{preview.length-15} more rows (all will upload)</p>}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
              {Object.entries(preview.reduce((acc,p)=>{const k=overrideCat||p.category||"Unknown";acc[k]=(acc[k]||0)+1;return acc;},{})).map(([cat,cnt])=>(
                <span key={cat} style={{fontSize:11,padding:"4px 12px",borderRadius:20,fontWeight:600,background:`${CAT_COLORS[cat]||"#d4a574"}18`,color:CAT_COLORS[cat]||"#d4a574",border:`1px solid ${CAT_COLORS[cat]||"#d4a574"}40`}}>{cat}: {cnt}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Orders Page ───────────────────────────────
function OrdersPage({showToast}){
  const[orders,setOrders]=useState([]);
  const[loading,setLoading]=useState(true);
  const[filter,setFilter]=useState("all");

  useEffect(()=>{
    supabaseQuery("orders?order=created_at.desc&limit=100")
      .then(data=>{setOrders(Array.isArray(data)?data:[]);setLoading(false);})
      .catch(()=>{
        setOrders([]);
        setLoading(false);
      });
  },[]);

  const STATUS={new:{bg:"#e8f0fd",color:"#5a7fc4"},processing:{bg:"#fdf3e3",color:"#c47a2a"},shipped:{bg:"#e8f5e8",color:"#4a8f4a"},delivered:{bg:"#d4edda",color:"#2a6a2a"},cancelled:{bg:"#fde8e8",color:"#c44a4a"}};
  const filtered=filter==="all"?orders:orders.filter(o=>o.status===filter);
  const update=async(id,status)=>{
    try{await supabaseQuery(`orders?id=eq.${id}`,"PATCH",{status});}catch{}
    setOrders(prev=>prev.map(o=>(o.id===id||o._id===id)?{...o,status}:o));
    showToast("Order updated");
  };

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {["all","new","processing","shipped","delivered","cancelled"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:"0.6px",textTransform:"capitalize",fontFamily:"inherit",background:filter===s?"linear-gradient(135deg,#d4a574,#b07a5a)":"#fff",color:filter===s?"#fff":"#b8a898",border:filter===s?"none":"1px solid #e8e0d8"}}>
            {s==="all"?`All (${orders.length})`:s}
          </button>
        ))}
      </div>
      <div className="am-card" style={{padding:0,overflow:"hidden"}}>
        {loading?<p style={{padding:40,textAlign:"center",color:"#c8b8a8",fontStyle:"italic"}}>Loading orders…</p>:(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:650}}>
              <thead><tr style={{background:"#faf7f4"}}>
                {["Order","Date","Customer","Items","Amount","Status","Update"].map(h=>(
                  <th key={h} style={{fontSize:10,color:"#c8b8a8",fontWeight:700,textAlign:"left",padding:"10px 14px",borderBottom:"1px solid #ede8e3",textTransform:"uppercase",letterSpacing:"0.8px",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(o=>{
                  const sc=STATUS[o.status]||STATUS.new;
                  return(
                    <tr key={o.id||o._id} className="am-tr" style={{borderBottom:"1px solid #f5f0ea"}}>
                      <td style={{padding:"10px 14px",fontSize:13,color:"#b07a5a",fontWeight:600}}>{o.id||o._id}</td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#c8b8a8"}}>{o.date||o.created_at?.slice(0,10)}</td>
                      <td style={{padding:"10px 14px",fontSize:13,color:"#2d2018"}}>{o.customer||o.customer_name}</td>
                      <td style={{padding:"10px 14px",fontSize:12,color:"#8a7a6e"}}>{o.items}</td>
                      <td style={{padding:"10px 14px",fontSize:13,color:"#2d2018",fontWeight:600}}>{formatINR(o.amount)}</td>
                      <td style={{padding:"10px 14px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:sc.bg,color:sc.color}}>{o.status}</span></td>
                      <td style={{padding:"10px 14px"}}>
                        <select value={o.status} onChange={e=>update(o.id||o._id,e.target.value)}
                          className="am-inp"
                          style={{padding:"6px 8px",border:"1.5px solid #e8e0d8",borderRadius:7,fontSize:12,background:"#faf7f4",color:"#2d2018"}}>
                          {["new","processing","shipped","delivered","cancelled"].map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length===0&&<p style={{padding:30,textAlign:"center",color:"#c8b8a8",fontSize:13}}>No orders found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
