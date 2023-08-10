import * as types from "../actions/mcActions";
import { MarkovProcess } from "../MarkovProcess";
import { MarkovRewardProcess } from "../MarkovRewardProcess";

import type { MarkovProcessState } from "../types/markovProcessState";
import type { MarkovRewardProcessState } from "../types/markovRewardProcessState";
import type { P } from "../types/p";
import utils from "../utils";

type McAction =
  | { type: typeof types.UPDATE_MARKOV_TYPE; markovType: string }
  | { type: typeof types.UPDATE_P; P: P }
  | { type: typeof types.UPDATE_PROBA; i: number; j: number; p: number }
  | { type: typeof types.UPDATE_REWARD; index: number; value: number }
  | { type: typeof types.UPDATE_GAMMA; gamma: number }
  | { type: typeof types.UPDATE_HORIZON; horizon: number }
  | { type: typeof types.UPDATE_EPSILON; epsilon: number }
  | {
      type: typeof types.ADD_STATE;
      state: Partial<MarkovProcessState | MarkovRewardProcessState>;
      pi: number[];
    }
  | { type: typeof types.REMOVE_STATE; piIndex: number }
  | { type: typeof types.EXPORT_MC };

const initialState = new MarkovProcess([{}], [[1]]);

export default (
  markovProcess: MarkovProcess | MarkovRewardProcess = initialState,
  action: McAction,
) => {
  switch (action.type) {
    case types.UPDATE_MARKOV_TYPE:
      if (action.markovType === markovProcess.type) {
        return markovProcess;
      }
      switch (action.markovType) {
        case "mdp":
        case "mrp":
          return new MarkovRewardProcess(
            [...markovProcess.states],
            markovProcess.P.map((row) => [...row]),
          );
        default:
          return new MarkovProcess(
            [...markovProcess.states],
            markovProcess.P.map((row) => [...row]),
          );
      }

    case types.UPDATE_P:
      return markovProcess.update({ P: action.P });

    case types.UPDATE_PROBA:
      const newP = markovProcess.P.map((row) => [...row]);
      newP[action.i][action.j] = action.p;
      return markovProcess.update({ P: newP });

    case types.UPDATE_REWARD:
      if (!(markovProcess instanceof MarkovRewardProcess)) {
        throw new Error("Cannot convert MarkovProcess to MarkovRewardProcess");
      }
      const newRewards = [...markovProcess.rewards];
      newRewards[action.index] = action.value;
      return markovProcess.update({ rewards: newRewards });

    case types.UPDATE_GAMMA:
      return markovProcess.update({ gamma: action.gamma });

    case types.UPDATE_HORIZON:
      return markovProcess.update({ horizon: action.horizon });

    case types.UPDATE_EPSILON:
      return markovProcess.update({ epsilon: action.epsilon });

    case types.ADD_STATE: {
      if (markovProcess instanceof MarkovRewardProcess) {
        const newState = {
          states: [
            ...markovProcess.states,
            action.state as MarkovRewardProcessState,
          ],
          P: utils.addPiToP(
            markovProcess.P.map((row) => [...row]),
            action.pi,
          ),
          rewards: [...markovProcess.rewards, 0],
        };
        return markovProcess.update(newState);
      } else {
        const newState = {
          states: [...markovProcess.states, action.state as MarkovProcessState],
          P: utils.addPiToP(
            markovProcess.P.map((row) => [...row]),
            action.pi,
          ),
        };
        return markovProcess.update(newState);
      }
    }

    case types.REMOVE_STATE: {
      if (markovProcess instanceof MarkovRewardProcess) {
        const newState = {
          states: markovProcess.states.filter(
            (state, i) => i !== action.piIndex,
          ),
          P: utils.removePiToP(
            markovProcess.P.map((row) => [...row]),
            action.piIndex,
          ),
          rewards: markovProcess.rewards.filter(
            (state, i) => i !== action.piIndex,
          ),
        };
        return markovProcess.update(newState);
      } else {
        const newState = {
          states: markovProcess.states.filter(
            (state, i) => i !== action.piIndex,
          ),
          P: utils.removePiToP(
            markovProcess.P.map((row) => [...row]),
            action.piIndex,
          ),
        };
        return markovProcess.update(newState);
      }
    }

    default:
      return markovProcess;
  }
};
