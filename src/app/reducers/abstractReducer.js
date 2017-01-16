import { abstractActionTypes } from '../actions/abstractActions';

const initialState = {
  abstracts: null,
  selectedAbstract: 0,
};
const abstractReducer = (state = initialState, action) => {
  switch(action.type) {
    case abstractActionTypes.SET_ABSTRACTS:
      return Object.assign({}, state, {
        abstracts: action.payload.abstracts
      });
    case abstractActionTypes.SET_SELECTED_ABSTRACT:
      return Object.assign({}, state, {
        selectedAbstract: action.payload.id
      });
    default:
      return state;
  }
};

export default abstractReducer;