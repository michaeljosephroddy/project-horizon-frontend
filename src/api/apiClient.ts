import axios from "axios";
import { Platform } from "react-native";
import { getToken } from "../context/tokenStore";

// const baseURL = process.env.API_BASE_URL ?? "http://192.168.8.14:8080/api";

const baseURL =
  Platform.OS === "web"
    ? "http://localhost:8080/api"
    : "http://192.168.8.14:8080/api"; // LAN IP

const apiClient = axios.create({ baseURL });

// attach token if present
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // Add user ID to headers for backend endpoints that need it
      config.headers["X-User-ID"] = "1"; // Hardcoded for now since auth isn't fully implemented
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export default apiClient;
