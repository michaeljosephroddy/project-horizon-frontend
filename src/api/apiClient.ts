import axios from "axios";
import { getToken } from "../context/tokenStore";

const baseURL = process.env.API_BASE_URL ?? "http://localhost:8080/api";

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
