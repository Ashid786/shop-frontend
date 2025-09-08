import React, { useEffect, useState } from "react";

import "../styles/ShopBuyer_cart.css";

import { http } from "../services/api";

export default function ShopBuyer_cart() {
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
const [discount, setDiscount] = useState(0);
const [finalAmount, setFinalAmount] = useState(0);
const username = localStorage.getItem("username");

useEffect(() => {
http(`/getCartItems/${encodeURIComponent(username)}`)
.then((res) => res.json())
.then((data) => {
setItems(data);
calculateTotal(data);
});
}, []);

const calculateTotal = (data) => {
let amount = 0;
let totalQty = 0;

data.forEach((item) => {
amount += item.price * item.quantity;
totalQty += item.quantity;
});

const disc = totalQty >= 5 ? amount * 0.15 : 0;
const final = amount - disc;

setTotal(amount);
setDiscount(disc);
setFinalAmount(final);
};

const handlePayment = async () => {
try {
const response = await http("/payment/create", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
amount: finalAmount,
currency: "INR",
customerName: username,
customerPhone: "9876543210",
customerEmail: "ashid@example.com",
}),
});
const data = await response.json();
const paymentSessionId = data.paymentSessionId;

localStorage.setItem("lastPaymentSessionId", paymentSessionId);
localStorage.setItem("lastFinalAmount", finalAmount);
localStorage.setItem("paymentOrigin", "ShopBuyer_cart");

if (typeof window.Cashfree !== "function") {
  alert("❌ Cashfree SDK not loaded.");
  return;
}

const cashfree = new window.Cashfree({ mode: "sandbox" });

cashfree.checkout({
  paymentSessionId,
  redirectTarget: "_self",
  returnUrl: `${window.location.origin}/paymentsuccess`,
});
} catch (error) {
  console.error("❌ Payment error:", error);
  alert("Payment initiation failed.");
  }
  };
  
  return (
  
  <div className="shopbuyer-cart"> <header className="shopbuyer-header"> <div className="welcome-text">Welcome Shop Buyer: {username}</div> </header>
  <div className="cart-container">
  <h2>Your Cart</h2>
  {items.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <p>Total: ₹{total.toFixed(2)}</p>
        <p>Discount (15%): ₹{discount.toFixed(2)}</p>
        <p><strong>Final Payable: ₹{finalAmount.toFixed(2)}</strong></p>
      </div>

      <button className="pay-btn" onClick={handlePayment}>
        Pay Now with Cashfree
      </button>
    </>
  )}
</div>

<footer className="shopbuyer-footer">
  <p>
    📧 Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a>
  </p>
  <p>© 2025 Kodagu Fresh. All rights reserved.</p>
</footer>
</div> );
}