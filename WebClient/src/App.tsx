import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import Home from "./components/Home/Home";
import Notifications from "./components/Notifications/Notifications";
import NotFound from "./components/Shared/NotFound";
import Header from "./components/Shared/Header";
import Footer from "./components/Shared/Footer";

const AppRouter = createBrowserRouter([
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={AppRouter} />
    </>
  );
}
