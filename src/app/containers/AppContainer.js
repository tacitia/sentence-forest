import { connect } from 'react-redux';

import { setSelectedAbstract } from '../actions/abstractActions';
import { getAbstractWithSentenceArrays } from '../selectors/abstractSelectors';
import App from '../components/App';

const mapStateToProps = (state) => {
  return {
    interfaceCondition: state.conditionReducer.interfaceCondition,
    interfaceStage: state.conditionReducer.interfaceStage,
    userCode: state.metaReducer.userId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAbstractOrderSelect: (id) => {
      dispatch(setSelectedAbstract(id));
    },
  };
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;