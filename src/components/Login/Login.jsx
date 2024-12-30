import React, { useState, useEffect, useContext } from "react";
import "./Login.css"; // Ensure this file is properly linked for other styling
import AppContext from "../AppContext"; // Import the AppContext
import { useNavigate } from "react-router-dom"; // Import navigate for routing

const Login = () => {
  const { loginUser, loginLoader } = useContext(AppContext); // Access context functions and state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // Initialize the navigation hook

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const backgroundStyle = {
    backgroundImage: `url(${require("../../assets/bg-image.png")})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    // opacity: 0.2, // Background opacity
  };

  const loginCardStyle = {
    backgroundColor: "rgba(225,225,225,0.5)",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    opacity: 1, // Keep card fully opaque
  };

  const formGroupStyle = {
    marginBottom: "15px",
    textAlign: "left",
    position: "relative", // Required for button alignment
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  };

  const toggleButtonStyle = {
    position: "absolute",
    right: "10px",
    top: "68%",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "#000",
    outline: "none",
  };

  return (
    <div style={backgroundStyle}>
      <div style={loginCardStyle}>
        <img
          className="bg-logo"
          src=""
          alt="bg-img"
          style={{ marginBottom: "20px", maxWidth: "150px" }}
        />
        <form onSubmit={loginUser}>
          <div style={formGroupStyle}>
            <label>Email</label>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label>Password</label>
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={toggleButtonStyle}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div style={formGroupStyle}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label
              htmlFor="remember"
              style={{ marginLeft: "8px", fontSize: "14px" }}
            >
              Remember Me
            </label>
          </div>
          {errorMessage && (
            <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>
          )}
          {loginLoader ? (
            <button
              type="submit"
              style={{ ...buttonStyle, backgroundColor: "#ccc" }}
              disabled
            >
              Loading...
            </button>
          ) : (
            <button type="submit" style={buttonStyle}>
              Sign In
            </button>
          )}
        </form>
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#000", textDecoration: "none" }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
