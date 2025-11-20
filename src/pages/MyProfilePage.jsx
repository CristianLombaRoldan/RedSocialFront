// src/pages/MyProfilePage.jsx
import Header from "../components/Header";
import MyPublication from "../components/MyPublication"
import MyUserProfile from "../components/MyUserProfile";



/**
 * Componente que renderiza la página de perfil del usuario actual.
 * Muestra el header de la aplicación, el perfil del usuario y las publicaciones del usuario.
 * @returns {JSX.Element} Componente que contiene la página de perfil del usuario actual.
 * @example
 * <MyProfilePage />
 */

export default function MyProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <MyUserProfile />
        <MyPublication />
      </main>
    </>
  );
}
