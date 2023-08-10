import { MarkovProcessUpdate } from "./markovProcessUpdate";
import type { MarkovRewardProcessState } from "./markovRewardProcessState";

export type MarkovRewardProcessUpdate = MarkovProcessUpdate & {
  states?: Partial<MarkovRewardProcessState>[];
  rewards?: number[];
  gamma?: number;
  horizon?: number;
  epsilon?: number;
};
