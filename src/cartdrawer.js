   function CartDrawer({ cart, setCart, open, onClose }) {
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);

  useBodyLock(open);

  const GIFT_WRAP_PRICE = 99;
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = cart.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);
  const grandTotal = total + (giftWrap ? GIFT_WRAP_PRICE : 0) - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "GIFT15") {
      const d = Math.round(total * 0.15);
      setDiscount(d);
      setCouponMsg(`✓ GIFT15 applied! You save ${formatPrice(d, currency)}`);
    } else {
      setDiscount(0);
      setCouponMsg("✕ Invalid coupon code");
    }
  };

  const updateQty = (itemId, delta) => {
    setCart(prev =>
      prev
        .map(p => (p._id || p.id) === itemId ? { ...p, quantity: p.quantity + delta } : p)
        .filter(p => p.quantity > 0)
    );
  };

  const goToCheckout = () => {
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

        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
              <p style={{ marginBottom: "8px", fontFamily: "Cormorant Garamond, serif", fontSize: "22px", color: "var(--text)" }}>Your cart is empty</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>Discover our beautiful collection</p>
              <Link to="/shop" className="btn-primary" style={{ display: "inline-block" }} onClick={onClose}>Shop Now</Link>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div className="cart-item" key={(item._id || item.id) + (item.selectedVariant || "")}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={e => { e.target.src = "https://placehold.co/76x76?text=Item"; }}
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    {item.selectedVariant && <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: 4 }}>{item.selectedVariant}</p>}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <p className="cart-item-price">{formatPrice(item.price, currency)}</p>
                      {item.originalPrice && <p className="cart-item-original">{formatPrice(item.originalPrice, currency)}</p>}
                    </div>
                    <div className="qty-controls">
                      <button onClick={() => updateQty(item._id || item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item._id || item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => updateQty(item._id || item.id, -item.quantity)}>🗑</button>
                </div>
              ))}

              <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-light)" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Have a Coupon?</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="Enter code (try GIFT15)"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponMsg(""); }}
                    style={{ flex: 1, padding: "9px 12px", borderRadius: "4px", fontSize: "12px", border: "1.5px solid var(--border)", outline: "none", fontFamily: "inherit" }}
                  />
                  <button onClick={applyCoupon} style={{ padding: "9px 14px", background: "var(--text)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Apply</button>
                </div>
                {couponMsg && <p style={{ fontSize: "11px", marginTop: 6, color: discount > 0 ? "#27ae60" : "#c0392b", fontWeight: 600 }}>{couponMsg}</p>}
              </div>

              <div style={{ padding: "0 20px 16px", borderBottom: "1px solid var(--border-light)" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={e => setGiftWrap(e.target.checked)}
                    style={{ marginTop: 3, accentColor: "var(--primary)", width: 16, height: 16 }}
                  />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>🎁 Add Gift Wrapping (+{formatPrice(GIFT_WRAP_PRICE, currency)})</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Premium box with ribbon & handwritten note</p>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            {savings > 0 && <div className="cart-savings">🎉 You save {formatPrice(savings, currency)}!</div>}
            <div className="cart-total">
              <span>Total</span>
              <div style={{ textAlign: "right" }}>
                <strong>{formatPrice(grandTotal, currency)}</strong>
                {(discount > 0 || giftWrap) && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {discount > 0 ? `Coupon: -${formatPrice(discount, currency)} ` : ""}
                    {giftWrap ? `+ 🎁 ${formatPrice(GIFT_WRAP_PRICE, currency)}` : ""}
                  </div>
                )}
              </div>
            </div>
            <button className="btn-checkout" onClick={goToCheckout}>Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}
