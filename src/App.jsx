import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import RegisterSupplier from "./pages/RegisterSupplier";
import RegisterSmallBusiness from "./pages/RegisterSmallBusiness";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import NewOrders from "./pages/NewOrders";
import SmallBusinessDashboard from "./pages/SmallBusinessDashboard";
import SmallBusinessOrders from "./pages/SmallBusinessOrders";
import SmallBusinessInventory from "./pages/SmallBusinessInventory";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register-selection" element={<AccountTypeSelection />} />
          <Route path="/register/supplier" element={<RegisterSupplier />} />
          <Route
            path="/register/small-business"
            element={<RegisterSmallBusiness />}
          />
          {/* Supplier Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-orders" element={<NewOrders />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element={<Inventory />} />
          {/* Small Business Routes */}
          <Route path="/small-business/dashboard" element={<SmallBusinessDashboard />} />
          <Route path="/small-business/orders" element={<SmallBusinessOrders />} />
          <Route path="/small-business/inventory" element={<SmallBusinessInventory />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

