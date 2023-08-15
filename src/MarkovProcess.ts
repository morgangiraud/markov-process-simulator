import { P } from "./types/p";
import { Node } from "./types/node";
import { Link } from "./types/link";
import { MarkovProcessState } from "./types/markovProcessState";
import { MarkovProcessUpdate } from "./types/markovProcessUpdate";
import { initializeForceSimulation, initializeMarkovProcess } from "./mpUtils";

export class MarkovProcess {
  type = "mp" as const;

  states: MarkovProcessState[];
  P: P;
  det: number;

  d3Nodes: Node<MarkovProcessState>[];
  d3Links: Link<MarkovProcessState>[];

  constructor(states: Partial<MarkovProcessState>[], P: P) {
    const markovProcessInitValues = initializeMarkovProcess<MarkovProcessState>(
      this.type,
      states,
      P,
    );

    this.states = markovProcessInitValues.states;
    this.P = markovProcessInitValues.P;
    this.det = markovProcessInitValues.detValue;

    const { d3Nodes, d3Links } = initializeForceSimulation<MarkovProcessState>(
      this.states,
      this.P,
    );

    this.d3Nodes = JSON.parse(JSON.stringify(d3Nodes));
    this.d3Links = JSON.parse(JSON.stringify(d3Links));
  }

  update(newState: MarkovProcessUpdate) {
    return new MarkovProcess(
      newState.states ?? this.states,
      newState.P ?? this.P,
    );
  }

  export() {
    return btoa(
      JSON.stringify({
        states: this.states,
        P: this.P,
      }),
    );
  }
}
