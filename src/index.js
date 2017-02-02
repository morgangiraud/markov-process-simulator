import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import URL from 'url-parse'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

import { MarkovChain } from "./MarkovProcess"
import utils from "./utils"
import rootReducer from './reducers';
import App from './components/App';


let initialMarkovProcess
    , url = new URL(window.location.href, true)

if (url.query.data) {
  initialMarkovProcess = utils.importMarkovProcess(url.query.data)
} else {
  let states = [
    { seed: Math.random().toString(36).substr(2, 5) }
    , { seed: Math.random().toString(36).substr(2, 5) }
    ],
      P = [
      [0.5, 0.5],
      [0.5, 0.5]
    ];

  initialMarkovProcess = new MarkovChain(states, P)
}

let store = createStore(rootReducer, {
  mc: initialMarkovProcess,
  isViewer: "viewer" in url.query
}, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
