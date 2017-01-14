import React from 'react'
import { render } from 'react-dom'
import { Chart } from 'react-google-charts'

const concat = (x,y) => x.concat(y)
const flatMap = (xs, f) => xs.map(f).reduce(concat, [])
 
class WordTree extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      options:{
        wordtree: {
          format: 'implicit',
          type: 'double',
          word: ''
        }
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      options: {
        wordtree: {
          format: 'implicit',
          type: 'double',
          word: nextProps.anchor
        }        
      }
    });
  }  

  render() {
    console.log(this.props.sentences)
    return (
    <div className={"word-tree-container"}>
      <Chart 
        chartType="WordTree" 
        data={this.props.sentences} 
        options={this.state.options} 
        graph_id="WordTree"  width={"100%"} height={"400px"}  legend_toggle={true} />
    </div>
    )
  }
}

export default WordTree;