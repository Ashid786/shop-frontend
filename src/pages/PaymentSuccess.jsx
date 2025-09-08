import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../services/api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const paymentSessionId = localStorage.getItem("lastPaymentSessionId");
    const totalAmount = localStorage.getItem("lastFinalAmount");

    if (!username || !paymentSessionId || !totalAmount) {
      setModalMessage("Missing payment information. Please try again.");
      setModalType("error");
      setShowModal(true);
      return;
    }

    http("/order/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, paymentSessionId, totalAmount }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to confirm order.");
        return res.text();
      })
      .then((message) => {
        setModalMessage(`✅ ${message}`);
        setModalType("success");
        setShowModal(true);

        // clear session-related items, but keep paymentOrigin for redirect
        localStorage.removeItem("lastPaymentSessionId");
        localStorage.removeItem("lastFinalAmount");
      })
      .catch((err) => {
        console.error("Order confirmation error:", err);
        setModalMessage(`❌ ${err.message || "Failed to confirm order."}`);
        setModalType("error");
        setShowModal(true);

        localStorage.removeItem("lastPaymentSessionId");
        localStorage.removeItem("lastFinalAmount");
      });
  }, [navigate]);

  const handleModalConfirm = () => {
    setShowModal(false);
    const paymentOrigin = localStorage.getItem("paymentOrigin");

    if (modalType === "success") {
      if (paymentOrigin === "shopBuyer_cart") {
        navigate("/shopbuyer_home");
      } else {
        navigate("/customer_home");
      }
    } else {
      if (paymentOrigin === "shopBuyer_cart") {
        navigate("/shopbuyer/cart");
      } else {
        navigate("/customer_cart");
      }
    }

    // clear after redirect
    localStorage.removeItem("paymentOrigin");
  };

  return (
    <div
      style={{ padding: "40px", textAlign: "center" }}
      className="payment-success-page"
    >
      {!showModal && (
        <>
          <h2>Processing your order...</h2>
          <p>Please wait while we confirm your payment and place your order.</p>
        </>
      )}

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <p className={`modal-message ${modalType}`}>{modalMessage}</p>
            <button onClick={handleModalConfirm} className="modal-ok-button">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
