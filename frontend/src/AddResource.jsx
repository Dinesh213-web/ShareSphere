import { useState } from "react";
import axios from "axios";
import "./AddResource.css";

function AddResource() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    condition: "",
    image: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleChange = (e) => {
    setMessage({ type: "", text: "" });
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setMessage({ type: "", text: "" });
    const file = e.target.files[0];
    if (file) {
      // Check file size (e.g. limit to 2MB to keep db documents small)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image is too large. Max size allowed is 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const { title, category, description, condition, image } = form;
    const ownerRollNumber = user.rollNumber;

    if (!title || !category || !description || !condition) {
      setMessage({ type: "error", text: "Please fill all fields." });
      return;
    }

    if (!ownerRollNumber) {
      setMessage({ type: "error", text: "Authentication error. Please re-login." });
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/add-resource", {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        condition,
        ownerRollNumber,
        image
      });

      setMessage({ type: "success", text: "Resource Added Successfully!" });
      setForm({
        title: "",
        category: "",
        description: "",
        condition: "",
        image: ""
      });
      // Clear file input manually
      const fileInput = document.getElementById("resource-image-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add resource. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-resource">
      <div className="form-box">
        <h1>Add Resource</h1>
        <p className="form-subtitle">Share books, draft tools, kits, or devices with campus peers</p>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Resource Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Scientific Calculator Casio fx-991EX"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Calculator, Drawing Tool, Book, Board"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter resource details (e.g. edition, accessories, pick-up location)"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select Condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div className="form-group">
            <label>Resource Image (Optional)</label>
            <input
              id="resource-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {form.image && (
              <div className="image-preview" style={{ marginTop: "10px", textAlign: "center" }}>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "150px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    objectFit: "cover"
                  }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding Resource..." : "Add Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddResource;