import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useParams, useNavigate, Link, useLocation  } from 'react-router-dom';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";



const AdminProductDetails = () => {
  const { id } = useParams();
  const [oneproduct, setOneProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  
useEffect(() => {
  const checkAdminStatus = () => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token); 
  };

  checkAdminStatus();
  
  window.addEventListener("storage", checkAdminStatus);

  setTimeout(() => setIsAdmin(!!localStorage.getItem("adminToken")), 200);

  return () => {
    window.removeEventListener("storage", checkAdminStatus);
  };
}, []);



  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`)
      .then((res) => {
        setOneProduct(res.data.product);
      })
      .catch((err) => console.error("Error fetching product:", err));
      
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 4),
    onSwipedRight: () => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + 4) % 4),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const handleImageClick = (index) => setCurrentImageIndex(index);

 

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Product deleted successfully.",
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
            }).then(() => navigate("/admin/dashboard")); 
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete product.", "error");
          });
      }
    });
  };
  
  if (!oneproduct) return <p>Loading...</p>;

  return (
    <div className='first'>
      <div className='product-details'>
        <div className='product'>
          <div className='main-image' {...handlers}>
            {Array.isArray(oneproduct.imageUrl) && oneproduct.imageUrl.length > 0 && (
              <img src={oneproduct.imageUrl[currentImageIndex]} alt={oneproduct.name} />
            )}
          </div>
          <div className='image-thumbnails'>
            {Array.isArray(oneproduct.imageUrl) && oneproduct.imageUrl.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${oneproduct.name} thumbnail ${index + 1}`}
                onClick={() => handleImageClick(index)}
                className={index === currentImageIndex ? 'active' : ''}
              />
            ))}
          </div>
        </div>
        <div className='info'>
          <h1>{oneproduct.name}</h1>
          <div>
          {oneproduct.discount > 0 ? (
            <>
              <article>
                <p>
                  ₦ {oneproduct.discountedPrice.toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p>-{oneproduct.discount}%</p>
              </article>
              <p id="price" style={{ textDecoration: 'line-through', color: 'gray' }}>
                ₦ {oneproduct.price.toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </>
          ) : (
           <p className='prices'>
              ₦ {oneproduct.discountedPrice.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </p>
          )}
          </div>
          {isAdmin && isAdminPage && (
            <div className="action">
              <Link className="edit" to={`/admin/editproduct/${id}`}>Edit Product</Link>
              <button onClick={handleDelete} className="delete">Delete Product</button>
            </div>
          )}
          
        </div>
      </div>
      <div className='description'>
        <h1><u>Product Details</u></h1>
        <p>{oneproduct.description}</p>
      </div>
    </div>
  );
};

export default AdminProductDetails;
