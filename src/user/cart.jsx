import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import deleteImg from "../icon-delete.svg";
import cartImg from "../icon-cart.svg";
import backImg from "../back.png";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/cart`;

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();

 const fetchCart = useCallback(async () => {
  const storedToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!storedToken || !user) {
    setCart([]);
    return;
  }

  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    
    const fetchedCart = response.data.cart || [];
    setCart(fetchedCart);

    if (fetchedCart.length === 0) {
      localStorage.removeItem(`cart_${user}`);
    } else {
      localStorage.setItem(`cart_${user}`, JSON.stringify(fetchedCart));
    }
  } catch (error) {
    console.error(error);
  }
}, [setCart]);

useEffect(() => {
  const user = localStorage.getItem("user");
  if (!user) {
    setCart([]);
    localStorage.removeItem("cart");
  } else {
    fetchCart();
  }
}, [fetchCart, setCart]);

  const handleRemove = async (productId) => {
    if (!productId) return;
    const updatedCart = cart.filter((item) => item.product?._id !== productId);
    setCart(updatedCart);
    const user = localStorage.getItem("user");
    if (user) localStorage.setItem(`cart_${user}`, JSON.stringify(updatedCart));
    const storedToken = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/remove/${productId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = async (id, amount) => {
    const storedToken = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!storedToken || !user) return;

    const currentItem = cart.find((item) => item.product?._id === id);
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + amount);

    const updatedCart = cart.map((item) =>
      item.product?._id === id ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem(`cart_${user}`, JSON.stringify(updatedCart));

    try {
      await axios.put(
        `${API_URL}/update`,
        { productId: id, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
    } catch (error) {
      console.error("Sync failed");
    }
  };

  const validCart = cart.filter((item) => item && item.product && item.product._id);

  if (validCart.length === 0) {
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
      <Link to="/products" className="back">
        <img src={backImg} alt="back" className="backimg" />
        <p>Back to products page</p>
      </Link>
      <h2>Your Cart</h2>
      <div className="cartdiv">
        <div className="cartsubdiv">
          {validCart.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="div1">
                <Link to={`/products/${item.product._id}`} style={{ textDecoration: "none", color: "black" }}>
                  <article>
                    <img src={item.product.imageUrl?.[0]} alt={item.product.name} />
                    <h3 className="item-name">{item.product.name}</h3>
                  </article>
                </Link>
                <article>
                  {item.product.discount > 0 ? (
                    <>
                      <p id="price-cart">
                        ₦ {item.product.discountedPrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </p>
                      <article>
                        <p style={{ textDecoration: "line-through", color: "gray" }}>
                          ₦ {item.product.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </p>
                        <p>-{item.product.discount}%</p>
                      </article>
                    </>
                  ) : (
                    <p id="price-cart" style={{ width: "40%" }}>
                      ₦ {item.product.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </article>
              </div>
              <div className="div2">
                <button onClick={() => handleRemove(item.product._id)}>
                  <img src={deleteImg} alt="delete" /> Remove
                </button>
                <article>
                  <button onClick={() => handleQuantityChange(item.product._id, -1)}>-</button>
                  <p>{item.quantity}</p>
                  <button onClick={() => handleQuantityChange(item.product._id, 1)}>+</button>
                </article>
              </div>
            </div>
          ))}
        </div>
        <div className="summary">
          <h2>Cart Summary</h2>
          <hr />
          <article>
            <p>Subtotal:</p>
            <h3>
              ₦ {validCart.reduce((total, item) => {
                const price = item.product.discountedPrice || item.product.price || 0;
                return total + price * item.quantity;
              }, 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
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