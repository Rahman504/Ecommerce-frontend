import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/login`, formData);
      
      const { token } = response.data;
      if (token) {
        localStorage.setItem("adminToken", token);
        toast.success("Logged in successfully!", {
          onClose: () => navigate("/admin/dashboard"),
          autoClose: 3000, 
        });
      } else {
        setError("Failed to retrieve token.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };
  

  return (
    <section className="form">
      <h1 className="head">Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Email:</p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <p>Password:</p>
          <input
            type={showPassword ? "text" : "password"} 
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="checkbox">
              <input
                type="checkbox"
                id="showPassword"
                style={{ marginRight: "5px", padding: "10px" }} 
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" style={{fontSize: ".8rem", fontWeight: "700", color: "#fff"}}> Show Password</label>
          </div>
        </div>
        {error && <p style={{ color: "red"}} className="error">{error}</p>} 
        <div>
          <button type="submit" className="submit-button">Login</button>
        </div>
      </form>
    </section>
  );
};

export default AdminLoginPage;
