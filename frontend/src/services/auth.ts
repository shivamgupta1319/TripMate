import axios from "axios";
import { User } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3005";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<void> => {
  await axiosInstance.post("/auth/register", credentials);
};

export const checkAuthStatus = async (): Promise<{
  verified: boolean;
  user: User;
}> => {
  try {
    const response = await axiosInstance.get("/auth/verify");
    return response.data;
  } catch (error) {
    localStorage.removeItem("token");
    throw error;
  }
};

// Export the axios instance to be used by other services
export default axiosInstance;
