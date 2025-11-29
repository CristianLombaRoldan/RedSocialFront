// src/components/UserListModal.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../social.css";

/**
 * Modal reutilizable para mostrar una lista de usuarios.
 * Redirige a /me si el usuario listado es el logueado.
 *
 * @param {object} props
 * @param {string} props.title - Titulo del modal (ej: "Seguidores")
 * @param {{ username: string }[]} props.users - Lista de usuarios a mostrar.
 * @param {Function} props.onClose - Funcion para cerrar el modal.
 * @returns {JSX.Element}
 */
export default function UserListModal({ title, users, onClose }) {
  const { user: loggedInUser } = useAuth();

  /**
   * Evita que el clic dentro del modal cierre el dialogo.
   * @param {React.MouseEvent} e
   */
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Fondo que cubre la pantalla
    <div className="modal-backdrop" onClick={onClose}>
      {/* Contenedor del modal */}
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {users.length > 0 ? (
            <ul className="user-list">
              {users.map((user) => {
                const isMe = user.username === loggedInUser?.username;
                const profileLink = isMe ? "/me" : `/profile/${user.username}`;

                return (
                  <li key={user.username} className="user-list-item">
                    <Link to={profileLink} onClick={onClose}>
                      {user.username}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No hay usuarios para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
