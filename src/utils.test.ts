import utils from "../src/utils";

describe("multiply", () => {
  it("should return a valid matrix", function () {
    const a = [
      [1, 1],
      [1, 1],
    ];
    const mat = utils.multiply(a, a);
    expect(mat).toEqual([
      [2, 2],
      [2, 2],
    ]);
  });
  it("should return a valid matrix", function () {
    const a = [
      [1, 1],
      [1, 1],
    ];
    const v = [1, 1];
    const mat = utils.multiply(a, v);
    expect(mat).toEqual([[2], [2]]);
  });
});

describe("checkP", () => {
  it("should return a valid P", function () {
    const P = [
      [0.8, 0],
      [0.5, 0.4],
    ];
    const newP = utils.checkP(P);
    expect(newP).toEqual([
      [1, 0],
      [0.555, 0.444],
    ]);
  });
  it("should return a valid P", function () {
    const P = [
      [0.8, -0.3],
      [0.5, 2],
    ];
    const newP = utils.checkP(P);
    expect(newP).toEqual([
      [1, 0],
      [0.333, 0.666],
    ]);
  });
  it("should return a valid P", function () {
    const P = [
      [0, 0],
      [0.5, 2],
    ];
    const newP = utils.checkP(P);
    expect(newP).toEqual([
      [0.5, 0.5],
      [0.333, 0.666],
    ]);
  });
});

describe("checkProba", () => {
  it("should return a valid proba", function () {
    expect(utils.checkProba(0)).toEqual(0);
    expect(utils.checkProba(2)).toEqual(1);
    expect(utils.checkProba(-1)).toEqual(0);
    expect(utils.checkProba(1 / 2)).toEqual(1 / 2);
    expect(utils.checkProba(NaN)).toEqual(0);
    expect(utils.checkProba(0.1234567)).toEqual(0.123);
  });
});

describe("matrixToString", () => {
  it("should return the corresponding string", function () {
    const P = [0.8, 0];
    const newP = utils.matrixToString(P);
    expect(newP).toEqual("(0.8,0)");
  });
  it("should return the corresponding string", function () {
    const P = [
      [0.8, 0],
      [0.5, 0.4],
    ];
    const newP = utils.matrixToString(P);
    expect(newP).toEqual("((0.8,0),(0.5,0.4))");
  });
});

describe("addPiToP", () => {
  it("should return the corresponding matrix", function () {
    const P = [
      [0.8, -0.3],
      [0.5, 2],
    ];
    const newP = utils.addPiToP(P);
    expect(newP).toEqual([
      [0.8, -0.3, 0],
      [0.5, 2, 0],
      [1 / 3, 1 / 3, 1 / 3],
    ]);
  });
  it("should throw an error", function () {
    const P = [
      [0.8, -0.3],
      [0.5, 2],
    ];
    const pi: number[] = [];
    expect(() => {
      utils.addPiToP(P, pi);
    }).toThrow();
  });
  it("should return the corresponding matrix", function () {
    const P = [
      [0.8, -0.3],
      [0.5, 2],
    ];
    const pi = [0.3, 0.3, 0.4];
    const newP = utils.addPiToP(P, pi);
    expect(newP).toEqual([
      [0.8, -0.3, 0],
      [0.5, 2, 0],
      [0.3, 0.3, 0.4],
    ]);
  });
});

describe("removePiToP", () => {
  it("should return the corresponding matrix", function () {
    const P = [
      [0.8, -0.3, 0],
      [0.5, 2, 0],
      [1 / 3, 1 / 3, 1 / 3],
    ];
    const piIndex = 2;
    const newP = utils.removePiToP(P, piIndex);
    expect(newP).toEqual([
      [0.8, -0.3],
      [0.5, 2],
    ]);
  });
  it("should throw an error", function () {
    const P = [
      [0.8, -0.3],
      [0.5, 2],
    ];
    const piIndex = 2;
    expect(() => {
      utils.removePiToP(P, piIndex);
    }).toThrow();
  });
});
