const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  userRole: null,
  accountId: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKENS":
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      console.log("SET_TOKENS Action:", action);
      console.log("Current State:", state);
      console.log("Setting accountId in authReducer:", action.payload.accountId);
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        accountId: action.payload.accountId,
      };
    case "SET_USER_ROLE":
      return {
        ...state,
        userRole: action.payload,
      };
  
    case "LOGOUT":
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        userRole: null,
      };
    default:
      return state;
  }
};

export default authReducer;
