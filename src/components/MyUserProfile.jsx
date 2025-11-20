import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";
import "../social.css";
import UserListModal from "./UserListModal";


/**
 * Componente para mostrar el perfil del usuario autenticado.
 * (MODIFICADO) Ahora muestra listas de seguidores/seguidos al hacer clic.
 * @returns {JSX.Element}
 */
export default function MyUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);


  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [listToShow, setListToShow] = useState(null);




  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState("");


  useEffect(() => {
/**
 * Carga el perfil del usuario autenticado, sus seguidores y los usuarios a los que sigue.
 * Actualiza los estados de carga, error y lista de seguidores/seguidos.
 */
    async function loadProfile() {
      if (!user?.username) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);


        const profilePromise = apiFetch(`/users/public/${user.username}`); // Asumo que este es el perfil
        const followersPromise = apiFetch("/users/followers"); // Autenticado
        const followingPromise = apiFetch("/users/following"); // Autenticado


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
       


      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user.username]);




/**
 * Actualiza el nombre de usuario del usuario autenticado.
 * Valida el formulario y verifica que el nuevo nombre de usuario no esté vacío y sea diferente al actual.
 * Si hay un error, se muestra un mensaje de error.
 * Si se actualiza correctamente, se muestra un mensaje de éxito y se redirige al login después de 2 segundos.
 * @param {Event} e - Evento del formulario.
 */
  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setUpdateError("El nombre de usuario no puede estar vacío.");
      return;
    }
    if (newUsername === user.username) {
      setUpdateError("El nuevo nombre de usuario debe ser diferente al actual.");
      return;
    }
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await apiFetch("/users/change", {
        method: "PATCH",
        body: JSON.stringify({ username: newUsername }),
      });
      setRedirectMessage("Nombre de usuario actualizado. Serás redirigido al login...");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        globalThis.location.replace("/login");
      }, 2000);
    } catch (err) {
      setUpdateError(err.message || "Error al actualizar el nombre de usuario.");
      setIsUpdating(false);
    }
  };




  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;


  const listData = listToShow === 'followers' ? followersList : followingList;
  const listTitle = listToShow === 'followers' ? 'Seguidores' : 'Siguiendo';


  return (
    <>
      <div className="profile-container">
        <h2 className="profile-username">{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-description">{profile.description || "Sin descripción disponible"}</p>


        {/* -- Seguidores/seguidos -- */}
        <div className="profile-stats-container">
          <div
            className="profile-stat profile-stat-clickable" // Nueva clase
            onClick={() => setListToShow('followers')} // Acción
            role="button"
            tabIndex="0"
          >
            <strong className="profile-stat-count">{followersCount}</strong>
            <span className="profile-stat-label">Seguidores</span>
          </div>
          <div
            className="profile-stat profile-stat-clickable" // Nueva clase
            onClick={() => setListToShow('following')} // Acción
            role="button"
            tabIndex="0"
          >
            <strong className="profile-stat-count">{followingCount}</strong>
            <span className="profile-stat-label">Siguiendo</span>
          </div>
        </div>
        {/* -- Fin de Seguidores/seguidos -- */}




        <hr className="profile-divider" />


       
        <button onClick={() => setShowForm(!showForm)} className="profile-toggle-form-btn">
          {showForm ? "Cancelar" : "Cambiar nombre de usuario"}
        </button>


        {showForm && (
          <form onSubmit={handleChangeUsername} className="profile-update-form">
            <h3 className="profile-update-title">Cambiar nombre de usuario</h3>
            <div className="form-group">
              <label htmlFor="newUsername" className="form-label">
                Nuevo nombre de usuario:
              </label>
              <input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Introduce tu nuevo username"
                className="form-input"
                disabled={isUpdating}
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="profile-update-submit-btn"
            >
              {isUpdating ? "Actualizando..." : "Actualizar nombre"}
            </button>
            {updateError && (
              <p className="error-text">{updateError}</p>
            )}
            {redirectMessage && (
              <p className="success-text">
                {redirectMessage}
              </p>
            )}
          </form>
        )}
      </div>


     
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
