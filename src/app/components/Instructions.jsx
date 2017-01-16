import React from 'react'

import { Button } from 'react-bootstrap';

class Instructions extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <h3>Instructions</h3>
        <Button bsStyle="primary" onClick={this.props.onNextButtonClick}>Next</Button>
      </div>
    );
  }
}

export default Instructions;


