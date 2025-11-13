// src/components/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";





/**
 * Componente que muestra el perfil del usuario.
 * Muestra el nombre del usuario, correo electrónico y descripción.
 * Si el usuario no tiene un nombre de usuario, sale inmediatamente.
 * Si hay un error al cargar el perfil, se muestra el mensaje de error.
 * Si se carga con éxito, se muestra el perfil.
 * Se utiliza finally para asegurar que se termina de cargar el Perfil aunque haya un error.
 * @param {string} name - nombre del usuario cuyo perfil se quieren mostrar.
 * @returns {JSX.Element} Componente que muestra el perfil del usuario.
 */

export default function UserProfile() {
  const { name } = useParams(); // toma el nombre de la URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {

/**
 * Carga el perfil del usuario actual.
 * Si el usuario no tiene un nombre de usuario, sale inmediatamente.
 * Si hay un error al cargar el Perfil, se muestra el mensaje de error.
 * Si se carga con éxito, se muestra el Perfil.
 * Se utiliza finally para asegurar que se termina de cargar el Perfil aunque haya un error.
**/
    async function loadProfile() {
      try {
        const data = await apiFetch(`/users/public/${name}`);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [name]);




  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.message}</p>;
  if (!profile) return <p>No se encontró el perfil del usuario.</p>;




  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>{profile.username}</h2>
      <p>{profile.email}</p>
      <p>{profile.description || "Sin descripción disponible"}</p>
    </div>
  );
}
