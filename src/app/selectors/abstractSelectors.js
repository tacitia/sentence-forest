import { createSelector } from 'reselect';
import { flatMap } from '../utility';
import porterStemmer from 'talisman/stemmers/porter';
import treebank from 'talisman/tokenizers/words/treebank';
import stopwords from 'stopwords-en';

const getAbstracts = (state) => state.abstractReducer.abstracts;
const getConditions = (state) => state.conditionReducer;
const customStopWords = ['1', '2', 'wa', 'thi', 'versu', 'set', 'map'];

export const getAbstractWithSentenceArrays = createSelector(
  [ getAbstracts, getConditions ], 
  (abstracts, conditions) => {
    if (!abstracts) return [];
    const results = abstracts
      .filter(a => a.group === conditions.abstractGroup)
      .sort((a, b) => {
        const posFirst = conditions.abstractOrder === 'pos-neg'
        if (a.direction === 'pos' && b.direction === 'neg') {
          return posFirst ? -1 : 1;
        }
        else if (a.direction === 'neg' && b.direction === 'pos') {
          return posFirst ? 1 : -1;
        }
        else {
          return 0;
        }
      })
      .map(a => {
        a.sentences = a.abstract.split('. ');
        return a;
      });
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
    const anchorFunnels = findAnchorFunnels(sentences);
    const sentencesWithAnchors1 = constructSentenceTree(['monolingu', 'bilingu'], sentences);
    const sentencesWithAnchors2 = constructSentenceTree(['bilingu'], sentences);
    return [{anchors: ['monolingu', 'bilingu'], sentences: sentencesWithAnchors1}, {anchors: ['bilingu'], sentences: sentencesWithAnchors2}];
  }
);

// Takes in one funnel and a group of sentences, extract all sentences containing the given funnel,
// and produce the merged sentence "tree"
// Segments are added as part of the sentence object
function constructSentenceTree(anchors, sentences) {
  return _(sentences)
    .filter(s => {
      var containAllAnchors = true;
      anchors.forEach(w => {
        if (!s.content.includes(w)) {
          containAllAnchors = false;
        }
      })
      return containAllAnchors;
    })
    .map(s => {
      const segments = [];
//      console.log(s)
      const tokens = treebank(s.content);
      var startIndex = 0;
      var anchorPos = 0;
      var i = 0;
      while (anchorPos < anchors.length && i < tokens.length) {
        const t = tokens[i];
        if (IsDerivedWord(anchors[anchorPos], t)) {
          if (i > startIndex) {
            segments.push(tokens.slice(startIndex, i));
          }
          else {
            segments.push(['']);
          }
          startIndex = i+1;
          anchorPos += 1;
        }
        i += 1;
      }
      if (startIndex < tokens.length) {
        segments.push(tokens.slice(startIndex, tokens.length));
      }
      return Object.assign({}, s, {
        anchors,
        segments
      });
    })
    .value();
}

// Check if target or a part of target can be reduced to the stem after stemming
// Assuming that target only contains a-zA-Z
function IsDerivedWord(stem, target) {
  if (target.includes('-')) {
    const subwords = target.split('-');
    subwords.forEach(w => {
      if (porterStemmer(w) === stem) {
        return true;
      }
    });
    return false;
  }
  else {
    return porterStemmer(target) === stem;
  }
}

function findAnchorWords(sentences) {
  const wordFrequency = {};
  const wordSpread = {};
  sentences.forEach(s => {
    const words = s.content.split(' ');
    words.forEach(w => {
      const wStem = porterStemmer(w.replace(/[^a-zA-Z0-9]/g, ''));
      if (stopwords.indexOf(wStem) < 0 && customStopWords.indexOf(wStem) < 0) {
        if (!wordFrequency[wStem]) {
          wordFrequency[wStem] = 0;
          wordSpread[wStem] = [];
        }
        wordFrequency[wStem] += 1;
        wordSpread[wStem].push(s.abstractOrder);
      }
    });
  });
  /*
  const anchorWords  = [];
  for (var word in wordFrequency) {
    if (wordFrequency[word] > 2 && _.uniq(wordSpread[word]).length > 1) {
      anchorWords.push(word);
    }
  }
  */
  const anchorWords = ['bilingual', 'switch', 'monolingual', 'cost', 'advantage', 'task', 'reduce', 'language', 'results']
    .map(w => porterStemmer(w.replace(/[^a-zA-Z0-9]/g, '')));
  console.log(anchorWords)
  return anchorWords;
}

function findAnchorFunnels(sentences) {
  const anchorWords = findAnchorWords(sentences);
  const allAnchorFunnels = [];
  const funnelSentenceMap = {};
  sentences.forEach(s => {
    const words = s.content.split(' ');
    const anchorFunnel = [];
    words.forEach(w => {
      const wStem = porterStemmer(w.replace(/[^a-zA-Z0-9]/g, ''));
      if (anchorWords.indexOf(wStem) > -1) {
        anchorFunnel.push(wStem);  
      }
    });
    if (anchorFunnel.length > 0) {
      allAnchorFunnels.push(anchorFunnel.join(':'));
      if (!funnelSentenceMap[anchorFunnel]) {
        funnelSentenceMap[anchorFunnel] = [];
      }
      funnelSentenceMap[anchorFunnel].push(s);
    }
  });
  console.log(allAnchorFunnels)
  console.log(funnelSentenceMap);
}

// Take all anchor funnels, enumerate all sub-funnels (e.g. "ABC" has three sub-funnels: AB, BC, and AC), and find the most frequent ones
// Then we can map each funnel to a sub-funnel; How should the mapping work when there are multiple frequent sub-funnels, though?
function findMostFrequentFunnels(anchorFunnels) {

}