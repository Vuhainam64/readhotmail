const roleReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_ROLE":
      return {
        ...state,
        role: action.role,
      };
    case "SET_ROLE_NULL":
      return {
        ...state,
        role: null,
      };
    default:
      return state;
  }
};

export default roleReducer;