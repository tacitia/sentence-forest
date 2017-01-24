import { combineReducers } from 'redux';
import abstractReducer from './abstractReducer';
import conditionReducer from './conditionReducer';
import metaReducer from './metaReducer';

const appReducer = combineReducers({
  abstractReducer,
  conditionReducer,
  metaReducer
});

export default appReducer;