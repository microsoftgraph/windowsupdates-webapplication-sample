import React from "react";
import ReactDOM from "react-dom";
import { PublicClientApplication } from "@azure/msal-browser"; //MIT LICENSE < https://www.npmjs.com/package/@azure/msal-browser >
import { MsalProvider } from "@azure/msal-react"; //MIT LICENSE < https://github.com/AzureAD/microsoft-authentication-library-for-js >
import { msalConfig } from "./src/config/AuthConfig"; //LOCAL FILE

import App from "./src/App";
import "bootstrap/dist/css/bootstrap.min.css"; //MIT LICENSE < https://github.com/react-bootstrap/react-bootstrap >

const msalInstance = new PublicClientApplication(msalConfig);
ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
