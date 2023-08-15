import type { SimulationNodeDatum } from "d3-force";
import type { MarkovRewardProcessState } from "./markovRewardProcessState";
import type { MarkovProcessState } from "./markovProcessState";

export type Node<T extends MarkovRewardProcessState | MarkovProcessState> =
  SimulationNodeDatum & {
    data: T;
  };
