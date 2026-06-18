import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CartDrawer({ cart, setCart, open, onClose }) {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const GIFT_WRAP_PRICE = 99;

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const updateQty = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((p) =>
          (p._id || p.id) === itemId
            ? { ...p, quantity: p.quantity + delta }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "GIFT15") {
      const d = Math.round(total * 0.15);
      setDiscount(d);
      setCouponMsg(`Coupon applied! You saved ₹${d}`);
    } else {
      setDiscount(0);
      setCouponMsg("Invalid coupon");
    }
  };

  const proceedToCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div className={`cart-overlay ${open ? "show" : ""}`} onClick={onClose} />

      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart ({cart.length})</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ flex: 1 }}>
          {cart.length === 0 ? (
            <div className="cart-empty">
              <h3>Your cart is empty</h3>
              <Link to="/shop" onClick={onClose}>Shop Now</Link>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={(item._id || item.id) + (item.selectedVariant || "")}
                >
                  <img src={item.image} alt={item.name} width={70} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                    {item.selectedVariant && (
                      <p style={{ fontSize: "11px", color: "var(--text-light)", marginTop: 4 }}>
                        {item.selectedVariant}
                      </p>
                    )}
                    <div className="qty-controls">
                      <button onClick={() => updateQty(item._id || item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item._id || item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => updateQty(item._id || item.id, -item.quantity)}
                  >
                    🗑
                  </button>
                </div>
              ))}

              {/* Coupon */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border-light)" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                  Have a Coupon?
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="GIFT15"
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value); setCouponMsg(""); }}
                    style={{
                      flex: 1, padding: "8px 12px", fontSize: "12px", border: "1px solid var(--border)", borderRadius: "3px",
                      outline: "none", fontFamily: "inherit", background: "#fff",
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{
                      padding: "8px 14px", background: "var(--primary)", color: "#fff", border: "none",
                      borderRadius: "3px", fontSize: "10px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p style={{ fontSize: "11px", marginTop: 6, color: discount > 0 ? "#27ae60" : "#c0392b", fontWeight: 600 }}>
                    {couponMsg}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-savings">
              Subtotal: ₹{total.toLocaleString()} {discount > 0 && `• Save: ₹${discount}`}
            </div>
            <div className="cart-total">
              <span>Total</span>
              <strong>₹{(total - discount).toLocaleString()}</strong>
            </div>
            <button className="btn-checkout" onClick={proceedToCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
