// src/components/RegisterForm.jsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../social.css";

/**
 * Datos que se envian en el formulario de registro.
 * @typedef {Object} RegisterFormValues
 * @property {string} username - Nombre de usuario.
 * @property {string} email - Correo electronico.
 * @property {string} password - Contraseña del usuario.
 */

/**
 * Formulario de registro de usuario.
 *
 * Usa React Hook Form para validar y React Query para enviar la alta.
 * Tras registrar correctamente redirige al login.
 *
 * @returns {JSX.Element} Formulario de registro listo para usar.
 */
export default function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // Mutacion que registra al usuario en la API.
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      reset();
      navigate("/");
    },
  });

  /**
   * Envia el formulario de registro a la API.
   *
   * @param {RegisterFormValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando termina el registro.
   */
  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  // Deshabilita inputs y boton cuando hay submit o peticion en curso.
  const isDisabled = useMemo(
    () => isSubmitting || mutation.isPending,
    [isSubmitting, mutation.isPending],
  );

  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      <div className="logo-anim logo-hero">Circulo</div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h3>Registro</h3>

        <input
          id="username"
          type="text"
          className="login-input"
          placeholder="Elige un nombre de usuario"
          autoComplete="username"
          {...register("username", {
            required: "El nombre de usuario es obligatorio.",
            minLength: {
              value: 3,
              message: "El nombre de usuario debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 30,
              message: "El nombre de usuario no puede superar los 30 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.username && (
          <p className="field-error">{errors.username.message}</p>
        )}

        <label htmlFor="email">Correo electronico</label>
        <input
          id="email"
          type="email"
          className="login-input"
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
          {...register("email", {
            required: "El correo electronico es obligatorio.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
              message: "Introduce un correo electronico valido.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.email && (
          <p className="field-error">{errors.email.message}</p>
        )}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          className="login-input"
          placeholder="Minimo 6 caracteres"
          autoComplete="new-password"
          {...register("password", {
            required: "La contraseña es obligatoria.",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres.",
            },
          })}
          disabled={isDisabled}
        />
        {errors.password && (
          <p className="field-error">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="login-button"
          disabled={isDisabled}
        >
          {isDisabled ? "Creando cuenta..." : "Registrarse"}
        </button>

        {mutation.isError && (
          <p className="error-text">
            {mutation.error?.message ?? "No se ha podido completar el registro."}
          </p>
        )}

        {mutation.isSuccess && !mutation.isPending && (
          <p className="success">
            Registro completado con exito. Redirigiendo al login...
          </p>
        )}
      </form>

      <p>Ya tienes cuenta? <Link to="/">Logeate</Link></p>
    </main>
  );
}
