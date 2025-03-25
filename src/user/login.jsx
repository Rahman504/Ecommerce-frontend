import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = ({ setIsLoggedIn, setCart }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const inputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", form);
      
      
      const token = response.data.token;
      const userId = response.data.userId;
      if (!userId) {
        console.error("Error: userId is missing from API response.");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", userId); 
      setIsLoggedIn(true);
      localStorage.removeItem("cart_null");


      const cartResponse = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userCart = cartResponse.data.cart || [];
      console.log("Fetched cart from API:", userCart);

      
      localStorage.setItem(`cart_${userId}`, JSON.stringify(userCart)); 
      setCart(userCart); 
      
     toast.success("Logged in successfully!", {
           onClose: () => navigate("/products"),
           autoClose: 3000, 
         });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <section className="form">
      <h1 className="head">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Email:</p>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={inputChange}
          />
        </div>

        <div className="password-container">
          <p>Password:</p>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Enter your password"
              onChange={inputChange}
            />
          </div>
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

        <div className="last">
          <p>Don't have an account? <Link to="/register" className="link login">Register</Link></p>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
