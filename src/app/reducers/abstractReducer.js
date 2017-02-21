import { abstractActionTypes } from '../actions/abstractActions';

const initialState = {
  abstracts: null,
  selectedAbstract: 0,
  hoverSentence: -1
};
const abstractReducer = (state = initialState, action) => {
  switch(action.type) {
    case abstractActionTypes.SET_ABSTRACTS:
      return Object.assign({}, state, {
        abstracts: action.payload.abstracts
      });
    case abstractActionTypes.SET_SELECTED_ABSTRACT:
      return Object.assign({}, state, {
        selectedAbstract: action.payload.id,
        hoverSentence: -1
      });
    case abstractActionTypes.SET_HOVER_SENTENCE:
      return Object.assign({}, state, {
        hoverSentence: action.payload.sentenceId
      });
    default:
      return state;
  }
};

export default abstractReducer;