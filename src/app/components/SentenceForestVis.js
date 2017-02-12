import d3 from 'd3';
import d3Kit from 'd3kit';
import d3Tip from 'd3-tip';

d3.tip = d3Tip;

const DEFAULT_OPTIONS = {
  margin: {top: 10, right: 10, bottom: 10, left: 10},
  initialWidth: 950,
  initialHeight: 800,
};

const CUSTOM_EVENTS = [
  'wordMouseOver',
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
    const data = skeleton.data();
    // # of trees = data.length
    // for each tree:
    //    # of anchors: anchors.length
    //    # of papers: amount of vertical space needed
//    visualize(data.sentenceForest[0], 0, skeleton.getInnerWidth(), skeleton.getInnerHeight());
    console.log(data)
    const treeGroups = layers.get('forest')
      .selectAll('.tree')
      .data(data)
      .enter()
      .append('g');

    computeAnchorProperties(data);
    visualizeAnchors(treeGroups, data);
  } 

  function visualizeAnchors(treeGroup, treeData) {
    // Step 1: Draw the anchor words
    const anchorStripes = treeGroup
      .selectAll('.anchor-stripe')
      .data(d => d.anchors)
      .enter()
      .append('g')
      .attr('x', );

    anchorStripes.selectAll('.anchor')
      .data(d => d)
      .append('text')
      .attr('class', 'anchor')
      .text(d => d)
      .attr('x', (d, i) => i * 200)
      .attr('y', 200)

/*
    console.log(treeData)
    console.log(treeGroup)
    treeGroup.selectAll('.anchor')
      .data(treeData.anchors)
      .enter()
      .append('text')
      .text(d => d); */
//    d3.selectAll('.anchor')
//      .data(treeGroup.data().anchors)

    // Step 2: Draw the intermediate phrases

    // Step 3: Draw the curves connecting phrases and words

    // Step 4: Celebrate 
  }

  function computeAnchorProperties(treeData) {
    treeData.anchors.forEach(anchorStripe => {
      anchorStripe.forEach(a => {
        a.vis = {};
      })
    })
    computeAnchorX(treeData);
    computeAnchorY(treeData);
  }


  // Information needed: 
  // For each anchor, what's the length of the longest sentence that comes after it and 
  // other anchors on the same level                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
  function computeAnchorX(treeData) {
    var totalX = 0;
    // Loop through each anchor stripe
    treeData.anchors.forEach((anchorStripe, i) => {
      var maxLength = -1;
      anchorStripe.forEach(a => {
        a.segments.forEach(s => {
          const charLength = s.join(' ').length;
          if (charLength > maxLength) {
            maxLength = charLength;
          }
        });
      });
      // Set the maximum number characters that can be displayed between two anchor points to be 100
      const xLength = Math.min(maxLength, 100) * 10;
      totalX += xLength;
      anchorStrip.forEach(a => {
        a.vis.x = xLength;
      })
    });
  }

  // Compute anchor positions based on the maximum number of words in each segment
  function computeAnchorY(treeData, canvasHeight) {
    const sentenceHeight = canvasHeight / treeData.sentences.length;
    treeData.anchors.forEach(anchorStripe => {
      var totalSpaceAbove = 0;
      anchorStripe.forEach(a => {
        const anchorSegmentsHeight = sentenceHeight * a.segments.length;
        a.vis.y = totalSpaceAbove + anchorSegmentsHeight / 2;
        totalSpaceAbove += anchorSegmentsHeight;
      })
    });
  }

  return skeleton.mixin({
    visualize
  });
});