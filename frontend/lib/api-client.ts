import axios from "axios";

// Using env var for backend or defaulting to local Go server
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally add interceptors for JWT injection
apiClient.interceptors.request.use((config) => {
  // const token = useAuthStore.getState().token; (example setup)
  return config;
});
