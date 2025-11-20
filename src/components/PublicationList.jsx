import { usePagination } from "../hooks/usePagination";
import GetPublication from "./GetPublication";



/**
 * Componente que muestra una lista de publicaciones.
 * Utiliza el hook usePagination para obtener las publicaciones.
 * Muestra un título con la página actual y el número total de páginas.
 * Si no hay publicaciones, muestra un mensaje de no hay publicaciones disponibles.
 * Cada publicación se muestra con un componente GetPublication.
 * Al final de la lista de publicaciones, se muestra un botón para ir a la página anterior o siguiente.
 * @returns {JSX.Element} Componente que muestra una lista de publicaciones.
 */

export default function PublicationList() {
  const { items, page, totalPages, isLoading, isError, error, nextPage, prevPage } =
    usePagination("/publications/", 5); // endpoint y tamaño de página


  if (isLoading) return <p>Cargando publicaciones...</p>;
  if (isError) return <p style={{ color: "red" }}>Error: {error.message}</p>;


  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones (página {page + 1} de {totalPages})</h2>


      {items.length === 0 && <p>No hay publicaciones disponibles.</p>}


      {items
      .slice() // hacemos copia del array
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate)) // más reciente primero
      .map((pub) => (
        <GetPublication
          key={pub.id}
          id={pub.id}
          authorName={pub.username}
          text={pub.text}
          createDate={pub.createDate}
        />
        )
       
      )}


      <div style={{ marginTop: "20px" }}>
        <button onClick={prevPage} disabled={page === 0}>
          ← Anterior
        </button>
        <button onClick={nextPage} disabled={page >= totalPages - 1} style={{ marginLeft: "10px" }}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
