function allNotifyReducer(state = null, action) {
  switch (action.type) {
    case "GET_ALL_NOTIFY":
      return state;

    case "SET_ALL_NOTIFY":
      return {
        ...state,
        allNotify: action.allNotify,
      };
    default:
      return state;
  }
};

export default allNotifyReducer;