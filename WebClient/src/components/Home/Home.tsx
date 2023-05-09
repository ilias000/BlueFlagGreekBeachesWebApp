import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import Search from "./Search";
import Welcome from "./Welcome";

export default function Home() {
  const [isSearch, setIsSearch] = React.useState(false);
  return (
    <>
      <Header setIsSearch={setIsSearch} />
      {isSearch ? <Search /> : <Welcome />}
      <Footer />
    </>
  );
}
