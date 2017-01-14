import React from 'react'
import { render } from 'react-dom'
import { Chart } from 'react-google-charts'
import WordTree from './WordTree';

const concat = (x,y) => x.concat(y)
const flatMap = (xs, f) => xs.map(f).reduce(concat, [])
 
class SentenceForest extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const sentenceData = flatMap(this.props.abstracts, a => a.sentences.map(s => [s]));
    const tree1 = [sentenceData[3], sentenceData[8], sentenceData[14]]
    return (
      <div>
        <WordTree sentences={tree1} anchor={"results"}>
        </WordTree>
      </div>
    );
  }
}

export default SentenceForest;