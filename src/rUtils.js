import utils from "./utils"

const rUtils = {
  syncValueEvaluation: (currentValues, P, rewards, gamma, horizon, epsilon=1e-2) => {
    let currentDiff = 1
        , T = 0

    gamma = Math.min(Math.max(parseFloat(gamma), 0), 1)
    if (isNaN(gamma)) { gamma = 0 }
    if(gamma !== 1){
        let gammaHorizon = 0
        while(Math.pow(gamma, gammaHorizon) > epsilon){
            gammaHorizon++
        }
        horizon = Math.min(gammaHorizon, horizon)
    } else if (!Number.isFinite(horizon)){
      // If gamma is 1 and horizon is not a finite number
      // we limit anyway the number of loop, to make sure
      // this function returns (special case without terminal state)
      horizon = 10000
    }

    while(currentDiff > epsilon && T <= horizon){
      T++
      [ currentValues, currentDiff ] = rUtils.syncValueEvaluationStep(currentValues, P, rewards, gamma)
      // console.log(`T:${T} -> ${currentDiff}`, currentValues, T <= 1);
    }
    return currentValues
  },

  syncValueEvaluationStep: (currentValues, P, rewards, gamma) => {
    let len = rewards.length
      , tmpValues
      , currentDiff
    currentValues = currentValues.map((val) => {
      return Array.isArray(val) ? val.slice() : [val]
    })

    tmpValues = utils.multiply(P, currentValues).map((row, r) => {
      if(P[r][r] === 1 && row[0] !== 0){ // Terminal state
        return row
      }
      row[0] = rewards[r] + gamma * row[0]
      return row
    })

    currentDiff = 0
    for (let i = len - 1; i >= 0; i--) {
        currentDiff += Math.abs(tmpValues[i][0] - currentValues[i][0])
    }
    currentDiff /= len

    return [
      tmpValues.map((arrVal) => Math.floor(arrVal[0] * 1000) / 1000)
      , currentDiff
    ]
  }
}
export default rUtils