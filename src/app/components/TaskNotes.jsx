import React from 'react'
import { render } from 'react-dom'
 
class TaskNotes extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const questions = {
      1: 'Will users perform analysis more accurately with animated maps',
      3: 'Will people tend to have more false memories of emotional contents than neutral contents',
      4: 'Do bilinguals tend to be better at task switching',
      5: 'Will users perform analysis faster with 3D visualizations'
    };
    const suggestions = {
      1: 'better accuracy with animated visualizations',
      3: 'that emotional contents are more likely to be falsely recalled',
      4: 'that billinguals are better at task switching',
      5: 'faster performance with 3D visualizations'
    };
    return (
      <div className="main-content">
        <div>
          <p><b>{questions[this.props.abstractGroup]}? Read the following research study summaries to find out.</b></p>
          Please note:
          <ul>
            <li className="footnote">When you are done with one summary, use the button at the bottom of the page to show the next one. You will NOT be able to go back to a summary once you have moved on.</li>
            <li className="footnote">Some of the study results suggest {suggestions[this.props.abstractGroup]}, while others suggest the contrary, and it is up to you to make a decision after weighing all the findings.</li>
            <li className="footnote">You don't need to understand every sentence and it is safe to assume any unfamiliar terminology is irrelevant to the task.</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default TaskNotes;