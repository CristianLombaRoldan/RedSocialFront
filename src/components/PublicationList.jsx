import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import GetPublication from "./GetPublication";
import { gsap } from "gsap";

/**
 * Lista de publicaciones con scroll infinito tipo Instagram.
 * Limpia la cache al desmontar para que al volver no muestre datos antiguos.
 *
 * @returns {JSX.Element}
 */
export default function PublicationList() {
  const loadMoreRef = useRef(null);
  const queryClient = useQueryClient();

  // Limpia la cache al salir de la pagina
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["publications"] });
    };
  }, [queryClient]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["publications"],
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: false,
    gcTime: 0,

  /**
   * Función que se encarga de fetchear las publicaciones de la API.
   * Recibe un objeto con una propiedad "pageParam" que indica la página actual.
   * Devuelve una promesa que se resuelve con el resultado de la petición a la API.
   * La petición se hace a "/publications/" con los parámetros "page" y "size" igual a 5 y "sort" igual a "createDate,desc".
   * @param {{ pageParam: number }} params - Objeto con la página actual.
   * @returns {Promise<any>} Promesa que se resuelve con el resultado de la petición a la API.
   */

    queryFn: async ({ pageParam = 0 }) => {
      return apiFetch(
        `/publications/?page=${pageParam}&size=5&sort=createDate,desc`
      );
    },

/**
 * Función que devuelve el parámetro para la página siguiente en función de
 * la página actual.
 * Si la página actual es la última, devuelve undefined.
 * De lo contrario, devuelve el número de la página actual más uno.
 * @param {{ last: boolean, number: number }} lastPage - Objeto con la información de la página actual.
 * @returns {number | undefined} Número de la página siguiente o undefined si es la última página.
 */
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
  });

  useEffect(() => {
    if (!loadMoreRef.current || !data) return;

    const trigger = gsap.to(loadMoreRef.current, {
      scrollTrigger: {
        trigger: loadMoreRef.current,
        start: "top 90%",

  /**
   * Función que se ejecuta cuando el usuario hace scroll y se alcanza
   * el final de la lista de publicaciones.
   * Si hay una página siguiente y no se está cargando la página actual,
   * se llama a fetchNextPage() para cargar la página siguiente.
   */

        onEnter: () => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
      },
    });

    return () => trigger.scrollTrigger?.kill();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error")
    return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Publicaciones</h2>

      {data?.pages?.map((page, i) => (
        <div key={i}>
          {page.content
            .slice()
            .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
            .map((pub) => (
              <GetPublication
                key={pub.id}
                id={pub.id}
                authorName={pub.username}
                text={pub.text}
                createDate={pub.createDate}
              />
            ))}
        </div>
      ))}

      {isFetchingNextPage && <p>Cargando mas publicaciones...</p>}

      <div
        ref={loadMoreRef}
        style={{ height: "50px", background: "transparent" }}
      />
    </div>
  );
}
