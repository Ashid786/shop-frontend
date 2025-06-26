import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AdminHome from "./pages/AdminHome";
import ShopBuyer_home from "./pages/ShopBuyer_home";
import ShopBuyer_cart from "./pages/ShopBuyer_cart";
import Customer_home from './pages/Customer_home';
import Customer_cart from './pages/Customer_cart';
import PaymentSuccess from "./pages/PaymentSuccess";


export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/admin_home" element={<AdminHome />} />
        <Route path="/shopbuyer_home" element={<ShopBuyer_home />} />
        <Route path="/cart" element={<ShopBuyer_cart />} />
        <Route path="/customer_home" element={<Customer_home />} />
        <Route path="/customer_cart" element={<Customer_cart />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        

      </Routes>
  );
}
