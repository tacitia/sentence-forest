import { connect } from 'react-redux';

import { setInterfaceStage } from '../actions/conditionActions';
import { postAction } from '../actions/metaActions';
import Instructions from '../components/Instructions';

const mapStateToProps = (state) => {
  return {
    abstractGroup: state.conditionReducer.abstractGroup
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNextButtonClick: () => {
      dispatch(postAction('instructions:nextButton', 'click', 'finish reading instructions'));
      dispatch(setInterfaceStage('task'));
    }
  };
};

const InstructionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Instructions);

export default InstructionsContainer;