// src/pages/ProfilePage.jsx
import Header from "../components/Header";
import ProfilePublication from "../components/ProfilePublication";
import UserProfile from "../components/UserProfile";



/**
 * Componente que renderiza la página de perfil de un usuario.
 * Muestra el Header de la aplicación, el perfil del usuario y las publicaciones del usuario.
 * @returns {JSX.Element} Componente que contiene la página de perfil del usuario.
 * @example
 * <ProfilePage />
 */

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <UserProfile />
        <ProfilePublication />
      </main>
    </>
  );
}
