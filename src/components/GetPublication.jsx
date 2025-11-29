import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "../social.css";

/**
 * Renderiza una publicacion y permite borrarla si pertenece al usuario actual.
 *
 * @param {{ id: number, authorName: string, text: string, createDate: Date }} props
 * @returns {JSX.Element}
 */
export default function GetPublication({ id, authorName, text, createDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Usado para animaciones de scroll infinito
  const pubRef = useRef(null);

  /**
   * Elimina la publicacion borrada de cualquier cache de React Query
   * que contenga "publication" en la queryKey (listas generales, propias, perfiles).
   *
   * @param {unknown} oldData - Estado previo de React Query.
   * @returns {unknown} Datos sin la publicacion borrada.
   */
  const removeFromCaches = (oldData) => {
    if (!oldData || !oldData.pages) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        content: Array.isArray(page.content)
          ? page.content.filter((pub) => pub.id !== id)
          : page.content,
      })),
    };
  };

  /**
   * Refresca todas las queries de publicaciones para evitar refrescar manualmente.
   * Primero actualiza el cache en caliente y luego dispara un refetch.
   */
  const refreshPublicationQueries = () => {
    const predicate = (query) =>
      String(query.queryKey?.[0] || "").includes("publication");

    queryClient.setQueriesData({ predicate }, removeFromCaches);
    queryClient.invalidateQueries({ predicate });
  };

  /** Mutacion que borra la publicacion actual. */
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiFetch(`/publications/${id}`, { method: "DELETE" });
    },
    onSuccess: refreshPublicationQueries,
    onError: (error) => {
      alert(`Error al borrar publicacion: ${error.message}`);
    },
  });

  /** Borra la publicacion tras confirmacion del usuario. */
  const handleDelete = () => {
    if (window.confirm("Seguro que quieres borrar esta publicacion?")) {
      deleteMutation.mutate();
    }
  };

  /** Navega al perfil del autor o al propio perfil. */
  const handleAuthorClick = () => {
    if (user?.username === authorName) {
      navigate("/me");
    } else {
      navigate(`/profile/${authorName}`);
    }
  };

  // Animacion de entrada (fade + translateY) cuando aparece en viewport
  useEffect(() => {
    const el = pubRef.current;
    if (!el) return;
    // Despues de 50ms se activa la animacion para el primer elemento de la lista de publicaciones
    const timer = setTimeout(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    }, 50);
    // Limpia el timer y la animacion al desmontar el componente
    return () => {
      clearTimeout(timer);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={pubRef}
      className="publication"
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
        -
        {" "}
        {new Date(createDate).toLocaleString("es-ES", {
          timeZone: "Europe/Madrid",
        })}
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
          {deleteMutation.isPending ? "Borrando..." : "Borrar publicacion"}
        </button>
      )}
    </div>
  );
}
