import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import apiClient from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Don't check localStorage. Just ask the backend who we are.
        // The browser will automatically send the HttpOnly cookie.
        const response = await apiClient.get("/api/auth/me");
        const userData = response.data;
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        // If the request fails, it means we're not authenticated.
        console.log("No active session or verification failed.");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const login = (loginData) => {
    // This function is likely for a standard username/password form
    // and can be kept for that purpose. It is not used in the Oauth2 flow.
    localStorage.setItem("accessToken", loginData.token);
    setIsAuthenticated(true);
    setUser(loginData.user);
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // The backend is responsible for clearing the cookie.
      // We just need to update the state.
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};