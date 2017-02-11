import React from 'react'

import { Button } from 'react-bootstrap';

class Instructions extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const instructionSnippets = {
      role: {
        1: 'a data visualization researcher designing a new system that will be used by climate scientists to study global precipitation',
        3: 'an educational psychologist developing a new history curriculum',
        4: 'an educational psychologist developing a new educational program for bilinguals',
        5: 'a data visualization researcher designing a new system that lets doctors study the bone healing process'
      },
      goal: {
        1: 'You are trying to decide whether to provide animated maps instead of stacks of static maps in the system.',
        3: 'You are trying to decide whether to include more materials that are heavy on emotional details about historical events.',
        4: '',
        5: 'You are trying to decide whether to provide three-dimensional (3D) instead of two-dimensional (2D) visualizations in the system.',
      },
      question: {
        1: 'whether users of the system will perform analysis more accurately using animated maps',
        3: 'whether people are more likely to have false memories of emotional contents',
        4: 'whether bilinguals tend to be better at task switching',
        5: 'whether users of the system will perform analysis faster with 3D visualizations'
      },
      topic: {
        1: 'animated v.s. static visualizations',
        3: 'emotional contents and false memories',
        4: 'bilingualism and task switching',
        5: '2D v.s. 3D visualization systems',
      },
      target: {
        1: 'user analysis accuracy with animated v.s. static visualizations',
        3: 'chances of having false memories with emotional v.s. neutral contents',
        4: 'task switching ability of bilinguals v.s. monolinguals',
        5: 'user analysis speed with 2D v.s. 3D visualizations'
      },
      hypothesis: {
        1: 'how likely users of the system you are designing will perform analysis more accurately using animated maps',
        3: 'how likely emotional contents will increase the chance for people to have false memories, compared to neutral contents',
        4: 'how likely bilinguals are on average better at task switching than monolinguals',
        5: 'how likely users of the system you are designing will perform analysis faster with 3D visualizations'
      }
    };
    const group = this.props.abstractGroup;
    return (
      <div className="main-content">
        <h2>Instructions</h2>
        <div id="instruction-content">
          <p><span className="paragraph-heading">Scenario</span></p>
          <p> In this study, you will play the role of {instructionSnippets.role[group]}. {instructionSnippets.goal[group]} More specifically, <b>you would like to know {instructionSnippets.question[group]}</b>.</p>
          <p><span className="paragraph-heading">Your task</span></p>
          <p>On the next screen, you will see summaries of six research studies about {instructionSnippets.topic[group]}. Your task is to read each summary and identify findings from the research that are relevant to <i>{instructionSnippets.target[group]}</i>.</p>
          <p>After reading all six summaries, you will need to estimate {instructionSnippets.hypothesis[group]}, <b>based on findings from the six papers.</b> You will <b>NOT</b> be able to review the six summaries when making the final estimation.</p> 
        </div>
        <Button bsStyle="primary" onClick={this.props.onNextButtonClick}>Next</Button>
      </div>
    );
  }
}

export default Instructions;


