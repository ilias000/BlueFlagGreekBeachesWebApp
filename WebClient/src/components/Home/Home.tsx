import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";

export default function Home() {
  const [isSearch, setIsSearch] = React.useState(false);
  return (
    <>
      <Header setIsSearch={setIsSearch} />
      {isSearch ? <div>Search</div> : <div>Welcome</div>}
      <Footer />
    </>
  );
}
