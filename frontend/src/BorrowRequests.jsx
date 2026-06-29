import { useEffect, useState } from "react";
import axios from "axios";
import "./BorrowRequests.css";

function BorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/borrow-requests");
        setRequests(res.data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load borrow requests." });
      } finally {
        setLoading(false);
      }
    };

    if (user.rollNumber) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [user.rollNumber]);

  const approve = async (id) => {
    try {
      setMessage({ type: "", text: "" });
      await axios.put(`/borrow/${id}/approve`);
      
      // Update state instantly without page refresh
      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Approved" } : item
        )
      );
      setMessage({ type: "success", text: "Borrow request approved successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to approve request."
      });
    }
  };

  const reject = async (id) => {
    try {
      setMessage({ type: "", text: "" });
      await axios.put(`/borrow/${id}/reject`);
      
      // Update state instantly without page refresh
      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Rejected" } : item
        )
      );
      setMessage({ type: "success", text: "Borrow request rejected successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to reject request."
      });
    }
  };

  // Filter incoming and outgoing requests
  const incomingRequests = requests.filter(
    (item) => item.ownerRollNumber === user.rollNumber
  );
  
  const outgoingRequests = requests.filter(
    (item) => item.borrowerRollNumber === user.rollNumber
  );

  return (
    <div className="requests-container">
      <h1>Borrow Requests</h1>
      <p className="requests-subtitle">Manage incoming approvals and track your sent request statuses</p>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading request details...</div>
      ) : (
        <div className="requests-grid">
          {/* Section 1: Incoming Requests */}
          <div className="requests-section">
            <h2>Incoming Requests (Needs Approval)</h2>
            {incomingRequests.length === 0 ? (
              <p className="no-requests">No incoming borrow requests on your items.</p>
            ) : (
              <div className="request-cards">
                {incomingRequests.map((item) => (
                  <div className="request-card" key={item._id}>
                    <div className="request-card-header">
                      <h3>{item.resourceId?.title || "Unknown Resource"}</h3>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="request-details">
                      <p><b>Borrower Roll No:</b> {item.borrowerRollNumber}</p>
                      <p><b>Category:</b> {item.resourceId?.category || "N/A"}</p>
                      <p><b>Condition:</b> {item.resourceId?.condition || "N/A"}</p>
                    </div>

                    {item.status === "Pending" && (
                      <div className="buttons">
                        <button
                          className="approve-btn"
                          onClick={() => approve(item._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => reject(item._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Outgoing Requests */}
          <div className="requests-section">
            <h2>My Sent Requests</h2>
            {outgoingRequests.length === 0 ? (
              <p className="no-requests">You haven't requested any resources yet.</p>
            ) : (
              <div className="request-cards">
                {outgoingRequests.map((item) => (
                  <div className="request-card" key={item._id}>
                    <div className="request-card-header">
                      <h3>{item.resourceId?.title || "Unknown Resource"}</h3>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="request-details">
                      <p><b>Owner Roll No:</b> {item.ownerRollNumber}</p>
                      <p><b>Category:</b> {item.resourceId?.category || "N/A"}</p>
                      <p><b>Condition:</b> {item.resourceId?.condition || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BorrowRequests;