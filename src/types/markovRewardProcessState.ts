import { MarkovProcessState } from "./markovProcessState";

export type MarkovRewardProcessState = MarkovProcessState & {
  reward: number;
};
