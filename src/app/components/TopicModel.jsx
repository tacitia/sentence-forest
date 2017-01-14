import React, { PropTypes } from 'react';
import { createComponent } from 'react-d3kit';

import PlainTopicParallelLists from '../components/TopicParallelLists';
import TopicModelControl from '../components/TopicModelControl';

const TopicParallelLists = createComponent(PlainTopicParallelLists);

const propTypes = {
};

class TopicModel extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log(this.props)
    this.props.checkTopicsLoaded();
  }

  onTermSelect(term, index) {
    console.log(term + ' selected');
  }

  render() {
    const data = {
      terms: this.props.terms,
      topics: this.props.topics ? this.props.topics.topics : null,
      connections: this.props.topics ? this.props.topics.termTopicConnections : null,
      termTopicProperties: this.props.termTopicProperties,
      selectedTerms: this.props.selectedTerms,
      selectedTopic: this.props.selectedTopic
    };

    return (
      <div id="topic-model">
        <TopicModelControl 
          showNextTerms={this.props.showNextTerms}
          showPrevTerms={this.props.showPrevTerms}
          clearSelectedTerms={this.props.clearSelectedTerms}
          updateTermTopicOrdering={this.props.updateTermTopicOrdering}
        />
        <TopicParallelLists 
          data={data} 
          onTermSelect={this.props.selectTerm}
          onTermDeselect={this.props.deselectTerm}
          onTopicSelect={this.props.selectTopic}
        />
        <div className="control">
          <p id="topic-summary">
            <span className="small-cap-label">Selected topic:</span>
            {
              !this.props.selectedTopic ? <span></span> :
              _.take(this.props.selectedTopic.terms, 10).map((t, i) => {
                  const additionalClass = i%2== 0 ? ' dark ' : '';
                  return <span id={"topic-term-"+i} className={"selected-topic-term" + additionalClass}
                    key={"topic-term-"+i}
                    onClick={() => this.onTermSelect(t.term, i)}
                  >
                    {t.term}
                  </span>
                })
            }
            {
              !this.props.selectedTopic ? <span></span>
                : <span className="small-bold-label">(# of documents: {this.props.selectedTopic.evidenceCount})</span>
            }
          </p>
        </div>
      </div>
    );
  }
}

TopicModel.propTypes = propTypes;

export default TopicModel;