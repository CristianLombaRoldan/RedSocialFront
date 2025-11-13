// src/pages/AllPublicationsPage.jsx
import Header from "../components/Header";
import PublicationList from "../components/PublicationList"
import CreatePublication from "../components/CreatePublication";




/**
 * Página que muestra todas las publicaciones y permite crear una nueva.
 * 
 * Incluye un formulario para crear una nueva publicación.
 * Muestra un título y una lista de todas las publicaciones.
 * Cada publicación se muestra con un componente PublicationList.
 * @returns {JSX.Element} Componente que contiene la página de todas las publicaciones.
 */

export default function AllPublicationsPage() {
  return (
    <>
      <Header />
      <CreatePublication />
      <main style={{ padding: 20 }}>
        <h3>Todas las publicaciones</h3>
        <PublicationList />
      </main>
    </>
  );
}
