import React from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { render } from 'react-dom'
import { Chart } from 'react-google-charts'
 
class AbstractTextArea extends React.Component {

  constructor(props){
    super(props);
    this.abstractClicked = this.abstractClicked.bind(this);
    this.nextButtonClicked = this.nextButtonClicked.bind(this);
  }

  abstractClicked(abstract) {
    this.props.onAbstractOrderSelect(abstract.id);
  }

  nextButtonClicked() {
    if (this.props.selectedAbstract < 5) {
      this.props.onAbstractOrderSelect(this.props.selectedAbstract + 1);
    }
    else {
      this.props.allArticlesRead();
    }
  }

  render() {
    return (
      <div>
        <div className="flexbox-horizontal" id="abstract-text-area">
          <ListGroup className="basic-flex-item">
            {
              this.props.abstracts.map(a => 
                <ListGroupItem 
                  key={a.group+'-'+a.id} 
                  active={a.id===this.props.selectedAbstract}>
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
        <div className="center">
          <Button onClick={this.nextButtonClicked}>Next</Button>
        </div>
      </div>
    )
  }
}

export default AbstractTextArea;