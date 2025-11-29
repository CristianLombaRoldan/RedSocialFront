// src/components/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import UserListModal from "./UserListModal";
import "../social.css";
import { useAuth } from "../hooks/useAuth";

/**
 * Pagina de perfil de un usuario publico.
 *
 * Carga datos del usuario visitado, contadores y listas de seguidores/seguidos,
 * detecta si el usuario logueado ya lo sigue y permite seguir/dejar de seguir.
 *
 * @returns {JSX.Element} Componente de perfil de usuario.
 */
export default function UserProfile() {
  const { user: loggedInUser } = useAuth();
  const { name } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [listToShow, setListToShow] = useState(null);

  /**
   * Carga la informacion del perfil y estado de seguimiento.
   * Se dispara cuando cambia el usuario visitado.
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

        setProfile(profileData);
        setFollowersList(followersData);
        setFollowingList(followingData);
        setFollowersCount(followersData.length);
        setFollowingCount(followingData.length);

        // Comprueba si el usuario logueado esta entre los seguidores.
        setIsFollowing(followersData.some((u) => u.username === loggedInUser?.username));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [name]);

  if (loading) return <p className="loading-text">Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p>No se encontro el perfil del usuario.</p>;

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
      setFollowersCount((prev) => prev + 1);
      setFollowersList((prev) => [...prev, { username: loggedInUser.username }]);
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
      setFollowersCount((prev) => (prev > 0 ? prev - 1 : 0));
      setFollowersList((prev) =>
        prev.filter((u) => u.username !== loggedInUser.username),
      );
    } catch (err) {
      console.error("Error al dejar de seguir:", err);
    }
  }

  return (
    <>
      {/* Contenedor del perfil */}
      <div className="profile-container">
        <h2 className="profile-username">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-description">
          {profile.description || "Sin descripcion disponible"}
        </p>

        {/* Boton Seguir/Dejar de seguir (solo si no es mi propio perfil) */}
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

      {/* Modal de listas */}
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
