import rUtils from "../src/rUtils";

describe("rUtils - syncValueEvaluationStep", () => {
  it("should compute the values of all nodes", function () {
    const states = [{ seed: "0" }, { seed: "1" }];
    const P = [
      [1, 0],
      [0.5, 0.5],
    ];
    const rewards = [1, 0.5];
    const gamma = 1;
    const currentValues = [0, 0];
    const [newValues, currentDiff] = rUtils.syncValueEvaluationStep(
      currentValues,
      P,
      rewards,
      gamma,
    );

    expect(newValues).toEqual([1, 0.5]);
    expect(currentDiff).toEqual(0.75);
  });
});

describe("rUtils - syncValueEvaluation", () => {
  it("should compute the values of all nodes", function () {
    const states = [{ seed: "0" }, { seed: "1" }];
    const P = [
      [1, 0],
      [0.5, 0.5],
    ];
    const rewards = [1, 0.5];
    const gamma = 1;
    const horizon = Infinity;
    const epsilon = 1e-2;
    const currentValues = [0, 0];
    const newValues = rUtils.syncValueEvaluation(
      currentValues,
      P,
      rewards,
      gamma,
      horizon,
      epsilon,
    );

    expect(newValues).toEqual([1, 1.988]);
  });
  it("should compute the values of all nodes", function () {
    const states = [{ seed: "0" }, { seed: "1" }];
    const P = [
      [1, 0],
      [0.5, 0.5],
    ];
    const rewards = [1, 0.5];
    const gamma = 0;
    const horizon = Infinity;
    const epsilon = 1e-2;
    const currentValues = [0, 0];
    const newValues = rUtils.syncValueEvaluation(
      currentValues,
      P,
      rewards,
      gamma,
      horizon,
      epsilon,
    );

    expect(newValues).toEqual([1, 0.5]);
  });
  it("should compute the values of all nodes", function () {
    const states = [{ seed: "0" }, { seed: "1" }];
    const P = [
      [1, 0],
      [0.5, 0.5],
    ];
    const rewards = [1, 0.5];
    const gamma = 1;
    const horizon = 0;
    const epsilon = 1e-2;
    const currentValues = [0, 0];
    const newValues = rUtils.syncValueEvaluation(
      currentValues,
      P,
      rewards,
      gamma,
      horizon,
      epsilon,
    );

    expect(newValues).toEqual([1, 0.5]);
  });
  it("should compute the values of all nodes", function () {
    const states = [{ seed: "0" }, { seed: "1" }];
    const P = [
      [1, 0],
      [0.5, 0.5],
    ];
    const rewards = [1, 0.5];
    const gamma = 1 / 2;
    const horizon = Infinity;
    const epsilon = 1e-2;
    const currentValues = [0, 0];
    const newValues = rUtils.syncValueEvaluation(
      currentValues,
      P,
      rewards,
      gamma,
      horizon,
      epsilon,
    );

    expect(newValues).toEqual([1, 0.998]);
  });
  it("should compute the values of all nodes", function () {
    const states = [{ seed: "0" }, { seed: "1" }];
    const P = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];
    const rewards = [1, 0.5];
    const gamma = 0.99;
    const horizon = Infinity;
    const epsilon = 1e-2;
    const currentValues = [0, 0];
    const newValues = rUtils.syncValueEvaluation(
      currentValues,
      P,
      rewards,
      gamma,
      horizon,
      epsilon,
    );

    expect(newValues).toEqual([74.264, 73.764]);
  });
});
