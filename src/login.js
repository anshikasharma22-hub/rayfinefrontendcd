import { useState } from "react";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();
const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                "https://rayfinesite-3.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await res.json();

            if (data.success && data.token) {
                // save token
                localStorage.setItem("admin_token", data.token);

                // safer redirect
                window.location.href = "/admin";
            } else {
                setError(data.message || "Invalid credentials");
            }

        } catch (err) {
            console.log(err);
            setError("Cannot connect to server");
        }

        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f0eb"
        }}>
            <div style={{
                background: "#fff",
                padding: "48px 40px",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                width: "100%",
                maxWidth: "400px"
            }}>

                <h2 style={{ textAlign: "center" }}>
                    Ray Fine Ornates
                </h2>

                <p style={{ textAlign: "center", color: "#888", marginBottom: "20px" }}>
                    Admin Login
                </p>

                {error && (
                    <div style={{
                        background: "#fff0f0",
                        color: "#c00",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "10px"
                    }}>
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    style={inputStyle}
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "#1a1a1a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none"
};