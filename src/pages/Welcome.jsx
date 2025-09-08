import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Welcome.css'; 

export default function Welcome() {
  return (
    <div className="welcome-page">
      {/* ✅ Header with logo and title */}
      <header className="welcome-header">
        <img src="https://img.freepik.com/free-vector/man-riding-scooter-white-background_1308-47664.jpg?ga=GA1.1.758191258.1750774542&semt=ais_hybrid&w=740" alt="Logo" className="welcome-logo" />
        <h1 className="welcome-heading">Coorg Express</h1>
      </header>

      {/* ✅ Hero section with background and CTA */}
      <section className="welcome-hero">
        <div className="welcome-overlay">
          <h2 className="hero-title">Fresh Fruits & Vegetables</h2>
          <p className="hero-subtitle">Delivered Straight from Kodagu Farmers 🍃</p>
          <div className="welcome-buttons">
            <NavLink to="/sign_up" className="welcome-btn">Sign Up</NavLink>
            <NavLink to="/sign_in" className="welcome-btn">Sign In</NavLink>
          </div>
        </div>
      </section>

      {/* ✅ Region availability message */}
      <div className="region-notice">
        🚨 This service is currently available only for users in Kodagu. We are actively working to expand access to more regions soon.
      </div>

      {/* ✅ Footer */}
      <footer className="welcome-footer">
        <p>📧 Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a></p>
        <p>© 2025 Kodagu Fresh. All rights reserved.</p>
      </footer>
    </div>
  );
}
