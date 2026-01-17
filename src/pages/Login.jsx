import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);

    if (result.success) {
      // Navigate based on user type
      if (result.user.type === 'supplier') {
        navigate("/dashboard");
      } else if (result.user.type === 'small-business') {
        navigate("/small-business/dashboard");
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-placeholder">EasyStock</div>
          <h1>Login Portal</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
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

          <button type="submit" className="primary-button">
            Sign in
          </button>
        </form>

        <div className="demo-credentials" style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '12px'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#0369a1' }}>Demo Credentials:</p>
          <div style={{ marginBottom: '8px' }}>
            <strong>Supplier:</strong><br />
            Email: supplier@easystock.com<br />
            Password: supplier123
          </div>
          <div>
            <strong>Small Business:</strong><br />
            Email: business@easystock.com<br />
            Password: business123
          </div>
        </div>

        <div className="create-account-section">
          <p>Don't have an account?</p>
          <Link to="/register-selection" className="create-account-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

