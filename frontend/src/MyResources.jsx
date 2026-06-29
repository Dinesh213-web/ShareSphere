import { useEffect, useState } from "react";
import axios from "axios";
import "./MyResources.css";

function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    description: "",
    condition: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchMyResources = async () => {
      try {
        const res = await axios.get("/resources");
        const mine = res.data.filter(
          item => item.ownerRollNumber === user.rollNumber
        );
        setResources(mine);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load resources." });
      } finally {
        setLoading(false);
      }
    };

    if (user.rollNumber) {
      fetchMyResources();
    } else {
      setLoading(false);
    }
  }, [user.rollNumber]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setMessage({ type: "", text: "" });
      await axios.delete(`/resource/${id}`);
      
      // Update state instantly without reload
      setResources(prev => prev.filter(item => item._id !== id));
      setMessage({ type: "success", text: `Resource "${title}" deleted successfully.` });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete resource."
      });
    }
  };

  const startEdit = (item) => {
    setMessage({ type: "", text: "" });
    setEditingId(item._id);
    setEditForm({
      title: item.title,
      category: item.category,
      description: item.description || "",
      condition: item.condition,
      image: item.image || ""
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      setMessage({ type: "", text: "" });
      const res = await axios.put(`/resource/${id}`, editForm);
      
      // Update state instantly without reload
      setResources(prev =>
        prev.map(item => (item._id === id ? res.data.resource : item))
      );
      setEditingId(null);
      setMessage({ type: "success", text: "Resource updated successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update resource."
      });
    }
  };

  return (
    <div className="my-resources">
      <h1>My Resources</h1>
      <p className="my-resources-subtitle">Manage resources you have shared with the community</p>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading your resources...</div>
      ) : (
        <div className="cards">
          {resources.length === 0 ? (
            <p className="no-items">You haven't uploaded any resources yet.</p>
          ) : (
            resources.map((item) => (
              <div className="card" key={item._id}>
                {editingId === item._id ? (
                  <div className="edit-form">
                    <h3>Edit Resource</h3>
                    
                    <div className="edit-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="edit-group">
                      <label>Category</label>
                      <input
                        type="text"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="edit-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="edit-group">
                      <label>Condition</label>
                      <select
                        name="condition"
                        value={editForm.condition}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>

                    <div className="edit-group">
                      <label>Resource Image (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              setMessage({ type: "error", text: "Image is too large. Max size allowed is 2MB." });
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditForm(prev => ({ ...prev, image: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {editForm.image && (
                        <div className="image-preview" style={{ marginTop: "5px", textAlign: "center" }}>
                          <img src={editForm.image} alt="Preview" style={{ maxWidth: "80px", maxHeight: "80px", borderRadius: "4px", objectFit: "cover", border: "1px solid #e2e8f0" }} />
                        </div>
                      )}
                    </div>

                    <div className="edit-buttons">
                      <button className="save-btn" onClick={() => handleSaveEdit(item._id)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                    </div>

                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item._id, item.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyResources;