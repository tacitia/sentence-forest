import React from 'react'
import { Button, ControlLabel, FormControl, FormGroup, ListGroup, ListGroupItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
    this.handleMouseoverSentence = this.handleMouseoverSentence.bind(this);
    this.handleMouseoutSentence = this.handleMouseoutSentence.bind(this);
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

  handleMouseoverSentence(sentence) {
    console.log(sentence)
    this.props.onSentenceHover(sentence.id);
  }

  handleMouseoutSentence() {
    this.props.onSentenceHover(-1);
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">You will NOT be able to read this summary again after advancing.</Tooltip>
    );
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
    const placeholderTexts = {
      1: 'user analysis accuracy with animated v.s. static visualizations',
      3: 'chances of having false memories with emotional v.s. neutral contents',
      4: 'bilingualism and task switching ability',
      5: 'user analysis speed with 2D v.s. 3D visualizations'
    };
    if (this.props.abstracts[this.props.selectedAbstract]) {
      console.log('abstract sentences')
      console.log(this.props.abstracts[this.props.selectedAbstract].sentences)
    }
    console.log(this.props.hoverSentence)
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
            <p><b>Abstract: </b>{this.props.abstracts.length > 0 
              ? this.props.abstracts[this.props.selectedAbstract].sentences.map(s => {
                return <span 
                  className={s.id === this.props.hoverSentence ? 'hover-sentence' : ''}
                  onMouseOver={() => this.handleMouseoverSentence(s)}
                  onMouseOut={this.handleMouseoutSentence}
                >{s.content + '. '}</span>;
              }) 
              : ''}
            </p>
          </div>
        </div>
        <div>
          <FormGroup
            controlId="userNotes"
            validationState={this.state.notesValidState}
          >
            <ControlLabel>What have authors of this paper found about <i>{placeholderTexts[this.props.abstractGroup]}</i>? Please copy & paste those findings below.</ControlLabel>
            <p>You will receive a bonus of $0.05 if your response contains all relevant findings and only the relevant findings.</p>
            <FormControl
              style={{height: '100px'}}
              componentClass="textarea"
              value={this.state.userNotes}
              placeholder={['Findings on', placeholderTexts[this.props.abstractGroup]].join(' ')}
              onChange={this.handleChange}
            />
          </FormGroup>
        </div>
        <div className="center">
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button bsSize="large" bsStyle="primary" onClick={this.nextButtonClicked}>Show Next Summary</Button>
          </OverlayTrigger>
        </div>
      </div>
    )
  }
}

export default AbstractTextArea;