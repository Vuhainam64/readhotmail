function allNewsReducer(state = null, action) {
  switch (action.type) {
    case "GET_ALL_NEWS":
      return state;

    case "SET_ALL_NEWS":
      return {
        ...state,
        allNews: action.allNews,
      };
    default:
      return state;
  }
};

export default allNewsReducer;