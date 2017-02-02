import * as types from '../actions/rActions';
import rUtils from '../rUtils';

const initialState = {
  values: [],
}

export default (state=initialState, action) => {
  switch(action.type){
    case types.INIT_VALUES: {
      return { values: Array(action.rewardsLen).fill(0) }
    }
    case types.UPDATE_VALUES:{      
      return { values: action.values}
    }
    case types.UPDATE_VALUE:{      
      let values = [...state.values]
      values[action.index] = action.value
      return { values: values}
    }
    case types.EVAL_VALUES: {
      let mc = action.mc
      return { 
        values: rUtils.syncValueEvaluation(state.values, mc.P, mc.rewards, mc.gamma, mc.horizon, mc.epsilon)
      }
    }
    case types.EVAL_VALUES_STEP:{
      let mc = action.mc
      let [ newValues, _ ] = rUtils.syncValueEvaluationStep(state.values, mc.P, mc.rewards, mc.gamma)
      return { 
        values: newValues
      }
    }
    
    default:
      return state
  }
}
