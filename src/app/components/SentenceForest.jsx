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
 //   const sentenceData = flatMap(this.props.abstracts, a => a.sentences.map(s => [s]));
//    const tree1 = [sentenceData[3], sentenceData[8], sentenceData[14]]
    return (
      <div>
        <SentenceForestVis 
          data={this.props.sentenceForestData}
        />
      </div>
    );
  }
}

export default SentenceForest;