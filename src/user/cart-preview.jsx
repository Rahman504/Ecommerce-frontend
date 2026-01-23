import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { PaystackButton } from "react-paystack"; 

const CartPreview = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    phone: "",
  });

  const subtotal = cart.reduce((total, item) => {
    const price = item.product?.discountedPrice || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);

  const isFormFilled = shippingData.address.trim() !== "" && 
                       shippingData.city.trim() !== "" && 
                       shippingData.phone.trim() !== "";

 
 const handleSuccess = async (reference) => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user");

    if (!token) {
      Swal.fire("Error", "You must be logged in to complete the order", "error");
      return;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/orders/verify`,
      {
        reference: reference.reference,
        cart: cart,
        shippingAddress: shippingData,
        amount: subtotal,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Order Verified:", response.data);

    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/clear`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCart([]);
    localStorage.removeItem(`cart_${userId}`);

    Swal.fire({
      title: "Order Placed!",
      text: "Your payment was successful.",
      icon: "success",
    }).then(() => {
      navigate("/products");
    });

  } catch (error) {
    console.error("Verification Error:", error.response || error);
    
    Swal.fire({
      title: "Error!",
      text: error.response?.data?.message || "Failed to finalize order.",
      icon: "error",
    });
  }
};

  const componentProps = {
    reference: new Date().getTime().toString(),
    email: localStorage.getItem("user_email") || "customer@email.com",
    amount: Math.round(subtotal * 100),
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    metadata: {
        user_id: localStorage.getItem("user"),
        cart_items: cart.map(item => ({
            name: item.product.name,
            qty: item.quantity,
            price: item.product.discountedPrice
        })),
        shipping_address: shippingData
    },
    onSuccess: (ref) => handleSuccess(ref),
    onClose: () => console.log("Closed"),
  };

  if (cart.length === 0) return <div className="empty-preview">Cart is empty.</div>;

  return (
    <div className="your">
      <h2>{showForm ? "Delivery Details" : "Cart Preview"}</h2>
      <div className="cartdiv">
        <div className="cart-items cartsubdiv">
          {!showForm ? (
            cart.map((item) => (
              <div key={item.product?._id} className="cart-item">
                <img src={item.product?.imageUrl?.[0]} alt={item.product?.name} />
                <div className="details">
                  <h3>{item.product?.name}</h3>
                  <p>₦ {item.product?.discountedPrice.toLocaleString()}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="shipping-form">
              <input type="text" name="address" placeholder="Address" onChange={(e) => setShippingData({...shippingData, address: e.target.value})} />
              <input type="text" name="city" placeholder="City" onChange={(e) => setShippingData({...shippingData, city: e.target.value})} />
              <input type="text" name="phone" placeholder="Phone" onChange={(e) => setShippingData({...shippingData, phone: e.target.value})} />
              <button className="back-btn" onClick={() => setShowForm(false)}>Back</button>
            </div>
          )}
        </div>

        <div className="summary">
          <h2>Summary</h2>
          <article><p>Total:</p><h3>₦ {subtotal.toLocaleString()}</h3></article>
          
          <div className="checkout-btn">
            {!showForm ? (
              <button className="checkout" onClick={() => setShowForm(true)}>Proceed to Shipping</button>
            ) : (
              isFormFilled ? (
                <PaystackButton {...componentProps} className="checkout" />
              ) : (
                <button className="checkout disabled-btn" disabled>Please Fill Form</button>
              )
            )}
          </div>      
        </div>
      </div>
    </div>
  );
};

export default CartPreview;