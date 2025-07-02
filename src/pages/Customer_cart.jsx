import React, { useEffect, useState, useRef } from "react";
import "../styles/Customer_cart.css";

export default function Customer_cart() {
  const username = localStorage.getItem("username");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      console.error("No user logged in. Please log in to view your cart.");
      return;
    }

    // Fetch customer cart items from the backend
    fetch(`${import.meta.env.VITE_BACKEND_URL}/customer/cart/${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
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
  }, [username]); // Dependency array includes username to refetch if it changes

  // Calculate the total amount for items in the cart
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    // Basic validation before initiating payment
    if (cartItems.length === 0) {
      console.warn("Cart is empty. Cannot proceed with payment.");
      // Show user-friendly message
      return;
    }
    if (totalAmount <= 0) {
      console.warn("Total amount is zero or negative. Cannot proceed with payment.");
      // Show user-friendly message
      return;
    }

    try {
      // Make a POST request to your backend to create a Cashfree payment session
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount, // Use the calculated total amount
          currency: "INR",
          customerName: username,
          customerPhone: "9876543210", // Placeholder, ideally fetched from user profile
          customerEmail: "customer@gmail.com", // Placeholder, ideally fetched from user profile
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const paymentSessionId = data.paymentSessionId;
      localStorage.setItem("lastPaymentSessionId", paymentSessionId);
      localStorage.setItem("lastFinalAmount", totalAmount); // Store the total amount

      // Check if Cashfree SDK is loaded
      if (typeof window.Cashfree !== "function") {
        console.error("Cashfree SDK not loaded. Please ensure it's included in your index.html.");
        // Show a user-friendly message on the UI
        return;
      }

      // Initialize Cashfree SDK in sandbox mode
      const cashfree = new window.Cashfree({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
        returnUrl: `${window.location.origin}/paymentsuccess` // Redirect to PaymentSuccess page
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

  return (
    <div className="customer-cart-container">
      {/* Header */}
      <div className="customer-cart-header">
        <h2>Welcome Customer: {username}</h2>
      </div>

      {/* Cart Content */}
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
                  {/* Fallback image if imageUrl is broken or missing */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.onerror = null; // Prevents infinite loop
                      e.target.src = "https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image"; // Placeholder
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

      {/* Footer */}
      <div className="customer-cart-footer">
        <p>
          Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a> | © 2025 Kodagu Fresh. All rights reserved.
        </p>
      </div>
    </div>
  );
}
