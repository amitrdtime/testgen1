import axios from "axios";
import config from "../Config.json";

let subscriptionKey;
if (config.devUrl === window.location.origin) {
  subscriptionKey = config.dev.Ocp_Apim_Subscription_Key;
} else if (config.prdUrl === window.location.origin) {
  subscriptionKey = config.prod.Ocp_Apim_Subscription_Key;
} else {
  subscriptionKey = config.local.Ocp_Apim_Subscription_Key;
}

// Create axios instance with dynamic headers
const instance = axios.create({
  headers: {
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Ocp-Apim-Subscription-Key": subscriptionKey,
  },
});

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Add a request interceptor to set the Authorization header with the Bearer token
instance.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., add headers, authentication token, etc.)
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // You can modify the response data here (e.g., transform data, handle success globally)
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default instance;
