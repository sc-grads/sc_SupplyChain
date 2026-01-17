import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import RegisterSupplier from "./pages/RegisterSupplier";
import RegisterSmallBusiness from "./pages/RegisterSmallBusiness";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-selection" element={<AccountTypeSelection />} />
        <Route path="/register/supplier" element={<RegisterSupplier />} />
        <Route
          path="/register/small-business"
          element={<RegisterSmallBusiness />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;
