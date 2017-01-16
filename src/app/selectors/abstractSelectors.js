import { createSelector } from 'reselect';

const getAbstracts = (state) => state.abstractReducer.abstracts;
const getConditions = (state) => state.conditionReducer;

export const getAbstractWithSentenceArrays = createSelector(
  [ getAbstracts, getConditions ], 
  (abstracts, conditions) => {
    if (!abstracts) return [];
    console.log(conditions)
    const results = abstracts
      .filter(a => a.group !== conditions.abstractGroup)
      .sort((a, b) => {
        const posFirst = conditions.abstractOrder === 'pos-neg'
        if (a === 'pos' && b === 'neg') {
          return posFirst ? 1 : -1;
        }
        else if (a === 'neg' && b === 'pos') {
          return posFirst ? -1 : 1;
        }
        else {
          return 0;
        }
      })
      .map(a => {
        a.sentences = a.abstract.split('. ');
        return a;
      });
    console.log(results)
    return results;
  }
);