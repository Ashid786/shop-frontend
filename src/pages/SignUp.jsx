import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/SignUp.css";

import { http } from "../services/api";

export default function SignUp() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState("customer");
const [email, setEmail] = useState("");
const [mobile, setMobile] = useState("");
const navigate = useNavigate();

async function handleSubmit(e) {
e.preventDefault();
const user = { username, password, role, email, mobile };

const resp = await http("/signup", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(user),
});

const msg = await resp.text();
alert(msg);
if (msg === "success") navigate("/sign_in");
}

return (

<div className="signup-page"> <header className="welcome-header"> <img src="https://img.freepik.com/free-vector/man-riding-scooter-white-background_1308-47664.jpg?ga=GA1.1.758191258.1750774542&semt=ais_hybrid&w=740" alt="Logo" className="welcome-logo" /> <h1 className="welcome-heading">Coorg Express</h1> </header>
<div className="signup-container">
  <h2 className="signup-title">Create an Account</h2>
  <form onSubmit={handleSubmit} className="signup-form">
    <input
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Username"
      required
    />
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
      required
    />
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email Address"
      required
    />
    <input
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
      placeholder="Mobile Number"
      required
    />
    <select value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="customer">Customer</option>
      <option value="shop_buyer">Shop Buyer</option>
      <option value="admin">Admin</option>
    </select>
    <button type="submit" className="signup-btn">Register</button>
  </form>
</div>

<footer className="welcome-footer">
  <p>📧 Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a></p>
  <p>© 2025 Kodagu Fresh. All rights reserved.</p>
</footer>
</div> );
}