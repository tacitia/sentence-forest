import React from 'react'
import { Button, ControlLabel, FormControl, FormGroup, ListGroup, ListGroupItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { render } from 'react-dom'
import { Chart } from 'react-google-charts'
 
class AbstractList extends React.Component {

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
    const colorPalette = ["#5e904e", "#dc58ea", "#2499d7", "#eb5e9b", "#8270f6", "#0ca82e"]; // Lighter
    return (
      <div id="abstract-list" className="flexbox-horizontal-wrap list-group">
        {
          this.props.abstracts.map((a,i) => 
            <div className={"basic-flex-item list-group-item-flex " + ((i === this.props.selectedAbstract) ? 'active' : '')}
              key={a.group+'-'+a.id}>
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
            </div>
          )
        }
      </div>
    )
  }
}

export default AbstractList;