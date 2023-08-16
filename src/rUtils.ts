import { P } from "./types/p";
import utils from "./utils";

const rUtils = {
  syncValueEvaluation: (
    P: P,
    rewards: number[],
    gamma: number,
    horizon: number,
    epsilon: number = 1e-2,
  ) => {
    let currentDiff = 1,
      T = 0,
      currentRewardValues = Array(rewards.length).fill(0);

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
      console.log({ currentRewardValues });
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
    const currentRewardValuesMat = currentRewardValues.map((val) => {
      return [val];
    });

    const oneStepRewards = utils
      .multiply(P, currentRewardValuesMat)
      .map((averagedNextRewardRow, stateIdx) => {
        const avgNextReward = averagedNextRewardRow[0];
        if (P[stateIdx][stateIdx] === 1 && avgNextReward !== 0) {
          // Terminal state
          return averagedNextRewardRow[0];
        }
        return rewards[stateIdx] + gamma * avgNextReward;
      });
    const oneStepRewardsFloored = oneStepRewards.map(
      (arrVal) => Math.floor(arrVal * 1000) / 1000,
    );
    console.log({ currentRewardValuesMat, oneStepRewardsFloored, gamma });

    let avgCurrentDiff = 0;
    const len = rewards.length;
    for (let i = len - 1; i >= 0; i--) {
      avgCurrentDiff += Math.abs(oneStepRewards[i] - currentRewardValues[i]);
    }
    avgCurrentDiff /= len;

    return [oneStepRewardsFloored, avgCurrentDiff];
  },
};
export default rUtils;
