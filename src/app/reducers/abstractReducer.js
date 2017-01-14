import { abstractActionTypes } from '../actions/abstractActions';

const initialState = {
  abstracts: null,
  group: 0,
  order: 0
};
const abstractReducer = (state = initialState, action) => {
  switch(action.type) {
    case abstractActionTypes.SET_ABSTRACTS:
      return Object.assign({}, state, {
        abstracts: action.payload.abstracts
      });
    case abstractActionTypes.SET_ABSTRACT_GROUP:
      return Object.assign({}, state, {
        group: action.payload.group
      });
    case abstractActionTypes.SET_ABSTRACT_ORDER:
      return Object.assign({}, state, {
        order: action.payload.order
      });
    default:
      return state;
  }
};

export default abstractReducer;