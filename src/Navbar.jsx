import { useState } from "react";

export function Navbar({ onLogout, onSearch, cartCount, onCartClick }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#2c3e50",
        color: "white",
        padding: "15px 25px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ margin: 0 }}>🛍️ MegaMart</h2>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleChange}
          style={{
            width: "300px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          onClick={onCartClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "20px" }}>🛒</span> Cart
          {cartCount > 0 && (
            <span style={{
              background: "#e74c3c",
              borderRadius: "50%",
              padding: "2px 8px",
              fontSize: "14px",
              marginLeft: "4px"
            }}>{cartCount}</span>
          )}
        </button>

        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "20px" }}>👤</span> Logout
        </button>
      </div>
    </div>
  );
}
