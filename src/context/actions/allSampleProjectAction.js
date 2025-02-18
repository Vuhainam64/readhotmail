export const setAllSampleProject = (data) => {
  return {
    type: "SET_ALL_SAMPLE_PROJECT",
    allSampleProject: data,
  };
};

export const getAllSampleProject = () => {
  return {
    type: "GET_ALL_SAMPLE_PROJECT",
  };
};