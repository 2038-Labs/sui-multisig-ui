import React from "react";
import ReactDOM from "react-dom/client";
import App from "./index";
import "./index.css";
import MyApp from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App>
      <MyApp />
    </App>
  </React.StrictMode>
);
