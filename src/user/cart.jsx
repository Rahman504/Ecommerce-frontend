import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import deleteImg from "../icon-delete.svg";
import cartImg from "../icon-cart.svg";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/cart`;

const Cart = ({ cart, setCart }) => {
    const navigate = useNavigate();
    useEffect(() => {
      const user = localStorage.getItem("user");
    
      if (!user) {
        setCart([]);
        localStorage.removeItem("cart"); 
        localStorage.removeItem("cart_null");
      } else {
        const storedCart = localStorage.getItem(`cart_${user}`);
        setCart(storedCart ? JSON.parse(storedCart) : []);
      }
    }, [setCart]);
    
    const saveCart = (updatedCart) => {
      const user = localStorage.getItem("user");
      if (user) {
        localStorage.setItem(`cart_${user}`, JSON.stringify(updatedCart));
      }
    };
    
  
  const fetchCart = useCallback(async () => {
    const storedToken = localStorage.getItem("token");  
    const user = localStorage.getItem("user");
  
    if (!storedToken || !user) {
      console.error("No token or user found. Redirecting to login...");
      return;
    }
  
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
  
      setCart(response.data.cart || []); 
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Failed to load cart. Please log in again.");
      navigate("/login")
    }
  }, [setCart, navigate]);
  

  useEffect(() => {
    fetchCart();
  }, [fetchCart]); 

  const handleRemove = async (id) => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("No token found. Cannot remove item.");
      return;
    }
  
    try {
      await axios.delete(`${API_URL}/remove/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
       const updatedCart = cart.filter(item => item.product?._id !== id);
        setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error);
    }
  };
  
  
  const handleQuantityChange = async (id, amount) => {
    const storedToken = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!storedToken || !user) {
      console.error("No token or user found. Cannot update quantity.");
      return;
    }
  
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.product?._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      );

      console.log("User in localStorage:", user);
      console.log("Updated Cart Before Saving:", updatedCart);
  
      if (user) {
        localStorage.setItem(`cart_${user}`, JSON.stringify(updatedCart));
        saveCart(updatedCart);
      }
      return updatedCart;
    });
  
    try {
      await axios.put(
        `${API_URL}/update`,
        { productId: id, quantity: cart.find((item) => item.product?._id === id).quantity + amount },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
  
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data || error);
    }
  };
  
  

  if (cart.length === 0) {
    return (
      <div className="empty">
        <img src={cartImg} alt="cart" />
        <p>Your cart is empty.</p>
        <Link to="/products" className="explore">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="your">
      <h2>Your Cart</h2>
      <div className="cartdiv">
        <div className="cartsubdiv">
        {cart.map((item) => {
          if (!item.product) return null; 
          return (
            <div key={item.product?._id || item._id} className="cart-item">
                <div className="div1">
                <Link to={`/products/${item.product?._id}`} style={{textDecoration: "none", color: "black"}}>
                  <article>
                      <img
                        src={item.product?.imageUrl?.[0]} 
                        alt={item.product?.name}
                      />
                      <h3 className="item-name">{item.product?.name}</h3>
                    </article>
                  </Link>
                  <article style={{backgroundColor: "red"}}>
                    {item.product?.discount > 0 ? (
                      <>
                        <p id="price-cart">
                          ₦ {item.product?.discountedPrice.toLocaleString('en-NG', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <article>
                          <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                            ₦ {item.product?.price.toLocaleString('en-NG', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p>-{item.product?.discount}%</p>
                        </article>
                      </>
                    ) : (
                      <p id="price-cart">
                        ₦ {item.product?.price.toLocaleString('en-NG', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    )}
                  </article>

                </div>
                <div className="div2">
                  <button onClick={() => handleRemove(item.product?._id)}>
                    <img src={deleteImg} alt="delete" />
                    Remove
                  </button>
                  <article>
                    <button onClick={() => handleQuantityChange(item.product?._id, -1)}>-</button>
                    <p>{item.quantity}</p>
                    <button onClick={() => handleQuantityChange(item.product?._id, 1)}>+</button>
                  </article>
                </div>
              </div>
          );
        })}

        
        </div>
        <div className="summary">
          <h2>Cart Summary</h2>
          <hr />
          <article>
            <p>Subtotal:</p>
            <h3>
            ₦
            {cart
              .reduce((total, item) => {
                const price = item.product?.discountedPrice || 0;
                const quantity = item.quantity || 0;
                return total + price * quantity;
              }, 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </article>
          <div className="checkout-btn">
            <Link to="/cart-preview" className="checkout">Proceed to Checkout</Link>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Cart;
