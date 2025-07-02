import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ShopBuyer_home.css"; // ✅ Add this

export default function ShopBuyer_home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [quantityMap, setQuantityMap] = useState({});
  const username = localStorage.getItem("username");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  const fetchProducts = () => {
    const params = new URLSearchParams();
    if (search) params.append("name", search);
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/products/search?${params}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantityMap[productId] || 0;
    if (quantity < 5) {
      alert("Minimum quantity for shop buyers is 5.");
      return;
    }

    const payload = {
      username,
      productId,
      quantity,
    };

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/addToCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Item added to cart");
    } else {
      alert("Failed to add");
    }
  };

  return (
    <div className="shopbuyer-container">
      {/* Header */}
      <div className="shopbuyer-header">
        <div>
          <h3>Welcome Shop Buyer: {username}</h3>
        </div>
        <button className="go-to-cart-btn" onClick={() => navigate("/cart")}>
          Go to Cart
        </button>
        <div className="filters">
          <input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="">All Categories</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
          </select>

          <select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>

      {/* Products */}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.imageUrl} alt={p.name} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <p>Category: {p.category}</p>
            <input
              type="number"
              min="0"
              placeholder="Qty (min 5)"
              value={quantityMap[p.id] || ""}
              onChange={(e) =>
                setQuantityMap({ ...quantityMap, [p.id]: e.target.value })
              }
            />
            <button onClick={() => handleAddToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="shopbuyer-footer">
        Contact: ashid7821@gmail.com | © 2025 Kodagu Fresh. All rights reserved.
      </div>
    </div>
  );
}
