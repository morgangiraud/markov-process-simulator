import { MarkovProcess } from "../MarkovProcess";
import { MarkovRewardProcess } from "../MarkovRewardProcess";

export const INIT_VALUES = "INIT_VALUES" as const;
export const initValues = (rewardsLen: number) => ({
  type: INIT_VALUES,
  rewardsLen,
});

export const EVAL_VALUES = "EVAL_VALUES" as const;
export const evalValues = (mp: MarkovProcess | MarkovRewardProcess) => ({
  type: EVAL_VALUES,
  mp,
});

export const EVAL_VALUES_STEP = "EVAL_VALUES_STEP" as const;
export const evalValuesStep = (mp: MarkovProcess | MarkovRewardProcess) => ({
  type: EVAL_VALUES_STEP,
  mp,
});

export const UPDATE_VALUES = "UPDATE_VALUES" as const;
export const updateValues = (values: number[]) => ({
  type: UPDATE_VALUES,
  values,
});

export const UPDATE_VALUE = "UPDATE_VALUE" as const;
export const updateValue = (value: number, index: number) => ({
  type: UPDATE_VALUE,
  value,
  index,
});
