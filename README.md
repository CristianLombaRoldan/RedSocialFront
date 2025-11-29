# 🌐 Círculo — Red social React (DAW) | Cristian Lomba Roldán

## Índice
- [Introducción](#introducción)
- [Funcionalidades y tecnologías](#funcionalidades-y-tecnologías)
- [Guía de instalación](#guía-de-instalación)
- [Guía de uso](#guía-de-uso)
- [Conclusión](#conclusión)
- [Contribuciones, agradecimientos y referencias](#contribuciones-agradecimientos-y-referencias)
- [Licencias](#licencias)
- [Contacto](#contacto)

## Introducción
Círculo es una aplicación web de red social desarrollada en React que permite a los usuarios autenticarse, publicar contenido y conectar mediante seguidores/seguidos.
Nace como proyecto del ciclo DAW para practicar un stack moderno (Vite, React Router, React Query) y la integración con una API REST.
Objetivos: ofrecer un flujo de autenticación sencillo, compartir publicaciones en tiempo real y gestionar la identidad (username y perfil).
Motivación: crear un entorno seguro y minimalista donde probar patrones de frontend con React 19 y estado basado en queries.

## Funcionalidades y tecnologías
- Autenticación con login/registro, protección de rutas privadas y persistencia de sesión (token en localStorage).
- Feed de publicaciones: listado global y creación de nuevas publicaciones desde el panel principal.
- Perfiles: perfil propio con cambio de nombre de usuario, perfiles públicos por nombre y manejo de listas de seguidores/seguidos con modales.
- Navegación SPA con react-router-dom y gestión de datos remotos con @tanstack/react-query.
- Formularios accesibles y validados con react-hook-form.
- Animaciones y microinteracciones con gsap.
- Construido con Vite + React 19; estilos en App.css/social.css.

## Guía de instalación
1. Requisitos: Node.js 18+ y npm.
2. Clona el repositorio y entra en la carpeta del proyecto.
3. Instala dependencias: npm install.
4. Arranca en desarrollo: npm run dev y abre la URL que muestra Vite (por defecto http://localhost:5173).

## Guía de uso
- Accede a la portada y realiza login o registro.
- Crea nuevas publicaciones desde la sección principal; se verán en el feed.
- Consulta perfiles públicos con /profile/:name y tu propio perfil en /me.
- Gestiona seguidores/seguidos desde tu perfil y abre las listas en los modales.
- Cambia tu nombre de usuario desde el perfil; la app cerrará sesión para volver a iniciar con el nuevo username.

## Conclusión
Círculo demuestra un flujo completo de red social ligera con React 19, centrado en autenticación, publicaciones y gestión de identidad, sirviendo como base para iterar nuevas características.

## Contribuciones, agradecimientos y referencias
- Aportaciones: abre un issue o pull request con una descripción clara del cambio propuesto.
- Agradecimientos: al profesorado de DAW y a quienes probaron las primeras versiones.
- Referencias: documentación de React, React Router, React Query y Vite.

## Licencias
Proyecto bajo licencia MIT (ver LICENSE para detalles).

## Contacto
Cristian Lomba Roldán — correo de contacto: cristianlmb@gmail.com
