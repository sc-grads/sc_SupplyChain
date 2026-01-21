import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();

  // Initialize state with user data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.companyName || user?.name || "My Company", // Fallback logic
    businessType: user?.businessType || "Retail Distribution",
    address: user?.address || "",
    profileImage: user?.profileImage || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpdate = () => {
    // Simple prompt for URL for prototype purposes, or could be a file input
    const url = window.prompt(
      "Enter Profile Image URL:",
      formData.profileImage,
    );
    if (url !== null) {
      setFormData((prev) => ({ ...prev, profileImage: url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Update Profile Logic
    const result = await updateProfile({
      name: formData.name,
      phone: formData.phone,
      companyName: formData.companyName,
      businessCategory: formData.businessType, // businessType mapped to businessCategory in controller
      address: formData.address,
      contactPersonName: formData.name, // Keep synced for now
      profileImage: formData.profileImage,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
    );

    if (result.success) {
      toast.success("Password changed successfully.");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  // High contrast input classes
  const inputClasses =
    "w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white font-medium transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-gray-400";

  const labelClasses =
    "text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-6 lg:py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Update your personal and business information.
          </p>
        </header>

        <div className="space-y-12">
          {/* Profile Header Block */}
          <div className="flex items-center gap-6 pb-12 border-b border-gray-200 dark:border-gray-800">
            <div className="relative group">
              <div className="size-24 rounded-full bg-gray-100 dark:bg-gray-800 bg-center bg-cover border-2 border-white dark:border-gray-700 shadow-md flex items-center justify-center overflow-hidden">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-gray-400">
                    person
                  </span>
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 size-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary transition-colors shadow-sm"
                type="button"
                onClick={handleImageUpdate}
                title="Update Profile Photo"
              >
                <span className="material-symbols-outlined text-sm">
                  photo_camera
                </span>
              </button>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">
                {user?.name || "User Profile"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize font-medium">
                {user?.role?.toLowerCase().replace("_", " ")} Argument
              </p>
              <button
                onClick={handleImageUpdate}
                className="text-xs text-primary font-bold mt-1 hover:underline"
              >
                {formData.profileImage ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Personal Info Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Personal Info
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className={labelClasses}>Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    type="text"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Email Address</label>
                  <div className="relative">
                    <input
                      name="email"
                      value={formData.email}
                      readOnly
                      className={`${inputClasses} bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 cursor-not-allowed`}
                      type="email"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                      title="Verified Email"
                    >
                      <span className="material-symbols-outlined text-xl">
                        verified
                      </span>
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    type="tel"
                    placeholder="+27 (000) 000-0000"
                  />
                </div>
              </div>
            </section>

            {/* Business Details Section */}
            <section className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Business Details
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className={labelClasses}>Company Name</label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={inputClasses}
                    type="text"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Business Category</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none`}
                  >
                    <option>Retail Distribution</option>
                    <option>Wholesale</option>
                    <option>Manufacturing</option>
                    <option>Third-Party Logistics (3PL)</option>
                    <option>Freight Forwarding</option>
                    <option>Warehouse Management</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Office Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClasses}
                    rows="2"
                    placeholder="Enter registered business address"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Security
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Highly recommended for administrators
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={true}
                      onChange={() =>
                        toast.info("2FA toggle is simulated for demo.")
                      }
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Password Change Toggle */}
                {!isChangingPassword ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center gap-2 text-primary text-sm font-bold hover:opacity-80 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-lg">
                        lock
                      </span>
                      Change Password
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4 animate-in slide-in-from-top-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Update Password
                    </h3>
                    <div className="space-y-3">
                      <input
                        name="currentPassword"
                        type="password"
                        placeholder="Current Password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={inputClasses}
                      />
                      <input
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={inputClasses}
                      />
                      <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSubmitPassword}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="px-4 py-2 bg-transparent text-gray-500 text-xs font-bold uppercase rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Footer Actions */}
            <footer className="pt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                className="text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                onClick={() => {
                  setFormData({
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    companyName: user?.companyName || user?.name || "",
                    businessType: user?.businessType || "Retail Distribution",
                    address: user?.address || "",
                    profileImage: user?.profileImage || "",
                  });
                  toast.info("Form reset to original values.");
                }}
              >
                Reset all fields
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white font-bold px-10 py-3.5 rounded-lg hover:brightness-110 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </footer>
          </form>

          <p className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
            Last activity: {new Date().toLocaleDateString()} •{" "}
            <button
              onClick={logout}
              className="text-primary cursor-pointer hover:underline font-bold"
            >
              Logout
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
