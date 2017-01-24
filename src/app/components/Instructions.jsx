import React from 'react'

import { Button } from 'react-bootstrap';

class Instructions extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="main-content">
        <h2>Instructions</h2>
        <div id="instruction-content">
          <p><span className="paragraph-heading">Scenario</span></p>
          <p> In this study, you will play the role of a data visualization researcher designing a new system that lets doctors study the bone healing process. You are trying to decide whether to provide three-dimensional (3D) instead of two-dimensional (2D) visualizations in the system. More specifically, <b>you would like to know whether users of the system will perform analysis faster with 3D visualizations</b>.</p>
          <p><span className="paragraph-heading">Your task</span></p>
          <p>On the next screen, you will see summaries of six research studies of 2D v.s. 3D visualization systems. Your task is to read each summary and identify findings from the research that are relevant to <i>user analysis speed with 2D v.s. 3D visualizations</i>.</p>
          <p>After reading all six summaries, you will need to estimate how likely users of the system you are designing will perform analysis faster with 3D visualizations, <b>based on findings from the six papers.</b></p>
        </div>
        <Button bsStyle="primary" onClick={this.props.onNextButtonClick}>Next</Button>
      </div>
    );
  }
}

export default Instructions;


