export const ADD_EVENT = 'ADD_EVENT';
export const addEvent = (event) => {
  return {
    type: ADD_EVENT,
    event
  }
}

export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const updateHistory = (history) => {
  return {
    type: UPDATE_HISTORY,
    history
  }
}