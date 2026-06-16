
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "", email: "" });
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const GIFT_WRAP_PRICE = 99;

  const formatPrice = (inr) => {
    if (!currency) return `₹${inr.toLocaleString()}`;
    const val = inr * currency.rate;
    return `${currency.symbol}${currency.code === "INR" ? Math.round(val).toLocaleString() : val.toFixed(2)}`;
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);
  const giftCost = giftWrap ? GIFT_WRAP_PRICE : 0;
  const total = subtotal + giftCost - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "GIFT15") {
      const d = Math.round(subtotal * 0.15);
      setDiscount(d);
      setCouponMsg(`✓ GIFT15 applied! You save ${formatPrice(d)}`);
    } else {
      setDiscount(0);
      setCouponMsg("✕ Invalid coupon code");
    }
  };

  const placeOrder = async () => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert("Please enter Name & Phone Number");
      return;
    }
    if (customer.phone.length < 10) {
      alert("Enter valid phone number");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);

    // Simulate order placement
    const orderId = `RFO-${Date.now()}`;
    setOrderPlaced(true);

    setTimeout(() => {
      setCart([]);
      navigate("/");
      alert(`Order placed! Order ID: ${orderId}\n\nYou'll receive confirmation on ${customer.phone}`);
    }, 2000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="page-content" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", color: "var(--text)", marginBottom: "12px" }}>Your cart is empty</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "28px" }}>Add items to proceed with checkout</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="page-content" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: "500px" }}>
          <div style={{ fontSize: "80px", marginBottom: "20px", animation: "bounce 0.6s ease" }}>✨</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "36px", color: "var(--primary)", marginBottom: "12px" }}>Order Confirmed!</h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "24px" }}>
            Thank you for your order, <strong>{customer.name}</strong>! We'll send you updates on WhatsApp at <strong>{customer.phone}</strong>.
          </p>
          <div style={{ background: "var(--cream)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-light)", marginBottom: "28px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>Order will be dispatched within 2-3 days.</p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)" }}>Use <strong>/track</strong> to monitor your delivery</p>
          </div>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="shop-hero">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", padding: "60px 40px 100px", alignItems: "start" }}>
        {/* LEFT: FORM */}
        <div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", color: "var(--primary)", marginBottom: "28px" }}>Delivery Information</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
            <input
              placeholder="Full Name *"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              style={{ padding: "13px 16px", borderRadius: "6px", border: "1.5px solid var(--border)", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "var(--text)", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <input
              placeholder="Email"
              type="email"
              value={customer.email}
              onChange={e => setCustomer({ ...customer, email: e.target.value })}
              style={{ padding: "13px 16px", borderRadius: "6px", border: "1.5px solid var(--border)", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "var(--text)", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <input
              placeholder="Phone Number *"
              value={customer.phone}
              onChange={e => setCustomer({ ...customer, phone: e.target.value })}
              maxLength={10}
              style={{ padding: "13px 16px", borderRadius: "6px", border: "1.5px solid var(--border)", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "var(--text)", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <textarea
              placeholder="Delivery Address"
              value={customer.address}
              onChange={e => setCustomer({ ...customer, address: e.target.value })}
              rows={4}
              style={{ padding: "13px 16px", borderRadius: "6px", border: "1.5px solid var(--border)", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fff", color: "var(--text)", boxSizing: "border-box", resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* Gift Wrap */}
          <div style={{ background: "var(--cream)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)", marginBottom: "28px" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={e => setGiftWrap(e.target.checked)}
                style={{ marginTop: "3px", accentColor: "var(--primary)", width: "18px", height: "18px" }}
              />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>🎁 Add Gift Wrapping (+{formatPrice(GIFT_WRAP_PRICE)})</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Premium box with ribbon & handwritten note</p>
              </div>
            </label>
            {giftWrap && (
              <textarea
                placeholder="Add a personal gift message (optional)"
                value={giftNote}
                onChange={e => setGiftNote(e.target.value)}
                rows={2}
                style={{ width: "100%", marginTop: "12px", padding: "10px 12px", borderRadius: "6px", border: "1.5px solid var(--border)", fontSize: "13px", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box", color: "var(--text)" }}
              />
            )}
          </div>

          {/* Coupon */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "10px" }}>Have a Coupon?</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                placeholder="Enter code (try GIFT15)"
                value={coupon}
                onChange={e => { setCoupon(e.target.value); setCouponMsg(""); }}
                style={{ flex: 1, padding: "11px 14px", borderRadius: "6px", fontSize: "13px", border: "1.5px solid var(--border)", outline: "none", fontFamily: "inherit", background: "#fff", color: "var(--text)" }}
              />
              <button
                onClick={applyCoupon}
                style={{ padding: "11px 18px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Apply
              </button>
            </div>
            {couponMsg && <p style={{ fontSize: "12px", marginTop: "8px", color: discount > 0 ? "#27ae60" : "#c0392b", fontWeight: 600 }}>{couponMsg}</p>}
          </div>

          {/* Trust Icons */}
          <div style={{ display: "flex", justifyContent: "space-around", padding: "20px", background: "var(--cream)", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
            {[["🚚", "Free Delivery"], ["🔒", "Secure"], ["🔄", "Easy Return"]].map(([icon, label]) => (
              <div key={label} style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{icon}</div>
                <div style={{ fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div style={{ position: "sticky", top: "100px" }}>
          <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "14px", padding: "32px", boxShadow: "0 4px 20px rgba(44,36,24,0.08)" }}>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", color: "var(--primary)", marginBottom: "24px" }}>Order Summary</h3>

            {/* Items */}
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-light)" }}>
              {cart.map(item => (
                <div key={item._id || item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", fontSize: "13px" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "3px" }}>{item.name}</p>
                    {item.selectedVariant && <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.selectedVariant}</p>}
                    <p style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700 }}>× {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 700, color: "var(--text)" }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#27ae60", fontWeight: 700 }}>
                  <span>Savings</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
              )}
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#27ae60", fontWeight: 700 }}>
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {giftWrap && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>🎁 Gift Wrapping</span>
                  <span>{formatPrice(GIFT_WRAP_PRICE)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-light)" }}>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-muted)" }}>TOTAL</span>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 600, color: "var(--primary)" }}>{formatPrice(total)}</span>
            </div>

            {/* CTA */}
            <button
              onClick={placeOrder}
              disabled={loading}
              style={{ width: "100%", padding: "16px", background: loading ? "#c4a98a" : "var(--text)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", marginBottom: "12px", transition: "background 0.3s" }}
            >
              {loading ? "Processing..." : "Place Order →"}
            </button>

            <Link
              to="/shop"
              style={{ display: "block", textAlign: "center", padding: "13px", background: "var(--cream)", color: "var(--text)", border: "1.5px solid var(--border)", borderRadius: "6px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              ← Continue Shopping
            </Link>

            <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "16px", lineHeight: "1.6" }}>
              Need help? <a href="https://wa.me/918690666771" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>WhatsApp us</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default Checkout;
