import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterSupplier.css";

const RegisterSupplier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    businessEmail: "",
    phone: "",
    address: "",
    primaryGoods: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registering supplier:", formData);
    alert("Registration successful! Redirecting to dashboard...");
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div
            className="back-link"
            onClick={() => navigate("/register-selection")}
          >
            ← Back
          </div>
          <h2>Supplier Registration</h2>
          <p>Join our network of trusted suppliers</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. Acme Supplies Ltd."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="businessEmail">Business Email</label>
              <input
                type="email"
                id="businessEmail"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                required
                placeholder="contact@company.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Business Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="primaryGoods">Primary Goods</label>
            <select
              id="primaryGoods"
              name="primaryGoods"
              value={formData.primaryGoods}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select your primary goods...</option>
              <option value="Hardware">Hardware</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Construction">Construction</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Create Supplier Account
          </button>
        </form>

        <div className="register-footer">
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSupplier;
