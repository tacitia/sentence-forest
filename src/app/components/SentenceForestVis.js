import d3 from 'd3';
import d3Kit from 'd3kit';
import d3Tip from 'd3-tip';

d3.tip = d3Tip;

const DEFAULT_OPTIONS = {
  margin: {top: 10, right: 10, bottom: 10, left: 10},
  initialWidth: 2000,
  initialHeight: 300,
  sentenceHeight: 50,
  anchorWidth: 100,
  treeGap: 20,
  segmentWidths: [],
  paperColorScale: d3.scale.category10()
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

    console.log('visualization data')
    console.log(skeleton.data())

    computeVisProperties(data);

    const treeGroups = layers.get('forest')
      .selectAll('.tree')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${d.vis.y})`)
      .attr('class', 'tree');

    // Step 1: Draw the anchor words
    const anchorStripes = visualizeAnchors(treeGroups, data);
    // Step 2: Draw the intermediate phrases
    const individualSegment = visualizeSegments(anchorStripes);
    // Step 3: Draw the curves connecting phrases and words
    visualizeLinks(individualSegment);

    // Step 4: Celebrate & take care of external-initiated updates
    layers.get('forest').selectAll('.segment-text')
      .classed('segment-text-highlight', d => {
        console.log(d.originalSentence.id)
        return (d.originalSentence.id === skeleton.data().states.hoverSentence)
      });

  } 

  function visualizeAnchors(treeGroup, treeData) {
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
      .attr('y', d => d.vis.y + 3)
      .attr('class', 'anchor');

    return anchorStripes;
  }

  function visualizeSegments(anchorStripes) {
   const segments = anchorStripes.selectAll('.segment-group')
      .data(d => d)
      .enter()
      .append('g')
      .attr('class', 'segment-group')
      .attr('transform', (d, i) => {
        const left = d.stem === '' ? 0 : options.anchorWidth;
        return `translate(${left}, ${d.vis.segmentTop})`
      });      

    const individualSegment = segments.selectAll('.segment')
      .data(d => d.segments)
      .enter()
      .append('g')
      .attr('class', 'segment')
      .attr('transform', (d, i) => `translate(0, ${i * options.sentenceHeight})`);

    individualSegment
      .append('rect')
      .attr('x', 10)
      .attr('width', (d, i) => {
        const widthOffset = 35;
        return d.prevAnchor.stem == '' ? d.prevAnchor.vis.segmentWidth - widthOffset : d.prevAnchor.vis.segmentWidth - options.anchorWidth - widthOffset;
      })
      .attr('height', options.sentenceHeight)
      .attr('fill', d => options.paperColorScale(d.originalSentence.abstractOrder))
      .attr('fill-opacity', 0.1)

    individualSegment
      .append('text')
      .text(d => d.content.join(' '))
      .attr('id', (d, i) => `${d.originalSentence.id}-${d.prevAnchor.id}`)
      .attr('class', d => `segment-text ${d.originalSentence.id}`)
      .on('mouseover', d => {
        segments.selectAll(`.segment-text.${d.originalSentence.id}`).classed('segment-text-highlight', true);
        segments.selectAll(`.segment-link.${d.originalSentence.id}`).classed('segment-link-highlight', true);
        // TODO: highlight associated anchors as well
        dispatch.sentenceMouseOver(d.originalSentence.id);
      })
      .on('mouseout', d => {
        segments.selectAll('.segment-text').classed('segment-text-highlight', false);
        segments.selectAll('.segment-link').classed('segment-link-highlight', false);
        dispatch.sentenceMouseOver(-1);
      });

    // Wrap texts
    individualSegment.selectAll('.segment-text')
      .each((d, i) => {
        // Avoiding wrapping empty segments, which seem to result in displaying "false"
        if (d.content[0] !== '') {
          d3plus.textwrap()
            .container(`#${d.originalSentence.id}-${d.prevAnchor.id}`)
            .draw();
        }
      });

    return individualSegment;
  }

  function visualizeLinks(individualSegment) {
    const linkGenerator = d3.svg.line()
      .x(d => d.x)
      .y(d => d.y)
      .interpolate('basis');
    // Visualize incoming links for each anchor
    individualSegment
      .append('path')
      .attr('class', (d, i) => `segment-link ${d.originalSentence.id}`)
      .attr('d', (d, i) => { 
        if (!d.nextAnchor || d.content[0] === '') {
          return linkGenerator([]);
        }
        const xOffset = d.prevAnchor.stem === '' ? 0 : -options.anchorWidth;      
        const baseX = d.prevAnchor.vis.segmentWidth + xOffset - 5;  
        const baseYStart = options.sentenceHeight / 2;
        const baseYEnd = d.nextAnchor.vis.y - i * options.sentenceHeight;
        const linkData = [
          { x: baseX - 20, y: baseYStart }, 
          { x: baseX - 15, y: baseYStart }, 
          { x: baseX - 5, y: baseYEnd},
          { x: baseX, y: baseYEnd }
        ];
        return linkGenerator(linkData);
      })
      .attr('stroke', 'black')
      .attr('fill', 'none');
    // Visualize outgoing links for each anchor
    individualSegment
      .append('path')
      .attr('class', (d, i) => `segment-link ${d.originalSentence.id}`)
      .attr('d', (d, i) => { 
        if (d.prevAnchor.stem === '') {
          return linkGenerator([]);
        }
        const xOffset = d.prevAnchor.stem === '' ? 0 : -options.anchorWidth;      
        const baseX = -20;
        const baseYStart = d.prevAnchor.vis.y - i * options.sentenceHeight;
        const baseYEnd = options.sentenceHeight / 2;
        const yOffset =  baseYStart < baseYEnd ? 10 : -10;
        const linkData = [
          { x: baseX, y: baseYStart }, 
          { x: baseX + 5, y: baseYStart},
          { x: baseX + 15, y: baseYEnd },
          { x: baseX + 20, y: baseYEnd }
        ];
        return linkGenerator(linkData);
      })
      .attr('stroke', 'black')
      .attr('fill', 'none');
  }

  function computeVisProperties(treeData) {
    treeData.forEach(tree => {
      tree.vis = {};
      tree.anchors.forEach(anchorStripe => {
        anchorStripe.forEach(a => {
          a.vis = {};
        })
      })
    });
    computeAnchorX(treeData);
    computeAnchorY(treeData);
    console.log('after computation')
    console.log(treeData)
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
        anchorStripe.forEach(a => {
          totalSentences += a.segments.length;
          a.segments.forEach(s => {
            const charLength = s.content.join(' ').length;
            totalLength += charLength;
            if (charLength > maxLength) {
              maxLength = charLength;
            }
          });
        });
        var xLength = Math.max(Math.min(totalLength / totalSentences * 9, maxStripeWidth), maxLength / 2 *  9);
        anchorStripe.forEach(a => {
          a.vis.x = totalX;
          a.vis.segmentWidth = xLength;
        });
        totalX += xLength;
      });
    });
  }

  // Compute anchor positions based on the maximum number of words in each segment
  function computeAnchorY(treeData) {
    const totalSentences = _.sum(treeData.map(t => t.sentences.length));
    const sentenceHeight = skeleton.getInnerHeight() / totalSentences;
    skeleton.options({sentenceHeight});

    var totalSpaceAboveTree = 0;
    treeData.forEach(tree => {
      tree.vis.y = totalSpaceAboveTree;
      var treeHeight = 0;
      tree.anchors.forEach(anchorStripe => {
        var totalSpaceAboveAnchor = 0;
        anchorStripe.forEach(a => {
          const anchorSegmentsHeight = options.sentenceHeight * a.segments.length;
          a.vis.segmentTop = totalSpaceAboveAnchor;
          a.vis.y = totalSpaceAboveAnchor + anchorSegmentsHeight / 2;
          totalSpaceAboveAnchor += anchorSegmentsHeight;
        })
        if (totalSpaceAboveAnchor > treeHeight) {
          treeHeight = totalSpaceAboveAnchor;
        }
      });
      totalSpaceAboveTree += (treeHeight + options.treeGap);
    });
  }

  return skeleton.mixin({
    visualize
  });
});