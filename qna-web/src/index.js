// index.js
import React from "react";
import { createRoot } from "react-dom/client"; 
import "semantic-ui-css/semantic.min.css";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/Store";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const root = document.getElementById("root");
const reactRoot = createRoot(root);
const msalInstance = new PublicClientApplication(msalConfig);

reactRoot.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <App />
      </Provider>
    </MsalProvider>
  </React.StrictMode>
);
