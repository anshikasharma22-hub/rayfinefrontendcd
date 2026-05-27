    export default function CartDrawer({ cart, open, setOpen }) {
    return (
        <div className={`cart-drawer ${open ? "open" : ""}`}>
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
            <p>Cart Empty</p>
        ) : (
            cart.map((item, i) => (
            <div key={i} className="cart-item">
                <p>{item.name}</p>
                <p>₹{item.price}</p>
            </div>
            ))
        )}

        <button onClick={() => setOpen(false)}>Close</button>
        </div>
    );
    }