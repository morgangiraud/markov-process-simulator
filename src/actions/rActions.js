export const INIT_VALUES = "INIT_VALUES";
export const initValues = (rewardsLen) => {
  return {
    type: INIT_VALUES,
    rewardsLen,
  };
};

export const EVAL_VALUES = "EVAL_VALUES";
export const evalValues = (mc) => {
  return {
    type: EVAL_VALUES,
    mc,
  };
};

export const EVAL_VALUES_STEP = "EVAL_VALUES_STEP";
export const evalValuesStep = (mc) => {
  return {
    type: EVAL_VALUES_STEP,
    mc,
  };
};

export const UPDATE_VALUES = "UPDATE_VALUES";
export const updateValues = (values) => {
  return {
    type: UPDATE_VALUES,
    values,
  };
};

export const UPDATE_VALUE = "UPDATE_VALUE";
export const updateValue = (value, index) => {
  return {
    type: UPDATE_VALUE,
    value,
    index,
  };
};
