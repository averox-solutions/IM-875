import React, { useState, useEffect, useContext } from "react";
import "./Login.css"; // Ensure this file is properly linked for other styling
import beeplogo from "../../assets/beepLogo.png";
import AppContext from "../AppContext"; // Import the AppContext
import { useNavigate } from "react-router-dom"; // Import navigate for routing

const Login = () => {
  const { loginUser, accessToken, loginLoader, refreshToken } =
    useContext(AppContext); // Access context functions and state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const backgroundStyle = {
    backgroundImage: `url(${require("../../assets/bg-image.png")})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-card">
        <img className="bg-logo" src={beeplogo} alt="bg-img" />
        <form onSubmit={loginUser}>
          <div className="form-group">
            <label>Email</label>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label htmlFor="remember">Remember Me</label>
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {loginLoader ? (
            <button type="submit" className="login-button" disabled>
              Loading...
            </button>
          ) : (
            <button type="submit" className="login-button">
              Sign In
            </button>
          )}
        </form>
        <p>
          Don’t have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#000", textDecoration: "none ", fontSize: "15px" }}
          >
            Sign Up
          </a>  
        </p>
      </div>
    </div>
  );
};

export default Login;
