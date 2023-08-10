import { HistoryEvent, HistoryState } from "../types/historyState";

export const ADD_EVENT = "ADD_EVENT" as const;
export const addEvent = (event: HistoryEvent) => {
  return {
    type: ADD_EVENT,
    event,
  };
};

export const UPDATE_HISTORY = "UPDATE_HISTORY" as const;
export const updateHistory = (history: HistoryState) => {
  return {
    type: UPDATE_HISTORY,
    history,
  };
};
