// import { useState } from "react";


// export default function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

// //     const navigate = useNavigate();
// const handleLogin = async () => {
//         setError("");
//         setLoading(true);

//         try {
//             const res = await fetch(
//                 "https://rayfinesite-3.onrender.com/api/auth/login",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         email,
//                         password
//                     })
//                 }
//             );

//             const data = await res.json();

//             if (data.success && data.token) {
//                 // save token
//                 localStorage.setItem("admin_token", data.token);

//                 // safer redirect
//                 window.location.href = "/admin";
//             } else {
//                 setError(data.message || "Invalid credentials");
//             }

//         } catch (err) {
//             console.log(err);
//             setError("Cannot connect to server");
//         }

//         setLoading(false);
//     };

//     return (
//         <div style={{
//             minHeight: "100vh",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "#f5f0eb"
//         }}>
//             <div style={{
//                 background: "#fff",
//                 padding: "48px 40px",
//                 borderRadius: "16px",
//                 boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
//                 width: "100%",
//                 maxWidth: "400px"
//             }}>

//                 <h2 style={{ textAlign: "center" }}>
//                     Ray Fine Ornates
//                 </h2>

//                 <p style={{ textAlign: "center", color: "#888", marginBottom: "20px" }}>
//                     Admin Login
//                 </p>

//                 {error && (
//                     <div style={{
//                         background: "#fff0f0",
//                         color: "#c00",
//                         padding: "10px",
//                         borderRadius: "8px",
//                         marginBottom: "10px"
//                     }}>
//                         {error}
//                     </div>
//                 )}

//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     style={inputStyle}
//                 />

//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//                     style={inputStyle}
//                 />

//                 <button
//                     onClick={handleLogin}
//                     disabled={loading}
//                     style={{
//                         width: "100%",
//                         padding: "14px",
//                         background: "#1a1a1a",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "8px",
//                         cursor: "pointer"
//                     }}
//                 >
//                     {loading ? "Logging in..." : "Login"}
//                 </button>

//             </div>
//         </div>
//     );
// }

// const inputStyle = {
//     width: "100%",
//     padding: "12px 16px",
//     marginBottom: "16px",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//     outline: "none"
// };
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) { setError("Email aur password dono required hain"); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://rayfinesite-3.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("admin_token", data.token);
                navigate("/admin");
            } else {
                setError(data.message || "Login failed");
            }
        } catch {
            setError("Server se connect nahi ho raha");
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "#0f0f10", fontFamily: "sans-serif"
        }}>
            <div style={{
                background: "#111", border: "1px solid #F9CDC2", borderRadius: "20px",
                padding: "48px 40px", width: "100%", maxWidth: "400px"
            }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <img src="https://rayfineornates.com/wp-content/uploads/2021/06/logo.png"
                        alt="Ray Fine Ornates" style={{ height: "60px", objectFit: "contain", marginBottom: "16px" }} />
                    <h2 style={{ color: "#F9CDC2", fontSize: "22px", margin: 0 }}>Admin Login</h2>
                    <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>Ray Fine Ornates Dashboard</p>
                </div>

                {error && (
                    <div style={{ background: "#ff444422", border: "1px solid #ff4444", borderRadius: "10px", padding: "12px", marginBottom: "20px", color: "#ff8888", fontSize: "14px", textAlign: "center" }}>
                        ⚠️ {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    style={inputStyle}
                />

                <button onClick={handleLogin} disabled={loading} style={{
                    width: "100%", padding: "14px", border: "none",
                    background: loading ? "#888" : "#F9CDC2",
                    borderRadius: "30px", cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "bold", fontSize: "16px", marginTop: "8px",
                    color: "#000"
                }}>
                    {loading ? "Logging in..." : "Login →"}
                </button>

                <p style={{ color: "#555", fontSize: "12px", textAlign: "center", marginTop: "24px" }}>
                    Ray Fine Ornates © 2024
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%", padding: "14px", margin: "8px 0",
    borderRadius: "10px", border: "1px solid #444",
    background: "#1a1a1a", color: "#fff",
    boxSizing: "border-box", fontSize: "14px",
    outline: "none"
};