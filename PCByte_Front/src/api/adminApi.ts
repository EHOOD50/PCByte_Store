import axios from "axios";

const adminAuth = btoa("admin:1234");

const API_BASE_URL = "http://192.168.100.226:8080/api";

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Basic ${adminAuth}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

export default adminApi;