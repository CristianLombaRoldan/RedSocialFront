// src/pages/HomePage.jsx
import Header from "../components/Header";
import PublicationFollowing from "../components/PublicationFollowing";




/**
 * Página principal de la aplicación.
 * Muestra un título y un componente PublicationFollowing que lista las publicaciones de los usuarios que seguimos.
 * @returns {JSX.Element} Componente que muestra la página principal de la aplicación.
**/
export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Publicaciones de tus seguidos</h3>
        <PublicationFollowing />
      </main>
    </>
  );
}
