import axios from "axios";

const TOKEN_STORAGE_KEY =
  "auth_token";

const api = axios.create({
  baseURL:
    "http://192.168.100.226:8080/api",

  headers: {
    "Content-Type":
      "application/json",

    "ngrok-skip-browser-warning":
      "true",
  },
});

/*
 * Agrega automáticamente las credenciales
 * HTTP Basic en cada solicitud autenticada.
 */
api.interceptors.request.use(
  (config) => {
    const authToken =
      localStorage.getItem(
        TOKEN_STORAGE_KEY
      );

    if (authToken) {
      config.headers.Authorization =
        `Basic ${authToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

export default api;