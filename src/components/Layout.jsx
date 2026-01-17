import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper to determine active state for nav items
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#121615] dark:text-white min-h-screen flex flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <nav
        className={`${isSidebarOpen ? "w-64 items-start px-4" : "w-20 items-center"} transition-all duration-300 flex flex-col py-6 gap-2 border-r border-[#dde3e1] dark:border-gray-800 bg-white dark:bg-background-dark h-screen z-50`}
      >
        {/* Toggle Button & Logo Area */}
        <div
          className={`flex items-center gap-3 mb-8 w-full ${isSidebarOpen ? "pl-2" : "justify-center flex-col-reverse gap-4"}`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-primary"
          >
            <span className="material-symbols-outlined">menu_open</span>
          </button>

          <div className="flex items-center gap-3 text-primary">
            <div className="size-8 min-w-8">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                  fill="currentColor"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            {isSidebarOpen && (
              <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] dark:text-white whitespace-nowrap">
                EasyStock
              </h2>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className={`p-2 rounded-lg flex items-center gap-3 w-full ${isSidebarOpen ? "justify-start" : "justify-center"} ${isActive("/dashboard") ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          {isSidebarOpen && (
            <span className="font-medium whitespace-nowrap">Dashboard</span>
          )}
        </button>
        <button
          onClick={() => navigate("/orders")}
          className={`p-2 rounded-lg flex items-center gap-3 w-full ${isSidebarOpen ? "justify-start" : "justify-center"} ${isActive("/orders") ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <span className="material-symbols-outlined">local_shipping</span>
          {isSidebarOpen && (
            <span className="font-medium whitespace-nowrap">Orders</span>
          )}
        </button>
        <button
          onClick={() => navigate("/inventory")}
          className={`p-2 rounded-lg flex items-center gap-3 w-full ${isSidebarOpen ? "justify-start" : "justify-center"} ${isActive("/inventory") ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <span className="material-symbols-outlined">inventory_2</span>
          {isSidebarOpen && (
            <span className="font-medium whitespace-nowrap">Inventory</span>
          )}
        </button>
        <button
          className={`p-2 rounded-lg flex items-center gap-3 w-full ${isSidebarOpen ? "justify-start" : "justify-center"} text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`}
        >
          <span className="material-symbols-outlined">analytics</span>
          {isSidebarOpen && (
            <span className="font-medium whitespace-nowrap">Analytics</span>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => navigate("/")}
          className={`p-2 rounded-lg flex items-center gap-3 w-full ${isSidebarOpen ? "justify-start" : "justify-center"} text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 mt-auto`}
        >
          <span className="material-symbols-outlined">logout</span>
          {isSidebarOpen && (
            <span className="font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header - Now only User/Notifications */}
        <header className="sticky top-0 z-40 flex items-center justify-end border-b border-solid border-[#dde3e1] dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3 lg:px-10 h-16">
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f1f4f3] dark:bg-gray-800 text-[#121615] dark:text-gray-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold">Nature's Best Ltd</span>
                <span className="text-xs text-gray-500">Supplier Account</span>
              </div>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
                data-alt="Portrait of supplier account manager"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgl1LL2EVHoZFwZ4AQfL3F2k8y1aNpRXhF9u1v9ljOr0r8qHIig0az1sR_OFeivDudTp-FS8Mb-C8iWKvzND_oqauaiFyX5vLGaFhzkzgJe8Jdqp_Xjz4HCbE7wMWj0koDSUIz4ugZt6inWd6w9q9HQZtTOZ8gPfkWpZdj9bPVHeL53usgQm1_PAv922cmnRnGhTTjpf_ztoTXfhJSpobJLQ17jc1aHe_9VO1-a14Mo3rfvL6S9_UMfDdXBNfDTb-7EbiHuHwSC_pV")',
                }}
              ></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 bg-background-light dark:bg-background-dark/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
