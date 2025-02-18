function allFeedbackReducer(state = null, action) {
  switch (action.type) {
    case "SET_ALL_FEEDBACK":
      return {
        ...state,
        allFeedbacks: action.allFeedbacks,
      };
    case "GET_ALL_FEEDBACK":
      return state;
    default:
      return state;
  }
};

export default allFeedbackReducer;