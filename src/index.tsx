import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import logger from "redux-logger";

import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import { MarkovProcess } from "./MarkovProcess";
import utils from "./utils";
import { rootReducer } from "./reducers";
import App from "./components/App";
import { configureStore } from "@reduxjs/toolkit";

let initialMarkovProcess;
const url = new URL(window.location.href);

const data = url.searchParams.get("data");
if (data) {
  initialMarkovProcess = utils.importMarkovProcess(data);
} else {
  const states = [
      { seed: Math.random().toString(36).substr(2, 5) },
      { seed: Math.random().toString(36).substr(2, 5) },
    ],
    P = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

  initialMarkovProcess = new MarkovProcess(states, P);
}

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    mp: initialMarkovProcess,
    isViewer: !!url.searchParams.get("viewer"),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
