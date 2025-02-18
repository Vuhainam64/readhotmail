export const setAllRoles = (data) => {
  return {
    type: "SET_ALL_ROLE",
    allRoles: data,
  };
};

export const getAllRoles = (data) => {
  return {
    type: "GET_ALL_ROLE",
  };
};