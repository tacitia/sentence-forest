export const abstractActionTypes = {
  SET_ABSTRACTS: 'SET_ABSTRACTS',
  SET_SELECTED_ABSTRACT: 'SET_SELECTED_ABSTRACT',
  SET_HOVER_SENTENCE: 'SET_HOVER_SENTENCE'
};

export function setAbstracts(abstracts) {
  return {
    type: abstractActionTypes.SET_ABSTRACTS,
    payload: {
      abstracts
    }
  }
}

export function setSelectedAbstract(id) {
  return {
    type: abstractActionTypes.SET_SELECTED_ABSTRACT,
    payload: {
      id
    }
  }
}

export function setHoverSentence(sentenceId) {
  return {
    type: abstractActionTypes.SET_HOVER_SENTENCE,
    payload: {
      sentenceId
    }
  }
}