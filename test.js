import G6 from '@antv/g6';
import r from './fine-edge';
import gData from './graphData';
import converter from './data-convert';

const nodes = converter.getNodes(gData, 300);

const edges = converter.getEdges(gData);

console.log(nodes,'\n', edges)

r.regsLine(G6)

r.regrLine(G6)

const net = new G6.Net({
  id: 'c1',
  width: window.innerWidth,
  height: window.innerHeight
});


net.source(nodes, edges);

net.node()
  .color('red')
  .size(100)
  .shape('circle');
net.edge()
  .color('blue')
  .size(1)
  .shape('sline');

net.render();
