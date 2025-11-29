// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

// Contexto global que expone token, usuario y helpers de autenticacion.
export const AuthContext = createContext();

/**
 * Proveedor de autenticacion.
 * Gestiona token y datos de usuario, sincroniza localStorage
 * y expone helpers de login/logout.
 *
 * @param {{ children: JSX.Element | JSX.Element[] }} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sincroniza el token en localStorage para mantener la sesion tras recargar.
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  /**
   * Loguea al usuario almacenando token y datos.
   * @param {string} tokenValue - Token JWT.
   * @param {{ username: string, email?: string } | null} userData - Datos basicos del usuario.
   */
  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData || null);

    localStorage.setItem("token", tokenValue);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * Desloguea al usuario y limpia localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
