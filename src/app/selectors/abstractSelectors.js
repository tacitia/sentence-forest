import { createSelector } from 'reselect';

const getAbstracts = (state) => state.abstractReducer.abstracts;

export const getAbstractWithSentenceArrays = createSelector(
  [ getAbstracts ], 
  (abstracts) => {
    if (!abstracts) return [];
    return abstracts.map(a => {
      a.sentences = a.abstract.split('. ');
      return a;
    });
  }
);