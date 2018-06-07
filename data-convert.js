const gData = require('./graphData');

function nodeCount(data) {
  let nodes = data.nodeList;
  let nodeMap = {}

  for(let i of nodes) {
    if(i.elementType && i.elementType === 'N') {
      i.prop = JSON.parse(i.prop);
      nodeMap[i.uniqueId] = {
        origin: i,
        related: {},
        edge: []
      };
    } else {
      console.warn('[warn]: detect non-node in nodeList;')
    }
  }

  return nodeMap
}

function edgeCount(data, nodeMap) {
  let edges = data.edgeList;

  for(let e of edges) {
    if(nodeMap[e.source]) {
      nodeMap[e.source].edge.push(e);
      nodeMap[e.target].edge.push(e);
      nodeMap[e.source].related[e.target] = nodeMap[e.target];
      nodeMap[e.target].related[e.source] = nodeMap[e.source];
    }
  }

  return nodeMap
}

function collaspeNodeMap(nMap) {
  let nArr = [];

  for(let i in nMap) {
    nArr.push(nMap[i]);
  }

  return nArr.sort((a, b) => b.edge.length - a.edge.length)
}

function getNextWay(xy, angle, len) {
  let [x, y] = xy;

  return [x+len*Math.sin(angle), y+len*Math.cos(angle)]
}

function getNodes(data, weight) {
  const nMap = nodeCount(data);
  const nArr = collaspeNodeMap(edgeCount(data, nMap));
  let last = [0, 0];
  let center = last;
  let startAngle = Math.PI / 2;
  let deltaAngle = 0.314*Math.PI;

  for(let i = 0; i < nArr.length; i++) {
    if(nArr[i+1] && nArr[i].edge.length > nArr[i+1].edge.length*1.5) {
      last = getNextWay(last, startAngle, weight*1.5)
      center = last;
      nArr[i].x = last[0];
      nArr[i].y = last[1];
      nArr[i].id = nArr[i].origin.uniqueId;
      nArr[i].label = nArr[i].origin.descption;
    } else {
      last = getNextWay(center, startAngle, weight);
      startAngle += deltaAngle;
      nArr[i].x = last[0];
      nArr[i].y = last[1];
      nArr[i].id = nArr[i].origin.uniqueId;
      nArr[i].label = nArr[i].origin.descption;
    }
  }




  return nArr;
}

function getEdges(data) {
  let edges = data.edgeList;

  return edges.map(e => {
    return {
      origin: e,
      source: e.source,
      target: e.target,
      id: e.uniqueId,
      label: e.descption
    }
  })
}

const converter = {
  getNodes, getEdges
}

export default converter;

