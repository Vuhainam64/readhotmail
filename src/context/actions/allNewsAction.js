export const setAllNews = (data) => {
  return {
    type: "SET_ALL_NEWS",
    allNews: data,
  };
};

export const getAllNews = () => {
  return {
    type: "GET_ALL_NEWS",
  };
};