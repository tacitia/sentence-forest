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
    this.handleMouseoverSentence = this.handleMouseoverSentence.bind(this);
    this.handleMouseoutSentence = this.handleMouseoutSentence.bind(this);
  }

  abstractClicked(abstract) {
    this.props.onAbstractOrderSelect(abstract.id);
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
      </div>
    )
  }
}

export default AbstractTextArea;