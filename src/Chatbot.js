    import { useState, useRef, useEffect } from "react";

    export default function Chatbot({ onClose }) {
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hi 👋 I'm RayFine AI Assistant. Ask me about delivery or refunds." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (msg) => {
        const text = msg || input;
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: "user", text }]);
        setInput("");
        setLoading(true);

        try {
        const res = await fetch("https://rayfinesite-3.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: "bot", text: data.reply || "No response" }]);
        } catch (err) {
        setMessages(prev => [...prev, { role: "bot", text: "Server error ❌ Try again later" }]);
        }

        setLoading(false);
    };

    return (
        <div className="chatbot-container">
        <div className="chat-header">
            💬 RayFine AI Assistant
            {onClose && (
            <button onClick={onClose} style={{ float: "right", background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>✖</button>
            )}
        </div>

        {/* Quick Reply Buttons */}
        <div style={{ display: "flex", gap: "6px", padding: "8px 12px", flexWrap: "wrap", borderBottom: "1px solid #eee" }}>
            {["Delivery time?", "Refund policy?", "Track my order"].map(q => (
            <button key={q} onClick={() => sendMessage(q)}
                style={{ fontSize: "12px", padding: "5px 10px", borderRadius: "20px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer" }}>
                {q}
            </button>
            ))}
        </div>

        <div className="chat-body">
            {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>{msg.text}</div>
            ))}
            {loading && <div className="msg bot typing">Typing...</div>}
            <div ref={bottomRef} />
        </div>

        <div className="chat-input">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about delivery or refund..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={() => sendMessage()}>Send</button>
        </div>
        </div>
    );
    }