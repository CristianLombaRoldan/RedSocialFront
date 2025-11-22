import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";

/**
 * Formulario de registro con logo animado.
 * @returns {JSX.Element}
 */
export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: registerUser,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      <div className="logo-anim logo-hero">Circulo</div>
      <form onSubmit={handleSubmit}>
        <h3>Registro</h3>

        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          Registrarse
        </button>

        {mutation.isError && (
          <p style={{ color: "red" }}>{mutation.error.message}</p>
        )}
        {mutation.isSuccess && (
          <p style={{ color: "green" }}>Registro completado con exito</p>
        )}
      </form>

      <p>Ya tienes cuenta? <Link to="/"> Logeate </Link></p>
    </main>
  );
}
