function allRolesReducer(state = null, action) {
  switch (action.type) {
    case "GET_ALL_ROLE":
      return state;

    case "SET_ALL_ROLE":
      return {
        ...state,
        allRoles: action.allRoles,
      };
    default:
      return state;
  }
};

export default allRolesReducer;