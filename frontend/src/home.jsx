import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="home-container">

      <nav className="navbar">

        <h2 className="logo">ShareSphere</h2>

        <div className="nav-links">

          <button onClick={() => navigate("/login")}>
            Login
          </button>

          <button onClick={() => navigate("/Signup")}>
            Signup
          </button>

        </div>

      </nav>

      <section className="hero">

        <h1>
          Share Academic Resources Across Campus
        </h1>

        <p>
          Borrow calculators, drafters, lab equipment,
          books and project materials from fellow students.
        </p>

        <button
          className="get-started-btn"
          onClick={() => navigate("/Signup")}
        >
          Get Started
        </button>

      </section>

      <section className="features">

        <h2>Why ShareSphere?</h2>

        <div className="feature-cards">

          <div className="card">

            <h3>🧮 Calculators</h3>

            <p>
              Share scientific calculators
              with students who need them.
            </p>

          </div>

          <div className="card">

            <h3>📐 Drawing Tools</h3>

            <p>
              Borrow drafters, mini drafters
              and engineering instruments.
            </p>

          </div>

          <div className="card">

            <h3>🔬 Lab Equipment</h3>

            <p>
              Access lab coats, kits,
              electronics boards and devices.
            </p>

          </div>

          <div className="card">

            <h3>🤝 Borrow Requests</h3>

            <p>
              Request resources and manage
              approvals easily.
            </p>

          </div>

        </div>

      </section>

    </div>

  );

}

export default Home;