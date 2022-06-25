import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useSelector} from "react-redux";
const PrivateRoute = () => {
    const user = useSelector((state)=> state.userReducer);
    const auth = user.isLoggedIn;
    console.log("is user available:",auth)
    return auth ? <Outlet /> : <Navigate to="/signin" />;
}


export default PrivateRoute;