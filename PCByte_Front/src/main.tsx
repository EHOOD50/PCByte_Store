import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>

    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#0f172a",
          color: "#ffffff",
          border: "1px solid rgba(151, 207, 0, 0.35)",
          borderRadius: "14px",
          padding: "14px 18px",
        },
        success: {
          iconTheme: {
            primary: "#97cf00",
            secondary: "#0f172a",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0f172a",
          },
        },
      }}
    />
  </React.StrictMode>
);