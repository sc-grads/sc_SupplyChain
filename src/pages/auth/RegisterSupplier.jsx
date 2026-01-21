import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterSupplier = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    businessEmail: "",
    phone: "",
    address: "",
    primaryGoods: "",
    password: "",
    confirmPassword: "",
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
      role: "SUPPLIER",
    });

    if (result.success) {
      alert("Registration successful! Redirecting to dashboard...");
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1115]">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white dark:bg-gray-900 shadow-xl z-10 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div
            className="inline-flex items-center text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-primary transition-colors mb-8 cursor-pointer uppercase tracking-widest text-[10px]"
            onClick={() => navigate("/register-selection")}
          >
            <span className="material-symbols-outlined text-lg mr-1">
              arrow_back
            </span>
            BACK
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Supplier Registration
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Join our network of trusted suppliers and grow your reach.
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
                  htmlFor="businessEmail"
                >
                  Business Email
                </label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  required
                  placeholder="contact@company.com"
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
                  placeholder="e.g. Acme Supplies Ltd."
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                />
              </div>

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
                  rows="3"
                  placeholder="Street name, City, Postal Code"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-1.5 overflow-hidden">
                <label
                  className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase px-1"
                  htmlFor="primaryGoods"
                >
                  Primary Goods
                </label>
                <div className="relative">
                  <select
                    id="primaryGoods"
                    name="primaryGoods"
                    value={formData.primaryGoods}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="appearance-none w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                  >
                    <option disabled value="">
                      Select your primary goods...
                    </option>
                    <option value="Hardware">Hardware</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Construction">Construction</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <span className="material-symbols-outlined">
                      unfold_more
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:brightness-105 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 uppercase tracking-widest text-[10px]"
              >
                {loading ? "Creating Account..." : "Create Supplier Account"}
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
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          alt="Modern bright logistics warehouse"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-Dy20B8jWXs8KBwZDABcHsL8F0fn71TQ00mfib2dJHfPZ2oQiRmBt3JJWk1A462gJHHLrF3aMHpFR9fmzCg2siaBDBl4ndCSaDUulfWEBsXk0O__jynwaiXp48-i32rue5It_FaRKZes789W3sD5rEYiW1gu_UkSWZHqFLYDmDQ0zw8cDaD9KARNCTnM1gSUfJjkjeX14xbA2vSXEVvb6ABUKGvRJRU6Gf77fApsaMwdubFeqAkKwVRlUap6Xa4Znv9ptB8iyxCNC"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-slate-900/40 flex flex-col justify-end p-20">
          <div className="max-w-md">
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex -space-x-3">
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdQbIuK-49xbRTlczbXvfYDzelW_GXmrdDUWjGXihKps5DlCpp8HyZcWqQqDqwA0ncIRk4M5AjbQw_IB9PkUzd5aKVb3_D2qSeEKMjPteh9ZtHSeY9snxUG3FyifyITqrU-rMoNrPhGnxKEDpfVXR4vXPpNUuwaKZIgrMRH3F_XNh4pL9xooE7LsLsjqgpD7FJwv4u5nJ3iRIQTSFBlJupIUt7SgvuiWb0OHpk-QGwIxTmblvDh4sR5m2guTYaJemArplsejyvyJ7N"
                />
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIzUl3VDdihg4YtGHagtkWSvr8cSq9qPI1a5dGKL1bFeGQAIp9qDpMgZsagrpUgEfJYfpbjVJsfKnTFT8w0PkervbtqDi0jQOVS4zZGXs3oqV61uovO6N7NE2NndPTLFhAhLZTUlR9AK_Hcw4Y-bSYScoPeCFCe3SKIppn3vBFudIiEoxUuOHD45wxEBAXHqlX4y3OV02Q9z7S_EoLAhw_Lb0JQ6jobwd6t3vlMXF4wQwgfUgRiBk6sv8aGlGzxkP_xfxuUkj2jE1F"
                />
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbVfdw4UAEHoTodEnZcsB_zPDzwjjX9doviUWFegBvJe6spQFA5eskNRpTrNwbBaZupJ18FJbkRKY07mDeVwaMLFykJhO-X2kW4i4MH-j07n7D_7VUoGTzLZV9eQlu_LOHOMcSye8PZWr3gdpTJHW-FtGp7LJDvjRM_2Im1JYB_Q2L2VQ3tQjv-dUoeoWYaIQbfipSkz0bU-WIptTr2ZRimFheIkYN8dme9CLRWvM5zU2q50j01sDcYaVRcU4_NNYjYBqExAgMgCM1"
                />
              </div>
              <span className="text-white text-xs font-bold uppercase tracking-widest opacity-80">
                Join 500+ trusted suppliers
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Stabilize your distribution today.
            </h2>
            <p className="text-teal-50/70 text-lg leading-relaxed font-medium">
              Access real-time inventory tools, streamlined invoicing, and a
              network of verified global buyers.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  98%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-teal-100/60">
                  Delivery Rate
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  24/7
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-teal-100/60">
                  Support Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSupplier;
