import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const authChannel = new BroadcastChannel("auth-channel");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res);
          setUser(res.data.user);
        } catch {
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    authChannel.onmessage = () => checkAuth();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      authChannel.close();
    };
  }, []);

  const login = async (credentials) => {
    try {
      console.log(credentials);
      const res = await axios.post("http://localhost:5000/api/signin", credentials);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      // authChannel.postMessage("auth-changed");
      return { role: res.data.user.role };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    authChannel.postMessage("auth-changed");
    return { success: true };
  };

  if (loading) return <div>Loading...</div>;

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
