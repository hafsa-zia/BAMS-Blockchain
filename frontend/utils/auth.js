// frontend/utils/auth.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const logout = async () => {
  await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
  window.location.href = "/login";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bams_auth");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {}
  }, []);

  function save(userObj) {
    setUser(userObj);
    localStorage.setItem("bams_auth", JSON.stringify(userObj));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("bams_auth");
  }

  return (
    <AuthContext.Provider value={{ user, login: save, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
