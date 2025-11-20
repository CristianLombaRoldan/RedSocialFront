// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();


/**
 * Componente que proporciona el contexto de autenticación.
 * Se utiliza para loguear y desloguear al usuario.
 * Proporciona los valores de token y usuario actuales, así como funcionesas para loguear y desloguear.
 * Se utiliza como proveedor para el contexto de autenticación.
 * @param {{ children: JSX.Element }} props
 * @returns {JSX.Element} Componente que proporciona el contexto de autenticación.
 */

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);


/**
 * Loguea al usuario con el token y los datos del usuario.
 * Almacena el token y los datos del usuario en el almacenamiento local.
 * Si no se proporcionan datos del usuario, se establecerá el valor de usuario en null.
 * @param {string} tokenValue - Token JWT del usuario.
 * @param {{ username: string, email: string }} userData - Datos del usuario.
 */

  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData || null);

    localStorage.setItem("token", tokenValue);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  };


/**
 * Desloguea al usuario, eliminando el token y los datos del usuario
 * del almacenamiento local.
 */

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");  
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated:!!token}}>
      {children}
    </AuthContext.Provider>
  );
}
