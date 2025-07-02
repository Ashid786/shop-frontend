import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Ensure you have a CSS file at this path for modal styling
// import "../styles/PaymentSuccess.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  // State to manage the visibility of the custom modal/popup
  const [showModal, setShowModal] = useState(false);
  // State to store the message to be displayed in the modal
  const [modalMessage, setModalMessage] = useState("");
  // State to store the type of message (e.g., 'success', 'error') for conditional styling/behavior
  const [modalType, setModalType] = useState(""); // Can be 'success' or 'error'

  useEffect(() => {
    const username = localStorage.getItem("username");
    const paymentSessionId = localStorage.getItem("lastPaymentSessionId");
    const totalAmount = localStorage.getItem("lastFinalAmount");
    // Retrieve the origin of the payment from localStorage
    const paymentOrigin = localStorage.getItem("paymentOrigin");

    // Check if essential payment info is missing
    if (!username || !paymentSessionId || !totalAmount) {
      setModalMessage("Missing payment information. Please try again.");
      setModalType("error");
      setShowModal(true);
      return; // Exit early if critical info is missing
    }

    // Call backend to confirm order, send email, and clear cart
    fetch(`${import.meta.env.VITE_BACKEND_URL}/order/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        paymentSessionId,
        totalAmount,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          // If response is not OK, throw an error to be caught by the catch block
          throw new Error("Failed to confirm order.");
        }
        return res.text(); // Get the success message from the backend
      })
      .then((message) => {
        // On successful order confirmation
        setModalMessage(`✅ ${message}`); // Display success message from backend
        setModalType("success");
        setShowModal(true); // Show the success modal

        // Clear localStorage items after successful confirmation
        localStorage.removeItem("lastPaymentSessionId");
        localStorage.removeItem("lastFinalAmount");
        localStorage.removeItem("paymentOrigin"); // Clear the origin flag as well
      })
      .catch((err) => {
        // On error during order confirmation
        console.error("Order confirmation error:", err);
        setModalMessage(`❌ ${err.message || "Failed to confirm order."}`);
        setModalType("error");
        setShowModal(true); // Show the error modal

        // Clear localStorage items even on error to prevent re-attempts with same ID
        localStorage.removeItem("lastPaymentSessionId");
        localStorage.removeItem("lastFinalAmount");
        localStorage.removeItem("paymentOrigin"); // Clear the origin flag
      });
  }, [navigate]); // navigate is in dependency array to avoid lint warnings, though it's stable

  // Function to handle the "OK" button click on the custom modal
  const handleModalConfirm = () => {
    setShowModal(false); // Hide the modal
    if (modalType === "success") {
      // Check the paymentOrigin flag to redirect to the correct home page
      const paymentOriginAfterConfirmation = localStorage.getItem("paymentOrigin"); // Re-check if needed, though cleared above

      // If the payment originated from "shopBuyer", redirect to shopbuyer home
      if (paymentOriginAfterConfirmation === "ShopBuyer_cart") {
        navigate("/shopbuyer_home");
      } else {
        // Otherwise, assume it was a customer payment and redirect to customer home
        navigate("/customer_home");
      }
    } else {
      // If there was an error, redirect based on origin or a general error route
      const paymentOriginAfterError = localStorage.getItem("paymentOrigin");
      if (paymentOriginAfterError === "shopBuyer") {
          navigate("/shopbuyer/cart"); // Redirect shop buyer to their cart on error
      } else {
          navigate("/customer_cart"); // Redirect customer to their cart on error
      }
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }} className="payment-success-page">
      {!showModal && ( // Only show "Processing..." if modal is not yet shown
        <>
          <h2>Processing your order...</h2>
          <p>Please wait while we confirm your payment and place your order.</p>
        </>
      )}

      {/* Custom Modal for success/error messages */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <p className={`modal-message ${modalType}`}>{modalMessage}</p>
            <button onClick={handleModalConfirm} className="modal-ok-button">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
