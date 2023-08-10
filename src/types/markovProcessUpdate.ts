import { MarkovProcessState } from "./markovProcessState";
import { P } from "./p";

export type MarkovProcessUpdate = {
  states?: Partial<MarkovProcessState>[];
  P?: P;
};
