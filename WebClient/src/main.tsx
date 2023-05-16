import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    {import.meta.env.VITE_DEBUG === "true" ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <>
        <App />
      </>
    )}
  </>
);
