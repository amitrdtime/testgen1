// AuthHandler.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "./actions/authActions";
import config from "./Config.json";

const useAuthHandler = () => {
  const dispatch = useDispatch();

  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(window.location.hash.substring(1));
    return searchParams.get(name);
  };

  const verifyCodeAndGetToken = async (code) => {
    try {
      const decodedToken = jwtDecode(code);
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  useEffect(() => {
    if (getQueryParam("id_token")) {
      localStorage.setItem("token", getQueryParam("id_token"));
    }
    const code = localStorage.getItem("token");
    if (code) {
      verifyCodeAndGetToken(code)
        .then((token) => {
          dispatch(loginUser(token));
        })
        .catch((error) => {
          console.error("Error verifying code:", error);
        });
    } else {
      if(config.devUrl === window.location.origin) {
        window.location.href =config.dev.loginUrl;
        return;
      }else if(config.prdUrl === window.location.origin){
        window.location.href = config.prod.loginUrl;
        return;
      } else{
        window.location.href =config.local.loginUrl;
        return;
      }
    }
  }, [dispatch, config]);

  return null;
};

export default useAuthHandler;
