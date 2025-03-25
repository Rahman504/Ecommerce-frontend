import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const user = localStorage.getItem("user");

    if (!token || !isAdmin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem(`cart_${user}`);

    }
  }, []);
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
  
    if (!adminToken) {
      navigate("/admin/login");
    }
  }, [navigate]);
  

  return children;
};

export default AdminRoute;
