function getNodesC(node1, node2) {
  let c = {
    x: (node1.x + node2.x) / 2,
    y: (node1.y + node2.y) / 2,
    dx: (node1.x - node2.x),
    dy: (node1.y - node2.y),
  }

  return c
}

function getNodesCenter(node1, node2) {
  const c = getNodesC(node1, node2);
  let ang = 0.5 * Math.PI + Math.atan2(c.dy, c.dx);

  return function (vol) {

    return [c.x + vol * Math.cos(ang), c.y + Math.sin(ang) * vol]
  }
}

function getBesCenter(node1, node2, node3) {
  let center = (a, b, c) => 0.25*a + 0.5*b + 0.25*c

  return [center(node1.x, node2[0], node3.x), center(node1.y, node2[1], node3.y)]
}

function getArcCenter(node1, node2) {
  const c = getNodesC(node1, node2);
  let ang = 0.5 * Math.PI + Math.atan2(c.dy, c.dx);

  return function (vol) {
    vol = vol/(1-Math.sin(ang))
    let [x, y] = [c.x - vol * Math.cos(ang), c.y - Math.sin(ang) * vol];
    let ang2 = Math.atan2(Math.sqrt((c.dx ** 2)+ (c.dy ** 2))/2, vol);
    let r = Math.sqrt(((node1.x - x) ** 2)+ ((node1.y - y) ** 2));

    return [x, y ,r ,ang, ang2]
  }
}

const point2str = node => (node.x + '') + (node.y + '');

const getVol = val => val % 2 === 0 ? val * 30 : -val * 30;

function getSelfCenter(node, ang) {
  let {x, y} = node;

  ang = ang || 0;
  ang = ang + 1.5 * Math.PI;

  return function (size, delta) {
    let dx = (size+delta)*Math.cos(ang);
    let dy = (size+delta)*Math.sin(ang);

    return [x + dx, y + dy, size+delta, Math.atan2(size, size + delta)]
  }
}

function regsLine(g6) {
  let edgeMap = {};
  let pre = [];
  let cleanEdgeMap = () => {
    let isOn = false;

    if(!isOn) {
      isOn = false;
      setTimeout(() => {edgeMap = {};pre = []; isOn = false}, 10)
    }
  }

  let findEdgeVol = (n1, n2) => {
    let n = 0;
    let p = getNodesCenter(n1, n2)
    let n1s = point2str(n1), n2s = point2str(n2);
    if (n1.x > n2.x)
      [n1s, n2s] = [n2s, n1s]

    if (edgeMap[n1s]) {
      if (edgeMap[n1s][n2s] !== undefined) {
        edgeMap[n1s][n2s] += 1;
        n = edgeMap[n1s][n2s]
      } else {
        edgeMap[n1s][n2s] = 0;
      }
    } else {
      edgeMap[n1s] = {}
      edgeMap[n1s][n2s] = 0;
    }

    return p(getVol(n))
  }

  let findSelfVol = (n1, size, ang) => {
    let n;
    let c = getSelfCenter(n1, ang);
    let n1s = point2str(n1);

    if(typeof edgeMap[n1s] === "number") {
      edgeMap[n1s] += 1
    } else {
      edgeMap[n1s] = 0
    }

    n = edgeMap[n1s];

    return c(size, n*15+2)
  }

  g6.registerEdge("sline", {
    draw(cfg, group) {
      if(cfg.source === cfg.target) {
        if(pre[0] !== cfg.model.id)
          pre[1] = findSelfVol(cfg.points[0], cfg.source._attrs.boxStash.height, cfg.source._attrs.model.angle);
        pre[0] = cfg.model.id;
        let p1 = pre[1];
        let angle = cfg.source._attrs.model.angle || 0;
        let [start,end] = [0.5 * Math.PI + p1[3]/2 + angle , 0.5 * Math.PI - p1[3]/2 + angle]
        if(start < end) [start,end] = [end, start]

        console.log(cfg)

        group.addShape('text', {
          attrs: {
            x: 2 * p1[0] - cfg.points[0].x,
            y: 2 * p1[1] - cfg.points[0].y,
            fontFamily: 'PingFang SC',
            text: cfg.origin.label,
            fontSize: 10,
            fill: 'black'
          }
        })

        return group.addShape('arc', {
          attrs: {
            x: p1[0],
            y: p1[1],
            r: p1[2],
            startAngle: start,
            endAngle: end,
            stroke: '#66ccff',
          }
        });
      }

      let p2 = findEdgeVol(cfg.points[0], cfg.points[1]);
      let center = getBesCenter(cfg.points[0], p2, cfg.points[1])

      group.addShape('text', {
        attrs: {
          x: center[0],
          y: center[1],
          fontFamily: 'PingFang SC',
          text: cfg.origin.label,
          fontSize: 10,
          fill: 'black'
        }
      })

      cleanEdgeMap();

      return group.addShape('quadratic', {
        attrs: {
          p1: [cfg.points[0].x, cfg.points[0].y],
          p2: p2,
          p3: [cfg.points[1].x, cfg.points[1].y],
          stroke: cfg.color,
          lineWidth: cfg.size,
          arrow: true
        }
      });
    }
  })
}

function regrLine(g6) {
  let stateMap = {
    10: '#aa3333',
    8: '#aa5511',
    70: '#dd1166',
    40: '#33aa33',
    60: '#3333aa',

  };
  let edgeMap = {};
  let pre = [];
  let cleanEdgeMap = () => {
    let isOn = false;

    if(!isOn) {
      isOn = false;
      setTimeout(() => {edgeMap = {};pre = []; isOn = false}, 10)
    }
  }
  let findSelfVol = (n1, size, ang) => {
    let n;
    let c = getSelfCenter(n1, ang);
    let n1s = point2str(n1);

    if(typeof edgeMap[n1s] === "number") {
      edgeMap[n1s] += 1
    } else {
      edgeMap[n1s] = 0
    }

    n = edgeMap[n1s];

    return c(size, n*15+2)
  }
  let findEdgeVol = (n1, n2) => {
    let n = 0;
    let p = getArcCenter(n1, n2)
    let n1s = point2str(n1), n2s = point2str(n2);
    if (n1.x > n2.x)
      [n1s, n2s] = [n2s, n1s]

    if (edgeMap[n1s]) {
      if (edgeMap[n1s][n2s] !== undefined) {
        edgeMap[n1s][n2s] += 1;
        n = edgeMap[n1s][n2s]
      } else {
        edgeMap[n1s][n2s] = 0;
      }
    } else {
      edgeMap[n1s] = {}
      edgeMap[n1s][n2s] = 0;
    }

    return p(100*n)
  }

  g6.registEdge('rline', {
    draw(cfg, group) {
      if(cfg.source === cfg.target) {
        if(pre[0] !== cfg.model.id)
          pre[1] = findSelfVol(cfg.source._attrs.model, cfg.source._attrs.boxStash.height, cfg.source._attrs.model.angle);
        pre[0] = cfg.model.id;
        let p1 = pre[1];
        let angle = cfg.source._attrs.model.angle || 0;
        let [start,end] = [0.5 * Math.PI + p1[3]/2 + angle , 0.5 * Math.PI - p1[3]/2 + angle]
        if(start < end) [start,end] = [end, start]

        group.addShape('text', {
          attrs: {
            x: 2 * p1[0] - cfg.source._attrs.model.x,
            y: 2 * p1[1] - cfg.source._attrs.model.y,
            fontFamily: 'PingFang SC',
            text: cfg.origin.label,
            fontSize: 10,
            fill: 'black'
          }
        })

        cleanEdgeMap();

        return group.addShape('arc', {
          attrs: {
            x: p1[0],
            y: p1[1],
            r: p1[2],
            startAngle: start,
            endAngle: end,
            stroke: '#66ccff',
            arrow: true
          }
        });
      }

      let p1 = findEdgeVol(cfg.points[0], cfg.points[1]);
      let [start, end] = [p1[3] - p1[4], p1[3] + p1[4]]

      group.addShape('text', {
        attrs: {
          x: p1[0] + p1[2] * Math.cos(p1[3]),
          y: p1[1] + p1[2] * Math.sin(p1[3]),
          fontFamily: 'PingFang SC',
          text: cfg.origin.label,
          fontSize: 10,
          fill: 'black'
        }
      })

      return group.addShape('arc', {
        attrs: {
          x: p1[0],
          y: p1[1],
          r: p1[2],
          startAngle: start,
          endAngle: end,
          stroke: stateMap[cfg.source._attrs.model.origin.status],
          arrow: true
        }
      })
    }
  })
}

const out = {
  regsLine, regrLine
}

export default out