import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/Customer_home.css";

import { http } from "../services/api";

export default function Customer_home() {
const [products, setProducts] = useState([]);
const [quantityMap, setQuantityMap] = useState({});
const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [sort, setSort] = useState("");

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

http(`/products/search?${params.toString()}`)
.then((res) => res.json())
.then((data) => setProducts(data));
};

const handleAddToCart = async (productId) => {
const quantity = parseInt(quantityMap[productId]) || 0;
if (quantity <= 0) {
alert("Please select a valid quantity.");
return;
}

const payload = {
username,
productId,
quantity,
};

const res = await http("/customer/addToCart", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(payload),
});

if (res.ok) {
alert("Item added to cart");
} else {
alert("Failed to add item to cart");
}
};

return (

<div className="customer-container"> <div className="customer-header"> <div className="customer-top"> <h2>Welcome Customer: {username}</h2> <button className="go-to-cart-btn" onClick={() => navigate("/customer_cart")} > Go to Cart </button> </div>
<div className="filters">
    <input
      type="text"
      placeholder="Search by name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">All Categories</option>
      <option value="Fruits">Fruits</option>
      <option value="Vegetables">Vegetables</option>
    </select>
    <select value={sort} onChange={(e) => setSort(e.target.value)}>
      <option value="">Sort by</option>
      <option value="name">Name</option>
      <option value="price">Price</option>
      <option value="quantity">Quantity</option>
    </select>
  </div>
</div>

<div className="product-grid">
  {products.map((product, i) => (
    <div key={i} className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h4>{product.name}</h4>
      <p>Category: {product.category}</p>
      <p>Price: ₹{product.price}</p>
      <p>Description: {product.description}</p>
      <input
        type="number"
        min="1"
        placeholder="Quantity"
        value={quantityMap[product.id] || ""}
        onChange={(e) =>
          setQuantityMap({ ...quantityMap, [product.id]: e.target.value })
        }
      />
      <button onClick={() => handleAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  ))}
</div>

<div className="customer-footer">
  Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a> | © 2025 Kodagu Fresh. All rights reserved.
</div>
</div> );
}