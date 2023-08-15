export type HistoryEvent = {
  type: "state" | "reward";
  value: number | string;
  stroke: string;
};

export type HistoryState = HistoryEvent[];
