import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1115]">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white dark:bg-gray-900 shadow-xl z-10 overflow-y-auto">
        <div className="max-w-lg mx-auto w-full">
          <div
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-8 cursor-pointer uppercase tracking-widest text-[10px]"
            onClick={() => navigate("/register-selection")}
          >
            <span className="material-symbols-outlined text-lg mr-1">
              arrow_back
            </span>
            BACK
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Small Business Registration
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Source products and grow your business with EasyStock.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {/* Section 1: Account Credentials */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h2 className="text-[10px] font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400">
                  Account Credentials
                </h2>
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                  htmlFor="email"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                    htmlFor="password"
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
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                  />
                  <div className="flex gap-1 px-1 mt-2">
                    <div
                      className={`h-1 w-full rounded-full ${formData.password.length > 0 ? "bg-primary" : "bg-gray-200 dark:bg-gray-800"}`}
                    ></div>
                    <div
                      className={`h-1 w-full rounded-full ${formData.password.length > 5 ? "bg-primary" : "bg-gray-200 dark:bg-gray-800"}`}
                    ></div>
                    <div
                      className={`h-1 w-full rounded-full ${formData.password.length > 8 ? "bg-primary" : "bg-gray-200 dark:bg-gray-800"}`}
                    ></div>
                    <div
                      className={`h-1 w-full rounded-full ${formData.password.length > 10 ? "bg-primary" : "bg-gray-200 dark:bg-gray-800"}`}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                    htmlFor="confirmPassword"
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
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Business Profile */}
            <section className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="text-[10px] font-bold tracking-widest uppercase text-gray-600 dark:text-gray-400">
                  Business Profile
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                    htmlFor="companyName"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                    htmlFor="contactPersonName"
                  >
                    Contact Person
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                    htmlFor="phone"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-1.5 overflow-hidden">
                  <label
                    className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                    htmlFor="businessType"
                  >
                    Business Type
                  </label>
                  <div className="relative">
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="appearance-none w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                    >
                      <option disabled value="">
                        Select business type...
                      </option>
                      <option value="Retailer">Retailer</option>
                      <option value="Wholesaler">Wholesaler</option>
                      <option value="Service Provider">Service Provider</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <span className="material-symbols-outlined">
                        unfold_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                  htmlFor="address"
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
                  placeholder="Street name, City, Postal Code"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-gray-500"
                />
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:brightness-105 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 uppercase tracking-widest text-[10px]"
              >
                {loading ? "Creating Account..." : "Create Business Account"}
              </button>
            </div>

            <p className="text-center text-[10px] font-bold text-gray-600 dark:text-gray-400 pt-4 uppercase tracking-widest leading-loose">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link to="/" className="text-primary hover:underline ml-1">
                LOG IN
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Column: Visual Sidebar */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary/95">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-slate-900/20 flex flex-col justify-center px-20">
          <div className="max-w-lg">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-10 border border-white/20">
              <span className="material-symbols-outlined text-3xl text-white">
                inventory_2
              </span>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 leading-[1.1]">
              Protect your shelves from stockouts.
            </h2>
            <p className="text-teal-50/80 text-lg leading-relaxed font-medium mb-12">
              Source with intelligence and join a resilient supply chain network
              built for modern commerce.
            </p>

            <div className="space-y-4">
              {/* Card 1: Trusted Suppliers */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-start gap-4 hover:bg-white/15 transition-colors">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-teal-300">
                    verified
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Trusted Suppliers
                  </h3>
                  <p className="text-teal-50/70 text-sm leading-relaxed">
                    Vetted partners to ensure product quality and delivery
                    reliability.
                  </p>
                </div>
              </div>

              {/* Card 2: Inventory Intelligence */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-start gap-4 hover:bg-white/15 transition-colors">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-teal-300">
                    auto_graph
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Inventory Intelligence
                  </h3>
                  <p className="text-teal-50/70 text-sm leading-relaxed">
                    Predictive analytics to help you order exactly what you
                    need.
                  </p>
                </div>
              </div>

              {/* Card 3: Unified Fulfillment */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-start gap-4 hover:bg-white/15 transition-colors">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-teal-300">
                    local_shipping
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Unified Fulfillment
                  </h3>
                  <p className="text-teal-50/70 text-sm leading-relaxed">
                    Manage all your orders from different suppliers in one
                    place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSmallBusiness;
