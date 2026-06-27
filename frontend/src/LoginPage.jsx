import './LoginPage.css';

function LoginPage() {
  return (
    <div>
      <h1>WELCOME</h1>

      <form>

        <label>Username:</label>
        <br />

        <input
          className="form-input"
          type="text"
          placeholder="Username"
        />

        <br />
        <br />

        <label>Password:</label>
        <br />

        <input
          className="form-input"
          type="password"
          placeholder="Password"
        />

        <br />
        <br />

        <button className="submit-btn">
          Login
        </button>

        <p className="forgot-password">
          <a href="#">Forgot Password?</a>
        </p>

        <p>
          Don't have an account?
          <a href="#"> Sign Up</a>
        </p>

      </form>

    </div>
  );
}

export default LoginPage;