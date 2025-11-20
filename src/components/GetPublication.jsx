import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../api/client";



/**
 * Componente que renderiza una publicación.
 * Incluye el nombre del autor, texto y fecha de creación.
 * Si el usuario actual es el autor, se muestra un botón para borrar la publicación.
 * Al hacer click en el botón, se muestra un diálogo para confirmar la eliminación.
 * Si se confirma, se borra la publicación y se invalida el listado de publicaciones para refrescarlo.
 * @param {number} id - Identificador único de la publicación.
 * @param {string} authorName - Nombre del autor de la publicación.
 * @param {string} text - Texto de la publicación.
 * @param {Date} createDate - Fecha de creación de la publicación.
 * @returns {React.ReactElement} Componente que renderiza la publicación.
 */

export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const deleteMutation = useMutation({

/**
 * Función que se encarga de eliminar una publicación.
 * Realiza una petición DELETE a la API con el identificador de la publicación.
 * Si la eliminación es exitosa, se invalida el listado de publicaciones para refrescarlo.
 */

    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },

/**
 * Función que se llama cuando se elimina con éxito una publicación.
 * Invalida el listado de publicaciones para refrescarlo.
**/
    onSuccess: () => {
      // Invalida el listado de publicaciones para refrescarlo
     queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0]?.includes("/publications"),
      });
    },

/**
 * Función que se llama cuando se produce un error al intentar borrar una publicación.
 * Muestra un alert con el mensaje de error.
 * @param {Error} error - Error producido al intentar borrar la publicación.
 */

    onError: (error) => {
      alert(`Error al borrar publicación: ${error.message}`);
    },
  });

  // 🔥 Handler para el click
  const handleDelete = () => {
    if (window.confirm("¿Seguro que quieres borrar esta publicación?")) {
      deleteMutation.mutate();
    }
  };

  const handleAuthorClick = () => {
    // Comprueba si el autor de la publicación es el usuario logueado
    if (user?.username === authorName) {
      navigate("/me"); // Si es, navega a /me
    } else {
      navigate(`/profile/${authorName}`); // Si no, navega al perfil público
  }
};


  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "10px",
        backgroundColor: "#fafafa",
      }}
    >
      <p>
        <strong
          style={{ cursor: "pointer", color: "blue" }}
          onClick={handleAuthorClick}
        >
          {authorName}
        </strong>{" "}
        — {new Date(createDate).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      </p>

      <p>{text}</p>

      {/* Solo el autor puede borrar */}
      {user?.username === authorName && (
        <button
          style={{
            color: "white",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicación"}
        </button>
      )}
    </div>
  );
}
