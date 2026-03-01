import { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUserData } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, Setuser] = useState(null);
  const [loading, Setloading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = getUserData();
      Setuser(JSON.parse(userData));
      Setloading(false);
    }
  }, []);

  const loginAuth = (userData) => {
    Setuser(JSON.parse(userData));
  };

  const logoutAuth = () => {
    Setuser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        loginAuth,
        logoutAuth,
        isAuthenticated: user !== null,
        isManager: user?.data?.UserRole === "manager",
        isWaiter: user?.data?.UserRole === "waiter",
        isChef: user?.data?.UserRole === "chef",
        isCashier: user?.data?.UserRole === "cashier",
        // isManager: true,
        // isWaiter: true,
        // isChef: true,
        // isCashier: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be in AuthProvider");
  }
  return context;
};
