export const setAllBlog = (data) => {
  return {
    type: "SET_ALL_BLOG",
    allBlog: data,
  };
};

export const getAllBlog = () => {
  return {
    type: "GET_ALL_BLOG",
  };
};