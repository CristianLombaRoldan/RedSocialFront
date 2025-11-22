import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

/**
 * Header con logo animado, navegacion y control de sesion.
 * @returns {JSX.Element}
 */
export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <h2 className="logo-anim logo-header" style={{ margin: 0 }}>Circulo</h2>

      <nav style={{ display: "flex", gap: 20 }}>
        <Link to="/">Inicio</Link>
        <Link to="/all">Todas</Link>
        <Link to="/me">Mi perfil</Link>
      </nav>

      <div>
        <span style={{ marginRight: 10 }}>{user?.username ?? "Usuario"}</span>
        <button onClick={logout}>Cerrar sesion</button>
      </div>
    </header>
  );
}
