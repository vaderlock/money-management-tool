import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import store from "./redux/store";
import { Provider } from "react-redux";

//create root element
const root = ReactDOM.createRoot(document.getElementById("root"));
// render the App component inside the root element, with dependencies wrapped around it
root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <NotificationsProvider position="top-center">
      <Provider store={store}>
        <App />
      </Provider>
    </NotificationsProvider>
  </MantineProvider>
);

//report web vitals
reportWebVitals();
