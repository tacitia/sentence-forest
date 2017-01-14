/*global require:true*/
import 'babel-polyfill';
import d3 from 'd3';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import App from './components/App';
import appReducer from './reducers';
import { setAbstracts } from './actions/abstractActions';

const logger = createLogger();
const store = createStore(
  appReducer,
  applyMiddleware(thunk, logger)
);

d3.json('../data/abstracts.json', data => {
  console.log(data);
  store.dispatch(setAbstracts(data));
}, error => {
  console.log(error);
});

ReactDOM.render(
  (
    <div>
      <Provider store={store}>
        <App />
      </Provider>
    </div>
  ),
  document.getElementById('app')
);
