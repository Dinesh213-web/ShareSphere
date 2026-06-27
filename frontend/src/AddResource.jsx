import { useState } from "react";
import axios from "axios";
import "./AddResource.css";

function AddResource() {

const [form,setForm]=useState({

title:"",
category:"",
description:"",
condition:"",
ownerRollNumber:""

});

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};

const handleSubmit=async(e)=>{

e.preventDefault();

try{

await axios.post(
"http://localhost:3000/add-resource",
form
);

alert("Resource Added Successfully");
setForm({
  title: "",
  category: "",
  description: "",
  condition: "",
  ownerRollNumber: ""
});
}catch(err){

console.log(err);

}

};

return(

<div className="add-resource">

<h1>Add Resource</h1>

<form onSubmit={handleSubmit}>

<input
name="category"
placeholder="Category"
onChange={handleChange}
required
/>

<textarea
name="description"
placeholder="Description"
onChange={handleChange}
required
/>

<select
name="condition"
onChange={handleChange}
required
>

<option value="">Condition</option>

<option>Excellent</option>

<option>Good</option>

<option>Fair</option>

</select>

<input

name="ownerRollNumber"

placeholder="Owner Roll Number"

onChange={handleChange}

/>

<button>

Add Resource

</button>

</form>

</div>

);

}

export default AddResource;