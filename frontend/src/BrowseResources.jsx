import { useEffect, useState } from "react";
import axios from "axios";
import "./BrowseResources.css";

function BrowseResources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/resources")

      .then((res) => {
        setResources(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);
const borrowResource = async (id) => {
  try {

    await axios.post("http://localhost:3000/borrow", {
      resourceId: id,
      borrowerRollNumber: "24761A1264"
    });

    alert("Borrow request sent!");

    window.location.reload();

  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="browse">
      <h1>Browse Resources</h1>

      <div className="cards">
        {resources.map((item) => (
          <div className="card" key={item._id}>
            <h2>{item.title}</h2>

            <p>
              <b>Category:</b> {item.category}
            </p>

            <p>
              <b>Condition:</b> {item.condition}
            </p>

            <p>
              <b>Status:</b>

              <span
                className={
                  item.status === "Borrowed" ? "borrowed" : "available"
                }
              >
                {item.status}
              </span>
            </p>

            <p>
              <b>Owner:</b> {item.ownerRollNumber}
            </p>

            <button
              className="borrow-btn"
              disabled={item.status === "Borrowed"}
              onClick={() => borrowResource(item._id)}
            >
              {item.status === "Borrowed" ? "Unavailable" : "Borrow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseResources;
