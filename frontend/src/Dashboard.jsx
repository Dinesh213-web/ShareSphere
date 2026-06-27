import "./Dashboard.css";

function Dashboard() {

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

        <button>Browse Resources</button>

        <button>Add Resource</button>

        <button>Borrow Requests</button>

      </div>

    </div>

  );

}

export default Dashboard;