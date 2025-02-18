function allBlogReducer(state = null, action) {
  switch (action.type) {
    case "GET_ALL_BLOG":
      return state;

    case "SET_ALL_BLOG":
      return {
        ...state,
        allBlog: action.allBlog,
      };
    default:
      return state;
  }
};

export default allBlogReducer;