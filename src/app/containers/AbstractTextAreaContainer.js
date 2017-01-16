import { connect } from 'react-redux';

import { setSelectedAbstract } from '../actions/abstractActions';
import { setInterfaceStage } from '../actions/conditionActions';
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
    allArticlesRead: () => {
      dispatch(setInterfaceStage('exit-survey'));
    }
  };
};

const AbstractTextAreaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbstractTextArea);

export default AbstractTextAreaContainer;