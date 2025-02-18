function feedbackReducer(state = null, action) {
    switch (action.type) {
        case "SET_FEEDBACK":
            return {
                ...state,
                feedback: action.feedback,
            };
        case "GET_FEEDBACK":
            return state;
        default:
            return state;
    }
};

export default feedbackReducer;