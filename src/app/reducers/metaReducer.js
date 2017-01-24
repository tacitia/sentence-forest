import { metaActionTypes } from '../actions/metaActions';

const initialState = {
  studyId: '',
  userId: ''
};

// This reducer manages two types of references: bookmarks and citations
// Bookmarks are associated with users regardless of the article; in other words,
// think of a user's bookmarks as the user's personal bibliography database
// Citations are associated with a pair of (userId, articleId)
const metaReducer = (state = initialState, action) => {
  switch(action.type) {
    case metaActionTypes.SET_STUDY_ID:
      return Object.assign({}, state, {
        studyId: action.payload.studyId
      });
    default:
      return state;
  }
};

export default metaReducer;