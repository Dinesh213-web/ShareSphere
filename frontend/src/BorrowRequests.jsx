import { useEffect, useState } from "react";
import axios from "axios";
import "./BorrowRequests.css";

function BorrowRequests() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/borrow-requests")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const approve = async (id) => {
    await axios.put(
      `http://localhost:3000/borrow/${id}/approve`
    );

    window.location.reload();
  };

  const reject = async (id) => {
    await axios.put(
      `http://localhost:3000/borrow/${id}/reject`
    );

    window.location.reload();
  };

  return (
    <div className="requests">

      <h1>Borrow Requests</h1>

      <div className="request-cards">

        {requests.map((item) => (

          <div className="request-card" key={item._id}>

            <p>
              <b>Borrower:</b> {item.borrowerRollNumber}
            </p>

            <p>
              <b>Owner:</b> {item.ownerRollNumber}
            </p>

            <p>
              <b>Status:</b> {item.status}
            </p>

            {item.status === "Pending" && (

              <div className="buttons">

                <button
                  className="approve"
                  onClick={() => approve(item._id)}
                >
                  Approve
                </button>

                <button
                  className="reject"
                  onClick={() => reject(item._id)}
                >
                  Reject
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default BorrowRequests;