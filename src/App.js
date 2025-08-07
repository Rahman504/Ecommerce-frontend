import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom';
import Products from './user/product-list-page/products';
import cartImg from './icon-cart.svg';
import logo from './ecommerce-logo.png';
import ProductDetails from './user/product-details';
import Home from './pages/home';
import RegisterPage from './user/register';
import LoginPage from './user/login';
import Cart from './user/cart';
import AdminLoginPage from './admin/admin-login';
import AddProductPage from './admin/add-product';
import EditProductPage from './admin/edit-product';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartPreview from './user/cart-preview';
import Swal from "sweetalert2";
import AdminDashboard from './admin/admin-dashboard';
import AdminRoute from './component/admin-routes';
import AdminProductDetails from './admin/admin-product-details-page';

function App() {
  const [cart, setCart] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const totalItemsInCart = cart.length;
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
      setCart(storedCart);
    } else {
      setCart([]); 
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      if (cart.length === 0) {
        localStorage.removeItem(`cart_${user}`); 
      } else {
        localStorage.setItem(`cart_${user}`, JSON.stringify(cart)); 
      }
    }
  }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); 
      const expiry = tokenPayload.exp * 1000;

      if (Date.now() > expiry) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem(`cart_${localStorage.getItem("user")}`);
        toast.warning("Session expired. Please log in again.", {
          onClose: () => {
            navigate("/login");
            window.location.reload();
          },
          autoClose: 3000, 
        });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        const user = localStorage.getItem("user");
        if (user) {
          localStorage.removeItem(`cart_${user}`);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCart([]); 
        setIsLoggedIn(false);

        toast.success("Logged out successfully!", {
          onClose: () => {
            navigate("/login");
            window.location.reload();
          },
          autoClose: 3000,
        });
      }
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <header cart={cart}>
      <div className="nav">
        <div>
          <img src={logo} alt="logo" />
          {!isAdminPage && (
            <article className="navlink">
              {!isLoggedIn ? (
                <>
                  <Link to="/register" className="link">Register</Link>
                  <Link to="/login" className="link">Login</Link>
                </>
              ) : (
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              )}
              <div className="dropdown">
                <Link to="#" className="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  Account
                </Link>
                {isDropdownOpen && (
                  <div className="content">
                    {!isLoggedIn ? (
                      <>
                        <Link to="/register" className="links" onClick={() => setIsDropdownOpen(false)}>Register</Link>
                        <Link to="/login" className="links" onClick={() => setIsDropdownOpen(false)}>Login</Link>
                      </>
                    ) : (
                      <button className="links log" onClick={handleLogout}>Logout</button>
                    )}
                  </div>
                )}
              </div>
              <Link to="/cart" className="gotocart">
                <img src={cartImg} alt="cart" />
                <span className="cart-quantity">{totalItemsInCart}</span>
                <p className="cart">Cart</p>
              </Link>
            </article>
          )}
        </div>
      </div>
      </header>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/products" Component={Products} />
        <Route path="/products/:id" element={<ProductDetails cart={cart} setCart={setCart} />} />
        <Route path="/register" Component={RegisterPage} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/cart-preview" element={<CartPreview cart={cart}  setCart={setCart} />} />

        <Route
          path="/admin/login"
          element={
            <AdminRoute>
              <AdminLoginPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/addproduct"
          element={
            <AdminRoute>
              <AddProductPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/editproduct/:id"
          element={
            <AdminRoute>
              <EditProductPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/:id"
          element={
            <AdminRoute>
              <AdminProductDetails cart={cart} setCart={setCart}/>
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
