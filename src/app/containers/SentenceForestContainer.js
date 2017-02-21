import { connect } from 'react-redux';

import { getAbstractWithSentenceArrays, getSentenceForest } from '../selectors/abstractSelectors';
import SentenceForest from '../components/SentenceForest';
import { setHoverSentence } from '../actions/abstractActions';

const mapStateToProps = (state) => {
  return { 
    abstracts: getAbstractWithSentenceArrays(state),
    sentenceForestData: getSentenceForest(state),
    hoverSentence: state.abstractReducer.hoverSentence
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setHoverSentence: (sentenceId) => {
      dispatch(setHoverSentence(sentenceId));
    }
  };
};

const SentenceForestContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceForest);

export default SentenceForestContainer;