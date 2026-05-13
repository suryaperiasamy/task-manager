import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css"; // We are importing our Vanilla CSS here

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap the entire app with AuthProvider so any component can access user state */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
