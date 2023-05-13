import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import Home from "./components/Home/Home";
import Notifications from "./components/Notifications/Notifications";
import NotFound from "./components/Shared/NotFound";
import Test from "./components/Shared/Test";
import Search from "./components/Home/Search";
import { AuthProvider } from "./components/Shared/Auth";

const AppRouter = createBrowserRouter([
  {
    // render admin page for admin
    path: "/admin",
    element: <Admin />,
  },
  {
    // render Welcome page for guests and search page for users
    path: "/",
    element: <Home />,
  },
  {
    // render search page for guests under /search
    path: "/search",
    element: <Search />,
  },
  {
    // render notifications page for users
    path: "/notifications",
    element: <Notifications />,
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
]);

export default function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={AppRouter} />
      </AuthProvider>
    </>
  );
}
