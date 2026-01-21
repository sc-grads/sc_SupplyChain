import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./RegisterSmallBusiness.css";

const RegisterSmallBusiness = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    const result = await register({
      ...formData,
      role: "VENDOR",
    });

    if (result.success) {
      alert("Registration successful! Redirecting to dashboard...");
      navigate("/small-business/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="register-container min-h-screen bg-gray-50 dark:bg-[#0f1115] flex flex-col justify-center py-12 px-6 lg:px-8">
      {/* Card Container: Standardized radius, background, and subtle shadow */}
      <div className="register-card max-w-[480px] w-full mx-auto bg-white dark:bg-gray-900 p-10 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
        <div className="register-header space-y-2">
          {/* Matched back-link style and spacing */}
          <div
            className="back-link inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest cursor-pointer mb-2"
            onClick={() => navigate("/register-selection")}
          >
            ← Back
          </div>
          {/* Matched font-weight to small business side (700 for main titles) */}
          <h2 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight">
            Small Business Registration
          </h2>
          {/* Reduced font-weight for subtitles (500) */}
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Source products and grow your business with EasyStock
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="form-group flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@business.com"
              disabled={loading}
              className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group flex flex-col gap-1.5">
              <label
                htmlFor="password"
                name="password"
                className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="form-group flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                name="confirmPassword"
                className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label
              htmlFor="companyName"
              className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. Joe's Hardware"
              disabled={loading}
              className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label
              htmlFor="contactPersonName"
              className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
            >
              Contact Person Name
            </label>
            <input
              type="text"
              id="contactPersonName"
              name="contactPersonName"
              value={formData.contactPersonName}
              onChange={handleChange}
              required
              placeholder="Full Name"
              disabled={loading}
              className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label
              htmlFor="phone"
              className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+27 00 000 0000"
              disabled={loading}
              className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label
              htmlFor="address"
              className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
            >
              Business Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="2"
              disabled={loading}
              className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="form-group flex flex-col gap-1.5 pb-4">
            <label
              htmlFor="businessType"
              className="text-[10px] font-medium uppercase tracking-widest text-gray-400 px-1"
            >
              Business Type
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-normal text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="">Select business type...</option>
              <option value="Retailer">Retailer</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Service Provider">Service Provider</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Matched button style (h-11, px-6, rounded-lg, font-bold, sm shadow) */}
          <button
            type="submit"
            className="submit-button w-full h-11 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:brightness-105 transition-all shadow-sm flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Business Account"}
          </button>
        </form>

        <div className="register-footer pt-6 border-t border-gray-50 dark:border-gray-800 text-center text-xs font-medium text-gray-400 uppercase tracking-widest">
          Already have an account?{" "}
          <Link to="/" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSmallBusiness;
