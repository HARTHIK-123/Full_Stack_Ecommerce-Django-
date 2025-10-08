import { useState } from "react";
import axios from "axios";


export function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // new email state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ---------------- LOGIN ----------------
  const handleLogin = () => {
    if (!username || !password) {
      alert("Please fill all fields!");
      return;
    }

    axios
      .post("https://full-stack-ecommerce-django-backend.onrender.com/website/api/login/", {
        username,
        password,
      })
      .then((res) => {
        if (res.data.success) {
          alert("Login successful!");
          onLogin(); // redirect to dashboard
        } else {
          alert(res.data.message || "Invalid credentials");
        }
      })
      .catch((err) => {
        console.error("Error logging in:", err);
        alert("Login failed! Please try again.");
      });
  };

  // ---------------- SIGNUP ----------------
  const handleSignup = () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    axios
      .post("https://full-stack-ecommerce-django-backend.onrender.com/website/api/signup/", {
        username,
        email,    // include email here
        password,
      })
      .then((res) => {
        alert("Signup successful! You can now login.");
        setIsLogin(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error("Error signing up:", err);
        alert("Signup failed! Username or email might already exist.");
      });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
          width: "320px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>
          {isLogin ? "Login" : "Signup"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {!isLogin && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: isLogin ? "20px" : "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        )}

        <button
          onClick={isLogin ? handleLogin : handleSignup}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            background: "#2c3e50",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          style={{
            cursor: "pointer",
            color: "#2c3e50",
            fontSize: "14px",
          }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
