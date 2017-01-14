import { connect } from 'react-redux';

import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import SentenceForest from '../components/SentenceForest';

const mapStateToProps = (state) => {
  return { 
    abstracts: getAbstractWithSentenceArrays(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkTopicsLoaded: () => {
      dispatch(fetchTopicsIfNeeded());
    }
  };
};

const SentenceForestContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceForest);

export default SentenceForestContainer;