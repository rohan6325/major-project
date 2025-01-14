/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  element: Component,
  isAuthenticated,
  requiredRole,
  userRole,
  ...rest
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate default page based on role
    const defaultRoutes = {
      admin: "/overview",
      voter: "/votecast",
    };
    return <Navigate to={defaultRoutes[userRole]}  />;
  }
  console.log("isAuthenticated:", isAuthenticated);
  console.log("userRole:", userRole);
  console.log("requiredRole:", requiredRole);
  console.log("Component:", Component);
  return <Component {...rest} />;
};

export default ProtectedRoute;
