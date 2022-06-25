import React from "react";
import { Navigate, Route } from "react-router-dom";
import {useSelector} from "react-redux";
function ProtectedRoute({ component: Component, ...restOfProps }) {
  const user = useSelector((state)=> state.userReducer);
  const isAuthenticated = user.isLoggedIn;
  console.log("this", isAuthenticated);

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Navigate to="/signin" />
      }
    />
  );
}

export default ProtectedRoute;
