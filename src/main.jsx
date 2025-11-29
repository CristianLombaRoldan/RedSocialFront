// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./social.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registro de plugin de scroll para las animaciones.
gsap.registerPlugin(ScrollTrigger);

// Cliente global de React Query para toda la aplicacion.
const queryClient = new QueryClient();

/**
 * Renderiza el componente principal de la app dentro de React.StrictMode.
 * @returns {JSX.Element} Punto de entrada de la aplicacion.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
