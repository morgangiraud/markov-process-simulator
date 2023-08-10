import { MarkovProcessState } from "./markovProcessState";
import { P } from "./p";

export type MarkovProcessArgs = {
  states: MarkovProcessState[];
  P: P;
};
