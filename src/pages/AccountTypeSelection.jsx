import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AccountTypeSelection.css";

const AccountTypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="selection-container">
      <div className="selection-content">
        <div className="header-section">
          <h1>Create your account</h1>
          <p className="subtitle">Choose how you want to use EasyStock</p>
        </div>

        <div className="cards-container">
          <button
            className="selection-card"
            onClick={() => navigate("/register/supplier")}
          >
            <div className="card-icon">🏭</div>
            <h2>I am a Supplier</h2>
            <p>I want to manage inventory and receive orders from retailers.</p>
            <div className="card-arrow">→</div>
          </button>

          <button
            className="selection-card"
            onClick={() => navigate("/register/small-business")}
            style={{ opacity: 1 }}
          >
            <div className="card-icon">🏪</div>
            <h2>I am a Small Business</h2>
            <p>I want to source products and place orders with suppliers.</p>
            <div className="card-arrow">→</div>
          </button>
        </div>

        <div className="footer-link">
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
