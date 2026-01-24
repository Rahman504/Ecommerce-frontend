import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders(); // Refresh the list
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  if (loading) return <div className="loader">Loading Orders...</div>;

  return (
    <div className="admin-orders-container">
      <h2>Order Management</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <p><strong>{order.shippingAddress.address}</strong></p>
                <small>{order.shippingAddress.phone}</small>
              </td>
              <td>
                {order.orderItems.map((item, index) => (
                  <div key={index}>
                    {item.name} (x{item.qty})
                  </div>
                ))}
              </td>
              <td>₦{order.totalPrice.toLocaleString()}</td>
              <td>
                <span className={`badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                >
                  <option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;