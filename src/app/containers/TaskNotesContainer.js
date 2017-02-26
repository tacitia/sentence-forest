import { connect } from 'react-redux';

import TaskNotes from '../components/TaskNotes';

const mapStateToProps = (state) => {
  return { 
    abstractGroup: state.conditionReducer.abstractGroup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const TaskNotesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskNotes);

export default TaskNotesContainer;