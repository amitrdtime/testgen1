// actions/authActions.js

export const loginUser = (token) => {
  const user = token.extension_Role;
  return {
    type: "LOGIN_USER",
    payload: { token, user },
  };
};

export const logoutUser = () => {
  return {
    type: "LOGOUT_USER",
  };
};
