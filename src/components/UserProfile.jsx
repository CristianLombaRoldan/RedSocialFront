import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import UserListModal from "./UserListModal";
import "../social.css";
import { useAuth } from "../context/useAuth";

/**
 * Página de perfil de un usuario (público).
 *
 * Funciones principales:
 * - Cargar datos del usuario visitado.
 * - Mostrar contadores de seguidores y seguidos.
 * - Mostrar modales con listados completos.
 * - Detectar si el usuario logueado sigue al usuario visitado.
 * - Permitir seguir / dejar de seguir.
 *
 * @returns {JSX.Element} Componente de perfil del usuario.
 */
export default function UserProfile() {
  // Usuario logueado (para saber si sigo a otro usuario)
  const { user: loggedInUser } = useAuth();

  // Nombre del usuario visitado (parámetro dinámico de la URL)
  const { name } = useParams();

  // Estado general del perfil
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contadores
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Estado que indica si YA sigo a este usuario
  const [isFollowing, setIsFollowing] = useState(false);

  // Listas completas (para desplegar modal)
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  // Controla si mostrar modal y cuál lista mostrar
  const [listToShow, setListToShow] = useState(null);

  /**
   * Carga toda la información del perfil y del seguimiento.
   * Se ejecuta cuando cambia el usuario visitado (name).
   */
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        // Peticiones paralelas
        const profilePromise = apiFetch(`/users/public/${name}`);
        const followersPromise = apiFetch(`/users/public/followers/${name}`);
        const followingPromise = apiFetch(`/users/public/following/${name}`);

        const [profileData, followersData, followingData] = await Promise.all([
          profilePromise,
          followersPromise,
          followingPromise,
        ]);

        // Datos principales del perfil
        setProfile(profileData);

        // Guardamos las listas completas
        setFollowersList(followersData);
        setFollowingList(followingData);

        // Actualizamos contadores visibles
        setFollowersCount(followersData.length);
        setFollowingCount(followingData.length);

        // Determina si yo sigo a este usuario:
        // "isFollowing" es true si MI username aparece en los seguidores del perfil visitado
        setIsFollowing(followersData.some(u => u.username === loggedInUser?.username));

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [name]);

  // Mostrar estados especiales
  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;

  // Determina qué lista envía al modal
  const listData = listToShow === "followers" ? followersList : followingList;
  const listTitle = listToShow === "followers" ? "Seguidores" : "Siguiendo";

  /**
   * Seguir a este usuario.
   * Llama al endpoint POST /follow/{username}
   */
  async function handleFollow() {
  try {
    await apiFetch(`/users/follow/${name}`, { method: "POST" });

    setIsFollowing(true);
    setFollowersCount(prev => prev + 1);

    //  AÑADIR EL USUARIO LOGUEADO A LA LISTA DE SEGUIDORES
    setFollowersList(prev => [
      ...prev,
      { username: loggedInUser.username }
    ]);

  } catch (err) {
    console.error("Error al seguir:", err);
  }
}

  /**
   * Dejar de seguir al usuario visitado.
   * Llama al endpoint DELETE /unfollow/{username}
   */
  async function handleUnfollow() {
  try {
    await apiFetch(`/users/unfollow/${name}`, { method: "DELETE" });

    setIsFollowing(false);
    setFollowersCount(prev => (prev > 0 ? prev - 1 : 0));

    //  QUITAR EL USUARIO LOGUEADO DE LA LISTA
    setFollowersList(prev =>
      prev.filter(u => u.username !== loggedInUser.username)
    );

  } catch (err) {
    console.error("Error al dejar de seguir:", err);
  }
}

  return (
    <>
      {/* CONTENEDOR DEL PERFIL */}
      <div className="profile-container">
        <h2 className="profile-username">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-description">
          {profile.description || "Sin descripción disponible"}
        </p>

        {/* Botón Seguir/Dejar de seguir — solo si no es mi propio perfil */}
        {loggedInUser?.username !== name && (
          <button
            className={isFollowing ? "follow-btn unfollow" : "follow-btn"}
            onClick={isFollowing ? handleUnfollow : handleFollow}
          >
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}

        {/* Contadores clicables */}
        <div className="profile-stats-container">
          <div
            className="profile-stat profile-stat-clickable"
            onClick={() => setListToShow("followers")}
          >
            <strong className="profile-stat-count">{followersCount}</strong>
            <span className="profile-stat-label">Seguidores</span>
          </div>

          <div
            className="profile-stat profile-stat-clickable"
            onClick={() => setListToShow("following")}
          >
            <strong className="profile-stat-count">{followingCount}</strong>
            <span className="profile-stat-label">Siguiendo</span>
          </div>
        </div>
      </div>

      {/* MODAL DE LISTAS */}
      {listToShow && (
        <UserListModal
          title={listTitle}
          users={listData}
          onClose={() => setListToShow(null)}
        />
      )}
    </>
  );
}
