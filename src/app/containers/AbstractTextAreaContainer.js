import { connect } from 'react-redux';

import { setAbstractOrder } from '../actions/abstractActions';
import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import AbstractTextArea from '../components/AbstractTextArea';

const mapStateToProps = (state) => {
  return { 
    abstracts: getAbstractWithSentenceArrays(state),
    abstractOrder: state.abstractReducer.order
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAbstractOrderSelect: (order) => {
      dispatch(setAbstractOrder(order));
    }
  };
};

const AbstractTextAreaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbstractTextArea);

export default AbstractTextAreaContainer;