import type { MarkovRewardProcessState } from "./markovRewardProcessState";
import type { MarkovProcessState } from "./markovProcessState";

export type Node<T extends MarkovRewardProcessState | MarkovProcessState> = {
  x: number;
  y: number;
  data: T;
  index: number;
};
