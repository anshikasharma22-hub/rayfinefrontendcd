    const [wishlist, setWishlist] = useState([]);

    const toggleWishlist = (item) => {
    const exists = wishlist.find(p => p._id === item._id);

    if (exists) {
        setWishlist(wishlist.filter(p => p._id !== item._id));
    } else {
        setWishlist([...wishlist, item]);
    }
};