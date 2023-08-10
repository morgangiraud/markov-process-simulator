import type { AgentState } from "../types/agentState";

export const SWITCH_AGENT = "SWITCH_AGENT" as const;
export const switchAgent = () => {
  return {
    type: SWITCH_AGENT,
  } as const;
};

export const UPDATE = "UPDATE" as const;
export const update = (agent: Partial<AgentState>) => {
  return {
    type: UPDATE,
    agent: agent,
  } as const;
};
