import { combineReducers } from 'redux';
import abstractReducer from './abstractReducer';

const appReducer = combineReducers({
  abstractReducer,
});

export default appReducer;