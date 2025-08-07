import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useParams, useNavigate  } from 'react-router-dom';
import cartImg from '../icon-cart.svg';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
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
    
    let storedCart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
    const existingProduct = storedCart.find((item) => item._id === oneproduct._id);
  
    if (existingProduct) {
      storedCart = storedCart.map((item) =>
        item._id === oneproduct._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      storedCart.push({ ...oneproduct, quantity });
    }
    localStorage.setItem(`cart_${user}`, JSON.stringify(storedCart));
    setCart([...storedCart]);

  
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/add`,
        { product: oneproduct._id, quantity },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Item added to cart successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
      console.error("Error adding to cart:", errorMessage);
      toast.error(errorMessage);
      navigate("/login")
    }
    console.log("Cart before adding:", cart);
    console.log("Stored cart in localStorage:", JSON.parse(localStorage.getItem(`cart_${localStorage.getItem("user")}`)));
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
           <p className='price'>
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
              <button onClick={handleAddToCart}>
                <img src={cartImg} alt='cart' /> Add to Cart
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
