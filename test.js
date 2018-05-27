import G6 from '@antv/g6';
import r from './fine-edge';
import gen from './gen';

const data = {
  "nodes": [
    {
      "x": 140,
      "y": 210,
      "id": "node0",
      "angle": - 1/3 * Math.PI
    },
    {
      "x": 1270,
      "y": 210,
      "id": "node1",
      "angle": 1/3 * Math.PI
    },
    {
      "x": 270,
      "y": 1210,
      "id": "node2",
      "angle": - 1 * Math.PI
    },
    {
      "x": 1270,
      "y": 1210,
      "id": "node3"
    },
    {
      "x": 1270,
      "y": 810,
      "id": "node4"
    },
    {
      "x": 870,
      "y": 1210,
      "id": "node5"
    },
  ]
};


data.edges = gen.edgeGen(6,5);


r.regsLine(G6)

r.regrLine(G6)

const net = new G6.Net({
  id: 'c1',
  width: window.innerWidth,
  height: window.innerHeight
});


net.source(data.nodes, data.edges);

net.node()
  .color('red')
  .size(30)
  .shape('circle');
net.edge()
  .color('blue')
  .size(1)
  .shape('rline');

net.render();
