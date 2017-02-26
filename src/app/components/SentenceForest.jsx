import React from 'react'
import { render } from 'react-dom'
 import { createComponent } from 'react-d3kit';
import { Chart } from 'react-google-charts'
import PlainSentenceForestVis from './SentenceForestVis';
import WordTree from './WordTree';
import { flatMap } from '../utility';

const SentenceForestVis = createComponent(PlainSentenceForestVis);

class SentenceForest extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const sentenceForestData = {
      data: this.props.sentenceForestData,
      states: {
        hoverSentence: this.props.hoverSentence,
        selectedAbstract: this.props.selectedAbstract
      }
    };
    return (
      <div>
        <SentenceForestVis 
          data={sentenceForestData}
          onSentenceMouseOver={this.props.setHoverSentence}
        />
      </div>
    );
  }
}

export default SentenceForest;