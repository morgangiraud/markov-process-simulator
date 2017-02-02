import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from '../src/reducers';
import App from '../src/components/App';

it('renders without crashing', () => {
  let store = createStore(rootReducer)
  const div = document.createElement('div');
  ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  div)
});
