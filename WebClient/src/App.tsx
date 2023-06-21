import React from "react";
import { AuthProvider } from "./components/Shared/Auth";
import AuthContext from "./components/Shared/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import NotFound from "./components/Shared/NotFound";
import Test from "./components/Shared/Test";
import Search from "./components/Home/Search";
import Welcome from "./components/Home/Welcome";
import { Navigate } from "react-router-dom";

export default function App() {
  return (
    <AuthProvider>
      <Views />
    </AuthProvider>
  );
}

function Views() {
  const { AuthData } = React.useContext(AuthContext);

  const ViewRouter = React.useMemo(
    () =>
      createBrowserRouter([
        {
          // render admin page for admin
          path: "/admin",
          element: <>{AuthData.role === "admin" ? <Admin /> : <Navigate to={"/"} />}</>,
        },
        {
          // render Welcome page for guests and search page for users
          path: "/",
          element: <>{AuthData.isLoggedIn ? <Search /> : <Welcome />}</>,
        },
        {
          // render search page for guests under /search
          path: "/search",
          element: <>{AuthData.role === "anonymous" ? <Search /> : <Navigate to={"/"} />}</>,
        },
        {
          // test page for quickly testing css and javascript
          path: "/test",
          element: <Test />,
        },
        {
          // any route that does not match any of the above should render NotFound component
          path: "*",
          element: <NotFound />,
        },
      ]),
    [AuthData]
  );
  return <RouterProvider router={ViewRouter} />;
}
