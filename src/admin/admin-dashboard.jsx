import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("adminToken");



  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          console.error("No admin token found");
          navigate("/admin/login");
          return;
        }
  
        const response = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Admin Data Response:", response.data); 
  
        setAdmin(response.data.admin);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        navigate("/admin/login");
      }
    };
  
    fetchAdminData();
  }, [navigate]);
  

useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const tokenPayload = JSON.parse(atob(adminToken.split(".")[1])); 
      const expiry = tokenPayload.exp * 1000;

      if (Date.now() > expiry) {
        localStorage.removeItem("adminToken");
        toast.warning("Session expired. Please log in again.", {
          onClose: () => {
            navigate("/admin/login");
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
          localStorage.removeItem("adminToken");
  
          toast.success("Logged out successfully!", {
            onClose: () => {
              navigate("/admin/login");
            },
            autoClose: 3000,
          });
        }
      });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("Fetching admin products...");
                const response = await axios.get("http://localhost:5000/api/admin/products", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("API Response:", response.data);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error.response?.data?.message || error.message);
            }
        };

        fetchProducts();
    }, [token]);




  return (
    <div className="dashboard">
      <h1>Welcome, {admin?.fname} {admin?.lname}!</h1>
      <button onClick={handleLogout}>Logout</button>
      <Link to={"/admin/addproduct"} >
        <div className=''>
            <p>Add new product</p>
        </div>
      </Link>
      <h1>My Products</h1>
      <div className="all-products">
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    products.map((product) => (
                        <div className="productcard" key={product._id}>
                            <Link to={`/admin/products/${product._id}`} className="link">
                                <img src={product.imageUrl[0]} alt={product.name} />
                                <article>
                                    <p>{product.name}</p>
                                    <p>$ {product.discountedPrice.toFixed(2)}</p>
                                    <p id="price" style={{ marginTop: "2px" }}>$ {product.price}</p>
                                </article>
                            </Link>   
                        </div>
                    ))
                )}
            </div>      

    </div>
  );
};

export default AdminDashboard;
