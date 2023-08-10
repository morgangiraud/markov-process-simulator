import utils from "./utils";
import { P } from "./types/p";
import { MarkovRewardProcessState } from "./types/markovRewardProcessState";
import { MarkovRewardProcessUpdate } from "./types/markovRewardProcessUpdate";
import {
  addRewardsToStates,
  initializeForceSimulation,
  initializeMarkovProcess,
} from "./mpUtils";
import { Node } from "./types/node";
import { Link } from "./types/link";

export class MarkovRewardProcess {
  type = "mrp" as const;

  states: MarkovRewardProcessState[];
  P: P;
  det: number;
  rewards: number[];
  gamma: number;
  horizon: number;
  epsilon: number;

  d3Nodes: Node<MarkovRewardProcessState>[];
  d3Links: Link<MarkovRewardProcessState>[];

  constructor(
    states: Partial<MarkovRewardProcessState>[],
    P: P,
    rewards?: number[],
    gamma?: number,
    horizon?: number,
    epsilon?: number,
  ) {
    const markovProcessInitValues =
      initializeMarkovProcess<MarkovRewardProcessState>(this.type, states, P);

    this.states = markovProcessInitValues.states;
    this.P = markovProcessInitValues.P;
    this.det = markovProcessInitValues.detValue;

    // Markov reward process
    this.rewards = utils.checkRewards(rewards, this.states.length);
    this.gamma = utils.checkGamma(gamma);
    this.horizon = utils.checkHorizon(horizon);
    this.epsilon = utils.checkEpsilon(epsilon);

    const { d3Nodes, d3Links } =
      initializeForceSimulation<MarkovRewardProcessState>(this.states, this.P);

    this.d3Nodes = JSON.parse(
      JSON.stringify(addRewardsToStates(d3Nodes, this.rewards)),
    );
    this.d3Links = JSON.parse(JSON.stringify(d3Links));
  }

  update(newState: MarkovRewardProcessUpdate) {
    return new MarkovRewardProcess(
      newState.states ?? this.states,
      newState.P ?? this.P,
      newState.rewards ?? this.rewards,
      newState.gamma ?? this.gamma,
      newState.horizon ?? this.horizon,
      newState.epsilon ?? this.epsilon,
    );
  }

  export() {
    return btoa(
      JSON.stringify({
        states: this.states,
        P: this.P,
        rewards: this.rewards,
        gamma: this.gamma,
        horizon: this.horizon === Infinity ? "Infinity" : this.horizon,
        epsilon: this.epsilon,
      }),
    );
  }
}
