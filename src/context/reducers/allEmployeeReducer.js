function allEmployeeReducer(state = null, action) {
    switch (action.type) {
        case "GET_ALL_EMPLOYEE":
            return state;

        case "SET_ALL_EMPLOYEE":
            return {
                ...state,
                allEmployee: action.allEmployee,
            };
        default:
            return state;
    }
};

export default allEmployeeReducer;