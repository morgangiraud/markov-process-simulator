import { MarkovProcess } from "../MarkovProcess";
import { MarkovRewardProcess } from "../MarkovRewardProcess";
import * as types from "../actions/rActions";
import rUtils from "../rUtils";
import { RState } from "../types/rState";

interface InitValuesAction {
  type: typeof types.INIT_VALUES;
  rewardsLen: number;
}

interface EvalValuesAction {
  type: typeof types.EVAL_VALUES;
  mp: MarkovProcess | MarkovRewardProcess;
}

interface EvalValuesStepAction {
  type: typeof types.EVAL_VALUES_STEP;
  mp: MarkovProcess | MarkovRewardProcess;
}

interface UpdateValuesAction {
  type: typeof types.UPDATE_VALUES;
  values: number[];
}

interface UpdateValueAction {
  type: typeof types.UPDATE_VALUE;
  value: number;
  index: number;
}

type RActions =
  | InitValuesAction
  | EvalValuesAction
  | EvalValuesStepAction
  | UpdateValuesAction
  | UpdateValueAction;

const initialState: RState = {
  values: [],
};

export default (state: RState = initialState, action: RActions) => {
  switch (action.type) {
    case types.INIT_VALUES: {
      return { values: Array(action.rewardsLen).fill(0) };
    }
    case types.UPDATE_VALUES: {
      return { values: action.values };
    }
    case types.UPDATE_VALUE: {
      const values = [...state.values];
      values[action.index] = action.value;
      return { values };
    }
    case types.EVAL_VALUES: {
      const mp = action.mp;
      if (!(mp instanceof MarkovRewardProcess)) {
        throw new Error("Cannot convert MarkovProcess to MarkovRewardProcess");
      }
      return {
        values: rUtils.syncValueEvaluation(
          state.values,
          mp.P,
          mp.rewards,
          mp.gamma,
          mp.horizon,
          mp.epsilon,
        ),
      };
    }
    case types.EVAL_VALUES_STEP: {
      const mp = action.mp;
      if (!(mp instanceof MarkovRewardProcess)) {
        throw new Error("Cannot convert MarkovProcess to MarkovRewardProcess");
      }
      const newData = rUtils.syncValueEvaluationStep(
        state.values,
        mp.P,
        mp.rewards,
        mp.gamma,
      );
      return {
        values: newData[0],
      };
    }

    default:
      return state;
  }
};
