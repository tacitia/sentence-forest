import React from 'react';
import ReactDOM from 'react-dom'
 
import AbstractTextAreaContainer from '../containers/AbstractTextAreaContainer';
import SentenceForestContainer from '../containers/SentenceForestContainer';
import InstructionsContainer from '../containers/InstructionsContainer';

class App extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidUpdate () {
    console.log('mounted')
    window.scrollTo(0, 0)
  }

  render() {
//    const surveyURL = 'https://brown.co1.qualtrics.com/SE/?SID=SV_9RJ3LTm1X05iRff'; // Abstract group 5
//    const surveyURL = 'https://brown.co1.qualtrics.com/SE/?SID=SV_3WO6WUtrCLFoy4l'; // Abstract group 4
//    const surveyURL = 'https://brown.co1.qualtrics.com/SE/?SID=SV_4ZP7LxI7dOCcPpH'; // Abstract group 1
    const surveyURL = 'https://brown.co1.qualtrics.com/SE/?SID=SV_b12InI5GNbppJtz'; // Abstract group 3
    if (this.props.interfaceStage === 'exit-survey') {
      return (<div id="app-root-wrapper">
        <div className="main-content"><p>You are almost there! Your participant code is: <b>{this.props.userCode}</b>. Please complete the short survey below, <b>enter your participant code in the survey, AND on the HIT page on MTurk</b>.</p></div>
        <iframe src={surveyURL} height="100%" width="100%"></iframe>
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


