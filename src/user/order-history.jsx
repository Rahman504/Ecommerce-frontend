import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import backImg from "../back.png";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/orders/myorders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="loader">Loading your orders...</div>;

  return (
    <div className="order-history-page">
        <div className="order-history-container">
        <Link to="/products" className="back">
            <img src={backImg} alt="back" className='backimg'/>
            <p>Back to products page</p>
        </Link>
            <h1 className="history-title">My Orders</h1>
            <div className="orders-grid">
            {orders.map((order) => (
                <div key={order._id} className="order-card">
                <div className="order-card-header">
                    <div>
                    <p className="label">Order ID</p>
                    <p className="value">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                    <p className="label">Date</p>
                    <p className="value">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="status-badge">Paid</div>
                </div>
                
                <div className="order-card-body">
                    {order.orderItems.map((item, idx) => (
                    <div key={idx} className="item-row">
                        <span>{item.name} <small>x{item.qty}</small></span>
                        <span>₦{item.price.toLocaleString()}</span>
                    </div>
                    ))}
                </div>

                <div className="order-card-footer">
                    <span>Total Amount</span>
                    <span className="total-price">₦{order.totalPrice.toLocaleString()}</span>
                </div>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
};

export default OrderHistory;