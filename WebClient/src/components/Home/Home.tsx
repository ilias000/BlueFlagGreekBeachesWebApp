import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import Search from "./Search";
import Welcome from "./Welcome";
import AuthContext from "../Shared/Auth";

export default function Home() {
  const [clickedSearch, setClickedSearch] = React.useState(false);
  const { AuthData } = React.useContext(AuthContext);

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
