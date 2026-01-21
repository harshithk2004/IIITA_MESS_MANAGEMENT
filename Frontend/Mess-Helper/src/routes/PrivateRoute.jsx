import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth(); // Destructure loading

  if (loading) return <div>Loading...</div>; // Add this line
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;