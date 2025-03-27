import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const CartPreview = ({ cart, setCart }) => {
  const navigate = useNavigate();
  if (cart.length === 0) {
    return (
      <div className="empty-preview">
        <p>No items in the cart.</p>
        <Link to="/products" className="explore">Start Shopping</Link>
      </div>
    );
  }


  const handleOrder = async () => {
    Swal.fire({
      title: "Are you sure you want to checkout?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm order!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
  
          const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/clear`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          console.log("Cart Clear Response Data:", response.data); 
  
          if (response.data.message === "Cart cleared successfully!") {
            setCart([]);
            localStorage.removeItem(`cart_${localStorage.getItem("user")}`);
            
            Swal.fire({
              title: "Order successfully placed!",
              text: "Your order was successful",
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
            }).then(() => navigate("/products"));
          } else {
            throw new Error("Failed to clear cart");
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
          Swal.fire("Error!", "Failed to place order.", "error");
        }
      }
    });
  };

  
  

  return (
    <div className="your">
      <h2>Cart Preview</h2>
      <div className="cartdiv">
        <div className="cart-items cartsubdiv">
          {cart.map((item) => (
            <div key={item.product?._id} className="cart-item">
              <img src={item.product?.imageUrl?.[0]} alt={item.product?.name} />
              <div className="details">
                <h3>{item.product?.name}</h3>
                <p>Price: ₦ {item.product?.discountedPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p>Quantity: {item.quantity}</p>
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
            <button className="checkout" onClick={handleOrder}>Checkout</button>
          </div>      
        </div>
      </div>
     
    </div>
  );
};


export default CartPreview;
