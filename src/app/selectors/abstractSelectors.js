import { createSelector } from 'reselect';
import { flatMap } from '../utility';
import porterStemmer from 'talisman/stemmers/porter';
import treebank from 'talisman/tokenizers/words/treebank';
import shortid from 'shortid';
import stopwords from 'stopwords-en';

const getAbstracts = (state) => state.abstractReducer.abstracts;
const getConditions = (state) => state.conditionReducer;
const customStopWords = ['1', '2', 'wa', 'thi', 'versu', 'set', 'map'];

const getAllAbstractsWithSentenceArrays = createSelector(
  [ getAbstracts ],
  (abstracts) => {
    if (!abstracts) return [];
    const results = abstracts
      .map((a, i) => {
        a.sentences = a.abstract
          .split('. ')
          .map((s, j) => ({
            abstractOrder: i,
            sentencePos: j,
            content: s,
            id: shortid.generate()            
          }));
        return a;
      });
    return results;      
  }
);

export const getAbstractWithSentenceArrays = createSelector(
  [ getAllAbstractsWithSentenceArrays, getConditions ], 
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
      });
    return results;
  }
);

export const getSentenceForest = createSelector(
  [ getAbstractWithSentenceArrays ], 
  (abstractsWithSentenceArrays) => {
    const sentences = flatMap(abstractsWithSentenceArrays, a => a.sentences);
    if (sentences.length === 0 ) {
      return [];
    }
//    const anchorFunnels = findAnchorFunnels(sentences);
    const anchorFunnels = [
/*      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' },  
        { stem: 'switch', display: 'task-switching' }, 
        { stem: 'monolingu', display: 'monolingual' }
      ]),
      generateAnchors([
        { stem: 'monolingu', display: 'monolingual' }, 
        { stem: 'bilingu', display: 'bilingual' }
      ]), */
      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' }, 
        { stem: 'monolingu', display: 'monolingual' }
      ]),
/*      generateAnchors([
        { stem: 'result', display: 'results' }, 
        { stem: 'bilingu', display: 'bilingual' }
      ]),
      generateAnchors([
        { stem: 'result', display: 'results' }, 
        { stem: 'monolingu', display: 'monolingual' }, 
      ]),
      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' }
      ]) */
    ];
    var remainingSentences = sentences;
    var anchorFunnelPos = 0;
    const forest = [];
    while (anchorFunnelPos < anchorFunnels.length && remainingSentences.length > 0) {
      const anchors = anchorFunnels[anchorFunnelPos];
      const sentencePartitions = _.partition(remainingSentences, s => {
        const tokens = treebank(s.content);
        var anchorPos = 1; // Skip the dummy start anchor
        tokens.forEach(t => {
          if (anchorPos >= anchors.length) {
            return true;
          }
          if (IsDerivedWord(anchors[anchorPos].stem, t)) {
            anchorPos += 1;
          }
        });
        return anchorPos >= anchors.length;
      });
      const sentencesWithAnchors = constructSentenceTree(anchors, sentencePartitions[0]);
      remainingSentences = sentencePartitions[1];
      anchorFunnelPos += 1;
      if (sentencesWithAnchors.length > 0) {
        forest.push({
          anchors,
          sentences: sentencesWithAnchors
        });
      }
    }
    ;
//    forest.forEach(anchorSentencesPair => mergeAnchors(anchorSentencesPair));
    console.log('return merged anchors')
    return mergeAnchors(forest);
//    return [{anchors: mergeAnchors(anchors1), sentences: sentencesWithAnchors1}, {anchors: mergeAnchors(anchors2), sentences: sentencesWithAnchors2}];
  }
);

function generateAnchors(names) {
  const augmentedNames = [ {stem: '', display: ''}, ...names ];
  return augmentedNames.map(n => Object.assign({}, n, {
    level: 0,
    id: shortid.generate(),
    segments: []
  }))
}

function mergeAnchors(forest) {
  return forest.map(f => {
    return {
      anchors: f.anchors.map(a => [a]),
      sentences: f.sentences
    }
  });
}

// Takes in one funnel and a group of sentences, extract all sentences containing the given funnel,
// and produce the merged sentence "tree"
// Segments are added as part of the sentence object
function constructSentenceTree(anchors, sentences) {
  return _(sentences)
    .map(s => {
      const segments = [];
      const tokens = treebank(s.content);
      var startIndex = 0;
      var anchorPos = 1; // Skip the dummy start anchor
      var i = 0;
      var prevAnchor = anchors[0];
      var nextAnchor = anchors[1];
      // TODO: debug the #anchor=1 case
      while (anchorPos < anchors.length && i < tokens.length) {
        const t = tokens[i];
        if (IsDerivedWord(anchors[anchorPos].stem, t)) {
          var content = [''];
          if (i > startIndex) {
            content = tokens.slice(startIndex, i);
          }
          const segment = {
            content,
            prevAnchor,
            nextAnchor,
            originalSentence: s
          };
          segments.push(segment);
          anchors[anchorPos-1].segments.push(segment);
          startIndex = i+1;
          anchorPos += 1;
          prevAnchor = anchors[anchorPos-1];
          nextAnchor = anchorPos >= anchors.length ? null : anchors[anchorPos];
        }
        i += 1;
      }
      if (startIndex < tokens.length) {
        const segment = {
          content: tokens.slice(startIndex, tokens.length),
          prevAnchor: anchors[anchors.length-1],
          nextAnchor: null,
          originalSentence: s
        };
        segments.push(segment);
        anchors[anchors.length-1].segments.push(segment);   
      }
      s.segments = segments;
      return s;
//      return Object.assign({}, s, {
//        anchors,
//        segments
//      });
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
  console.log('all anchor funnels')
  console.log(allAnchorFunnels)
  console.log('funnel sentence map')
  console.log(funnelSentenceMap);
}

// Take all anchor funnels, enumerate all sub-funnels (e.g. "ABC" has three sub-funnels: AB, BC, and AC), and find the most frequent ones
// Then we can map each funnel to a sub-funnel; How should the mapping work when there are multiple frequent sub-funnels, though?
function findMostFrequentFunnels(anchorFunnels) {

}