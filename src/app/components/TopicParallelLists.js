import d3 from 'd3';
import d3Kit from 'd3kit';
import d3Tip from 'd3-tip';

d3.tip = d3Tip;

const DEFAULT_OPTIONS = {
  margin: {top: 10, right: 10, bottom: 10, left: 10},
  initialWidth: 950,
  initialHeight: 800,
  termBatchSize: 50,
  topicBatchSize: 50,
  termList: {
    width: 200,
    height: 790
  },
  connections: {
    width: 50,
    height: 790
  },
  topicList: {
    width: 700,
    height: 790
  },
  termColorMap: d3.scale.category10()
};

const CUSTOM_EVENTS = [
  'termSelect',
  'termDeselect',
  'topicSelect'
];


export default d3Kit.factory.createChart(DEFAULT_OPTIONS, CUSTOM_EVENTS,
function constructor(skeleton){
  // alias
  const options = skeleton.options();
  const dispatch = skeleton.getDispatcher();
  const layers = skeleton.getLayerOrganizer();

  layers.create(['term-list', 'topic-list', 'connections']);
  dispatch.on('data', visualize);

  //***************************************************//
  //*********** Computation Functions Begin ***********//
  //***************************************************//

  //***************************************************//
  //*********** Computation Functions End ***********//
  //***************************************************//

  //***************************************************//
  //*********** Draw Functions Begin ***********//
  //***************************************************//

  //***************************************************//
  //*********** Draw Functions End ***********//
  //***************************************************//


  function visualize(){
    if(!skeleton.hasData()) return;
    const data = skeleton.data();
    if (!data.terms || !data.topics) return;
    console.log(data)
    layers.get('connections').attr('transform', 'translate(' + options.termList.width + ', 0)');
    layers.get('topic-list').attr('transform', 'translate(' + (options.termList.width + options.connections.width) + ', 0)');
    visualizeTopTerms();
    visualizeTopTopics();
    visualizeConnections();
  }

  function visualizeTopTerms() {
    console.log(skeleton.data())
    const topTerms = skeleton.data().terms;
    const selectedTerms = skeleton.data().selectedTerms;
    const container = layers.get('term-list');
    const width = options.termList.width;
    const height = options.termList.height;

    const x = d3.scale.linear()
      .domain([0, skeleton.data().termTopicProperties.maxWeight])
      .range([10, width-130]); // 100 pixels are allocated to the texts

    const y = d3.scale.ordinal()
      .domain(d3.range(options.termBatchSize))
      .rangeBands([0, height], 0.05);

    const term = container.selectAll('.term')
      .data(topTerms, d => d.term);

    term.exit().remove();
    const newTerms = term.enter()
      .append('g')
      .attr('class', 'term');
    term.transition()
      // Each group is moved right by 100, to leave 100 pixels for the texts
      .attr('transform', (d, i) => 'translate(100, ' + y(i) + ')');
    
    newTerms.append('text')
      .text(t => t.term)
      .attr('font-family', 'Helvetica Neue')
      .attr('font-weight', 300)
      .attr('text-anchor', 'end')
      .attr('dy', 13);

    newTerms.append('rect')
      .attr('width', d => x(d.properties.weight))
      .attr('height', y.rangeBand())
      .attr('transform', 'translate(20, 0)') // Space between rectangles and texts
      .on('mouseover', function(d, i) {
        const selectedTerms = skeleton.data().selectedTerms;
        if (selectedTerms.indexOf(d.term) >= 0) return;
        d3.select(this).attr('fill', '#a6bddb');
        d3.selectAll('.connection')
          .filter(curve => selectedTerms.indexOf(curve.term.term) < 0)
          .attr('stroke',(curve, i) => curve.term.term === d.term ? '#a6bddb' : '#d6d6d6')
          .attr('stroke-width', function(curve, i) {
            return curve.term.term === d.term ? 2 : 1;
          })
          .attr('opacity', function(curve, i) {
            return curve.term.term === d.term ? 0.75 : 0.25;
          });
        layers.get('topic-list').selectAll('.topic-term-selector')
          .attr('fill', function(topicTerm, i) {
            if (selectedTerms.indexOf(topicTerm.term) >= 0) {
              return options.termColorMap(topicTerm.term);
            }
            else {
              return topicTerm.term === d.term ? '#a6bddb' : '#d6d6d6';
            }
          });
      })
      .on('mouseout', function(d, i) {
        const selectedTerms = skeleton.data().selectedTerms;
        if (selectedTerms.indexOf(d.term) >= 0) return;
        d3.select(this).attr('fill', '#d6d6d6');
        d3.selectAll('.connection')
          .filter(function(curve) {
            return selectedTerms.indexOf(curve.term.term) < 0;
          })
          .attr('stroke', '#d6d6d6')
          .attr('stroke-width', 1)
          .attr('opacity', 0.5);
        layers.get('topic-list').selectAll('.topic-term-selector')
          .attr('fill', function(topicTerm, i) {
            if (selectedTerms.indexOf(topicTerm.term) >= 0) {
              return options.termColorMap(topicTerm.term);
            }
            else {
              return '#d6d6d6';
            }
          });
      })
      .on('click', function(d) {
        if (skeleton.data().selectedTerms.indexOf(d.term) >= 0) {
          dispatch.termDeselect(d.term);
        }
        else {
          dispatch.termSelect(d.term);
        }
//          $scope.updateTermTopicOrdering();
        updateTermTopicFills();
        updateConnectionStrokes();
      });

    updateTermTopicFills();
  }

  function visualizeTopTopics() {
    const topTopics = skeleton.data().topics;
    const container = layers.get('topic-list');
    const width = options.topicList.width;
    const height = options.topicList.height;

    const y = d3.scale.ordinal()
      .domain(d3.range(options.topicBatchSize))
      .rangeBands([0, height], 0.05);

    const topic = container.selectAll('.topic')
      .data(topTopics, d => d.id);

    topic.exit().remove();

    const newTopics = topic
      .enter()
      .append('g')
      .attr('class', 'topic')

    topic.transition()
      // 50 is allocated to topic ids
      .attr('transform', (d, i) => 'translate(50, ' + y(i) + ')');

    const numDocScale = d3.scale.linear()
      .domain([
          d3.min(topTopics, d => d.evidenceCount), 
          d3.max(topTopics, d => d.evidenceCount)
        ])
      .range([5, 30]);

    visualizeIndividualTopic(newTopics, width-50, y, numDocScale);
  }

  function visualizeIndividualTopic(topic, width, y, numDocScale) {

    const termWidth = Math.max(width - 10, 10);
    const highlightOpacity = 0.3;

    topic.append('rect')
      .attr('class', 'topic-background')
      .attr('id', d => 'topic-bg-' + d.id)
      .attr('width', 60)
      .attr('height', 20)
      .attr('transform', 'translate(-50, 0)')
      .attr('rx', 5)
      .attr('fill', 'steelblue')
      .attr('opacity', 0, function(d) {
        const selectedTopic = skeleton.data().selectedTopic;
        return (selectedTopic !== null && d.id === selectedTopic.id) ? highlightOpacity : 0;
      })
      .on('mouseover', function(d) {
        const selectedTopic = skeleton.data().selectedTopic;        
        d3.selectAll('.topic-background').attr('opacity', 0);
        d3.select('#topic-bg-' + d.id)
          .attr('opacity', highlightOpacity);          
        if (selectedTopic !== null) {
          d3.select('#topic-bg-' + selectedTopic.id).attr('opacity', highlightOpacity); 
        }

      })
      .on('mouseout', function() {
        d3.selectAll('.topic-background').attr('opacity', function(d) {
          const selectedTopic = skeleton.data().selectedTopic;
          return (selectedTopic !== null && d.id === selectedTopic.id) ? highlightOpacity : 0;
        });          
      })
      .on('click', function(d) {
        dispatch.topicSelect(d, 'direct');
      });

    topic.append('rect')
      .attr('class', 'topic-selector')
      .attr('id', d =>'topic-selector-' + d.id)
      .attr('pointer-events', 'none')
      .attr('width', function(d, i) {
        return numDocScale(d.evidenceCount);
      })
      .attr('height', 10)
      .attr('transform', 'translate(-35, 5)')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('fill', '#e5e5e5');
/*
    topic.append('text')
      .text(function(topic) {
        return topic.evidenceCount;
      })
      .attr('text-anchor', 'end')
      .attr('dy', 13)
      .attr('dx', -20)     */

    var probSum = 0.4;
    // Hack alert!!!
    /*
    if ($scope.collection.id === 12) probSum = 0.2;
    if ($scope.collection.id === 13) probSum = 0.5;
    if ($scope.collection.id === 15) probSum = 0.7;
    if ($scope.collection.id === 16) probSum = 0.2;
    if ($scope.collection.id === 17) probSum = 0.25; */

    const probScale = d3.scale.pow(100)
      .domain([0, 0.4])
      .range([0, 1]);

    var term = topic.selectAll('g')
      .data(function(d, i) {
        var acc = 0;
        var terms = d.terms;
        for (var j = 0; j < terms.length; ++j) {
          var term = terms[j];
          term.prevProb = acc;
          acc += term.prob;
        }
        terms.push({
          prevProb: acc,
          prob: probSum - acc,
          term: 'other terms'
        });
        return terms;
      })
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(' + (d.prevProb * termWidth * (1 / probSum)) + ', 0)';
      });

    term.append('rect') 
      .attr('class', 'topic-term-selector')
      .attr('width', function(d) {
        return Math.max(d.prob * termWidth * (1 / probSum) - 1, 1);
      })
      .attr('height', y.rangeBand())
      .attr('fill', '#d6d6d6')
      .attr('opacity', (d, i) => 0.4 + (10-i)*0.06)
      .on('click', function(d) {
        // TODO: cannot easily count topic count here, will add if necessary
        const selectedTerms = skeleton.data().selectedTerms;
        if (selectedTerms.indexOf(d.term) >= 0) {
          dispatch.termDeselect(d.term);
        }
        else {
          dispatch.termSelect(d.term);
        }
        updateTermTopicFills();
      });        

    term.append('text')
      .attr('x', function(d) {
        return d.prob * termWidth * (1 / probSum) / 2;
      })
      .attr('dy', 13)
      .attr('fill', 'white')
      .attr('font-family', 'Helvetica Neue')
      .attr('font-weight', 350)
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .text(function(d, i) {
        return i < 2 ? d.term : '';
      });      
  }

  function visualizeConnections() {
    const terms = skeleton.data().terms;
    const topics = skeleton.data().topics;
    const connections = skeleton.data().connections;
    const container = layers.get('connections');
    const width = options.connections.width;
    const height = options.connections.height;

    const termIndexMap = getItemIndexMap(terms, 'origIndex');
    const topicIndexMap = getItemIndexMap(topics, 'id');

    var termY = d3.scale.ordinal()
      .domain(d3.range(options.termBatchSize))
      .rangeBands([0, height], 0.05);
    var topicY = d3.scale.ordinal()
      .domain(d3.range(options.topicBatchSize))
      .rangeBands([0, height], 0.05);

    var line = d3.svg.line()
      .x(d => d.x)
      .y(d => d.y)
      .interpolate('bundle')
      .tension(1);

    var curve = container.selectAll('.connection')
      .data(connections, function(d, i) {
        return d.term.origIndex + '-' + d.topic.id;
      });

    curve.exit().remove();

    curve.enter()
      .append('path')
      .attr('class', 'connection')
      .attr('fill', 'none')
      .attr('stroke', '#d6d6d6')
      .attr('stroke-with', 1)
      .attr('opacity', 0.5);

    curve
      .attr('d', function(d) {
        var termPos = 5 + termY(termIndexMap[d.term.origIndex]);
        var topicPos = 9 + topicY(topicIndexMap[d.topic.id]);
        var points = [
          {x: 0, y: termPos},
          {x: 30, y: termPos},
          {x: 30, y: topicPos},
          {x: options.connections.width, y: topicPos}
        ]; 
        return line(points);
      });
  }

    function updateTermTopicFills() {
      const selectedTerms = skeleton.data().selectedTerms;
      // Uncomment the following to color terms by their position in the $scope.selectedTerms array
      // termColorMap.domain($scope.selectedTerms);
      layers.get('term-list').selectAll('rect')
        .attr('fill', d => selectedTerms.indexOf(d.term) >= 0 ? options.termColorMap(d.term) : '#d6d6d6');
      layers.get('topic-list').selectAll('.topic-term-selector')
        .attr('fill', d => selectedTerms.indexOf(d.term) >= 0 ? options.termColorMap(d.term) : '#d6d6d6');
    }

    function updateConnectionStrokes() {
      layers.get('connections').selectAll('path')
        .attr('stroke', function(d, i) {
          if (skeleton.data().selectedTerms.indexOf(d.term.term) >= 0) {
            return options.termColorMap(d.term.term);
          }
          else {
            return '#d6d6d6';
          }          
        })
        .attr('stroke-width', function(d, i) {
          const selectedTerms = skeleton.data().selectedTerms;
          return (selectedTerms.length === 0 || selectedTerms.indexOf(d.term.term) >= 0) ? 2 : 1;
        })
        .attr('opacity', function(d, i) {
          const selectedTerms = skeleton.data().selectedTerms;
          return (selectedTerms.length === 0 || selectedTerms.indexOf(d.term.term) >= 0) ? 0.75 : 0.25;
        });
    }


  function getItemIndexMap(itemArray, idProperty) {
    return _.fromPairs(itemArray.map(function(item, i) {
      return [item[idProperty], i];
    }));
  }

  return skeleton.mixin({
    visualize
  });
});