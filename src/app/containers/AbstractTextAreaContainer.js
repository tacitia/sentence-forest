import { connect } from 'react-redux';

import { setSelectedAbstract, setHoverSentence } from '../actions/abstractActions';
import { setInterfaceStage } from '../actions/conditionActions';
import { postAction, postResponse } from '../actions/metaActions';
import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import AbstractTextArea from '../components/AbstractTextArea';

const mapStateToProps = (state) => {
  console.log('update abstract text area')
  console.log(state.abstractReducer.hoverSentence)
  return { 
    abstracts: getAbstractWithSentenceArrays(state),
    selectedAbstract: state.abstractReducer.selectedAbstract,
    abstractGroup: state.conditionReducer.abstractGroup,
    hoverSentence: state.abstractReducer.hoverSentence
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
    onSentenceHover: (sentenceId) => {
      dispatch(setHoverSentence(sentenceId));
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