import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "IT",
    year: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, rollNumber, department, year, password, confirmPassword } = form;

    if (!name || !email || !rollNumber || !department || !year || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address format.");
      return;
    }

    // Roll number format validation (e.g. 24761A1201)
    const rollRegex = /^2\d76\d[A-Z]\d{4}$/;
    if (!rollRegex.test(rollNumber.trim().toUpperCase())) {
      setError("Invalid Roll Number. Format should be like 24761A1201.");
      return;
    }

    // Year validation
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
      setError("Year of study must be between 1 and 4.");
      return;
    }

    // Password length validation
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rollNumber: rollNumber.trim().toUpperCase(),
        department,
        year: yearNum,
        password
      });

      setSuccess(res.data.message || "Registration Successful! Redirecting to login...");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleReset = () => {
    setError("");
    setSuccess("");
    setForm({
      name: "",
      email: "",
      rollNumber: "",
      department: "IT",
      year: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <form className="signup-form" onSubmit={handleSubmit} onReset={handleReset}>
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Join your campus community today</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                placeholder="e.g. 24761A1201"
                value={form.rollNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select 
                name="department" 
                value={form.department} 
                onChange={handleChange}
                required
              >
                <option value="IT">IT</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="Civil">Civil</option>
                <option value="ASE">ASE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Year of Study</label>
              <input
                type="number"
                name="year"
                min="1"
                max="4"
                placeholder="1-4"
                value={form.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group empty-group">
              {/* Grid spacer */}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="button-group">
            <button className="submit-btn" type="submit">
              Register
            </button>
            <button className="reset-btn" type="reset">
              Clear
            </button>
          </div>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;