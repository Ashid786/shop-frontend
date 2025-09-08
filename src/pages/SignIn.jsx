import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/SignIn.css";

import { http } from "../services/api";

export default function SignIn() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

async function handleSubmit(e) {
e.preventDefault();
const data = { username, password };

const resp = await http("/signin", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Accept": "text/plain",
},
body: JSON.stringify(data),
});

const msg = await resp.text();

const roleRedirectMap = {
admin: "/admin_home",
customer: "/customer_home",
shop_buyer: "/shopbuyer_home",
};

const path = roleRedirectMap[msg];
if (path) {
localStorage.setItem("username", username);
localStorage.setItem("role", msg);
navigate(path);
} else {
alert("Invalid role or credentials.");
}
}

return (

<div className="signin-page"> <header className="signin-header"> <h1 className="welcome-heading">Coorg Express</h1> </header>
<div className="signin-container">
  <h2 className="signin-title">Welcome Back</h2>
  <form onSubmit={handleSubmit} className="signin-form">
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
    <button type="submit" className="signin-btn">Log In</button>
  </form>
</div>

<footer className="welcome-footer">
  <p>Contact: <a href="mailto:ashid7821@gmail.com">ashid7821@gmail.com</a></p>
  <p>© 2025 Kodagu Fresh. All rights reserved.</p>
</footer>
</div> );
}