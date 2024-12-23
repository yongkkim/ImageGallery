import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/app/app.tsx";

import { Provider } from "react-redux";
import store from "./src/app/store.ts";
import "./style.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
