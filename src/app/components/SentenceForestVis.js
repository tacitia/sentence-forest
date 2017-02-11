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

    visualizeAnchors(treeGroups, data);
      /*
      .each(d => { 
        console.log(this)
        d3.select(this)

          .append('text')
          .text('peter')
//        visualizeTree(d, d3.select(this)); 
      }) */
//      .call(visualizeTree);
//    console.log(treeGroups)
//    treeGroups[0].forEach(g => { console.log(g); visualizeTree(g) });
  } 

  function visualizeAnchors(treeGroup, treeData) {
    // Step 1: Draw the anchor words
    treeGroup
      .selectAll('.anchor')
      .data(d => d.anchors)
      .enter()
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

  // Compute anchor positions based on the maximum number of words in each segment
  function computeAnchorPositions(treeData) {

  }

  return skeleton.mixin({
    visualize
  });
});