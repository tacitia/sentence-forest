import { xxxActionTypes } from '../actions/xxxActions';
import { SET_USER_ID, SET_COLLECTION_ID } from '../actions/identityActions';

const initialState = {
};

// This reducer manages two types of references: bookmarks and citations
// Bookmarks are associated with users regardless of the article; in other words,
// think of a user's bookmarks as the user's personal bibliography database
// Citations are associated with a pair of (userId, articleId)
const xxxReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_USER_ID:
      return Object.assign({}, state, {
        userId: action.payload.userId
      });
    case SET_COLLECTION_ID:
      return Object.assign({}, state, {
        collectionId: action.payload.collectionId
      });
    case xxxActionTypes.:
      return Object.assign({}, state, {
        selectedReference: action.payload.reference
      });
    default:
      return state;
  }
};

export default xxxReducer;