import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useParams, useNavigate, Link  } from 'react-router-dom';
import cartImg from '../icon-cart.svg';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backImg from "../back.png"

const ProductDetails = ({ cart, setCart }) => {
  const { id } = useParams();
  const [oneproduct, setOneProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

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
  
  const incrementQuantity = () => {
    if (quantity < oneproduct.countInStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning(`Only ${oneproduct.countInStock} items available in stock`);
    }
  };

  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

 const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      toast.error("Oops, you need to be logged in to add product to cart", {
        onClose: () => {
          localStorage.removeItem(`cart_${user}`);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        },
        autoClose: 3000,
      });
      return;
    }

    if (oneproduct.countInStock <= 0) {
      toast.error("Sorry, this item is currently out of stock");
      return;
    }

    let storedCart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
    const existingIndex = storedCart.findIndex(
      (item) => item.product?._id === oneproduct._id
    );

    if (existingIndex !== -1) {
      const totalQuantity = storedCart[existingIndex].quantity + quantity;
      if (totalQuantity > oneproduct.countInStock) {
        toast.error(`You cannot add more than ${oneproduct.countInStock} of this item`);
        return;
      }
      storedCart[existingIndex].quantity = totalQuantity;
    } else {
      storedCart.push({ product: oneproduct, quantity });
    }

    localStorage.setItem(`cart_${user}`, JSON.stringify(storedCart));
    setCart([...storedCart]); 

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/add`,
        { product: oneproduct._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item added to cart successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error adding to cart:", errorMessage);
      toast.error("Sync failed, but item saved locally.");
    }
  };
  
  if (!oneproduct) return <p>Loading...</p>;

  return (
    <div className='first'>
      <Link to="/products" className="back">
        <img src={backImg} alt="back" className='backimg'/>
        <p>Back to products page</p>
      </Link>
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
          <p style={{ color: oneproduct.countInStock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
            {oneproduct.countInStock > 0 ? `In Stock: ${oneproduct.countInStock}` : 'Out of Stock'}
          </p>
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

          <article className='add'>
            <div className='quantity-control'>
              <p onClick={decrementQuantity}>-</p>
              <h2>{quantity}</h2>
              <p onClick={incrementQuantity}>+</p>
            </div>
              <button 
                onClick={handleAddToCart} 
                disabled={oneproduct.countInStock <= 0}
                style={{ opacity: oneproduct.countInStock <= 0 ? 0.5 : 1, cursor: oneproduct.countInStock <= 0 ? 'not-allowed' : 'pointer' }}
              >
                <img src={cartImg} alt='cart' /> {oneproduct.countInStock > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
          </article>
        </div>
      </div>
      <div className='description'>
        <h1><u>Product Details</u></h1>
        <p>{oneproduct.description}</p>
      </div>
    </div>
  );
};

export default ProductDetails;