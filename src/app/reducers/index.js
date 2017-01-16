import { combineReducers } from 'redux';
import abstractReducer from './abstractReducer';
import conditionReducer from './conditionReducer';

const appReducer = combineReducers({
  abstractReducer,
  conditionReducer
});

export default appReducer;