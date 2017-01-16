import React from 'react'
 
import AbstractTextAreaContainer from '../containers/AbstractTextAreaContainer';
import SentenceForestContainer from '../containers/SentenceForestContainer';
import InstructionsContainer from '../containers/InstructionsContainer';

class App extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    console.log(this.props)
    if (this.props.interfaceStage === 'exit-survey') {
      return (<div id="app-root-wrapper">
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


