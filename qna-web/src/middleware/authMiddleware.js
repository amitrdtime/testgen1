// middleware/authMiddleware.js
import config from "../Config.json";

const authMiddleware = (store) => (next) => (action) => {
  if (action.type === "LOGIN_USER") {
    const token = action.payload.token;
    if (token === undefined) {
      localStorage.removeItem("token");
      if (config.devUrl === window.location.origin) {
        window.location.href = config.dev.loginUrl;
        return;
      } else if (config.prdUrl === window.location.origin) {
        window.location.href = config.prod.loginUrl;
        return;
      } else {
        window.location.href = config.local.loginUrl;
        return;
      }
    }
    const expirationTime = token.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if (expirationTime < currentTime) {
      localStorage.removeItem("token");
      if (config.devUrl === window.location.origin) {
        window.location.href = config.dev.loginUrl;
        return;
      } else if (config.prdUrl === window.location.origin) {
        window.location.href = config.prod.loginUrl;
        return;
      } else {
        window.location.href = config.local.loginUrl;
        return;
      }
    }

    // store.dispatch(decodeToken(token));
    // const userType = store.getState().auth.user.userType;
    const userType = store.getState().auth;
    if (userType === "admin" && action.payload.route === "/admin") {
      // Perform admin-specific actions
    } else if (userType === "user" && action.payload.route === "/user") {
      // Perform user-specific actions
    } else {
      // Unauthorized route, handle accordingly
    }
  } else if (action.type === "LOGOUT_USER") {
    localStorage.removeItem("token");
    if (config.devUrl === window.location.origin) {
      window.location.href = config.dev.loginUrl;
      return;
    } else if (config.prdUrl === window.location.origin) {
      window.location.href = config.prod.loginUrl;
      return;
    } else {
      window.location.href = config.local.loginUrl;
      return;
    }
  }

  return next(action);
};

export default authMiddleware;
