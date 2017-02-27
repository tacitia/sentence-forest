import { connect } from 'react-redux';

import { getAbstractWithSentenceArrays, getSentenceForest } from '../selectors/abstractSelectors';
import SentenceForest from '../components/SentenceForest';
import { setHoverSentence } from '../actions/abstractActions';
import { postAction } from '../actions/metaActions';

const mapStateToProps = (state) => {
  return { 
    abstracts: getAbstractWithSentenceArrays(state),
    sentenceForestData: getSentenceForest(state),
    hoverSentence: state.abstractReducer.hoverSentence,
    selectedAbstract: state.abstractReducer.selectedAbstract
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setHoverSentence: (sentence) => {
      dispatch(setHoverSentence(sentence.id));
      if (sentence.id !== -1) {
        dispatch(postAction('vis:sentence-'+ sentence.abstractOrder+'-'+sentence.sentencePos, 'mouseover', 'Hover over a sentence in the vis'));
      }
      else {
        dispatch(postAction('vis:sentence', 'mouseout', 'Mouseout a sentence in the vis'));        
      }
    }
  };
};

const SentenceForestContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceForest);

export default SentenceForestContainer;