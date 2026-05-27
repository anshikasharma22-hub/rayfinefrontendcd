    export default function ProductModal({ product, onClose }) {
    if (!product) return null;

    return (
        <div className="modal-bg" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src={product.image} />
            <h2>{product.name}</h2>
            <p>₹{product.price}</p>

            <button>Add to Cart</button>
            <button onClick={onClose}>Close</button>
        </div>
        </div>
    );
    }