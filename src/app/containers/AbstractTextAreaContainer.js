import { connect } from 'react-redux';

import { setSelectedAbstract } from '../actions/abstractActions';
import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import AbstractTextArea from '../components/AbstractTextArea';

const mapStateToProps = (state) => {
  return { 
    abstracts: getAbstractWithSentenceArrays(state),
    selectedAbstract: state.abstractReducer.selectedAbstract
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAbstractOrderSelect: (id) => {
      dispatch(setSelectedAbstract(id));
    },
  };
};

const AbstractTextAreaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbstractTextArea);

export default AbstractTextAreaContainer;