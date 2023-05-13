import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import AuthContext from "../Shared/Auth";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const { AuthData } = React.useContext(AuthContext);

  const navigate = useNavigate();
  React.useEffect(() => {
    if (!AuthData.isLoggedIn) {
      navigate("/");
    }
  }, [AuthData]);

  return (
    <>
      <Header />
      <div>notifications</div>
      <Footer />
    </>
  );
}
