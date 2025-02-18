const userReducer = (state = {
    user: null,
   
}, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: {
                    ...action.user,
                    id: action.user.id, // Include id in the user object
                },                
            };
        case "SET_USER_NULL":
            return {
                ...state,
                user: null,
                
            };
        default:
            return state;
    }
};

export default userReducer;