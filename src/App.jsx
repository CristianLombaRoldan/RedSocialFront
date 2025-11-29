// src/App.jsx
// Configuracion de rutas principales segun autenticacion.

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./pages/HomePage";
import AllPublicationsPage from "./pages/AllPublicationsPage";
import MyProfilePage from "./pages/MyProfilePage";
import ProfilePage from "./pages/ProfilePage";

/**
 * Router raiz de la aplicacion.
 * Decide rutas publicas o privadas segun autenticacion.
 * @returns {JSX.Element}
 */
export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Si no esta logueado, solo puede ver login/registro */}
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<AuthPage />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* Cualquier otra ruta redirige a login */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Rutas privadas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/all" element={<AllPublicationsPage />} />
            <Route path="/me" element={<MyProfilePage />} />
            <Route path="/profile/:name" element={<ProfilePage />} />
            {/* Cualquier otra ruta redirige a la principal */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

/**
 * Pagina inicial cuando no hay sesion iniciada.
 * Muestra login y registro.
 */
function AuthPage() {
  return (
    <main style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Bienvenid@ a Circulo</h2>
      <LoginForm />
    </main>
  );
}
