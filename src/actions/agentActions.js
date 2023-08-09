export const SWITCH_AGENT = "SWITCH_AGENT";
export const switchAgent = () => {
  return {
    type: SWITCH_AGENT,
  };
};
export const UPDATE = "UPDATE";
export const update = (agent) => {
  return {
    type: UPDATE,
    agent: agent,
  };
};
