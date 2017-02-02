export const UPDATE_MARKOV_TYPE = 'UPDATE_MARKOV_TYPE';
export const updateMarkovType = (markovType) => {
  return {
    type: UPDATE_MARKOV_TYPE,
    markovType
  }
}

export const UPDATE_P = 'UPDATE_P';
export const updateP = (P) => {
  return {
    type: UPDATE_P,
    P:P
  }
}

export const UPDATE_PROBA = 'UPDATE_PROBA';
export const updateProba = (i, j, p) => {
  p = parseFloat(p)
  return {
    type: UPDATE_PROBA,
    i,
    j,
    p
  }
}

export const UPDATE_REWARD = 'UPDATE_REWARD';
export const updateReward = (index, value) => {
  return {
    type: UPDATE_REWARD,
    index,
    value: parseFloat(value)
  }
}

export const UPDATE_GAMMA = 'UPDATE_GAMMA';
export const updateGamma = (gamma) => {
  return {
    type: UPDATE_GAMMA,
    gamma
  }
}

export const UPDATE_HORIZON = 'UPDATE_HORIZON';
export const updateHorizon = (horizon) => {
  return {
    type: UPDATE_HORIZON,
    horizon
  }
}

export const UPDATE_EPSILON = 'UPDATE_EPSILON';
export const updateEpsilon = (epsilon) => {
  return {
    type: UPDATE_EPSILON,
    epsilon
  }
}

export const ADD_STATE = 'ADD_STATE';
export const addState = (state={ seed: Math.random().toString(36).substr(2, 5) }, pi) => {
  return {
    type: ADD_STATE,
    state,
    pi
  }
}

export const REMOVE_STATE = 'REMOVE_STATE';
export const removeState = (piIndex) => {
  return {
    type: REMOVE_STATE,
    piIndex
  }
}

export const EXPORT_MC = 'EXPORT_MC';
export const exportData = () => {
  return {
    type: EXPORT_MC,
  }
}