import * as types from '../actions/mcActions';
import { MarkovChain, MarkovRewardProcess } from "../MarkovProcess"
import utils from "../utils"

export default (markovProcess=new MarkovChain([{}], [[1]]), action) => {
  switch(action.type){
    case types.UPDATE_MARKOV_TYPE:
      if (action.markovType === markovProcess.type) {
        return markovProcess
      }
      switch(action.markovType){
        case "mdp":
        case "mrp":
          return new MarkovRewardProcess(
            [...markovProcess.states],
            [...markovProcess.P],
            (markovProcess.rewards ? [...markovProcess.rewards] : undefined),
            markovProcess.gamma,
            markovProcess.horizon,
            markovProcess.epsilon
          )
        default:
          return new MarkovChain(
            [...markovProcess.states],
            [...markovProcess.P]
          )
      }

    case types.UPDATE_P:
      return markovProcess.update({P: action.P})

    case types.UPDATE_PROBA:
      let newP = [...markovProcess.P]
      newP[action.i][action.j] = action.p
      return markovProcess.update({P: newP})

    case types.UPDATE_REWARD:
      let newRewards = [...markovProcess.rewards]
      newRewards[action.index] = action.value
      return markovProcess.update({rewards: newRewards})

    case types.UPDATE_GAMMA:
      return markovProcess.update({gamma: action.gamma})

    case types.UPDATE_HORIZON:
      return markovProcess.update({horizon: action.horizon})

    case types.UPDATE_EPSILON:
      return markovProcess.update({epsilon: action.epsilon})

    case types.ADD_STATE: {
      let newState = {
        states: [...markovProcess.states, action.state],
        P: utils.addPiToP(markovProcess.P, action.pi),
      }
      if (markovProcess.type === "mrp") {
        newState.rewards = [...markovProcess.rewards, 0]
      }
      return markovProcess.update(newState)
    }
    
    case types.REMOVE_STATE: {
      let newState = {
          states: markovProcess.states.filter((state, i) => i !== action.piIndex),
          P: utils.removePiToP(markovProcess.P, action.piIndex),
      }
      if (markovProcess.type === "mrp") {
        newState.rewards = markovProcess.rewards.filter((state, i) => i !== action.piIndex)
      }
      return markovProcess.update(newState)
    }

    default:
      return markovProcess
  }
}
