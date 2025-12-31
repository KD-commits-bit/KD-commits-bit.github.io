import {useState, useEffect} from "react";
import {AuthContext} from "./AuthContext";
import apiClient from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("accessToken");

       if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      if (token) {
        try {
          // apiClient has the interceptor to add the token
          const response = await apiClient.get("/api/auth/me");
          const userData = response.data;
          if (userData) {
            setIsAuthenticated(true);
            setUser(userData);
          }
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          console.log("Token verification failed, removing token.");
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = (loginData) => {
    // loginData is expected to be { token: "...", user: { ... } }
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
      localStorage.removeItem("accessToken");
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