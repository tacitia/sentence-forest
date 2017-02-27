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
//            abstractOrder: i,
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
    if (!conditions.abstractGroup || !conditions.abstractOrder) return [];
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
    results.forEach((a, i) => {
        a.sentences.forEach(s => s.abstractOrder = i);
    });
    return results;
  }
);

export const getSentenceForest = createSelector(
  [ getAbstractWithSentenceArrays ], 
  (abstractsWithSentenceArrays) => {
    const sentences = flatMap(abstractsWithSentenceArrays, a => a.sentences)
      .sort((a, b) => {
        if (a.abstractOrder === b.abstractOrder) {
          return a.sentencePos - b.sentencePos;
        }
        else {
          return a.abstractOrder - b.abstractOrder;
        }
      });
    if (sentences.length === 0 ) {
      return [];
    }
    findAnchorFunnels(sentences);
    const anchorFunnels = [
      generateAnchors([
        { stem: 'result', display: 'results' }, 
        { stem: 'bilingu advantag', display: 'bilingual advantage' }
      ]),
      generateAnchors([
        { stem: 'result', display: 'results' }, 
        { stem: 'monolingu advantag', display: 'monolingual advantage' }
      ]),
      generateAnchors([
        { stem: 'result', display: 'results' }, 
        { stem: 'advantag', display: 'advantage' }
      ]),
      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' }, 
        { stem: 'switch cost', display: 'switch cost' }
      ]),
      generateAnchors([
        { stem: 'bilingu advantag', display: 'bilingual advantage' }, 
      ]),
      generateAnchors([
        { stem: 'monolingu advantag', display: 'monolingual advantage' }
      ]),
      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' }, 
        { stem: 'monolingu', display: 'monolingual' }
      ]),
      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' },  
        { stem: 'taskswitch', display: 'task-switching' }
      ]),
      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' },  
        { stem: 'switch', display: 'switch' }
      ]),
      generateAnchors([
        { stem: 'monolingu', display: 'monolingual' }, 
        { stem: 'bilingu', display: 'bilingual' }
      ]),
      generateAnchors([
        { stem: 'result', display: 'results' }, 
        { stem: 'bilingu', display: 'bilingual' }
      ]),
      generateAnchors([
        { stem: 'result', display: 'results' }, 
        { stem: 'monolingu', display: 'monolingual' }, 
      ]),
      generateAnchors([
        { stem: 'advantag', display: 'advantage' }
      ]),
      generateAnchors([
        { stem: 'bilingu', display: 'bilingual' }
      ])
    ];
    console.log('get sentence forest data')
    console.log(sentences)
    var remainingSentences = sentences;
    var anchorFunnelPos = 0;
    const forest = [];
    while (anchorFunnelPos < anchorFunnels.length && remainingSentences.length > 0) {
      const anchors = anchorFunnels[anchorFunnelPos];
      const sentencePartitions = _.partition(remainingSentences, s => {
        const tokens = treebank(s.content);
        var anchorPos = 1; // Skip the dummy start anchor
        var tokenPos = 0;
        while (tokenPos < tokens.length) {
          if (anchorPos >= anchors.length) {
            return true;
          }
          const stems = anchors[anchorPos].stem.split(' ');
          const anchorLength = stems.length;
          if (tokenPos + anchorLength > tokens.length ) {
            return false;
          }
          if (IsDerivedWord(stems, tokens.slice(tokenPos, tokenPos + anchorLength))) {
            anchorPos += 1;
            tokenPos += anchorLength;
          }
          else {
            tokenPos += 1;
          }
        }
        return anchorPos >= anchors.length;
      });
      const sentencesWithAnchors = constructSentenceTree(anchors, sentencePartitions[0]);
      remainingSentences = sentencePartitions[1];
      anchorFunnelPos += 1;
      sortAnchorSegments(anchors)
      if (sentencesWithAnchors.length > 0) {
        forest.push({
          anchors: anchors,
          sentences: sentencesWithAnchors
        });
      }
    }
    ;
//    forest.forEach(anchorSentencesPair => mergeAnchors(anchorSentencesPair));
//    console.log('return merged anchors')
    const mergedAnchors = [];
    mergedAnchors.push(mergeAnchors(forest, [0,1,2], [2]));
    console.log('merged anchor')
    console.log(mergedAnchors)
    console.log(wrapAnchors(forest, [0, 1, 2]))
    return [ ...mergedAnchors, ...wrapAnchors(forest, [0,1,2]) ];
//    return [{anchors: mergeAnchors(anchors1), sentences: sentencesWithAnchors1}, {anchors: mergeAnchors(anchors2), sentences: sentencesWithAnchors2}];
  }
);

function sortAnchorSegments(anchors) {
  anchors.forEach(a => {
    a.segments = a.segments
      .sort((a, b) => {
        if (a.originalSentence.abstractOrder === b.originalSentence.abstractOrder) {
          return a.originalSentence.sentencePos - b.originalSentence.sentencePos;
        }
        else {
          return a.originalSentence.abstractOrder - b.originalSentence.abstractOrder;
        }
      });
  });
}

function generateAnchors(names) {
  const augmentedNames = [ {stem: '', display: ''}, ...names ];
  return augmentedNames.map(n => Object.assign({}, n, {
    level: 0,
    id: shortid.generate(),
    segments: [],
    prevSegments: []
  }))
}

function mergeAnchors(forest, mergeIndex, branchPositions) {
  const mergedTree = {anchors: [], sentences: []};
  const baseTree = forest[mergeIndex[0]];
  baseTree.anchors.forEach(a => {
    mergedTree.anchors.push([a]);
  });
  mergedTree.sentences = [ ...mergedTree.sentences, ...baseTree.sentences ];
  var i = 1;
  while (i < mergeIndex.length) {
    var thisTree = forest[mergeIndex[i]];
    thisTree.anchors.forEach((a, j) => {
      if (branchPositions.indexOf(j) < 0) {
        // Fix prevAnchor pointers
        thisTree.anchors[j].segments.forEach(s => {
          s.prevAnchor = mergedTree.anchors[j][0];
        });
        mergedTree.anchors[j][0].segments = [ ...mergedTree.anchors[j][0].segments, ...thisTree.anchors[j].segments ];
      }
      else {
        mergedTree.anchors[j].push(thisTree.anchors[j]);
      }
    });
    mergedTree.sentences = [ ...mergedTree.sentences, ...thisTree.sentences ];
    i += 1;
  }
  // Fix nextAnchor pointers
  mergedTree.anchors.forEach((a, i) => {
    if (branchPositions.indexOf(i) < 0) {
      if (i-1 >= 0) {
        mergedTree.anchors[i-1].forEach(a => {
          a.segments.forEach(s => {
            s.nextAnchor = mergedTree.anchors[i][0];
          })
        })
      }
    }
  });

  return mergedTree;
  mergeIndex.forEach(i => {

  });
  return forest.map(f => {
    console.log('merge anchors')
    console.log(f.anchors)
    return {
      anchors: f.anchors.map(a => [a]),
      sentences: f.sentences
    }
  });
}

function wrapAnchors(forest, mergedTrees) {
  const result = [];
  forest.forEach((f, i) => {
    if (mergedTrees.indexOf(i) < 0) {
      result.push({
        anchors: f.anchors.map(a => [a]),
        sentences: f.sentences        
      });
    }
  });
  return result;
}

// Takes in one funnel and a group of sentences, extract all sentences containing the given funnel,
// and produce the merged sentence "tree"
// Segments are added as part of the sentence object
function constructSentenceTree(anchors, sentences) {
  sentences
    .forEach(s => {
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
        const stems = anchors[anchorPos].stem.split(' ');
        if (IsDerivedWord(stems, tokens.slice(i, i + stems.length))) {
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
          anchors[anchorPos].prevSegments.push(segment)
          startIndex = i+stems.length;
          anchorPos += 1;
          prevAnchor = anchors[anchorPos-1];
          nextAnchor = anchorPos >= anchors.length ? null : anchors[anchorPos];
          i += stems.length;
        }
        else {
          i += 1;
        }
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
    });
    return sentences;
}

// Check if target or a part of target can be reduced to the stem after stemming
// Assuming that target only contains a-zA-Z
function IsDerivedWord(stems, target) {
  if (stems.length > 1) {
    var index = 0;
    while (index < target.length) {
      if (porterStemmer(target[index]) !== stems[index]) {
        return false;
      }
      index += 1;
    }
    return true;
  }
  /*
  if (target.includes('-')) {
    return porterStemmer(target.split('-').join('')) === stem;
  } */
  else {
    return porterStemmer(target[0]) === stems[0];
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

  const anchorWords  = [];
  for (var word in wordFrequency) {
    if (wordFrequency[word] > 2 && _.uniq(wordSpread[word]).length > 1) {
      anchorWords.push(word);
    }
  }
//  const anchorWords = ['bilingual', 'switch', 'monolingual', 'cost', 'advantage', 'task', 'reduce', 'language', 'results']
//    .map(w => porterStemmer(w.replace(/[^a-zA-Z0-9]/g, '')));
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
//  console.log('all anchor funnels')
//  console.log(allAnchorFunnels)
//  console.log('funnel sentence map')
//  console.log(funnelSentenceMap);
}

// Take all anchor funnels, enumerate all sub-funnels (e.g. "ABC" has three sub-funnels: AB, BC, and AC), and find the most frequent ones
// Then we can map each funnel to a sub-funnel; How should the mapping work when there are multiple frequent sub-funnels, though?
function findMostFrequentFunnels(anchorFunnels) {

}