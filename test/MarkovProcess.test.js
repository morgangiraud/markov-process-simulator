import { MarkovChain, MarkovRewardProcess } from "../src/MarkovProcess";

describe("MRP - constructor", () => {
  it("should return states with 0 rewards", function () {
    let states = [{ seed: "0" }, { seed: "1" }];
    let P = [
      [0.8, 0],
      [0.5, 0.4],
    ];
    let mrp = new MarkovRewardProcess(states, P);
    expect(mrp.states).toEqual([
      {
        class: "state",
        name: "S0",
        r: mrp.states[0].r,
        reward: 0,
        seed: "0",
        terminal: true,
      },
      {
        class: "state",
        name: "S1",
        r: mrp.states[0].r,
        reward: 0,
        seed: "1",
        terminal: false,
      },
    ]);
  });
  it("should return states with rewards", function () {
    let states = [{ seed: "0" }, { seed: "1" }];
    let P = [
      [0.8, 0],
      [0.5, 0.4],
    ];
    let rewards = [1, 2];
    let mrp = new MarkovRewardProcess(states, P, rewards);
    expect(mrp.states).toEqual([
      {
        class: "state",
        name: "S0",
        r: mrp.states[0].r,
        reward: 1,
        seed: "0",
        terminal: true,
      },
      {
        class: "state",
        name: "S1",
        r: mrp.states[0].r,
        reward: 2,
        seed: "1",
        terminal: false,
      },
    ]);
  });
});

describe("MP - update", () => {
  it("should return states with 0 rewards", function () {
    let states = [{ seed: "0" }, { seed: "1" }];
    let P = [
      [0.8, 0],
      [0.5, 0.4],
    ];
    let mp = new MarkovChain(states, P);

    let newStates = [{ seed: "2" }, { seed: "3" }];
    let newMp = mp.update({ states: newStates });

    expect(newMp == mp).toBe(false);
    expect(newMp === mp).toBe(false);
    expect(newMp.states == mp.states).toBe(false);
    expect(newMp.states[0].seed).toBe("2");
    expect(newMp.P == mp.P).toBe(false);
    expect(newMp.P === mp.P).toBe(false);
    expect(newMp.P[0] == mp.P[0]).toBe(false);
    expect(newMp.P).toEqual(mp.P);
  });
});

describe("MP - update", () => {
  it("should return states with 0 rewards", function () {
    let states = [{ seed: "0" }, { seed: "1" }];
    let P = [
      [0.8, 0],
      [0.5, 0.4],
    ];
    let rewards = [1, 2];
    let mrp = new MarkovRewardProcess(states, P, rewards);

    let newStates = [{ seed: "2" }, { seed: "3" }];
    let newMrp = mrp.update({ states: newStates });

    expect(newMrp == mrp).toBe(false);
    expect(newMrp === mrp).toBe(false);
    expect(newMrp.states == mrp.states).toBe(false);
    expect(newMrp.states[0].seed).toBe("2");
    expect(newMrp.P == mrp.P).toBe(false);
    expect(newMrp.P === mrp.P).toBe(false);
    expect(newMrp.P[0] == mrp.P[0]).toBe(false);
    expect(newMrp.rewards).toEqual(mrp.rewards);
    expect(newMrp.gamma).toEqual(mrp.gamma);
    expect(newMrp.horizon).toEqual(mrp.horizon);
    expect(newMrp.epsilon).toEqual(mrp.epsilon);
  });
});
