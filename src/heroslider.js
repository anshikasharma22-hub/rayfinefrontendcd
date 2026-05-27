    import { useEffect, useState } from "react";

    const slides = [
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
    "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d"
    ];

    export default function HeroSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
        setIndex(prev => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(t);
    }, []);

    return (
        <section
        className="hero"
        style={{ backgroundImage: `url(${slides[index]})` }}
        >
        <div className="hero-overlay">
            <h1>Luxury Jewellery</h1>
            <p>Elegance Crafted for You</p>
        </div>
        </section>
    );
    }