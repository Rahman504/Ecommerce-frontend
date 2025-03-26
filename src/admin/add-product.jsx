import React, { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProductPage = () => {
  
  const navigate = useNavigate();
  const [form, setForm] = useState({name: "", price: "", discount: "", imageUrl1: "", imageUrl2: "",imageUrl3: "",imageUrl4: "", description: ""})

  const inputChange = (e) => {
    setForm({...form, [e.target.name] :e.target.value})
  }
  
  const handleSubmit = (e) =>{
    e.preventDefault()
    const token = localStorage.getItem("adminToken"); 

    if (!token) {
      toast.error("Unauthorized! Please log in.");
      return;
    }
    const productData = {
      ...form,
      imageUrl: [form.imageUrl1, form.imageUrl2, form.imageUrl3, form.imageUrl4],
    };
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    })
    .then(() => {
      toast.success("Product created successfully!", {
              onClose: () => navigate(`/admin/dashboard`),
              autoClose: 3000, 
              })
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <section className="form addproduct">
      <form onSubmit={handleSubmit}>
        <div>
          <p>Name:</p>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Price:</p>
          <input
            className="price"
            type="number"
            name="price"
            placeholder="Enter product price"
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Discount</p>
          <input
            className="price"
            type="number"
            name="discount"
            placeholder="Enter discount"
            onChange={inputChange}
          />
        </div>
        <div>
          <p>Image URL 1:</p>
          <input
            type="url"
            name="imageUrl1"
            placeholder="Enter image url"
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Image URL 2:</p>
          <input
            type="url"
            name="imageUrl2"
            placeholder="Enter image url"
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Image URL 3:</p>
          <input
            type="url"
            name="imageUrl3"
            placeholder="Enter image url"
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Image URL 4:</p>
          <input
            type="url"
            name="imageUrl4"
            placeholder="Enter image url"
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Description:</p>
          <textarea name="description" onChange={inputChange} id=""></textarea>
        </div>
        <div>
          <button type="submit" className="submit-button">Add New Product</button>
        </div>

      </form>
    </section>
  );
};

export default AddProductPage;
