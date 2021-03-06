import { connect } from 'react-redux';

import { setSelectedAbstract, setHoverSentence } from '../actions/abstractActions';
import { setInterfaceStage } from '../actions/conditionActions';
import { postAction, postResponse } from '../actions/metaActions';
import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import AbstractTextArea from '../components/AbstractTextArea';

const mapStateToProps = (state) => {
  return { 
    abstracts: getAbstractWithSentenceArrays(state),
    selectedAbstract: state.abstractReducer.selectedAbstract,
    abstractGroup: state.conditionReducer.abstractGroup,
    hoverSentence: state.conditionReducer.interfaceCondition === 'text-vis' ? state.abstractReducer.hoverSentence : -1,
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
    onSentenceHover: (sentence) => {
      dispatch(setHoverSentence(sentence.id));
      if (sentence.id !== -1) {
        dispatch(postAction('abstracts:sentence-'+ sentence.abstractOrder+'-'+sentence.sentencePos, 'mouseover', 'Hover over a sentence in the abstract text'));
      }
      else {
        dispatch(postAction('abstracts:sentence', 'mouseout', 'Mouseout a sentence in the abstract text'));        
      }
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