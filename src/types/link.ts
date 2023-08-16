import type { Node } from "./node";
import type { MarkovRewardProcessState } from "./markovRewardProcessState";
import type { MarkovProcessState } from "./markovProcessState";

export type Link<T extends MarkovRewardProcessState | MarkovProcessState> = {
  source: Node<T>;
  target: Node<T>;
  p: number;
  class: string;
};
