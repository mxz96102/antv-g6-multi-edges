function edgeGen(nodeNum, edgePer) {
  let e = []

  for(let i = 0; i < nodeNum; i++) {
    for(let j = i + 1 ; j < i + 2 && j < nodeNum; j++) {
      //if(Math.random() > 0.5)
      for(let k = 0; k < edgePer; k++) {
          e.push({
            source: 'node'+i,
            target: 'node'+j,
            id: 'edge'+i+j+k,
            label: i+'->'+j+'.'+k
          })
      }
    }
  }

  return e
}

const out = {
  edgeGen
}

export default out;
