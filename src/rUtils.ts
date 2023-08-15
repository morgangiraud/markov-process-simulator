import { P } from "./types/p";
import utils from "./utils";

const rUtils = {
  syncValueEvaluation: (
    currentRewardValues: number[],
    P: P,
    rewards: number[],
    gamma: number | string,
    horizon: number,
    epsilon: number = 1e-2,
  ) => {
    let currentDiff = 1,
      T = 0;

    gamma = typeof gamma === "number" ? gamma : parseFloat(gamma);
    gamma = Math.min(Math.max(gamma, 0), 1);
    if (isNaN(gamma)) {
      gamma = 0;
    }
    if (gamma !== 1) {
      let gammaHorizon = 0;
      while (Math.pow(gamma, gammaHorizon) > epsilon) {
        gammaHorizon++;
      }
      horizon = Math.min(gammaHorizon, horizon);
    } else if (!Number.isFinite(horizon)) {
      // If gamma is 1 and horizon is not a finite number
      // we limit anyway the number of loop, to make sure
      // this function returns (special case without terminal state)
      horizon = 10000;
    }

    while (currentDiff > epsilon && T <= horizon) {
      T++;
      [currentRewardValues, currentDiff] = rUtils.syncValueEvaluationStep(
        currentRewardValues,
        P,
        rewards,
        gamma,
      );
      // console.log(`T:${T} -> ${currentDiff}`, currentValues, T <= 1);
    }
    return currentRewardValues;
  },

  syncValueEvaluationStep: (
    currentRewardValues: number[],
    P: P,
    rewards: number[],
    gamma: number,
  ): [number[], number] => {
    const len = rewards.length;

    const currentRewardValuesMat = currentRewardValues.map((val) => {
      return [val];
    });

    const tmpValues = utils
      .multiply(P, currentRewardValuesMat)
      .map((row, r) => {
        if (P[r][r] === 1 && row[0] !== 0) {
          // Terminal state
          return row;
        }
        row[0] = rewards[r] + gamma * row[0];
        return row;
      });
    const firstTmpValuesFloored = tmpValues.map(
      (arrVal) => Math.floor(arrVal[0] * 1000) / 1000,
    );

    let currentDiff = 0;
    for (let i = len - 1; i >= 0; i--) {
      currentDiff += Math.abs(tmpValues[i][0] - currentRewardValuesMat[i][0]);
    }
    currentDiff /= len;

    return [firstTmpValuesFloored, currentDiff];
  },
};
export default rUtils;
