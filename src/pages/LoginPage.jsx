import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../firebase/firebaseAuth";
import Navbar from "../components/Navbar/Navbar";
import "../assets/styles/LoginPage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/emptyProfile.png";


const LoginPage = ({ profilePic }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/"); // Navigate to HomePage on successful login
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="login-container">
        <h1>Welcome Back !</h1>
        <h2>Start your AdvenTour of a Lifetime</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="button button-primary">
            Login
          </button>

        </form>
        <p2>Please login to continue your AdvenTour</p2>
        <p className="signup-prompt">
          Don’t have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
