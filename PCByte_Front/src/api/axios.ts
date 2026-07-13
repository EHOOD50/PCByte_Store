import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.226:8080/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;