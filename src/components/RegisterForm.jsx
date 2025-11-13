// src/components/RegisterForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { Link } from "react-router-dom";



/**
 * Componente que renderiza un formulario para registrar un nuevo usuario.
 * El formulario pide un usuario, email y contraseña.
 * Si se introduce un usuario, email y contraseña válidos, se envía una petición para registrar el usuario.
 * Si la petición es exitosa, se muestra un mensaje de éxito y se redirige al login.
 * Si la petición falla, se muestra un mensaje de error.
 * @returns {JSX.Element} Componente que renderiza el formulario de registro.
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
    <form onSubmit={handleSubmit}>
      <h2>Bienvenid@ a Círculo</h2>
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
        placeholder="Contraseña"
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
        <p style={{ color: "green" }}>Registro completado con éxito</p>
      )}
    </form>

    <p>¿Ya tienes cuenta? <Link to="/"> Logeate </Link></p>
    </main>
  );
}
