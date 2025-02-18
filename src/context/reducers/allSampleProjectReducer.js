function allSampleProjectReducer(state = null, action) {
  switch (action.type) {
    case "GET_ALL_SAMPLE_PROJECT":
      return state;

    case "SET_ALL_SAMPLE_PROJECT":
      return {
        ...state,
        allSampleProject: action.allSampleProject,
      };
    default:
      return state;
  }
};

export default allSampleProjectReducer;