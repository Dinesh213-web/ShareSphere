import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rollNumber: "",
    password: ""
  });
  const [error, setError] = useState("");

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
    try {
      const res = await axios.post(
        "/login",
        form
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (

    <div className="login-container">

      <div className="login-box">

        <h1>ShareSphere</h1>

        <p className="subtitle">

          Share Educational Resources Across Campus

        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>

          <label>Roll Number</label>

          <input

            className="form-input"

            type="text"

            name="rollNumber"

            placeholder="Enter Roll Number"

            value={form.rollNumber}

            onChange={handleChange}

            required

          />

          <label>Password</label>

          <input

            className="form-input"

            type="password"

            name="password"

            placeholder="Enter Password"

            value={form.password}

            onChange={handleChange}

            required

          />

          <button

            className="submit-btn"

            type="submit"

          >

            Login

          </button>

          <p className="forgot-password">

            Forgot Password?

          </p>

          <p className="signup">

            New to ShareSphere?

            <Link to="/signup"> Register</Link>

          </p>

        </form>

      </div>

    </div>

  );

}

export default LoginPage;