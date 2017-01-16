import { connect } from 'react-redux';

import { setInterfaceStage } from '../actions/conditionActions';
import Instructions from '../components/Instructions';

const mapStateToProps = (state) => {
  return { 
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNextButtonClick: () => {
      dispatch(setInterfaceStage('task'));
    }
  };
};

const InstructionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Instructions);

export default InstructionsContainer;