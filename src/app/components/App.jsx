import React from 'react'
 
import AbstractTextAreaContainer from '../containers/AbstractTextAreaContainer';
import SentenceForestContainer from '../containers/SentenceForestContainer';
import InstructionsContainer from '../containers/InstructionsContainer';

class App extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    if (this.props.interfaceStage === 'exit-survey') {
      const userCode = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      return (<div id="app-root-wrapper">
        <div className="main-content"><p>You are almost there! Your participant code is: <b>{this.props.userCode}</b>. Please complete the short survey below, <b>enter your participant code in the survey, AND on the HIT page on MTurk</b>.</p></div>
        <iframe src="https://brown.co1.qualtrics.com/SE/?SID=SV_9RJ3LTm1X05iRff" height="100%" width="100%"></iframe>
      </div>);
    }
    else if (this.props.interfaceStage === 'instructions') {
      return (<div id="app-root-wrapper">
        <InstructionsContainer />
      </div>);
    }
    else {
      if (this.props.interfaceCondition === 'text-only') {
        return (
          <div id="app-root-wrapper">
            <AbstractTextAreaContainer />
          </div>
        );
      }
      else {
        return (
          <div id="app-root-wrapper">
            <SentenceForestContainer />
            <AbstractTextAreaContainer />
          </div>
        );
      }
    }
  }
}

export default App;


