// App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import "semantic-ui-css/semantic.min.css";
import "./styles/styles.css";
import useAuthHandler from "./AuthHandler";

function App() {
  useAuthHandler();

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
