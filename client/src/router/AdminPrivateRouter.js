import React from "react";
import { USER_INFO_KEY } from "../utils/util.enum";
import AdminLayout from "../layouts/AdminLayout";
import { Navigate } from "react-router-dom";

const AdminPrivateRouter = (props) => {
  let userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));

  return Number(userInfo && userInfo?.role) === 1 ? (
    <Navigate to="/" />
  ) : Number(userInfo && userInfo?.role) === 2 ? (
    <AdminLayout {...props} />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminPrivateRouter;
