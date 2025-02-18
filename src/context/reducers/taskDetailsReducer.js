const taskDetailsReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_TASK_DETAILS':
            return action.payload;
        default:
            return state;
    }
};

export default taskDetailsReducer;