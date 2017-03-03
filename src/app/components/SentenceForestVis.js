import d3 from 'd3';
import d3Kit from 'd3kit';
import d3Tip from 'd3-tip';
import { getTextWidth } from '../utility.js';

d3.tip = d3Tip;

// const colorPalette = ["#4f8c9d", "#4d943a", "#b55edb", "#427ff5", "#ce5d8e", "#9a789e"]; // Darker
const colorPalette = ["#5e904e", "#dc58ea", "#2499d7", "#eb5e9b", "#8270f6", "#0ca82e"]; // Lighter
// const colorPalette = ['#dd3b44', '#2578b5', '#569597', '#eb652d', '#9c6680', '#aec487']; // Chinese

const DEFAULT_OPTIONS = {
  margin: {top: 10, right: 10, bottom: 10, left: 20},
  initialWidth: 2000,
  initialHeight: 800,
  sentenceHeight: 20,
  focusSentenceHeight: 35,
  anchorWidth: 100,
  treeGap: 10,
  segmentWidths: [],
  anchorCharWidth: 10,
  anchorFontSize: 16,
  sentenceFontSize: 13,
  anchorFontFamily: 'Roboto',
  sentenceFontFamily: 'Roboto',
  paperColorScale: d3.scale.ordinal()
    .domain([0, 1, 2, 3, 4, 5])
    .range(colorPalette),
  useDynamicLayout: true
};

const CUSTOM_EVENTS = [
  'sentenceMouseOver',
];


export default d3Kit.factory.createChart(DEFAULT_OPTIONS, CUSTOM_EVENTS,
function constructor(skeleton){
  // alias
  const options = skeleton.options();
  const dispatch = skeleton.getDispatcher();
  const layers = skeleton.getLayerOrganizer();

  layers.create(['forest']);
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
    const data = skeleton.data().data;
    // # of trees = data.length
    // for each tree:
    //    # of anchors: anchors.length
    //    # of papers: amount of vertical space needed
//    visualize(data.sentenceForest[0], 0, skeleton.getInnerWidth(), skeleton.getInnerHeight());
    if (!data) return;
    const sortedData = sortTrees(data);
    computeVisProperties(sortedData);

    const activeAbstract = skeleton.data().states.selectedAbstract;

    const treeGroups = layers.get('forest')
      .selectAll('.tree')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'tree');

    layers.get('forest')
      .selectAll('.tree')
      .transition()
      .attr('transform', (d, i) => `translate(0, ${options.useDynamicLayout ? d.vis.dynamicY[activeAbstract] : d.vis.y})`)

    // Step 1: Draw the anchor words
    const anchorStripes = visualizeAnchors(treeGroups, data);
    // Step 2: Draw the intermediate phrases
    const individualSegment = visualizeSegments(anchorStripes);
    // Step 3: Draw the curves connecting phrases and words
    visualizeLinks(individualSegment);
    visualizePointers(individualSegment);
    // Step 4: Celebrate & take care of external-initiated updates
    const segmentTexts = layers.get('forest').selectAll('.segment-text');
    segmentTexts.classed('segment-text-highlight', d => {
        return (d.originalSentence.id === skeleton.data().states.hoverSentence)
      });
    layers.get('forest').selectAll('.segment')
      .classed('segment-out-focus', d => {
        return d.originalSentence.abstractOrder !== activeAbstract;
      });
    layers.get('forest').selectAll('.anchor')
      .classed('segment-out-focus', d => {
        var outFocus = true;
        d.segments.forEach(s => {
          if (s.originalSentence.abstractOrder === activeAbstract) {
            outFocus = false;
          }
        });
        d.prevSegments.forEach(s => {
          if (s.originalSentence.abstractOrder === activeAbstract) {
            outFocus = false;
          }
        });
        return outFocus;
      });
    layers.get('forest').selectAll('.pointer')
      .classed('hidden', d => {
        return (d.originalSentence.id !== skeleton.data().states.hoverSentence);
      });
  } 

  function sortTrees(trees) {
    return trees.sort((treeA, treeB) => {
      const sentencePositionsA = treeA.sentences.map(s => s.sentencePos);
      const sentencePositionsB = treeB.sentences.map(s => s.sentencePos);
      const medianA = computeMedian(sentencePositionsA);
      const medianB = computeMedian(sentencePositionsB);
      if (medianA !== medianB) {
        return medianA - medianB;
      }
      else {
        return _.mean(sentencePositionsA) - _.mean(sentencePositionsB);
      }
    });
  }

  function computeMedian(numbers) {
    if (numbers.length % 2 === 0) {
      const mid = numbers.length / 2;
      return (numbers[mid-1] + numbers[mid]) / 2;
    }
    else {
      return numbers[(numbers.length-1) / 2];
    }
  }

  function visualizeAnchors(treeGroup, treeData) {
    const activeAbstract = skeleton.data().states.selectedAbstract;
    const anchorStripes = treeGroup
      .selectAll('.anchor-stripe')
      .data(d => d.anchors)
      .enter()
      .append('g')
      .attr('class', 'anchor-stripe')
      .attr('transform', (d, i) => `translate(${d[0].vis.x}, 0)`);

    anchorStripes.selectAll('.anchor')
      .data(d => d)
      .enter()
      .append('text')
      .attr('class', 'anchor')
      .text(d => d.display)
      .attr('font-size', options.anchorFontSize)
      .attr('font-family', options.anchorFontFamily);

    layers.get('forest')
      .selectAll('.anchor')
      .transition()
      .attr('y', d => (options.useDynamicLayout ? d.vis.dynamicY[activeAbstract] : d.vis.y) + 3)

    return anchorStripes;
  }

  function visualizeSegments(anchorStripes) {
   const activeAbstract = skeleton.data().states.selectedAbstract;
   const segments = anchorStripes.selectAll('.segment-group')
      .data(d => d)
      .enter()
      .append('g')
      .attr('class', 'segment-group');

    layers.get('forest')
      .selectAll('.segment-group')
      .transition()
      .attr('transform', (d, i) => {
        const left = d.stem === '' 
        ? 0 
        : getTextWidth(d.display, options.anchorFontSize, options.anchorFontFamily);
        const segmentTop = options.useDynamicLayout ? d.vis.dynamicSegmentTop[activeAbstract] : d.vis.segmentTop;
        return `translate(${left}, ${segmentTop})`
      });      

    const individualSegment = segments.selectAll('.segment')
      .data(d => d.segments)
      .enter()
      .append('g')
      .attr('class', 'segment');

    layers.get('forest')
      .selectAll('.segment')
      .attr('transform', (d, i) => `translate(0, ${options.useDynamicLayout ? d.vis.dynamicSingleSegmentTop[activeAbstract] : i * options.sentenceHeight})`);

    individualSegment
      .append('rect')
      .attr('x', d => d.prevAnchor.stem === '' ? 10 : 28)
      .attr('width', (d, i) => {
        const widthOffset = 35;
        const baseWidth = d.prevAnchor.vis.segmentWidth - widthOffset ;
        return d.prevAnchor.stem === '' 
          ? baseWidth
          : baseWidth - getTextWidth(d.prevAnchor.display, options.anchorFontSize, options.anchorFontFamily) - 17;
      })
      .attr('height', 5)
      .attr('fill', d => options.paperColorScale(d.originalSentence.abstractOrder))
      .attr('class', 'segment-background');

    layers.get('forest').selectAll('.segment-background')
      .transition(1000)
      .attr('y', d => {
        return (options.useDynamicLayout && d.originalSentence.abstractOrder === activeAbstract) ? options.focusSentenceHeight - 5 : options.sentenceHeight - 5;
      });

    drawSegmentTexts(individualSegment);
      
    return individualSegment;
  }

  function drawSegmentTexts(individualSegment) {
   const activeAbstract = skeleton.data().states.selectedAbstract;
    layers.get('forest')
      .selectAll('.segment-text')
      .remove();

    layers.get('forest')
      .selectAll('.segment-bounds')
      .remove();

    const segments = layers.get('forest')
      .selectAll('.segment');

    segments
      .append('rect')
      .attr('x', d => d.prevAnchor.stem === '' ? 10 : 28)
      .attr('y', (d, i) => {
        if (options.useDynamicLayout && d.originalSentence.abstractOrder === activeAbstract) {
          const textWidth = getTextWidth(d.content.join(' '), options.sentenceFontSize, options.sentenceFontFamily);
          const rectWidth = computeSegmentWidth(d);
          return textWidth < rectWidth ? 13 : 3;
        }
        else {
          return 3;
        }
      })
      .attr('width', d => computeSegmentWidth(d))
      .attr('fill-opacity', 0)
      .attr('class', 'segment-bounds')
      .attr('height', d => (options.useDynamicLayout && d.originalSentence.abstractOrder === activeAbstract) ? options.focusSentenceHeight : options.sentenceHeight);

    segments
      .append('text')
      .text(d => d.content.join(' '))
      .attr('font-size', options.sentenceFontSize)
      .attr('font-family', options.sentenceFontFamily)
      .attr('id', (d, i) => `${d.originalSentence.id}-${d.prevAnchor.id}`)
      .attr('class', d => `segment-text ${d.originalSentence.id}`)
      .on('mouseover', d => {
        if (d.originalSentence.abstractOrder !== skeleton.data().states.selectedAbstract) return
        segments.selectAll(`.segment-text.${d.originalSentence.id}`).classed('segment-text-highlight', true);
        segments.selectAll(`.segment-link.${d.originalSentence.id}`).classed('segment-link-highlight', true);
        // TODO: highlight associated anchors as well
        dispatch.sentenceMouseOver(d.originalSentence);
      })
      .on('mouseout', d => {
        if (d.originalSentence.abstractOrder !== skeleton.data().states.selectedAbstract) return
        segments.selectAll('.segment-text').classed('segment-text-highlight', false);
        segments.selectAll('.segment-link').classed('segment-link-highlight', false);
        dispatch.sentenceMouseOver({ id: -1 });
      });

    // Wrap texts
    layers.get('forest')
      .selectAll('.segment-text')
      .each((d, i) => {
        // Avoiding wrapping empty segments, which seem to result in displaying "false"
        if (d.content[0] !== '') {
          d3plus.textwrap()
            .container(`#${d.originalSentence.id}-${d.prevAnchor.id}`)
            .draw();
        }
      });

  }

  function computeSegmentWidth(d) {
    const widthOffset = 35;
    const baseWidth = d.prevAnchor.vis.segmentWidth - widthOffset ;
    return d.prevAnchor.stem === '' 
      ? baseWidth
      : baseWidth - getTextWidth(d.prevAnchor.display, options.anchorFontSize, options.anchorFontFamily) - 10;
  }

  function visualizePointers(individualSegment) {
    const startAnchors = individualSegment
      .filter(d => d.prevAnchor.stem === '');
    const points = '0 0, 16 9, 0 18, 4 9';      
    startAnchors.append('polyline')
      .attr('points', points)
      .attr('transform', 'translate(-10, 8)')
      .attr('class', 'pointer')
      .style('stroke', 'steelblue')
      .style('fill', 'steelblue');
  }

  function visualizeLinks(individualSegment) {
    const activeAbstract = skeleton.data().states.selectedAbstract;
    const linkGenerator = d3.svg.line()
      .x(d => d.x)
      .y(d => d.y)
      .interpolate('basis');
    // Visualize incoming links for each anchor
    individualSegment
      .append('path')
      .attr('class', (d, i) => `segment-link incoming-link ${d.originalSentence.id}`);

    layers.get('forest').selectAll('.incoming-link')
      .transition()
      .attr('d', (d, i) => { 
        const sentenceHeight = (options.useDynamicLayout && d.originalSentence.abstractOrder === activeAbstract) ? options.focusSentenceHeight : options.sentenceHeight;
        if (!d.nextAnchor) {
          return linkGenerator([]);
        }
        const xOffset = d.prevAnchor.stem === '' 
          ? 0 
          : -getTextWidth(d.prevAnchor.display, options.anchorFontSize, options.anchorFontFamily);    
        const baseX = d.prevAnchor.vis.segmentWidth + xOffset - 5;  
        const baseYStart = (options.useDynamicLayout && d.originalSentence.abstractOrder === activeAbstract) ? (sentenceHeight / 2 + 14) : (sentenceHeight / 2 + 6);
        const nextAnchorY = options.useDynamicLayout ? d.nextAnchor.vis.dynamicY[activeAbstract] : d.nextAnchor.vis.y;
        const baseYEnd = options.useDynamicLayout 
          ? (nextAnchorY - d.vis.dynamicSingleSegmentTop[activeAbstract]) 
          : (nextAnchorY - i * options.sentenceHeight);
        const linkData = [
          { x: baseX - 20, y: baseYStart }, 
          { x: baseX - 15, y: baseYStart }, 
          { x: baseX - 5, y: baseYEnd},
          { x: baseX, y: baseYEnd }
        ];
        return linkGenerator(linkData);
      })
      .attr('stroke', d => options.paperColorScale(d.originalSentence.abstractOrder))
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    // Visualize outgoing links for each anchor
    individualSegment
      .append('path')
      .attr('class', (d, i) => `segment-link outgoing-link ${d.originalSentence.id}`);

    layers.get('forest').selectAll('.outgoing-link')
      .transition()    
      .attr('d', (d, i) => { 
        if (d.prevAnchor.stem === '') {
          return linkGenerator([]);
        }
        const sentenceHeight = (options.useDynamicLayout && d.originalSentence.abstractOrder === activeAbstract) ? options.focusSentenceHeight : options.sentenceHeight;
        const xOffset = d.prevAnchor.stem === '' 
          ? 0 
          : -getTextWidth(d.prevAnchor.display, options.anchorFontSize, options.anchorFontFamily);    
        const baseX = 7;
        const prevAnchorY = options.useDynamicLayout ? d.prevAnchor.vis.dynamicY[activeAbstract] : d.prevAnchor.vis.y;
        const prevAnchorTop = options.useDynamicLayout ? d.prevAnchor.vis.dynamicSegmentTop[activeAbstract] : d.prevAnchor.vis.segmentTop;
        const baseYStart = options.useDynamicLayout
          ? (prevAnchorY - prevAnchorTop) - d.vis.dynamicSingleSegmentTop[activeAbstract]
          : (prevAnchorY - prevAnchorTop) - i * options.sentenceHeight;
        const baseYEnd = (options.useDynamicLayout && d.originalSentence.abstractOrder === activeAbstract) ? (sentenceHeight / 2 + 14) : (sentenceHeight / 2 + 6);
        const linkData = [
          { x: baseX, y: baseYStart }, 
          { x: baseX + 5, y: baseYStart},
          { x: baseX + 15, y: baseYEnd },
          { x: baseX + 20, y: baseYEnd }
        ];
        return linkGenerator(linkData);
      })
      .attr('stroke', d => options.paperColorScale(d.originalSentence.abstractOrder))
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }

  function computeVisProperties(treeData) {
    treeData.forEach(tree => {
      tree.vis = {};
      tree.vis.dynamicY = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      tree.anchors.forEach(anchorStripe => {
        anchorStripe.forEach(a => {
          a.vis = {};
          a.vis.dynamicSegmentTop = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          a.vis.dynamicY = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          a.segments.forEach(s => {
            s.vis = {};
            s.vis.dynamicSingleSegmentTop = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          });
        })
      })
    });
    computeAnchorX(treeData);
    if (options.useDynamicLayout) {
      computeAnchorYCollapse(treeData);
    }
    else {
      computeAnchorY(treeData);      
    }
//     console.log('after computation')
//     console.log(treeData)
  }


  // Information needed: 
  // For each anchor, what's the length of the longest sentence that comes after it and 
  // other anchors on the same level                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
  function computeAnchorX(treeData) {
    treeData.forEach(tree => {
      var totalX = 0;
      const maxStripeWidth = skeleton.getInnerWidth() / tree.anchors.length;
      tree.anchors.forEach((anchorStripe, i) => {
        var maxLength = 0;
        var totalLength = 0;
        var totalSentences = 0;
        var longestSentence = null;
        anchorStripe.forEach(a => {
          totalSentences += a.segments.length;
          a.segments.forEach(s => {
            const charLength = s.content.join(' ').length;
            totalLength += charLength;
            if (charLength > maxLength) {
              maxLength = charLength;
              longestSentence = s.content.join(' ');
            }
          });
        });
        var xLength = Math.max(100, getTextWidth(longestSentence, options.sentenceFontSize, options.sentenceFontFamily) / 2) + 80;
        if (anchorStripe[0].stem.length > 0) {
          xLength += getTextWidth(anchorStripe[0].display, options.anchorFontSize, options.anchorFontFamily);
        }
//        var xLength = Math.max(Math.min(totalLength / totalSentences * 9, maxStripeWidth), );
        anchorStripe.forEach(a => {
          a.vis.x = totalX;
          a.vis.segmentWidth = xLength; // segmentWidth is the entire x space allocated to an anchor and the segment that follows it
        });
        totalX += xLength;
      });
    });
  }

  // Compute anchor positions based on the maximum number of words in each segment
  function computeAnchorY(treeData) {
    const totalSentences = _.sum(treeData.map(t => t.sentences.length));
    const sentenceHeight = (skeleton.getInnerHeight() - 120) / totalSentences;
    skeleton.options({sentenceHeight});

    var totalSpaceAboveTree = 0;
    treeData.forEach(tree => {
      tree.vis.y = totalSpaceAboveTree;
      var treeHeight = 0;
      tree.anchors.forEach(anchorStripe => {
        var totalSpaceAboveAnchor = 0;
        anchorStripe.forEach(a => {
          const anchorSegmentsHeight = options.sentenceHeight * Math.max(1, a.segments.length);
          a.vis.segmentTop = totalSpaceAboveAnchor;
          a.vis.y = totalSpaceAboveAnchor + anchorSegmentsHeight / 2;
          totalSpaceAboveAnchor += anchorSegmentsHeight;
        });
        if (totalSpaceAboveAnchor > treeHeight) {
          treeHeight = totalSpaceAboveAnchor;
        }
      });
      totalSpaceAboveTree += (treeHeight + options.treeGap);
    });
  }

  function computeAnchorYCollapse(treeData) {
    const minimumSentenceHeight = options.sentenceHeight;
    const focusSentenceHeight = options.focusSentenceHeight;
    skeleton.options({minimumSentenceHeight});

    [0, 1, 2, 3, 4, 5].forEach(abstractOrder => {
      var totalSpaceAboveTree = 0;
      treeData.forEach(tree => {
        tree.vis.dynamicY[abstractOrder] = totalSpaceAboveTree;
        var treeHeight = 0;
        tree.anchors.forEach(anchorStripe => {
          var totalSpaceAboveAnchor = 0;
          anchorStripe.forEach(a => {
            var anchorSegmentsHeight = 0;
            a.segments.forEach(s => {
              s.vis.dynamicSingleSegmentTop[abstractOrder] = anchorSegmentsHeight;
              if (s.originalSentence.abstractOrder === abstractOrder) {
                anchorSegmentsHeight += focusSentenceHeight;
              }
              else {
                anchorSegmentsHeight += minimumSentenceHeight;
              }
            })
            a.vis.dynamicSegmentTop[abstractOrder] = totalSpaceAboveAnchor;
            a.vis.dynamicY[abstractOrder] = totalSpaceAboveAnchor + anchorSegmentsHeight / 2;
            totalSpaceAboveAnchor += anchorSegmentsHeight;
          });
          if (totalSpaceAboveAnchor > treeHeight) {
            treeHeight = totalSpaceAboveAnchor;
          }
        });
        totalSpaceAboveTree += (treeHeight + options.treeGap);
      });
    });
  }

  return skeleton.mixin({
    visualize
  });
});