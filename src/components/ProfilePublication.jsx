import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import { apiFetch } from "../api/client";
import GetPublication from "./GetPublication";

/**
 * Lista con scroll infinito de publicaciones de un perfil.
 * Usa React Query + GSAP ScrollTrigger y limpia cache al cambiar/abandonar la pagina.
 *
 * @returns {JSX.Element}
 */
export default function ProfilePublication() {
  const { name } = useParams();
  const queryClient = useQueryClient();
  const loadMoreRef = useRef(null);
  const listRef = useRef(null);

  // Limpia cache al entrar y al salir del perfil
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["profile-publications", name] });
    return () => {
      queryClient.removeQueries({ queryKey: ["profile-publications", name] });
    };
  }, [name, queryClient]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["profile-publications", name],
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: false,
    gcTime: 0,
    queryFn: async ({ pageParam = 0 }) =>
      apiFetch(
        `/publications/public/${name}?page=${pageParam}&size=5&sort=createDate,desc`
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

  useEffect(() => {
    const container = listRef.current;
    if (!container || !data) return;

    const cards = container.querySelectorAll(".publication");
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 20 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.08,
    });
  }, [data]);

  if (status === "loading") return <p>Cargando publicaciones...</p>;
  if (status === "error")
    return <p style={{ color: "red" }}>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }} ref={listRef}>
      <h2>Publicaciones</h2>

      {data?.pages?.map((page, idx) => (
        <div key={idx}>
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
