// src/pages/MyProfilePage.jsx
import Header from "../components/Header";
import { useAuth } from "../context/useAuth";
import MyPublications from "../components/MyPublications";
import MyUserProfile from "../components/MyUserProfile";

export default function MyProfilePage() {
  const { user } = useAuth();

  // Si aún no se ha cargado el user del contexto
  if (!user) return <p>Cargando tu perfil...</p>;

  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Tu perfil (@{user.username})</h3>

        
        <MyUserProfile/>

        <h4>Tus publicaciones</h4>
        <MyPublications/>
      </main>
    </>
  );
}
