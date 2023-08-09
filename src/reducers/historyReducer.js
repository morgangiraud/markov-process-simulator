import * as types from "../actions/historyActions";

export default (state = [], action) => {
  switch (action.type) {
    case types.ADD_EVENT:
      return [...state, action.event];
    case types.UPDATE_HISTORY:
      return action.history;
    default:
      return state;
  }
};
