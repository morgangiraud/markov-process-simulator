import * as types from '../actions/agentActions';

const initialState = {
  startAgent: false,
  currentState: 0,
  nbStep: 0,
  cumulatedReward: 0,
  shouldEvaluate: false
}

export default (state=initialState, action) => {
  switch(action.type){
    case types.SWITCH_AGENT:
      return {...state, startAgent:!state.startAgent}
    case types.UPDATE:
      return {...state, ...action.agent}
    default:
      return state
  }
}
