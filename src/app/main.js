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

import AppContainer from './containers/AppContainer';
import appReducer from './reducers';
import { setAbstracts } from './actions/abstractActions';
import { setAbstractGroup, setAbstractOrder } from './actions/conditionActions';
import { fetchCSRFToken, setUserId, setStudyId } from './actions/metaActions';
import { getRandomString } from './utility';

const logger = createLogger();
const store = createStore(
  appReducer,
  applyMiddleware(thunk, logger)
);

d3.json('data/abstracts.json', data => {
  console.log(data);
  store.dispatch(setAbstracts(data));
  store.dispatch(setAbstractGroup(4));
  store.dispatch(setAbstractOrder('pos-neg'));
}, error => {
  console.log(error);
});

store.dispatch(setUserId(getRandomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')));
store.dispatch(setStudyId('T3-PN-mturk-batch1'));
store.dispatch(fetchCSRFToken());

ReactDOM.render(
  (
    <div>
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </div>
  ),
  document.getElementById('app')
);
