import { useEffect, useState } from "react";
import { checkAuthStatus } from "../services/auth";
import { User } from "../types";

export const useAuth = () => {
  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const verifyAuth = async () => {
    setIsLoading(true);
    try {
      const response = await checkAuthStatus();
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (token) {
      verifyAuth();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return {
    isAuthenticated,
    isLoading,
    token,
    user,
    login,
    logout,
  };
};
