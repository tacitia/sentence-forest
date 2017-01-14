import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { render } from 'react-dom'
import { Chart } from 'react-google-charts'
 
class AbstractTextArea extends React.Component {

  constructor(props){
    super(props);
    this.abstractClicked = this.abstractClicked.bind(this);
  }

  abstractClicked(abstract) {
    this.props.onAbstractOrderSelect(abstract.defaultOrder);
  }

  render() {
    return (
    <div className="flexbox-horizontal">
      <ListGroup className="basic-flex-item">
        {
          this.props.abstracts.map(a => <ListGroupItem onClick={() => this.abstractClicked(a)}>{a.title}</ListGroupItem>)
        }
      </ListGroup>
      <p className="basic-flex-item">{this.props.abstracts.length > 0 ? this.props.abstracts[this.props.abstractOrder].abstract : ''}</p>
    </div>
    )
  }
}

export default AbstractTextArea;