import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ProfilePublications from "../components/ProfilePublications";
import UserProfile from "../components/UserProfile";

export default function ProfilePage() {
  const { name } = useParams();

  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Perfil de {name}</h3>
        <UserProfile/>
        <h4>Publicaciones</h4>
        <ProfilePublications />
      </main>
    </>
  );
}


