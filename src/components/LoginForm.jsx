
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";




/**
 * Formulario de inicio de sesión.
 * 
 * @returns {JSX.Element} Componente que contiene un formulario para iniciar sesión.
 */

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });


  const mutation = useMutation({
    mutationFn: loginUser,

/**
 * Llamada cuando la mutación es exitosa.
 * Se supone que la API devuelve un objeto con la siguiente estructura:
 * { token: string, user: { username: string } }
 * Se llama a la función login del contexto de autenticación con el token y el usuario.
 */

    onSuccess: (data) => {
      // Suponemos que la API devuelve { token, user }
      login(data.access_token, { username: data.username });
    },
  });



/**
 * Llamada cuando se envía el formulario.
 * Evita que el formulario se envíe y llama a la mutación con el formulario actual.
 */

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Iniciar sesión</h3>


        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled={mutation.isPending}>
          Entrar
        </button>


        {mutation.isError && (
          <p style={{ color: "red" }}>{mutation.error.message}</p>
        )}
      </form>

      <p>¿No tienes cuenta? <Link to="/register"> Registrate </Link></p>
    </>
  );
}
