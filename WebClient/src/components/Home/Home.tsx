import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import Search from "./Search";
import Welcome from "./Welcome";
import AuthContext from "../Shared/Auth";

export default function Home() {
  const [isSearch, setIsSearch] = React.useState(false);
  const { AuthData } = React.useContext(AuthContext);

  return (
    <>
      <Header setIsSearch={setIsSearch} />
      {isSearch || AuthData.isLoggedIn ? <Search /> : <Welcome />}
      <Footer />
    </>
  );
}
