import type { MarkovProcessArgs } from "./markovProcessArgs";
import type { MarkovRewardProcessState } from "./markovRewardProcessState";

export type MarkovRewardProcessArgs = MarkovProcessArgs & {
  states: MarkovRewardProcessState[];
  rewards?: number[];
  gamma?: number;
  horizon?: number;
  epsilon?: number;
};
