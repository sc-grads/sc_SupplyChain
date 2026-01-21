import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Login Portal
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
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
