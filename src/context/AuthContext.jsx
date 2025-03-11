import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("userData");
      
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error al parsear datos de usuario:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials, onSuccess, onError) => {
    setLoading(true);
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(user));
      
      setUser(user);
      
      if (typeof onSuccess === 'function') {
        onSuccess(user);
      }
    } catch (error) {
      console.error("Error de login:", error);
      
      let errorMessage = "Credenciales incorrectas. Por favor intenta de nuevo.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      if (typeof onError === 'function') {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};