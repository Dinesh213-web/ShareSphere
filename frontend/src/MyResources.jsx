import { useEffect, useState } from "react";
import axios from "axios";
import "./MyResources.css";

function MyResources() {

  const [resources, setResources] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:3000/resources")

      .then((res) => {

        const mine = res.data.filter(

          item => item.ownerRollNumber === "24761A1264"

        );

        setResources(mine);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  return (

    <div className="my-resources">

      <h1>My Resources</h1>

      <div className="cards">

        {resources.map(item => (

          <div className="card" key={item._id}>

            <h2>{item.title}</h2>

            <p>{item.category}</p>

            <p>{item.condition}</p>

            <p>{item.status}</p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default MyResources;