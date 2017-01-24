import React from 'react'
import { Button, ControlLabel, FormControl, FormGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import { render } from 'react-dom'
import { Chart } from 'react-google-charts'
 
class AbstractTextArea extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userNotes: '',
      notesValidState: null
    };
    this.abstractClicked = this.abstractClicked.bind(this);
    this.nextButtonClicked = this.nextButtonClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  abstractClicked(abstract) {
    this.props.onAbstractOrderSelect(abstract.id);
  }

  nextButtonClicked() {
    if (this.state.userNotes.length === 0) {
      this.setState({ notesValidState: 'error' });
    }
    else {
      this.setState({
        userNotes: '',
        notesValidState: null        
      });
      this.props.onUserNotesSubmit(this.props.selectedAbstract, this.state.userNotes);
      if (this.props.selectedAbstract < 5) {
        this.props.onAbstractOrderSelect(this.props.selectedAbstract + 1);
      }
      else {
        this.props.allArticlesRead();
      }
    }
  }

  handleChange(e) {
    this.setState({ userNotes: e.target.value });
    if (e.target.value.length > 0) {
      this.setState({ notesValidState: 'success' });
    }
    else {
      this.setState({ notesValidState: 'error' });
    }
  }

  render() {
    return (
      <div className="main-content">
        <div>
          <p><b>Will users perform analysis faster with 3D visualizations? Read the following research study summaries to find out.</b></p>
          <p>When you are done with one summary, use the button at the bottom of the page to show the next one. You will NOT be able to go back to a summary once you have moved on.</p>
          <p className="footnote">Hint 1: Some of the study results suggest faster performance with 3D visualizations, while others suggest the contrary, and it is up to you to make a decision after weighing all the findings.</p>
          <p className="footnote">Hint 2: You don't need to understand every sentence and it is safe to assume any unfamiliar terminology is irrelevant to the task.</p>
        </div>
        <div className="flexbox-horizontal" id="abstract-text-area">
          <ListGroup className="basic-flex-item" id="abstract-list">
            {
              this.props.abstracts.map((a,i) => 
                <ListGroupItem 
                  key={a.group+'-'+a.id} 
                  active={i===this.props.selectedAbstract}>
                    {a.title}
                </ListGroupItem>
              )
            }
          </ListGroup>
          <div className="basic-flex-item" id="abstract-content-area">
            <p><b>Title: </b>{this.props.abstracts.length > 0 ?  this.props.abstracts[this.props.selectedAbstract].title : ''}</p>
            <p><b>Abstract: </b>{this.props.abstracts.length > 0 ? this.props.abstracts[this.props.selectedAbstract].abstract : ''}</p>
          </div>
        </div>
        <div>
          <FormGroup
            controlId="userNotes"
            validationState={this.state.notesValidState}
          >
            <ControlLabel>What have authors of this paper found about <i>user analysis speed with 2D v.s. 3D visualizations</i>? Please copy & paste those findings below.</ControlLabel>
            <p>You will receive a bonus of $0.05 if your response contains all relevant findings and only the relevant findings.</p>
            <FormControl
              style={{height: '100px'}}
              componentClass="textarea"
              value={this.state.userNotes}
              placeholder="Findings on user analysis speed with 2D v.s. 3D visualizations"
              onChange={this.handleChange}
            />
          </FormGroup>
        </div>
        <div className="center">
          <Button bsSize="large" bsStyle="primary" onClick={this.nextButtonClicked}>Show Next Summary</Button>
        </div>
      </div>
    )
  }
}

export default AbstractTextArea;