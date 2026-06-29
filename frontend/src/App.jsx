import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import BrowseResources from "./BrowseResources";
import AddResource from "./AddResource";
import BorrowRequests from "./BorrowRequests";
import MyResources from "./MyResources";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="app-content">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<BrowseResources />} />
          <Route path="/add-resource" element={<AddResource />} />
          <Route path="/borrow-requests" element={<BorrowRequests />} />
          <Route path="/my-resources" element={<MyResources />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
