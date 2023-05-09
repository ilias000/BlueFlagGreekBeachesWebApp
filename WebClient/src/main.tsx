import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/index.css";

const debug = true; // if true, components render twice to find errors

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    {debug ? (
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
