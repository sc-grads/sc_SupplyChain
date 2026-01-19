import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { InventoryProvider } from "./context/InventoryContext";
// Auth
import Login from "./pages/auth/Login";
import AccountTypeSelection from "./pages/auth/AccountTypeSelection";
import RegisterSupplier from "./pages/auth/RegisterSupplier";
import RegisterSmallBusiness from "./pages/auth/RegisterSmallBusiness";
// Supplier
import Dashboard from "./pages/supplier/Dashboard";
import Orders from "./pages/supplier/Orders";
import Inventory from "./pages/supplier/Inventory";
import NewOrders from "./pages/supplier/NewOrders";
// Small Business
import SmallBusinessDashboard from "./pages/small-business/SmallBusinessDashboard";
import SmallBusinessOrders from "./pages/small-business/SmallBusinessOrders";
import SmallBusinessInventory from "./pages/small-business/SmallBusinessInventory";

import SmallBusinessOrderDetails from "./pages/small-business/SmallBusinessOrderDetails";

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <InventoryProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/register-selection"
                element={<AccountTypeSelection />}
              />
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
              <Route
                path="/small-business/dashboard"
                element={<SmallBusinessDashboard />}
              />
              <Route
                path="/small-business/orders"
                element={<SmallBusinessOrders />}
              />
              <Route
                path="/small-business/orders/:orderId"
                element={<SmallBusinessOrderDetails />}
              />
              <Route
                path="/small-business/inventory"
                element={<SmallBusinessInventory />}
              />
            </Routes>
          </Router>
        </InventoryProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
