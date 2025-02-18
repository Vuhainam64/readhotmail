function allTasksReducer(state = null, action) {
  switch (action.type) {
    case "GET_ALL_TASK":
      return state;

    case "SET_ALL_TASK":
      return {
        ...state,
        allTasks: action.allTasks,
      };
    default:
      return state;
  }
};

export default allTasksReducer;