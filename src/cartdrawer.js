import React, { useState } from "react";
import { Link } from "react-router-dom";

function CartDrawer({ cart, setCart, open, onClose }) {
  const [step, setStep] = useState("cart");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const GIFT_WRAP_PRICE = 99;

  const total = cart.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const grandTotal =
    total +
    (giftWrap ? GIFT_WRAP_PRICE : 0) -
    discount;

  const updateQty = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((p) =>
          (p._id || p.id) === itemId
            ? {
                ...p,
                quantity: p.quantity + delta,
              }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "GIFT15") {
      const d = Math.round(total * 0.15);
      setDiscount(d);
      setCouponMsg(
        `Coupon applied! You saved ₹${d}`
      );
    } else {
      setDiscount(0);
      setCouponMsg("Invalid coupon");
    }
  };

  const placeOrder = () => {
    alert("Payment integration pending");
  };

  return (
    <>
      <div
        className={`cart-overlay ${
          open ? "show" : ""
        }`}
        onClick={onClose}
      />

      <div
        className={`cart-drawer ${
          open ? "open" : ""
        }`}
      >
        <div className="cart-header">
          <h3>
            {step === "cart"
              ? `Your Cart (${cart.length})`
              : "Checkout"}
          </h3>

          <button
            className="cart-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {step === "cart" ? (
          <div style={{ flex: 1 }}>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <h3>Your cart is empty</h3>

                <Link
                  to="/shop"
                  onClick={onClose}
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    className="cart-item"
                    key={
                      (item._id || item.id) +
                      (item.selectedVariant || "")
                    }
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      width={70}
                    />

                    <div className="cart-item-info">
                      <p>{item.name}</p>

                      <p>
                        ₹{item.price}
                      </p>

                      <div className="qty-controls">
                        <button
                          onClick={() =>
                            updateQty(
                              item._id ||
                                item.id,
                              -1
                            )
                          }
                        >
                          -
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQty(
                              item._id ||
                                item.id,
                              1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        updateQty(
                          item._id ||
                            item.id,
                          -item.quantity
                        )
                      }
                    >
                      🗑
                    </button>
                  </div>
                ))}

                <div style={{ padding: 20 }}>
                  <input
                    placeholder="GIFT15"
                    value={coupon}
                    onChange={(e) =>
                      setCoupon(
                        e.target.value
                      )
                    }
                  />

                  <button
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>

                  <p>{couponMsg}</p>
                </div>

                <div style={{ padding: 20 }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) =>
                        setGiftWrap(
                          e.target.checked
                        )
                      }
                    />

                    Gift Wrapping (+₹99)
                  </label>

                  {giftWrap && (
                    <textarea
                      placeholder="Gift note..."
                      value={giftNote}
                      onChange={(e) =>
                        setGiftNote(
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>

                <div className="cart-footer">
                  <h3>
                    Total: ₹{grandTotal}
                  </h3>

                  <button
                    className="btn-checkout"
                    onClick={() =>
                      setStep("checkout")
                    }
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="checkout-form">
            <input
              placeholder="Full Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  phone: e.target.value,
                })
              }
            />

            <input
              placeholder="Address"
              value={customer.address}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  address: e.target.value,
                })
              }
            />

            <div className="order-summary">
              {cart.map((item) => (
                <div
                  key={
                    item._id || item.id
                  }
                >
                  <span>
                    {item.name} ×{" "}
                    {item.quantity}
                  </span>

                  <span>
                    ₹
                    {item.price *
                      item.quantity}
                  </span>
                </div>
              ))}

              <h3>
                Total: ₹{grandTotal}
              </h3>
            </div>

            <button
              className="btn-checkout"
              onClick={placeOrder}
            >
              Pay ₹{grandTotal}
            </button>

            <button
              onClick={() =>
                setStep("cart")
              }
            >
              Back
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer; 
 
 

 
