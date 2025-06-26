import React, { useEffect, useState } from "react";
import "../styles/AdminHome.css";

export default function Admin_home() {
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const username = localStorage.getItem("username") || "Admin";

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "Fruits",
    quantity: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [searchName, categoryFilter, sortBy]);

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (searchName) params.append("name", searchName);
    if (categoryFilter) params.append("category", categoryFilter);
    if (sortBy) params.append("sort", sortBy);

    const res = await fetch(`http://localhost:8080/products/search?${params}`);
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await fetch(`http://localhost:8080/deleteProduct/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setIsUpdateMode(true);
    setForm(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = isUpdateMode
      ? `http://localhost:8080/updateProduct/${form.id}`
      : "http://localhost:8080/addProduct";
    const method = isUpdateMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await res.json();
    alert(`${isUpdateMode ? "Updated" : "Added"} successfully`);
    setForm({ id: "", name: "", category: "Fruits", quantity: "", price: "", imageUrl: "" });
    setIsUpdateMode(false);
    fetchProducts();
  };

  return (
    <div className="admin-home">
      {/* ✅ Header with welcome message */}
      <header className="admin-header">
        <div className="welcome-text">Welcome Admin: {username}</div>

        <form onSubmit={handleFormSubmit} className="product-form">
          <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" required />
          <select name="category" value={form.category} onChange={handleFormChange}>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
          </select>
          <input name="quantity" type="number" value={form.quantity} onChange={handleFormChange} placeholder="Qty" required />
          <input name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="Price" required />
          <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange} placeholder="Image URL" required />
          <button type="submit">{isUpdateMode ? "Update" : "Add"}</button>
        </form>

        <div className="search-controls">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search..."
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </header>

      {/* Product Table */}
      <div className="product-table">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Category</th><th>Qty</th><th>Price</th><th>Image</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.price}</td>
                  <td><img src={p.imageUrl} alt={p.name} width="50" height="50" /></td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer className="admin-footer">
        <p>📧 Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a></p>
        <p>© 2025 Kodagu Fresh. All rights reserved.</p>
      </footer>
    </div>
  );
}
