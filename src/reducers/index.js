import { combineReducers } from 'redux';

import agentReducer from './agentReducer'
import mcReducer from './mcReducer'
import rReducer from './rReducer'
import historyReducer from './historyReducer'

export default combineReducers({
  agent: agentReducer,
  mc: mcReducer,
  r: rReducer,
  history: historyReducer,
  isViewer: (state=false, action) => state
});