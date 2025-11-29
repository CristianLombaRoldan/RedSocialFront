// src/components/CreatePublication.jsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";

/**
 * Datos que se envian al crear una publicacion.
 * @typedef {Object} CreatePublicationValues
 * @property {string} text - Contenido de la publicacion.
 */

/**
 * Formulario para crear una nueva publicacion.
 *
 * Gestiona validaciones con React Hook Form y usa React Query
 * para disparar la creacion y refrescar caches relacionadas.
 *
 * @returns {JSX.Element} Un formulario estilado para crear publicaciones.
 */
export default function CreatePublication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
    },
    mode: "onBlur",
  });

  // Mutacion centralizada que envia el texto a la API.
  const mutation = useMutation({
    mutationFn: async ({ text }) =>
      apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),

/**
 * Función que se ejecuta cuando la mutación se completa con éxito.
 * Limpia todos los caches de React Query que contengan "publications" en su queryKey.
 * Y resetea el formulario para que pueda ser reutilizado.
 */

    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].includes("publications"),
      });
    },
  });

  /**
   * Envia el texto de la publicacion a la API.
   *
   * @param {CreatePublicationValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando se completa la creacion.
   */
  const onSubmit = async (values) => {
    if (!user) return;
    await mutation.mutateAsync(values);
  };

  // Flag reutilizable para deshabilitar campos y boton de envio.
  const isDisabled = useMemo(
    () => !user || isSubmitting || mutation.isPending,
    [user, isSubmitting, mutation.isPending],
  );

  return (
    <div style={{
      maxWidth: "600px",
      margin: "20px auto",
      padding: "15px",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    }}>
      <h3>Crea una nueva publicacion</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <textarea
          placeholder={
            user
              ? "Que esta pasando?"
              : "Inicia sesion para poder publicar."
          }
          rows={3}
          {...register("text", {
            required: user ? "El texto de la publicacion es obligatorio." : false,
            minLength: {
              value: 3,
              message: "La publicacion debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 280,
              message: "La publicacion no puede superar los 280 caracteres.",
            },
          })}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none",
          }}
          disabled={isDisabled}
        />
        {errors.text && (
          <p className="field-error">{errors.text.message}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
      {mutation.isError && (
        <p className="error-text">
          {mutation.error?.message ?? "No se ha podido crear la publicacion."}
        </p>
      )}
    </div>
  );
}
