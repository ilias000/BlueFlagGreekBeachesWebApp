import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import AuthContext from "../Shared/Auth";
import { Navigate } from "react-router-dom";

export default function Notifications() {
  const { AuthData } = React.useContext(AuthContext);

  if (!AuthData.isLoggedIn) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <>
      <Header />
      <div>notifications</div>
      <Footer />
    </>
  );
}
