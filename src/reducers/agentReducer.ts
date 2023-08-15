import * as types from "../actions/agentActions";
import type { AgentState } from "../types/agentState";

const initialState: AgentState = {
  startAgent: false,
  currentState: 0,
  nbStep: 0,
  cumulatedReward: 0,
  shouldEvaluate: false,
  speedCoef: 1,
};

interface AgentAction {
  type: typeof types.SWITCH_AGENT | typeof types.UPDATE;
  agent?: Partial<AgentState>;
}

export default (
  agentState: AgentState = initialState,
  action: AgentAction,
): AgentState => {
  switch (action.type) {
    case types.SWITCH_AGENT:
      return { ...agentState, startAgent: !agentState.startAgent };
    case types.UPDATE:
      return { ...agentState, ...action.agent };
    default:
      return agentState;
  }
};
