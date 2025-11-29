// src/api/auth.js
import { apiFetch } from "./client";

/**
 * Registra un nuevo usuario en el backend.
 * @param {{ username: string, password: string, }} data - Credenciales
 * @returns {Promise<any>} Respuesta de la API de registro.
 */
export function registerUser(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Inicia sesion y obtiene el token JWT.
 * @param {{ username: string, password: string }} data - Credenciales del usuario.
 * @returns {Promise<any>} Datos devueltos por el backend (incluye token).
 */
export function loginUser(data) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
