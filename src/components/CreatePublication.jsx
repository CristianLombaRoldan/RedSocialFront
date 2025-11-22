import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";


/**
 * Datos que se envían al crear una publicación.
 * @typedef {Object} CreatePublicationValues
 * @property {string} text - Contenido de la publicación.
 */


/**
 * Formulario para crear una nueva publicación.
 *
 * Utiliza React Hook Form para gestionar el estado y la validación del textarea,
 * y React Query para lanzar la mutación de creación contra la API. Tras una
 * creación correcta invalida las queries relacionadas con publicaciones para
 * refrescar automáticamente los listados.
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


  const mutation = useMutation({
    mutationFn: async ({ text }) =>
      apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
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
   * Envía el texto de la publicación a la API.
   *
   * @param {CreatePublicationValues} values - Valores validados del formulario.
   * @returns {Promise<void>} Promesa que resuelve cuando se completa la creación.
   */
  const onSubmit = async (values) => {
    if (!user) return;
    await mutation.mutateAsync(values);
  };


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
      <h3>Crea una nueva publicación</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <textarea
          placeholder={
            user
              ? "¿Qué está pasando?"
              : "Inicia sesión para poder publicar."
          }
          rows={3}
          {...register("text", {
            required: user ? "El texto de la publicación es obligatorio." : false,
            minLength: {
              value: 3,
              message: "La publicación debe tener al menos 3 caracteres.",
            },
            maxLength: {
              value: 280,
              message: "La publicación no puede superar los 280 caracteres.",
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
          {mutation.error?.message ?? "No se ha podido crear la publicación."}
        </p>
      )}

    </div>
  );
}



