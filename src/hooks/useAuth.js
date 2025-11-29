// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Hook de conveniencia para consumir el AuthContext.

/**
 * Retorna el contexto de autenticacion con token, usuario y helpers.
 * @returns {{ token: string | null, user: object | null, login: function, logout: function, isAuthenticated: boolean }}
 * @example
 * const { token, user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
