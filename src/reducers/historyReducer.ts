import * as types from "../actions/historyActions";
import { HistoryEvent, HistoryState } from "../types/historyState";

interface AddEventAction {
  type: typeof types.ADD_EVENT;
  event: HistoryEvent;
}

interface UpdateHistoryAction {
  type: typeof types.UPDATE_HISTORY;
  history: HistoryState;
}

type HistoryActions = AddEventAction | UpdateHistoryAction;

const initialState: HistoryState = [];

export default (
  historyState: HistoryState = initialState,
  action: HistoryActions,
): HistoryState => {
  switch (action.type) {
    case types.ADD_EVENT:
      return [...historyState, action.event];
    case types.UPDATE_HISTORY:
      return action.history;
    default:
      return historyState;
  }
};
