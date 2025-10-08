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
      // .get("http://127.0.0.1:8000/website/api/users/")
      .get("https://full-stack-ecommerce-django-backend.onrender.com/website/api/users/")
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
      // .post("http://127.0.0.1:8000/website/api/signup/", { username, email, password })
      .post("https://full-stack-ecommerce-django-backend.onrender.com/website/api/signup/", { username, email, password })
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
  // const API_URL = "http://127.0.0.1:8000/website/api/products/";
  const API_URL = "https://full-stack-ecommerce-django-backend.onrender.com/website/api/products/";
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

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Navbar } from "./Navbar";
// // import { Sidebar } from "./Sidebar";

// const API_URL = "https://full-stack-ecommerce-django-backend.onrender.com/website/api/products/";

// export function Dashboard({ onLogout }) {
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({ name: "", description: "", price: "" });
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [search, setSearch] = useState("");
//   const [cart, setCart] = useState([]);

//   // ✅ Fetch products from backend
//   const getProducts = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   useEffect(() => {
//     getProducts();
//   }, []);

//   // ✅ Add / Update product
//   const handleSubmit = async () => {
//     if (!form.name || !form.description || !form.price) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       if (editingProduct) {
//         const res = await axios.put(`${API_URL}${editingProduct.id}/`, form);
//         const updated = products.map((p) =>
//           p.id === editingProduct.id ? res.data : p
//         );
//         setProducts(updated);
//         setEditingProduct(null);
//         alert("Product updated!");
//       } else {
//         const res = await axios.post(API_URL, form);
//         setProducts([...products, res.data]);
//         alert("Product added!");
//       }
//       setForm({ name: "", description: "", price: "" });
//     } catch (err) {
//       console.error("Error saving product:", err);
//       alert("Failed to save product");
//     }
//   };

//   // ✅ Delete product
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       await axios.delete(`${API_URL}${id}/`);
//       setProducts(products.filter((p) => p.id !== id));
//       alert("Product deleted!");
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       alert("Failed to delete product");
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setForm({
//       name: product.name,
//       description: product.description,
//       price: product.price,
//     });
//   };

//   // ✅ Cart Functions
//   const addToCart = (product) => {
//     const existing = cart.find((item) => item.id === product.id);
//     if (existing) {
//       setCart(
//         cart.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       );
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };

//   const removeOne = (id) => {
//     const existing = cart.find((item) => item.id === id);
//     if (!existing) return;
//     if (existing.quantity > 1) {
//       setCart(
//         cart.map((item) =>
//           item.id === id ? { ...item, quantity: item.quantity - 1 } : item
//         )
//       );
//     } else {
//       setCart(cart.filter((item) => item.id !== id));
//     }
//   };

//   const removeAll = (id) => {
//     setCart(cart.filter((item) => item.id !== id));
//   };

//   const total = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const filteredProducts = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Navbar onLogout={onLogout} />

//         <div className="p-6 overflow-y-auto">
//           <h1 className="text-2xl font-bold mb-4">Products Dashboard</h1>

//           {/* ✅ Search Bar */}
//           <div className="mb-4 flex justify-between items-center">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="border rounded px-3 py-2 mr-2"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             <div className="text-lg font-semibold">
//               🛒 Cart Items: {cart.length} | Total: ₹{total.toFixed(2)}
//             </div>
//           </div>

//           {/* ✅ Add / Edit Form */}
//           <div className="bg-white p-4 rounded shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-3">
//               {editingProduct ? "Edit Product" : "Add Product"}
//             </h2>

//             <input
//               type="text"
//               placeholder="Name"
//               className="border rounded px-3 py-2 w-full mb-2"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               className="border rounded px-3 py-2 w-full mb-2"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               className="border rounded px-3 py-2 w-full mb-2"
//               value={form.price}
//               onChange={(e) => setForm({ ...form, price: e.target.value })}
//             />

//             <button
//               onClick={handleSubmit}
//               className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//             >
//               {editingProduct ? "Update" : "Add"}
//             </button>

//             {editingProduct && (
//               <button
//                 onClick={() => {
//                   setEditingProduct(null);
//                   setForm({ name: "", description: "", price: "" });
//                 }}
//                 className="bg-gray-400 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>

//           {/* ✅ Products Table */}
//           <table className="w-full border-collapse border">
//             <thead>
//               <tr className="bg-gray-200 text-left">
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Description</th>
//                 <th className="p-2 border">Price</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProducts.map((product) => (
//                 <tr key={product.id} className="border">
//                   <td className="p-2 border">{product.name}</td>
//                   <td className="p-2 border">{product.description}</td>
//                   <td className="p-2 border">₹{product.price}</td>
//                   <td className="p-2 border flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="bg-yellow-400 text-white px-3 py-1 rounded"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                     <button
//                       onClick={() => addToCart(product)}
//                       className="bg-green-500 text-white px-3 py-1 rounded"
//                     >
//                       Add to Cart
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {filteredProducts.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center p-4">
//                     No products found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* ✅ Cart Section */}
//           <div className="mt-8 bg-gray-100 p-4 rounded shadow-md">
//             <h2 className="text-xl font-semibold mb-3">🛍️ Cart</h2>

//             {cart.length === 0 ? (
//               <p>No items in cart.</p>
//             ) : (
//               <table className="w-full border-collapse border">
//                 <thead>
//                   <tr className="bg-gray-200 text-left">
//                     <th className="p-2 border">Name</th>
//                     <th className="p-2 border">Qty</th>
//                     <th className="p-2 border">Price</th>
//                     <th className="p-2 border">Total</th>
//                     <th className="p-2 border">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cart.map((item) => (
//                     <tr key={item.id} className="border">
//                       <td className="p-2 border">{item.name}</td>
//                       <td className="p-2 border">{item.quantity}</td>
//                       <td className="p-2 border">₹{item.price}</td>
//                       <td className="p-2 border">
//                         ₹{(item.price * item.quantity).toFixed(2)}
//                       </td>
//                       <td className="p-2 border flex gap-2">
//                         <button
//                           onClick={() => removeOne(item.id)}
//                           className="bg-yellow-400 text-white px-3 py-1 rounded"
//                         >
//                           Remove One
//                         </button>
//                         <button
//                           onClick={() => removeAll(item.id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded"
//                         >
//                           Remove All
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
