import { createSelector } from 'reselect';
import { flatMap } from '../utility';
import stemmer from 'stemmer';
import stopwords from 'stopwords-en';

const getAbstracts = (state) => state.abstractReducer.abstracts;
const getConditions = (state) => state.conditionReducer;

export const getAbstractWithSentenceArrays = createSelector(
  [ getAbstracts, getConditions ], 
  (abstracts, conditions) => {
    if (!abstracts) return [];
    const results = abstracts
      .filter(a => a.group === conditions.abstractGroup)
      .sort((a, b) => {
        const posFirst = conditions.abstractOrder === 'pos-neg'
        if (a.direction === 'pos' && b.direction === 'neg') {
          return posFirst ? 1 : -1;
        }
        else if (a.direction === 'neg' && b.direction === 'pos') {
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

export const getSentenceForest = createSelector(
  [ getAbstractWithSentenceArrays ], 
  (abstractsWithSentenceArrays) => {
    const sentences = flatMap(abstractsWithSentenceArrays, (a, i) => a.sentences.map((s, j) => ({
      abstractOrder: i,
      sentencePos: j,
      content: s
    })));
    console.log(sentences)
    const anchorFunnels = findAnchorFunnels(sentences);
  }
);

function findAnchorWords(sentences) {
  const wordFrequency = {};
  const wordSpread = {};
  sentences.forEach(s => {
    const words = s.content.split(' ');
    words.forEach(w => {
      const wStem = stemmer(w.replace(/[^a-zA-Z0-9]/g, ''));
      if (stopwords.indexOf(wStem) < 0) {
        if (!wordFrequency[wStem]) {
          wordFrequency[wStem] = 0;
          wordSpread[wStem] = [];
        }
        wordFrequency[wStem] += 1;
        wordSpread[wStem].push(s.abstractOrder);
      }
    });
  });
  const anchorWords  = [];
  for (var word in wordFrequency) {
    if (wordFrequency[word] > 2 && _.uniq(wordSpread[word]).length > 1) {
      anchorWords.push(word);
    }
  }
  console.log(anchorWords)
  return anchorWords;
}

function findAnchorFunnels(sentences) {
  const anchorWords = findAnchorWords(sentences);
  sentences.forEach(s => {
    const words = s.content.split(' ');
    const anchorFunnel = [];
    words.forEach(w => {
      const wStem = stemmer(w.replace(/[^a-zA-Z0-9]/g, ''));
      if (anchorWords.indexOf(wStem) < -1) {
      }
    });
  });
}