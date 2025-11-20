import { useContext } from "react";
import { AuthContext } from "./AuthContext";


/**
 * Hook que devuelve el contexto de autenticación.
 * Proporciona los valores de token y usuario actuales, así como las funcionesas para loguear y desloguear.
 * @returns {{ token: string, user: object, login: function, logout: function, isAuthenticated: boolean }}
 * @example
 * const { token, user, login, logout, isAuthenticated } = useAuth();
 */

export function useAuth() {
  return useContext(AuthContext);
}

