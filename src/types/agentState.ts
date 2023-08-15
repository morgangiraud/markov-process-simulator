export type AgentState = {
  startAgent: boolean;
  currentState: number;
  nbStep: number;
  cumulatedReward: number;
  shouldEvaluate: boolean;
  speedCoef: number;
};
