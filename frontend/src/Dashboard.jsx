import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <p>Welcome Dinesh 👋</p>

      <div className="cards">
        <div className="card">
          <h2>15</h2>

          <p>Resources</p>
        </div>

        <div className="card">
          <h2>4</h2>

          <p>My Resources</p>
        </div>

        <div className="card">
          <h2>2</h2>

          <p>Pending Requests</p>
        </div>

        <div className="card">
          <h2>3</h2>

          <p>Borrowed</p>
        </div>
      </div>

      <div className="buttons">
        <button onClick={() => navigate("/resources")}>Browse Resources</button>

        <button onClick={() => navigate("/add-resource")}>Add Resource</button>

        <button onClick={() => navigate("/my-resources")}>My Resources</button>

        <button onClick={() => navigate("/borrow-requests")}>
          Borrow Requests
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
