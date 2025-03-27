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
  const [loading, setLoading] = useState(true);
  
  const openModal = (email) => {
    setModalData({ email, duration: "" }); // Captura el correo del usuario
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({ email: null, duration: "" }); // Reinicia los datos del modal
  };

  // Cargar datos si el usuario es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"; // Redirige manualmente
    } else {
      setLoading(false); // Solo permite mostrar la página si es admin
    }
    if (isAuthenticated && user?.role === "admin") {
      const fetchData = async () => {
        try {
          // 1. Usuarios recientes
          const recentUsersResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`,
            {
              method: "GET",
              credentials: "include", // Enviar la cookie
            }
          );
          const recentUsersData = await recentUsersResponse.json();
          setRecentUsers(recentUsersData);

          // 2. Usuarios bloqueados
          await fetchBlockedUsers();

          // 3. Intentos fallidos
          const failedAttemptsResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/failed-login-attempts`,
            {
              method: "GET",
              credentials: "include", // Enviar la cookie
            }
          );
          const failedAttemptsData = await failedAttemptsResponse.json();
          setFailedAttempts(failedAttemptsData);

          // 4. Inicios de sesión recientes
          await fetchRecentLogins();
        } catch (error) {
          console.error("Error al obtener datos del backend:", error);
        }
      };

      // Ejecutar la función la primera vez y luego cada X tiempo (aquí cada 30s)
      fetchData();
      const intervalId = setInterval(fetchData, 30_000);

      // Limpiar el intervalo al desmontar
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, user]);


  // Bloqueo temporal de usuario
  const blockUserTemporarily = async ({ email, duration }) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user-temporarily`,
        {
          method: "POST",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, lockDuration: duration }),
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
  

  // Bloqueo permanente de usuario
  const blockUser = async (userId) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user`,
        {
          method: "POST",
          credentials: "include", // Cookie
          headers: {
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

  // Obtener usuarios bloqueados
  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`,
        {
          method: "GET",
          credentials: "include", // Cookie
        }
      );
      const data = await response.json();
      setBlockedUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios bloqueados:", error);
    }
  };

  // Obtener inicios de sesión recientes
  const fetchRecentLogins = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-logins`,
        {
          method: "GET",
          credentials: "include", // Cookie
        }
      );
      const data = await response.json();
      setRecentLogins(data);
    } catch (error) {
      console.error("Error al obtener los inicios de sesión recientes:", error);
    }
  };
  // Desbloquear usuario
  const unblockUser = async (userId) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/unblock-user`,
        {
          method: "POST",
          credentials: "include", // Cookie
          headers: {
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
  <div className="container mx-auto py-12 pt-32 px-6">
    <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
      Dashboard Admin
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Usuarios Recientes */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Usuarios Recientes
        </h2>
        {recentUsers.length > 0 ? (
          recentUsers.map((user) => (
            <div key={user.id} className="bg-green-100 rounded-lg p-4 mb-4 shadow-md">
              <p className="text-gray-700"><strong>Nombre:</strong> {user.name}</p>
              <p className="text-gray-700"><strong>Correo:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Fecha de Creación:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay usuarios recientes</p>
        )}
      </div>

      {/* Usuarios Bloqueados */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Usuarios Bloqueados Recientemente
        </h2>
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <div key={user.id} className={`rounded-lg p-4 mb-4 shadow-md ${user.currentlyBlocked ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <p className="text-gray-700"><strong>Nombre:</strong> {user.name}</p>
              <p className="text-gray-700"><strong>Correo:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Tipo de Bloqueo:</strong> {user.blockedType}</p>
              {user.blockedType === "Temporary" && (
                <p className="text-gray-700"><strong>Bloqueado Hasta:</strong> {new Date(user.lockedUntil).toLocaleString()}</p>
              )}
              {user.currentlyBlocked && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={() => unblockUser(user.id)}>
                  Desbloquear
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay usuarios bloqueados</p>
        )}
      </div>

      {/* Intentos Fallidos */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Recientes Intentos Fallidos
        </h2>
        {failedAttempts.length > 0 ? (
          failedAttempts.map((user) => (
            <div key={user.id} className="bg-yellow-100 rounded-lg p-4 mb-4 shadow-md">
              <p className="text-gray-700"><strong>Nombre:</strong> {user.name}</p>
              <p className="text-gray-700"><strong>Correo:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Intentos Fallidos:</strong> {user.failedLoginAttempts}</p>
              <button className="bg-red-500 text-white px-4 py-2 rounded mt-2" onClick={() => blockUser(user.id)}>
                Bloquear
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay intentos fallidos recientes</p>
        )}
      </div>
    </div>
  </div>
);
}
export default AdminDashboard;
