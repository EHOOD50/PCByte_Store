import axios from "axios";

const API_BASE_URL =
  "http://192.168.100.226:8080/api";

export const ADMIN_TOKEN_STORAGE_KEY =
  "admin_auth_token";

const adminApi = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",

    "ngrok-skip-browser-warning":
      "true",
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const authToken =
      localStorage.getItem(
        ADMIN_TOKEN_STORAGE_KEY
      );

    if (authToken) {
      config.headers.Authorization =
        `Basic ${authToken}`;
    } else {
      delete config
        .headers
        .Authorization;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

adminApi.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (
      error.response?.status ===
        401 ||
      error.response?.status ===
        403
    ) {
      localStorage.removeItem(
        ADMIN_TOKEN_STORAGE_KEY
      );
    }

    return Promise.reject(
      error
    );
  }
);

export default adminApi;