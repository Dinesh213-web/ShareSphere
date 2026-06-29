import { useEffect, useState } from "react";
import axios from "axios";
import "./BrowseResources.css";

function BrowseResources() {
  const [resources, setResources] = useState([]);
  const [requestedIds, setRequestedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResources, resBorrows] = await Promise.all([
          axios.get("http://localhost:3000/resources"),
          axios.get("http://localhost:3000/borrow-requests")
        ]);

        setResources(resResources.data);

        // Find resource IDs of pending borrow requests sent by the current user
        const myPendingRequests = resBorrows.data.filter(
          b => b.borrowerRollNumber === user.rollNumber && b.status === "Pending"
        );
        const pendingResourceIds = myPendingRequests.map(
          b => b.resourceId?._id || b.resourceId
        );
        setRequestedIds(pendingResourceIds);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load resources." });
      } finally {
        setLoading(false);
      }
    };

    if (user.rollNumber) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user.rollNumber]);

  const borrowResource = async (id, title) => {
    try {
      setMessage({ type: "", text: "" });
      // Instantly disable button visually in UI
      setRequestedIds(prev => [...prev, id]);

      await axios.post("http://localhost:3000/borrow", {
        resourceId: id,
        borrowerRollNumber: user.rollNumber
      });

      setMessage({ type: "success", text: `Borrow request sent for "${title}"!` });
    } catch (error) {
      // Revert UI change if request failed
      setRequestedIds(prev => prev.filter(reqId => reqId !== id));
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to send borrow request."
      });
    }
  };

  return (
    <div className="browse">
      <h1>Browse Resources</h1>
      <p className="browse-subtitle">Find and request academic tools shared by classmates</p>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading resources...</div>
      ) : (
        <div className="cards">
          {resources.length === 0 ? (
            <p className="no-items">No resources available at this time.</p>
          ) : (
            resources.map((item) => {
              const isOwner = item.ownerRollNumber === user.rollNumber;
              const isBorrowed = item.status === "Borrowed";
              const isRequested = requestedIds.includes(item._id);

              let buttonText = "Borrow";
              let isDisabled = false;

              if (isOwner) {
                buttonText = "My Resource";
                isDisabled = true;
              } else if (isBorrowed) {
                buttonText = "Unavailable";
                isDisabled = true;
              } else if (isRequested) {
                buttonText = "Request Sent";
                isDisabled = true;
              }

              return (
                <div className="card" key={item._id}>
                  <div className="card-header">
                    <h2>{item.title}</h2>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>

                  {item.image && (
                    <div className="card-image-container" style={{ margin: "12px 0", borderRadius: "10px", overflow: "hidden", height: "180px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", padding: "4px" }}>
                      <img src={item.image} alt={item.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                  )}

                  <p className="description">{item.description}</p>

                  <div className="details">
                    <p>
                      <b>Category:</b> {item.category}
                    </p>
                    <p>
                      <b>Condition:</b> {item.condition}
                    </p>
                    <p>
                      <b>Owner:</b> {isOwner ? "You" : item.ownerRollNumber}
                    </p>
                  </div>

                  <button
                    className={`borrow-btn ${isRequested ? "requested" : ""} ${isOwner ? "owner" : ""}`}
                    disabled={isDisabled}
                    onClick={() => borrowResource(item._id, item.title)}
                  >
                    {buttonText}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default BrowseResources;
