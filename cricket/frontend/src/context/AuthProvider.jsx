import {useState} from "react";
import {AuthContext} from "./AuthContext";

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    console.log(userData);

    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
