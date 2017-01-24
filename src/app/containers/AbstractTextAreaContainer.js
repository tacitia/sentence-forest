import { connect } from 'react-redux';

import { setSelectedAbstract } from '../actions/abstractActions';
import { setInterfaceStage } from '../actions/conditionActions';
import { postResponse } from '../actions/metaActions';
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
      dispatch(postAction('tasks:nextAbstractButton', 'click', 'Advance to next paper abstract'));
    },
    onUserNotesSubmit: (abstractId, notes) => {
      dispatch(postResponse('userNotes-' + abstractId, notes));
    },
    allArticlesRead: () => {
      dispatch(setInterfaceStage('exit-survey'));
      dispatch(postAction('tasks:finishButton', 'click', 'Advance to exit-survey'));
    }
  };
};

const AbstractTextAreaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbstractTextArea);

export default AbstractTextAreaContainer;