import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    imageUrl4: "",
    discount: "",
    description: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        const product = res.data.product;
        setForm({
          name: product.name,
          price: product.price,
          imageUrl1: product.imageUrl[0] || "",
          imageUrl2: product.imageUrl[1] || "",
          imageUrl3: product.imageUrl[2] || "",
          imageUrl4: product.imageUrl[3] || "",
          description: product.description,
          discount: product.discount
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const inputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProductData = {
      ...form,
      imageUrl: [
        form.imageUrl1,
        form.imageUrl2,
        form.imageUrl3,
        form.imageUrl4,
      ],
    };
    axios.put(`http://localhost:5000/api/products/${id}`, updatedProductData)
      .then(() => {
        toast.success("Product updated successfully!", {
        onClose: () => navigate(`/products/${id}`),
        autoClose: 3000, 
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="form addproduct">
      <form onSubmit={handleSubmit}>
        <div>
          <p>Name:</p>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={form.name}
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
            value={form.price}
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Discount:</p>
          <input
          className="price"
            type="number"
            name="discount"
            placeholder="Enter discount"
            value={form.discount}
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Image URL 1:</p>
          <input
            type="url"
            name="imageUrl1"
            placeholder="Enter image url"
            value={form.imageUrl1}
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
            value={form.imageUrl2}
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
            value={form.imageUrl3}
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
            value={form.imageUrl4}
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <p>Description:</p>
          <textarea
            name="description"
            value={form.description}
            onChange={inputChange}
          />
        </div>
        <div>
          <button type="submit" className="submit-button">
            Update Product
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProductPage;
