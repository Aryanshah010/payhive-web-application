import axios from "axios";
import { getAuthToken } from "../cookie";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // safe even if you don't use cookies
});

// Attach token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 🚨 IMPORTANT: do NOT set Content-Type here
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
