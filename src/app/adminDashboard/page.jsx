"use client"; // Asegura que este es un Client Component

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config"; // Importar las configuraciones

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ email: "", duration: "" });
  
  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"; // Redirige manualmente
    }
  }, [isAuthenticated, user]);

  // Función para abrir el modal
  const openModal = (email) => {
    setModalData({ email, duration: "" }); // Captura el correo del usuario
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({ email: null, duration: "" }); // Reinicia los datos del modal
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      // Función para obtener datos del backend
      const fetchData = async () => {
        const token = localStorage.getItem("token");

        try {
          // Usuarios recientes
          const recentUsersResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const recentUsersData = await recentUsersResponse.json();
          setRecentUsers(recentUsersData);

          // Usuarios bloqueados
          await fetchBlockedUsers();

          // Intentos fallidos
          const failedAttemptsResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/failed-login-attempts`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const failedAttemptsData = await failedAttemptsResponse.json();
          setFailedAttempts(failedAttemptsData);
          await fetchRecentLogins();
        } catch (error) {
          console.error("Error al obtener datos del backend:", error);
        }
      };

      // Ejecutar la función por primera vez y luego cada 30 segundos
      fetchData();
      const intervalId = setInterval(fetchData, 1000); // 30 segundos

      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, user]);

  // Función para manejar el envío de datos del modal
  const blockUserTemporarily = async ({ email, duration }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user-temporarily`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, lockDuration: duration }), // Enviar email y duración
        }
      );
  
      if (response.ok) {
        console.log("Usuario bloqueado temporalmente");
        closeModal();
      } else {
        const data = await response.json();
        console.error("Error al bloquear temporalmente:", data.message);
      }
    } catch (error) {
      console.error("Error al bloquear temporalmente:", error);
    }
  };
  

  const blockUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        console.log("Usuario bloqueado exitosamente");
      } else {
        const data = await response.json();
        console.error("Error al bloquear usuario:", data.message);
      }
    } catch (error) {
      console.error("Error al bloquear usuario:", error);
    }
  };

  const fetchBlockedUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setBlockedUsers(data); // Actualiza el estado de usuarios bloqueados
    } catch (error) {
      console.error("Error al obtener usuarios bloqueados:", error);
    }
  };

  const fetchRecentLogins = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-logins`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setRecentLogins(data); // Actualiza el estado con los inicios de sesión recientes
    } catch (error) {
      console.error("Error al obtener los inicios de sesión recientes:", error);
    }
  };

  const unblockUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/unblock-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        console.log("Usuario desbloqueado exitosamente");
        fetchBlockedUsers(); // Actualizar la lista de usuarios bloqueados
      } else {
        const data = await response.json();
        console.error("Error al desbloquear usuario:", data.message);
      }
    } catch (error) {
      console.error("Error al desbloquear usuario:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 ">
      <h1 className="text-4xl font-extrabold text-center mb-10 underline decoration-wavy decoration-purple-500">
        Panel de Administrador
      </h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Usuarios Recientes */}
        <div className="bg-purple-100 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            Usuarios Recientes
          </h2>
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div
                key={user._id}
                className="bg-purple-200 rounded-lg p-4 mb-4 shadow-md"
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Fecha de Creación:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay usuarios recientes</p>
          )}
        </div>
  
        {/* Usuarios Bloqueados */}
        <div className="bg-red-100 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Usuarios Bloqueados
          </h2>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user) => (
              <div
                key={user.id}
                className={`rounded-lg p-4 mb-4 shadow-md ${
                  user.currentlyBlocked ? "bg-red-200" : "bg-yellow-200"
                }`}
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Tipo de Bloqueo:</strong> {user.blockedType}
                </p>
                {user.blockedType === "Temporary" && (
                  <p>
                    <strong>Bloqueado Hasta:</strong>{" "}
                    {new Date(user.lockedUntil).toLocaleString()}
                  </p>
                )}
                <p>
                  <strong>Actualmente Bloqueado:</strong>{" "}
                  {user.currentlyBlocked ? "Sí" : "No"}
                </p>
                {user.currentlyBlocked && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition"
                    onClick={() => unblockUser(user.id)}
                  >
                    Desbloquear
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay usuarios bloqueados</p>
          )}
        </div>
  
        {/* Intentos Fallidos */}
        <div className="bg-yellow-100 shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">
            Intentos Fallidos
          </h2>
          {failedAttempts.length > 0 ? (
            failedAttempts.map((user) => (
              <div
                key={user.id}
                className="bg-yellow-200 rounded-lg p-4 mb-4 shadow-md"
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Intentos Fallidos:</strong> {user.failedLoginAttempts}
                </p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600 transition"
                  onClick={() => blockUser(user.id)}
                >
                  Bloquear
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay intentos fallidos recientes</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;