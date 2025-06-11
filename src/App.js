import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './Components/Login.js';
import Signup from './Components/Signup.js';
import LoginOTP from './Components/LoginOTP.js';
import Sidebar from './Components/Sidebar.js';
import Verification from './Components/Verification.js';
import FogotPassword from './Components/ForgotPassword.js';
import ResetPassword from './Components/ResetPassword.js';
import './css/style.css';
import axios from "axios";

const ProtectedRoute = ({ authenticated, children }) => {
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const PublicRoute = ({ authenticated, children }) => {
  if (authenticated) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

console.warn = () => {}; // Suppress warnings
console.error = () => {}; // Suppress errors
// console.log = () => {}; // Suppress logs

function App() {
  const [authenticated, setAuthenticated] = useState('Loading');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        try {
          const responseToken = await axios.post(
            "https://services.uaxwallet.com/api/verifyToken",
            {
              token: token,
              email: email,
            }
          );
          if (responseToken.data === "Token Expired") {
            localStorage.clear();
            setAuthenticated(false);
          } else {
            const config = {
              headers: { Authorization: `Bearer ${token}` },
            };
            const responseWallet = await axios.post(
              'https://services.uaxwallet.com/api/getUserWallet',
              {
                email: email,
              },
              config
            );
            localStorage.setItem("wallet_address",responseWallet.data)
            setAuthenticated(true);
            if (window.opener) {
              window.opener.postMessage(
                { email: responseToken.data.email, token, wallet_address: responseWallet.data },
                "*"
              );
            }
          }
        } catch (error) {
          console.error("Token verification error:", error);
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (authenticated === 'Loading') {
    return (
      <div
        className=""
        style={{
          height: "100vh",
          position: "relative",
          backgroundColor: "#000",
        }}
      >
        <center
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <img src={"https://images.uaxdlts.com/uax-dashboard/images/LOADER.gif"} style={{width:"3vw"}} alt="Loading" />
        </center>
      </div>
    );
  }

  return (
    // <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute authenticated={authenticated}>
              <Login setAuthenticated={setAuthenticated} />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute authenticated={authenticated}>
              <Login setAuthenticated={setAuthenticated} />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute authenticated={authenticated}>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute authenticated={authenticated}>
              <Sidebar />
            </ProtectedRoute>
          } 
        />
        <Route path="/forgotpassword" element={<FogotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/loginotp" element={<LoginOTP />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    // </Router>
  );
}

export default App;
