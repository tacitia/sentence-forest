// This reducer manages

import { conditionActionTypes } from '../actions/conditionActions';

const initialState = {
  abstractGroup: 5,
  abstractOrder: 'pos-neg',
  interfaceCondition: 'text-only',
  interfaceStage: 'instructions'
};

// This reducer manages two types of references: bookmarks and citations
// Bookmarks are associated with users regardless of the article; in other words,
// think of a user's bookmarks as the user's personal bibliography database
// Citations are associated with a pair of (userId, articleId)
const conditionReducer = (state = initialState, action) => {
  switch(action.type) {
    case conditionActionTypes.SET_ABSTRACT_GROUP:
      return Object.assign({}, state, {
        abstractGroup: action.payload.group
      });
    case conditionActionTypes.SET_ABSTRACT_ORDER:
      return Object.assign({}, state, {
        abstractOrder: action.payload.order
      });
    case conditionActionTypes.SET_INTERFACE_STAGE:
      return Object.assign({}, state, {
        interfaceStage: action.payload.stage
      });
    default:
      return state;
  }
};

export default conditionReducer;