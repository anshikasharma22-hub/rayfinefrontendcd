    import "./Footer.css";

    export default function Footer() {
    const links = [
        { name: "My Account", href: "/account" },
        { name: "About Us", href: "/about" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms & Conditions", href: "/terms" },
    ];

    const support = [
        { name: "Return & Refund", href: "/returns" },
        { name: "Care Information", href: "/care" },
        { name: "Contact Us", href: "/contact" },
    ];

    return (
        <footer className="footer">
        <div className="footer-container">

            {/* Brand */}
            <div className="footer-box fade">
            <h2 className="brand">Ray Fine</h2>
            <p>
                Premium jewellery crafted with elegance, trust and timeless beauty.
            </p>
            </div>

            {/* Links */}
            <div className="footer-box fade">
            <h3>Quick Links</h3>
            <ul>
                {links.map((item, i) => (
                <li key={i}>
                    <a href={item.href}>{item.name}</a>
                </li>
                ))}
            </ul>
            </div>

            {/* Support */}
            <div className="footer-box fade">
            <h3>Support</h3>
            <ul>
                {support.map((item, i) => (
                <li key={i}>
                    <a href={item.href}>{item.name}</a>
                </li>
                ))}
            </ul>
            </div>

            {/* Contact */}
            <div className="footer-box fade">
            <h3>Contact</h3>
            <p>Email: support@rayfine.com</p>
            <p>Available: 24/7</p>
            </div>

        </div>

        <div className="footer-bottom">
            © 2021 Ray Fine. All Rights Reserved.
        </div>
        </footer>
    );
    }