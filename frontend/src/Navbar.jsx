import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
        <img src="/logo.jpg" alt="ShareSphere Logo" className="navbar-logo-img" /> ShareSphere
      </div>

      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Navigation">
        ☰
      </button>

      <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
        <Link to="/" className={`nav-item ${isActive("/")}`} onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/dashboard" className={`nav-item ${isActive("/dashboard")}`} onClick={() => setIsOpen(false)}>
          Dashboard
        </Link>
        <Link to="/resources" className={`nav-item ${isActive("/resources")}`} onClick={() => setIsOpen(false)}>
          Browse Resources
        </Link>
        <Link to="/add-resource" className={`nav-item ${isActive("/add-resource")}`} onClick={() => setIsOpen(false)}>
          Add Resource
        </Link>
        <Link to="/my-resources" className={`nav-item ${isActive("/my-resources")}`} onClick={() => setIsOpen(false)}>
          My Resources
        </Link>
        <Link to="/borrow-requests" className={`nav-item ${isActive("/borrow-requests")}`} onClick={() => setIsOpen(false)}>
          Borrow Requests
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
