import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterSmallBusiness.css";

const RegisterSmallBusiness = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactPersonName: "",
    phone: "",
    address: "",
    businessType: "",
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering small business:", formData);
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
          <h2>Small Business Registration</h2>
          <p>Source products and grow your business with EasyStock</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@business.com"
            />
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

          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. Joe's Hardware"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactPersonName">Contact Person Name</label>
            <input
              type="text"
              id="contactPersonName"
              name="contactPersonName"
              value={formData.contactPersonName}
              onChange={handleChange}
              required
              placeholder="Full Name"
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

          <div className="form-group">
            <label htmlFor="address">Business Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessType">Business Type</label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select business type...</option>
              <option value="Retailer">Retailer</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Service Provider">Service Provider</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className="submit-button accent-button">
            Create Business Account
          </button>
        </form>

        <div className="register-footer">
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSmallBusiness;
