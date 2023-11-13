import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found for booting react app");

ReactDOM.createRoot(root).render(
  <GoogleOAuthProvider clientId="715515051528-imrmuo2qvovrqcj56niub971f6anrtlm.apps.googleusercontent.com">
    <React.StrictMode>
      <AppProvider i18n={enTranslations}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
