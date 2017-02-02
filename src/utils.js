import * as d3Selection from "d3-selection";
import randomColor from 'randomcolor'

import { MarkovChain, MarkovRewardProcess } from "./MarkovProcess"

const utils = {
  isDefined: function(variable){
    return !(typeof variable === 'undefined' || variable === null)
  }, 

  // Stats
  sample: function(probs) {
    let total = 0
    let r = Math.random()
    for (var i = probs.length - 1; i >= 0; i--) {
      total += probs[i]
      if (r <= total){
        return i
      }
    }
  },

  checkStates: function(states) {
    return states.map((state, i) => {
        return {
            name: `S${i}`,
            class: state.className || "state",
            r: state.r || 40,
            seed: state.seed || Math.random().toString(36).substr(2, 5),
            terminal: state.terminal || false
        }
    });
  },

  checkP: function (P) {
    if(!Array.isArray(P) || !Array.isArray(P[0])){
        throw new Error("The matrix P must be an Array of 2 dimensions")
    }

    let nbRows = P.length
    let nbCols = P[0].length
    if(nbRows !== nbCols){
        throw new Error("The matrix P must be a square matrix")
    }

    let newP = P.map(function(pi){
        pi = pi.map(utils.checkProba)
        let piSum = pi.reduce((a, b) => a + b, 0)
        // Due to checkProba you might end up in a full zero vector
        if(piSum === 0) {
          let len = pi.length
          pi = pi.map((p) => 1 / len)
          piSum = 1
        }
        if(!(piSum > 0.999 && piSum < 1.001)){
          pi = pi.map( (p) => utils.checkProba(p / piSum) )
        }

        return pi
    })

    return newP
  },

  checkRewards: function(rewards, statesLength){
    return Array.isArray(rewards) ? rewards : Array(statesLength).fill(0)
  },

  checkGamma: function(gamma){
    gamma = Math.min(Math.max(parseFloat(gamma), 0), 1)
    return isNaN(gamma) ? 0.99 : gamma
  },

  checkHorizon: function(horizon){
    horizon = Math.max(horizon, 0)
    return isNaN(horizon) ? Infinity : horizon
  },

  checkEpsilon: function(epsilon){
    epsilon = Math.min(Math.max(parseFloat(epsilon), 0), 1)
    return isNaN(epsilon) ? 1e-3 : epsilon
  },

  checkProba: function(p){
    p = Math.min(Math.max(parseFloat(p), 0), 1)
    if (isNaN(p)) { p = 0 }
    if (p > 0.995) { p = 1 }
    if (p < 0.005) { p = 0 }
    return Math.floor(p * 1000) / 1000
  },

  // Markov porcess
  findTerminalStates: function(links){
    let terminalStates = []
    for (var i = links.length - 1; i >= 0; i--) {
      let link = links[i]
      if(link.source === link.target && link.p === 1){
        terminalStates.push(link.target)
      }
    }

    return terminalStates
  },

  importMarkovProcess: function(jsonBase64){
    let data = JSON.parse(atob(jsonBase64)),
        mp;

    if (data.horizon === "Infinity") {
      data.horizon = Infinity
    }
    if(data.actions){
        // mp = new MarkovDecisionProcess(data.states, data.actions, data.P, data.rewards, data.gamma, data.horizon)
    } else if (data.rewards) {
        mp = new MarkovRewardProcess(data.states, data.P, data.rewards, data.gamma, data.horizon, data.epsilon)
    } else {
        mp = new MarkovChain(data.states, data.P)
    }
    return mp
  },


  // Math
  cosPi4: Math.cos(Math.PI/4),
  sinPi4: Math.sin(Math.PI/4),
  cosPi8: Math.cos(Math.PI/8),
  sinPi8: Math.sin(Math.PI/8),
  negSinPi8: Math.sin(-Math.PI/8),
  pi4Rot: [
    [Math.cos(Math.PI/4), -Math.sin(Math.PI/4)],
    [Math.sin(Math.PI/4), Math.cos(Math.PI/4)]
  ],
  negPi4Rot: [
    [Math.cos(Math.PI/4), -Math.sin(-Math.PI/4)],
    [Math.sin(-Math.PI/4), Math.cos(Math.PI/4)]
  ],
  pi8Rot: [
    [Math.cos(Math.PI/8), -Math.sin(Math.PI/8)],
    [Math.sin(Math.PI/8), Math.cos(Math.PI/8)]
  ],
  negPi8Rot: [
    [Math.cos(Math.PI/8), -Math.sin(-Math.PI/8)],
    [Math.sin(-Math.PI/8), Math.cos(Math.PI/8)]
  ],

  multiply: function(a, b) {
    let A = a.map((val) => {
      return Array.isArray(val) ? val.slice() : [val]
    })
    let B = b.map((val) => {
      return Array.isArray(val) ? val.slice() : [val]
    })
    
    let aNumCols = a[0].length
    return A.map((row, r) => {
      return B[r].map((val, c) => {
        let m = 0
        for (let i = 0; i < aNumCols; ++i) {
          m += A[r][i] * B[i][c];
        }
        return m
      })
    })
  },

  matrixToString: function(mat){
    if(Array.isArray(mat[0])){
      let newMat = mat.map(utils.matrixToString)
      return "(" + newMat.join(",") + ")"
    } else {
      return "(" + mat.join(",") + ")"
    }
  },

  addPiToP: function(P, newPi){
    if (Array.isArray(newPi)) {
      if(newPi.length !== P.length + 1){
        throw new Error("newPi has not the right length")
      }
    } else {
      newPi = Array(P[0].length + 1).fill(1/(P[0].length + 1))
    }
    let newP = P.map((pi) => {
      pi.push(0)
      return pi
    })
    newP.push(newPi)
    return newP
  },

  removePiToP: function(P, piIndex){
    if (piIndex >= P.length || piIndex < 0) {
      throw new Error('piIndex is out of range')
    }
    const isPiIndex = (v, i) => i !== piIndex

    return P.map((pi) => pi.filter(isPiIndex)).filter(isPiIndex)
  },


  // SVG
  getColor: function(node) {
    return randomColor({
      luminosity: "bright",
      seed: node.seed
    })
  },

  createD: function (link){
    let srcx = link.source.x,
        srcy = link.source.y,
        destx = link.target.x,
        desty = link.target.y,
        dx = link.target.x - link.source.x,
        dy = link.target.y - link.source.y,
        dr = Math.sqrt(dx * dx + dy * dy),
        cRadius = link.target.data.r,
        isSelfLink = (link.source.data.name === link.target.data.name),
        rx = isSelfLink ? 1 : dr,
        ry = isSelfLink ? 3 : dr,
        largeArcFlag = isSelfLink ? 1 : 0,
        xAxisRotation = isSelfLink ? 90 : 0,
        sweepFlag = 0;
    if (isSelfLink) {
        let vec = [-cRadius, 0]
        
        let pi8Vec = utils.multiply(utils.pi8Rot, vec)
        srcx += pi8Vec[0][0]
        srcy += pi8Vec[1][0]
        
        let negPi8Vec = utils.multiply(utils.negPi8Rot, vec)
        destx += negPi8Vec[0][0]
        desty += negPi8Vec[1][0]
    } else {
        let vec = [dx / dr * cRadius, dy / dr * cRadius]
        let pi4vec = utils.multiply(utils.pi4Rot, vec)
        srcx += pi4vec[0][0]
        srcy += pi4vec[1][0]
        destx -= pi4vec[1][0]
        desty += pi4vec[0][0]
    }
    // console.log("------------START------------");
    // console.log(isSelfLink)
    // console.log(`link.target.x:${destx}, link.target.y:${desty}, link.source.x:${srcx}, link.source.y:${srcy}`)
    // console.log(dx, dy, dr, cRadius, rx, ry);
    // console.log(`xAxisRotation:${xAxisRotation} largeArcFlag:${largeArcFlag} sweepFlag:${sweepFlag}`);
    // console.log("------------STOP------------");
    return `M${srcx},${srcy} A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${destx},${desty}`
  },


  getPath: function(links, currentState, nextState){
    for (var i = links.length - 1; i >= 0; i--) {
      let link = links[i]
      if(link.source.index === currentState && link.target.index === nextState ){
        break;
      };
    }
    return [d3Selection.select(`#path-S${currentState}-S${nextState}`)._groups[0][0], links[i]]
  },

  getNode: function(nodes, state){
    for (var i = nodes.length - 1; i >= 0; i--) {
      let node = nodes[i]
      if (node.index === state) {
        break;
      }
    }
    return [d3Selection.select(`#S${state}`)._groups[0][0], nodes[i]]
  },

  translateAlong: function(path){
    let len = path.getTotalLength()
    return function(i) {
      return function(t) {
        let p = path.getPointAtLength(t * len);
        return "translate(" + p.x + "," + p.y + ")";
      }
    }
  }
}

export default utils