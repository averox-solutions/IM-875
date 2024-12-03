import React, { useState, useEffect } from "react";
import "./Login.css"; // Ensure this file is properly linked for other styling
import beeplogo from '../../assets/beepLogo.png';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate login
    if (email === "admin@example.com" && password === "admin123") {
      alert("Login Successful");

  
      if (rememberMe) {
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("email");
      }

 
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Inline style for background image
  const backgroundStyle = {
    backgroundImage: `url(${require('../../assets/bg-image.png')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-card">
        <img className="bg-logo" src={beeplogo} alt="bg-img" />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
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
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        <p>
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
