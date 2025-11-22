import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";
import { useQueryClient } from "@tanstack/react-query"; // ✅ IMPORTANTE




/**
 * Componente que permite crear una nueva publicación.
 * 
 * @returns {JSX.Element} Componente que contiene un formulario para crear una publicación.
 */

export default function CreatePublication() {  // ya NO necesitas onNewPublication
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // Usamos useQueryClient para invalidar el listado de publicaciones
  const queryClient = useQueryClient();

  if (!user) {
    return <p>Debes estar logueado para crear una publicación.</p>;
  }

/**
 * Función que se encarga de crear una nueva publicación.
 * 
 * Primero, evita que el formulario se envíe.
 * Luego, verifica si el texto de la publicación no está vacío.
 * Si no lo está, intenta crear la publicación con la API.
 * Si la creación es exitosa, invalida el listado de publicaciones para que se recargue automáticamente.
 * Si ocurre un error, muestra un mensaje de error.
 * Finalmente, siempre que termine la función, se asegura de que el formulario no esté en estado de envío.
 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("La publicación no puede estar vacía.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetch("/publications/", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      setText("");

      // Invalida cualquier lista de publicaciones (todas y propias)
      queryClient.invalidateQueries({
        predicate: (q) => {
          const key = String(q.queryKey?.[0] || "");
          return key.includes("publications");
        },
      });

    } catch (err) {
      setError(err.message || "Error al crear la publicación.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué estás pensando?"
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "none",
          }}
          disabled={isSubmitting}
        />
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
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}



