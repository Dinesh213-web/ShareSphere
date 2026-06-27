import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container"> 

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">ShareSphere</h2>
        <div className="nav-links">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>Share Resources with Your Community</h1>
        <p>Borrow and lend items easily. Join ShareSphere today!</p>
        <button className="get-started-btn" onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="features">
        <h2>What You Can Do</h2>
        <div className="feature-cards">

          <div className="card">
            <h3>📦 Add Resources</h3>
            <p>List items you own and are willing to share with others.</p>
          </div>

          <div className="card">
            <h3>🔍 Browse Items</h3>
            <p>Find resources posted by people in your community.</p>
          </div>

          <div className="card">
            <h3>🤝 Borrow & Lend</h3>
            <p>Send borrow requests and manage them from your dashboard.</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 ShareSphere. Made with ❤️ for communities.</p>
      </footer>

    </div>
  );
}

export default Home;