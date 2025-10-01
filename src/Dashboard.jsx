import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const NAVBAR_HEIGHT = 70;
const SIDEBAR_WIDTH = 200;

export function Dashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedPage, setSelectedPage] = useState("Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch products initially (just a few dummy items for testing)
  useEffect(() => {
    if (selectedPage === "Products") {
      const initialProducts = [
        { id: 1, name: "Laptop", description: "High performance", price: 80000 },
        { id: 2, name: "Phone", description: "Latest model", price: 50000 }
      ];
      setProducts(initialProducts);
      setFilteredProducts(initialProducts);
    }
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ FRONTEND ONLY ADD/EDIT
  const handleSubmit = () => {
    if (!form.name || !form.description || !form.price) {
      alert("Please fill all fields");
      return;
    }

    if (editingProduct) {
      // Update product locally
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...editingProduct, ...form } : p
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setForm({ name: "", description: "", price: "" });
      setEditingProduct(null);
    } else {
      // Add product locally
      const newProduct = {
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        ...form,
      };
      const newProducts = [...products, newProduct];
      setProducts(newProducts);
      setFilteredProducts(newProducts);
      setForm({ name: "", description: "", price: "" });
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

  // ✅ FRONTEND ONLY DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const newProducts = products.filter((p) => p.id !== id);
    setProducts(newProducts);
    setFilteredProducts(newProducts);
  };

  // ADD TO CART
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, count: item.count + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, count: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  // REMOVE ONE FROM CART
  const handleRemoveOneFromCart = (productId) => {
    setCart((prevCart) => {
      const found = prevCart.find((item) => item.id === productId);
      if (!found) return prevCart;
      if (found.count === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, count: item.count - 1 } : item
      );
    });
  };

  // REMOVE ALL OF ITEM
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

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