import { connect } from 'react-redux';

import { setSelectedAbstract, setHoverSentence } from '../actions/abstractActions';
import { setInterfaceStage } from '../actions/conditionActions';
import { postAction, postResponse } from '../actions/metaActions';
import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import ResponseArea from '../components/ResponseArea';

const mapStateToProps = (state) => {
  return { 
    abstracts: getAbstractWithSentenceArrays(state),
    selectedAbstract: state.abstractReducer.selectedAbstract,
    abstractGroup: state.conditionReducer.abstractGroup,
    layout: state.conditionReducer.interfaceCondition === 'text-vis' ? 'vertical' : 'horizontal',
    showAbstractLabel: state.conditionReducer.interfaceCondition === 'text-vis'
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

const ResponseAreaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResponseArea);

export default ResponseAreaContainer;