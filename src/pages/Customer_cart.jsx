import React, { useEffect, useState } from "react";

import "../styles/Customer_cart.css";

import { http } from "../services/api";

export default function Customer_cart() {
const username = localStorage.getItem("username");
const [cartItems, setCartItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (!username) {
console.error("No user logged in. Please log in to view your cart.");
return;
}

http(`/customer/cart/${encodeURIComponent(username)}`)
.then((res) => {
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
return res.json();
})
.then((data) => {
setCartItems(data);
setLoading(false);
})
.catch((error) => {
console.error("Error fetching cart items:", error);
setLoading(false);
});
}, [username]);

const totalAmount = cartItems.reduce(
(acc, item) => acc + item.product.price * item.quantity,
0
);

const handlePayment = async () => {
if (cartItems.length === 0) {
console.warn("Cart is empty. Cannot proceed with payment.");
return;
}
if (totalAmount <= 0) {
console.warn("Total amount is zero or negative. Cannot proceed with payment.");
return;
}

try {
const response = await http("/payment/create", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
amount: totalAmount,
currency: "INR",
customerName: username,
customerPhone: "9876543210",
customerEmail: "customer@gmail.com",
}),
});
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
const paymentSessionId = data.paymentSessionId;
localStorage.setItem("lastPaymentSessionId", paymentSessionId);
localStorage.setItem("lastFinalAmount", totalAmount);

if (typeof window.Cashfree !== "function") {
  console.error("Cashfree SDK not loaded. Please ensure it's included in your index.html.");
  return;
}

const cashfree = new window.Cashfree({ mode: "sandbox" });
cashfree.checkout({
  paymentSessionId,
  redirectTarget: "_self",
  returnUrl: `${window.location.origin}/paymentsuccess`,
});
} catch (error) {
  console.error("Payment initiation error:", error);
  }
  };
  
  return (
  
  <div className="customer-cart-container"> <div className="customer-cart-header"> <h2>Welcome Customer: {username}</h2> </div>
  <div className="customer-cart-content">
  <h3>Your Cart</h3>

  {loading ? (
    <p>Loading cart items...</p>
  ) : cartItems.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <div>
      <div className="cart-grid">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image";
              }}
            />
            <div className="cart-item-details">
              <h4>{item.product.name}</h4>
              <p>Qty: {item.quantity}</p>
              <p>
                ₹{item.product.price.toFixed(2)} × {item.quantity} = ₹
                {(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
      </div>

      <div className="pay-button-container">
        <button onClick={handlePayment} className="pay-with-cashfree-btn">
          Pay with Cashfree
        </button>
      </div>
    </div>
  )}
</div>

<div className="customer-cart-footer">
  <p>
    Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a> | © 2025 Kodagu Fresh. All rights reserved.
  </p>
</div>
</div> );
}