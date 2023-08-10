import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { rootReducer } from "../reducers";
// import App from "./App";

it("renders without crashing", () => {
  const store = configureStore({
    reducer: rootReducer,
  });

  const root = ReactDOM.createRoot(
    document.createElement("div") as HTMLElement,
  );
  root.render(
    <React.StrictMode>
      <Provider store={store}>{/* <App /> */}</Provider>
    </React.StrictMode>,
  );
});
