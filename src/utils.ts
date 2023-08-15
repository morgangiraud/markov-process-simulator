import * as d3Selection from "d3-selection";
import randomColor from "randomcolor";

import { MarkovProcess } from "./MarkovProcess";
import { MarkovRewardProcessState } from "./types/markovRewardProcessState";
import { P } from "./types/p";
import { MarkovProcessState } from "./types/markovProcessState";
import { Link } from "./types/link";
import { MarkovRewardProcess } from "./MarkovRewardProcess";
import { Node } from "./types/node";

export const checkMarkovStates = (states: Partial<MarkovProcessState>[]) => {
  return states.map((state, i) => {
    return {
      name: `S${i}`,
      class: "state",
      r: state.r || 40,
      seed: state.seed || Math.random().toString(36).substr(2, 5),
      terminal: state.terminal || false,
    } as MarkovProcessState;
  });
};

export const checkMarkovRewardStates = (
  states: Partial<MarkovRewardProcessState>[],
) => {
  return states.map((state, i) => {
    return {
      name: `S${i}`,
      class: "state",
      r: state.r || 40,
      seed: state.seed || Math.random().toString(36).substr(2, 5),
      terminal: state.terminal || false,
      reward: state.reward || 0,
    } as MarkovRewardProcessState;
  });
};

export const sample = (probs: number[]) => {
  const r = Math.random();

  let total = 0;
  for (let i = probs.length - 1; i >= 0; i--) {
    total += probs[i];
    if (r <= total) {
      return i;
    }
  }
  return probs[probs.length - 1];
};

export const getPath = (
  links: (Link<MarkovProcessState> | Link<MarkovRewardProcessState>)[],
  currentStateIdx: number,
  nextStateIdx: number,
): SVGPathElement => {
  for (let i = links.length - 1; i >= 0; i--) {
    const link = links[i];
    if (
      link.source.index === currentStateIdx &&
      link.target.index === nextStateIdx
    ) {
      break;
    }
  }

  const path = d3Selection.select<SVGPathElement, unknown>(
    `#path-S${currentStateIdx}-S${nextStateIdx}`,
  );
  if (path.empty()) {
    throw new Error(`path-S${currentStateIdx}-S${nextStateIdx} does not exist`);
  }

  return path.node() as SVGPathElement;
};

export const getNode = (
  nodes: (Node<MarkovProcessState> | Node<MarkovRewardProcessState>)[],
  stateIdx: number,
): Node<MarkovProcessState> | Node<MarkovRewardProcessState> | undefined => {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (node.index === stateIdx) {
      return node;
    }
  }
};

export const isVec = (
  vecOrMat: number[] | number[][],
): vecOrMat is number[] => {
  return !Array.isArray(vecOrMat[0]);
};

const utils = {
  // Stats

  checkP: function (P: P) {
    if (!Array.isArray(P) || !Array.isArray(P[0])) {
      throw new Error("The matrix P must be an Array of 2 dimensions");
    }

    const nbRows = P.length;
    P.map((row) => {
      if (row.length !== nbRows) {
        throw new Error("The matrix P must be a square matrix");
      }
    });

    const newP = P.map(function (pi) {
      pi = pi.map(utils.checkProba);
      let piSum = pi.reduce((a, b) => a + b, 0);
      // Due to checkProba you might end up in a full zero vector
      if (piSum === 0) {
        const len = pi.length;
        pi = pi.map(() => 1 / len);
        piSum = 1;
      }
      if (!(piSum > 0.999 && piSum < 1.001)) {
        pi = pi.map((p) => utils.checkProba(p / piSum));
      }

      return pi;
    });

    return newP;
  },

  checkRewards: function (rewards: number[] | undefined, statesLength: number) {
    return Array.isArray(rewards) ? rewards : Array(statesLength).fill(0);
  },

  checkGamma: function (gamma: number | string | undefined) {
    if (!gamma) return 0.99;

    gamma = typeof gamma === "number" ? gamma : parseFloat(gamma);
    gamma = Math.min(Math.max(gamma, 0), 1);
    return isNaN(gamma) ? 0.99 : gamma;
  },

  checkHorizon: function (horizon: number | undefined) {
    if (!horizon) return Infinity;

    horizon = Math.max(horizon, 0);
    return isNaN(horizon) ? Infinity : horizon;
  },

  checkEpsilon: function (epsilon: number | string | undefined) {
    if (!epsilon) return 1e-3;

    epsilon = typeof epsilon === "number" ? epsilon : parseFloat(epsilon);
    epsilon = Math.min(Math.max(epsilon, 0), 1);
    return isNaN(epsilon) ? 1e-3 : epsilon;
  },

  checkProba: function (p: number | string) {
    p = typeof p === "number" ? p : parseFloat(p);
    p = Math.min(Math.max(p, 0), 1);
    if (isNaN(p)) {
      p = 0;
    }
    if (p > 0.995) {
      p = 1;
    }
    if (p < 0.005) {
      p = 0;
    }
    return Math.floor(p * 1000) / 1000;
  },

  // Markov porcess
  findTerminalStates: function <
    T extends MarkovProcessState | MarkovRewardProcessState,
  >(links: Link<T>[]) {
    const terminalStates = [];
    for (let i = links.length - 1; i >= 0; i--) {
      const link = links[i];
      if (link.source === link.target && link.p === 1) {
        terminalStates.push(link.target);
      }
    }

    return terminalStates;
  },

  importMarkovProcess: function (jsonBase64: string) {
    const data = JSON.parse(atob(jsonBase64));
    let mp;

    if (data.horizon === "Infinity") {
      data.horizon = Infinity;
    }
    if (data.actions) {
      // mp = new MarkovDecisionProcess(data.states, data.actions, data.P, data.rewards, data.gamma, data.horizon)
    } else if (data.rewards) {
      mp = new MarkovRewardProcess(
        data.states,
        data.P,
        data.rewards,
        data.gamma,
        data.horizon,
        data.epsilon,
      );
    } else {
      mp = new MarkovProcess(data.states, data.P);
    }
    return mp;
  },

  // Math
  cosPi4: Math.cos(Math.PI / 4),
  sinPi4: Math.sin(Math.PI / 4),
  cosPi8: Math.cos(Math.PI / 8),
  sinPi8: Math.sin(Math.PI / 8),
  negSinPi8: Math.sin(-Math.PI / 8),
  pi4Rot: [
    [Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4)],
    [Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)],
  ],
  negPi4Rot: [
    [Math.cos(Math.PI / 4), -Math.sin(-Math.PI / 4)],
    [Math.sin(-Math.PI / 4), Math.cos(Math.PI / 4)],
  ],
  pi8Rot: [
    [Math.cos(Math.PI / 8), -Math.sin(Math.PI / 8)],
    [Math.sin(Math.PI / 8), Math.cos(Math.PI / 8)],
  ],
  negPi8Rot: [
    [Math.cos(Math.PI / 8), -Math.sin(-Math.PI / 8)],
    [Math.sin(-Math.PI / 8), Math.cos(Math.PI / 8)],
  ],

  multiply: function (a: number[] | number[][], b: number[] | number[][]) {
    const A = a.map((val) => {
      return Array.isArray(val) ? val.slice() : [val];
    });
    const B = b.map((val) => {
      return Array.isArray(val) ? val.slice() : [val];
    });

    const aNumCols = A[0].length;
    return A.map((row, r) => {
      return B[r].map((val, c) => {
        let m = 0;
        for (let i = 0; i < aNumCols; ++i) {
          m += A[r][i] * B[i][c];
        }
        return m;
      });
    });
  },

  matrixToString: function (mat: number[] | number[][]): string {
    if (isMatrix(mat)) {
      const newMat = mat.map(utils.matrixToString);
      return "(" + newMat.join(",") + ")";
    } else {
      return "(" + mat.join(",") + ")";
    }
  },

  addPiToP: function (P: P, newPi?: number[]) {
    if (Array.isArray(newPi)) {
      if (newPi.length !== P.length + 1) {
        throw new Error(
          `newPi has not the right length: ${newPi.length}, ${
            P.length + 1
          } expected`,
        );
      }
    } else {
      newPi = Array(P[0].length + 1).fill(1 / (P[0].length + 1));
    }
    const newP = P.map((pi) => {
      pi.push(0);
      return pi;
    });
    newP.push(newPi);
    return newP;
  },

  removePiToP: function (P: P, piIndex: number) {
    if (piIndex >= P.length || piIndex < 0) {
      throw new Error("piIndex is out of range");
    }
    const isPiIndex = (v: number | number[], i: number) => i !== piIndex;

    return P.map((pi) => pi.filter(isPiIndex)).filter(isPiIndex);
  },

  // SVG
  getColor: function (mState: MarkovProcessState | MarkovRewardProcessState) {
    return randomColor({
      luminosity: "bright",
      seed: mState.seed,
    });
  },

  createD: function (
    link: Link<MarkovProcessState> | Link<MarkovRewardProcessState>,
  ) {
    let srcx = link.source.x || 0,
      srcy = link.source.y || 0,
      destx = link.target.x || 0,
      desty = link.target.y || 0;
    const dx = destx - srcx,
      dy = desty - srcy,
      dr = Math.sqrt(dx * dx + dy * dy),
      cRadius = link.target.data.r,
      isSelfLink = link.source.data.name === link.target.data.name,
      rx = isSelfLink ? 1 : dr,
      ry = isSelfLink ? 3 : dr,
      largeArcFlag = isSelfLink ? 1 : 0,
      xAxisRotation = isSelfLink ? 90 : 0,
      sweepFlag = 0;

    if (isSelfLink) {
      const vec = [-cRadius, 0];

      const pi8Vec = utils.multiply(utils.pi8Rot, vec);
      srcx += pi8Vec[0][0];
      srcy += pi8Vec[1][0];
      const negPi8Vec = utils.multiply(utils.negPi8Rot, vec);
      destx += negPi8Vec[0][0];
      desty += negPi8Vec[1][0];
    } else {
      const vec = [(dx / dr) * cRadius, (dy / dr) * cRadius];
      const pi4vec = utils.multiply(utils.pi4Rot, vec);
      srcx += pi4vec[0][0];
      srcy += pi4vec[1][0];
      destx -= pi4vec[1][0];
      desty += pi4vec[0][0];
    }
    // console.log("------------START------------");
    // console.log(isSelfLink)
    // console.log(`link.target.x:${destx}, link.target.y:${desty}, link.source.x:${srcx}, link.source.y:${srcy}`)
    // console.log(dx, dy, dr, cRadius, rx, ry);
    // console.log(`xAxisRotation:${xAxisRotation} largeArcFlag:${largeArcFlag} sweepFlag:${sweepFlag}`);
    // console.log("------------STOP------------");
    return `M${srcx},${srcy} A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${destx},${desty}`;
  },

  translateAlong: function (path: SVGPathElement) {
    const len = path.getTotalLength();
    return function () {
      return function (t: number) {
        const p = path.getPointAtLength(t * len);
        return "translate(" + p.x + "," + p.y + ")";
      };
    };
  },
};

export default utils;

function isMatrix(value: number[] | number[][]): value is number[][] {
  return Array.isArray(value[0]);
}
