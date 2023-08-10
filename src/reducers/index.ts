import { combineReducers } from "redux";

import agentReducer from "./agentReducer";
import mpReducer from "./mpReducer";
import rReducer from "./rReducer";
import historyReducer from "./historyReducer";

export const rootReducer = combineReducers({
  agent: agentReducer,
  mp: mpReducer,
  r: rReducer,
  history: historyReducer,
  isViewer: (state = false) => state,
});

export type RootState = ReturnType<typeof rootReducer>;
