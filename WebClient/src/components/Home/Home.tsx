import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import Search from "./Search";
import Welcome from "./Welcome";
import AuthContext from "../Shared/Auth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const { AuthData } = React.useContext(AuthContext);
  const [clickedSearch, setClickedSearch] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // redirect users from /search to / if the specific path was selected
  React.useEffect(() => {
    if (location.pathname === "/search") {
      if (AuthData.isLoggedIn) {
        navigate("/");
      }
    }
  }, []);

  return (
    <>
      <Header setClickedSearch={setClickedSearch} />
      {AuthData.role === "anonymous" && !clickedSearch ? (
        <Welcome />
      ) : (
        <Search />
      )}
      <Footer />
    </>
  );
}
