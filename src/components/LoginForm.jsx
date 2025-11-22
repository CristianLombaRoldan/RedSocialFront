import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

/**
 * Formulario de inicio de sesion con logo animado.
 * @returns {JSX.Element}
 */
export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.access_token, { username: data.username });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <>
      <div className="logo-anim logo-hero">Circulo</div>
      <form onSubmit={handleSubmit}>
        <h3>Iniciar sesion</h3>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contrasena"
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

      <p>No tienes cuenta? <Link to="/register"> Registrate </Link></p>
    </>
  );
}
