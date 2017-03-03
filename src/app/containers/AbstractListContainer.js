import { connect } from 'react-redux';

import { setSelectedAbstract, setHoverSentence } from '../actions/abstractActions';
import { setInterfaceStage } from '../actions/conditionActions';
import { postAction, postResponse } from '../actions/metaActions';
import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import AbstractList from '../components/AbstractList';

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
  };
};

const AbstractListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbstractList);

export default AbstractListContainer;