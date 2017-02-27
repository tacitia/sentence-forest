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
    this.props.onSentenceHover(sentence);
  }

  handleMouseoutSentence() {
    this.props.onSentenceHover({ id:-1 });
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">You will NOT be able to read this summary again after advancing.</Tooltip>
    );
    const placeholderTexts = {
      1: 'user analysis accuracy with animated v.s. static visualizations',
      3: 'chances of having false memories with emotional v.s. neutral contents',
      4: 'bilingualism and task switching ability',
      5: 'user analysis speed with 2D v.s. 3D visualizations'
    };
    const colorPalette = ["#5e904e", "#dc58ea", "#2499d7", "#eb5e9b", "#8270f6", "#0ca82e"]; // Lighter
    return (
      <div>
        <div className={"flexbox-" + this.props.layout} id="abstract-text-area">
          <ListGroup className="basic-flex-item" id="abstract-list">
            {
              this.props.abstracts.map((a,i) => 
                <ListGroupItem 
                  key={a.group+'-'+a.id} 
                  active={i===this.props.selectedAbstract}>
                    { this.props.showAbstractLabel
                        ? <div style={{
                            backgroundColor: colorPalette[i], 
                            width: '12px', 
                            height: '15px', 
                            display:'inline-block',
                            borderRadius: '2px',
                            marginRight: '5px'
                          }}></div>
                        : <div></div>
                    }
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
                  key={s.id}
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