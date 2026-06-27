import './LoginPage.css';

function LoginPage() {
  return (
    <div className="container">

      <div className="login-box">

        <h1>ShareSphere</h1>
        <p className="subtitle">
          Share Educational Resources Across Campus
        </p>

        <form>

          <label>Roll Number</label>

          <input
            className="form-input"
            type="text"
            placeholder="Enter Roll Number"
          />

          <label>Password</label>

          <input
            className="form-input"
            type="password"
            placeholder="Enter Password"
          />

          <button className="submit-btn">
            Login
          </button>

          <p className="forgot-password">
            Forgot Password?
          </p>

          <p className="signup">
            New to ShareSphere?
            <a href="#"> Register</a>
          </p>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;