import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLocalLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Navigate based on user role from backend
      if (result.user.role === "SUPPLIER") {
        navigate("/dashboard");
      } else if (result.user.role === "VENDOR") {
        navigate("/small-business/dashboard");
      }
    } else {
      setError(result.error);
    }
    setLocalLoading(false);
  };

  const isLoading = authLoading || localLoading;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-placeholder">EasyStock</div>
          <h1>Login Portal</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="error-message"
              style={{
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: "8px",
                color: "#c33",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

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
