import React from "react";
import Search from "./Search";
import Welcome from "./Welcome";
import AuthContext from "../Shared/Auth";

export default function Home() {
  const { AuthData } = React.useContext(AuthContext);

  return <>{AuthData.role === "anonymous" ? <Welcome /> : <Search />}</>;
}
