import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const NAVBAR_HEIGHT = 70;
const SIDEBAR_WIDTH = 200;

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/website/api/users/")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ background: "white", padding: 20, borderRadius: 10, boxShadow: "0 6px 12px rgba(0,0,0,0.1)", height: "100%", boxSizing: "border-box" }}>
      <h2 style={{ color: "#2c3e50", marginTop: 0 }}>User List</h2>
      <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 180px)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "16px", minWidth: "600px" }}>
          <thead>
            <tr style={{ background: "#34495e", color: "white" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>ID</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Username</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.id}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.username}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.email || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddUserForm({ onUserAdded }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/website/api/signup/", { username, email, password })
      .then(() => {
        alert("User created successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setLoading(false);
        if (onUserAdded) onUserAdded();
      })
      .catch(() => {
        alert("Failed to create user. Username or email might be already used.");
        setLoading(false);
      });
  };

  return (
    <div style={{ background: "white", padding: 20, borderRadius: 10, boxShadow: "0 6px 12px rgba(0,0,0,0.1)", maxWidth: 500, boxSizing: "border-box" }}>
      <h2 style={{ color: "#2c3e50", marginTop: 0 }}>Add User</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc" }} />
      <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "10px", background: "#27ae60", color: "white", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer" }}>
        {loading ? "Creating..." : "Create User"}
      </button>
    </div>
  );
}

export function Dashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedPage, setSelectedPage] = useState("Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]); // array of {id, name, price, description, count}
  const [showCart, setShowCart] = useState(false);

  // If you later want to switch to backend-driven CRUD, change this constant.
  const API_URL = "http://127.0.0.1:8000/website/api/products/";

  useEffect(() => {
    if (selectedPage === "Products") getProducts();
  }, [selectedPage]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const getProducts = () => {
    // Try fetch from backend; if it fails (no backend during frontend-only testing),
    // fall back to a couple of sample products so UI is usable.
    axios
      .get(API_URL)
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(() => {
        const initialProducts = [
          { id: 1, name: "Laptop", description: "High performance", price: 80000 },
          { id: 2, name: "Phone", description: "Latest model", price: 50000 },
          { id: 3, name: "Headphones", description: "Noise cancelling", price: 3000 },
        ];
        setProducts(initialProducts);
        setFilteredProducts(initialProducts);
      });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Frontend-only add/edit (keeps UI responsive even if backend isn't available)
  const handleSubmit = () => {
    if (!form.name || !form.description || !form.price) {
      alert("Please fill all fields");
      return;
    }

    if (editingProduct) {
      // update locally
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...p, name: form.name, description: form.description, price: form.price } : p
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setForm({ name: "", description: "", price: "" });
      setEditingProduct(null);
      // (Optional) you can also call your backend here with axios.put(...)
    } else {
      const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        name: form.name,
        description: form.description,
        price: form.price,
      };
      const newProducts = [...products, newProduct];
      setProducts(newProducts);
      setFilteredProducts(newProducts);
      setForm({ name: "", description: "", price: "" });
      // (Optional) axios.post(...) if you want to persist backend
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const newProducts = products.filter((p) => p.id !== id);
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    // (Optional) axios.delete(...) to remove from backend
  };

  // --------- CART FUNCTIONS (added / restored) ---------
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, count: item.count + 1 } : item
        );
      }
      // add new item with count 1
      return [...prevCart, { ...product, count: 1 }];
    });
    // optional UX feedback
    // alert(`${product.name} added to cart!`);
  };

  const handleRemoveOneFromCart = (productId) => {
    setCart((prevCart) => {
      const found = prevCart.find((item) => item.id === productId);
      if (!found) return prevCart;
      if (found.count === 1) {
        // remove completely
        return prevCart.filter((item) => item.id !== productId);
      }
      // decrement count
      return prevCart.map((item) =>
        item.id === productId ? { ...item, count: item.count - 1 } : item
      );
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  // ----------------------------------------------------

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        background: "#f4f6f8",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          height: `${NAVBAR_HEIGHT}px`,
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        <Navbar
          onLogout={onLogout}
          onSearch={setSearchTerm}
          cartCount={cart.reduce((sum, item) => sum + item.count, 0)}
          onCartClick={() => setShowCart(true)}
        />
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: `${NAVBAR_HEIGHT}px`,
          left: 0,
          width: `${SIDEBAR_WIDTH}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          zIndex: 1,
          background: "#34495e",
          color: "white",
          paddingTop: "10px",
          boxSizing: "border-box",
        }}
      >
        <Sidebar onSelect={setSelectedPage} />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: "absolute",
          top: `${NAVBAR_HEIGHT}px`,
          left: `${SIDEBAR_WIDTH}px`,
          right: 0,
          bottom: 0,
          overflow: "auto",
          background: "#f4f6f8",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        {selectedPage === "UserList" ? (
          <UserList />
        ) : selectedPage === "AddUser" ? (
          <AddUserForm onUserAdded={() => setSelectedPage("UserList")} />
        ) : (
          <>
            <h2 style={{ color: "#2c3e50", marginTop: 0 }}>
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  flex: "2 1 180px",
                  minWidth: "120px",
                }}
              />
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  flex: "4 1 260px",
                  minWidth: "180px",
                }}
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  width: "90px",
                  minWidth: "70px",
                }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  padding: "10px 22px",
                  border: "none",
                  borderRadius: "6px",
                  background: editingProduct ? "#f39c12" : "#27ae60",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  minWidth: "110px",
                }}
              >
                {editingProduct ? "✏ Update" : "➕ Add"}
              </button>
            </div>

            <h2 style={{ color: "#2c3e50" }}>Product List</h2>
            <div
              style={{
                width: "100%",
                flex: 1,
                overflowX: "auto",
                background: "white",
                marginBottom: "12px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "16px",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr style={{ background: "#34495e", color: "white" }}>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Product Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Description
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Price
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          color: "#7f8c8d",
                        }}
                      >
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ padding: "10px", border: "1px solid #ccc" }}>{p.name}</td>
                        <td style={{ padding: "10px", border: "1px solid #ccc" }}>{p.description}</td>
                        <td style={{ padding: "10px", border: "1px solid #ccc" }}>₹{p.price}</td>
                        <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                          <button
                            onClick={() => handleEdit(p)}
                            style={{
                              marginRight: "8px",
                              padding: "5px 10px",
                              background: "#f39c12",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            ✏ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            style={{
                              padding: "5px 10px",
                              background: "#e74c3c",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              marginRight: "8px",
                            }}
                          >
                            🗑 Delete
                          </button>
                          <button
                            onClick={() => handleAddToCart(p)}
                            style={{
                              padding: "5px 10px",
                              background: "#2980b9",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            🛒 Add to Cart
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {/* CART MODAL */}
        {showCart && (
          <div
            style={{
              position: "fixed",
              top: "90px",
              right: "40px",
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
              zIndex: 1500,
              minWidth: "320px"
            }}
          >
            <h3>🛒 Cart</h3>
            {cart.length === 0 ? (
              <div>Your cart is empty.</div>
            ) : (
              <ul style={{ paddingLeft: 18 }}>
                {cart.map(item => (
                  <li key={item.id} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{item.name}</strong>
                        <div style={{ fontSize: 13, color: "#7f8c8d" }}>{item.description}</div>
                        <div style={{ marginTop: 4 }}>Qty: {item.count} • ₹{item.price} each</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button onClick={() => handleRemoveOneFromCart(item.id)}
                          style={{
                            background: "#e67e22", color: "white", border: "none", borderRadius: "4px", padding: "6px 10px", cursor: "pointer"
                          }}>Remove One</button>
                        <button onClick={() => handleRemoveFromCart(item.id)}
                          style={{
                            background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", padding: "6px 10px", cursor: "pointer"
                          }}>Remove All</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 12 }}>
              <strong>Total: ₹{cart.reduce((sum, it) => sum + (Number(it.price) * it.count), 0)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: "#34495e", color: "white", border: "none", borderRadius: "6px", padding: "7px 22px", cursor: "pointer"
                }}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "fixed",
          left: `${SIDEBAR_WIDTH}px`,
          bottom: 0,
          right: 0,
          height: "50px",
          background: "#2c3e50",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        © {new Date().getFullYear()} MegaMart. All Rights Reserved.
      </footer>
    </div>
  );
}
