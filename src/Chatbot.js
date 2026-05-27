    // import { useState, useRef, useEffect } from "react";
    // import "./Chatbot.js";

    // export default function Chatbot() {
    // const [messages, setMessages] = useState([
    //     { role: "bot", text: "Hi 👋 I’m RayFine AI Assistant. How can I help you?" }
    // ]);
    // const [input, setInput] = useState("");
    // const [loading, setLoading] = useState(false);
    // const bottomRef = useRef(null);

    // useEffect(() => {
    //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

    // const sendMessage = async () => {
    //     if (!input.trim()) return;

    //     const userMsg = { role: "user", text: input };
    //     setMessages(prev => [...prev, userMsg]);
    //     setInput("");
    //     setLoading(true);

    //     try {
    //     const res = await fetch("http://127.0.0.1:5000/api/chat", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ message: input })
    //     });

    //     const data = await res.json();

    //     const botMsg = {
    //         role: "bot",
    //         text: data.reply || "No response"
    //     };

    //     setMessages(prev => [...prev, botMsg]);
    //     } catch (err) {
    //     setMessages(prev => [
    //         ...prev,
    //         { role: "bot", text: "Server error ❌ Try again later" }
    //     ]);
    //     }

    //     setLoading(false);
    // };

    // return (
    //     <div className="chatbot-container">
    //     <div className="chat-header">
    //         💬 RayFine AI Assistant
    //     </div>

    //     <div className="chat-body">
    //         {messages.map((msg, i) => (
    //         <div key={i} className={`msg ${msg.role}`}>
    //             {msg.text}
    //         </div>
    //         ))}

    //         {loading && (
    //         <div className="msg bot typing">Typing...</div>
    //         )}

    //         <div ref={bottomRef}></div>
    //     </div>

    //     <div className="chat-input">
    //         <input
    //         value={input}
    //         onChange={(e) => setInput(e.target.value)}
    //         placeholder="Ask about jewellery..."
    //         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    //         />
    //         <button onClick={sendMessage}>Send</button>
    //     </div>
    //     </div>
    // );
    // }
            import { useState, useRef, useEffect } from "react";

    export default function Chatbot({ onClose }) {
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hi 👋 I’m RayFine AI Assistant. Ask me about delivery or refunds." }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const msg = input;

        setMessages(prev => [...prev, { role: "user", text: msg }]);
        setInput("");
        setLoading(true);

        try {
        const res = await fetch("http://127.0.0.1:5000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });

        const data = await res.json();

        setMessages(prev => [
            ...prev,
            { role: "bot", text: data.reply || "No response" }
        ]);

        } catch (err) {
        setMessages(prev => [
            ...prev,
            { role: "bot", text: "Server error ❌ Try again later" }
        ]);
        }

        setLoading(false);
    };

    return (
        <div className="chatbot-container">

        <div className="chat-header">
            💬 RayFine AI Assistant

            {onClose && (
            <button onClick={onClose} style={{ float: "right", background: "transparent", border: "none", color: "white" }}>
                ✖
            </button>
            )}
        </div>

        <div className="chat-body">
            {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
                {msg.text}
            </div>
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
            <button onClick={sendMessage}>Send</button>
        </div>

        </div>
    );
    }