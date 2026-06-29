import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalResources: 0,
    myResources: 0,
    pendingRequests: 0,
    borrowedItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resResources, resBorrows] = await Promise.all([
          axios.get("http://localhost:3000/resources"),
          axios.get("http://localhost:3000/borrow-requests")
        ]);

        const resources = resResources.data;
        const borrows = resBorrows.data;

        const totalResources = resources.length;
        const myResources = resources.filter(r => r.ownerRollNumber === user.rollNumber).length;
        const pendingRequests = borrows.filter(b => b.ownerRollNumber === user.rollNumber && b.status === "Pending").length;
        const borrowedItems = borrows.filter(b => b.borrowerRollNumber === user.rollNumber && b.status === "Approved").length;

        setMetrics({
          totalResources,
          myResources,
          pendingRequests,
          borrowedItems
        });
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user.rollNumber) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user.rollNumber]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="welcome-text">Welcome, {user.name || "Student"} 👋</p>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading dashboard details...</div>
      ) : (
        <>
          <div className="cards">
            <div className="card clickable-card" onClick={() => navigate("/resources")}>
              <h2>{metrics.totalResources}</h2>
              <p>Total Resources</p>
            </div>

            <div className="card clickable-card" onClick={() => navigate("/my-resources")}>
              <h2>{metrics.myResources}</h2>
              <p>My Resources</p>
            </div>

            <div className="card clickable-card" onClick={() => navigate("/borrow-requests")}>
              <h2>{metrics.pendingRequests}</h2>
              <p>Pending Requests</p>
            </div>

            <div className="card clickable-card" onClick={() => navigate("/borrow-requests")}>
              <h2>{metrics.borrowedItems}</h2>
              <p>Borrowed Items</p>
            </div>
          </div>

          <div className="buttons">
            <button onClick={() => navigate("/resources")}>Browse Resources</button>
            <button onClick={() => navigate("/add-resource")}>Add Resource</button>
            <button onClick={() => navigate("/my-resources")}>My Resources</button>
            <button onClick={() => navigate("/borrow-requests")}>Borrow Requests</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
