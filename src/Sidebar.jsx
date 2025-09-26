export function Sidebar({ onSelect }) {
  const menuItems = [
    "Home",
    "Best Sellers",
    "New Releases",
    "Orders",
    "Inventory",
    "Help",
  ];

  return (
    <div
      style={{
        width: "200px",
        height: "100vh",
        background: "#34495e",
        color: "white",
        paddingTop: "70px",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "auto",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            style={{
              padding: "15px 20px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onClick={() => onSelect && onSelect(item)}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2c3e50")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {item}
          </li>
        ))}

        <li
          style={{
            padding: "15px 20px",
            cursor: "pointer",
            fontWeight: "bold",
            borderTop: "1px solid #2c3e50",
            transition: "0.3s",
          }}
          onClick={() => onSelect && onSelect("UserList")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2c3e50")}
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          User List
        </li>

        <li
          style={{
            padding: "15px 20px",
            cursor: "pointer",
            fontWeight: "bold",
            borderTop: "1px solid #2c3e50",
            transition: "0.3s",
          }}
          onClick={() => onSelect && onSelect("AddUser")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2c3e50")}
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Add Users
        </li>
      </ul>
    </div>
  );
}
