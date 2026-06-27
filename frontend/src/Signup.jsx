import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <form className="signup-form">
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Join your campus community today</p>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                placeholder="e.g. 24761A1201"
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select defaultValue="IT">
                <option>IT</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>EEE</option>
                <option>MECH</option>
                <option>Civil</option>
                <option>ASE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Year of Study</label>
              <input
                type="number"
                min="1"
                max="4"
                placeholder="1-4"
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
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
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