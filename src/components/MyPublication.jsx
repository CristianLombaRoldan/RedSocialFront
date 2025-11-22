// src/components/MyPublication.jsx
import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/useAuth";
import GetPublication from "./GetPublication";

/**
 * Lista de publicaciones propias con scroll infinito.
 * Limpia cache al desmontar para no reutilizar datos al volver.
 */
export default function MyPublication() {
  const { user } = useAuth();
  const loadMoreRef = useRef(null);
  const queryClient = useQueryClient();

  // Limpia cache al salir de la vista de "Mis publicaciones"
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["my-publications", user?.username] });
    };
  }, [queryClient, user?.username]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["my-publications", user?.username],
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: false,
    gcTime: 0,
    queryFn: ({ pageParam = 0 }) =>
      apiFetch(
        `/publications/public/${user.username}?page=${pageParam}&size=5&sort=createDate,desc`
      ),
    getNextPageParam: (lastPage) =>
      lastPage?.last ? undefined : lastPage.number + 1,
  });

  useEffect(() => {
    if (!loadMoreRef.current || !data) return;

    const trigger = gsap.to(loadMoreRef.current, {
      scrollTrigger: {
        trigger: loadMoreRef.current,
        start: "top 90%",
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
      <h2>Mis publicaciones</h2>

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

      <div ref={loadMoreRef} style={{ height: "50px", background: "transparent" }} />
    </div>
  );
}
