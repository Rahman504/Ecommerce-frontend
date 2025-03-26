import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({firstName: "", lastName: "", email: "", password: ""})
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const inputChange = (e) => {
    setForm({...form, [e.target.name] :e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("")
    const formData = {
      ...form
    };
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users`, formData)
    .then(() => {
        toast.success("Account created successfully!", {
                 onClose: () => navigate("/login"),
                 autoClose: 3000, 
               });
    })
    .catch(err => {
      setError(err.response?.data?.message)
    })
  };

  return (
    <section className="form">
      <h1 className="head">Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>First Name:</p>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            onChange={inputChange}
            value={form.firstName}
          />
        </div>
        <div>
          <p>Last Name:</p>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            onChange={inputChange}
            value={form.lastName}
          />
        </div>
        <div>
          <p>Email:</p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={inputChange}
            value={form.email}
          />
        </div>
        <div>
          <p>Password:</p>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            onChange={inputChange}
            value={form.password}
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
          <button type="submit" className="submit-button">Register</button>
        </div>

        <div className="last">
          <p>Already have an account? <Link to="/login" className="link login">Login</Link></p>
        </div>
      </form>
    </section>
  );
};

export default RegisterPage;
