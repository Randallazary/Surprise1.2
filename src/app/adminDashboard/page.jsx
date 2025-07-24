"use client"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import {
  FiUsers,
  FiShield,
  FiAlertTriangle,
  FiClock,
  FiUserX,
  FiUserCheck,
  FiSettings,
  FiActivity,
  FiLock,
  FiUnlock,
} from "react-icons/fi"

function AdminDashboard() {
  const { user, isAuthenticated, theme } = useAuth()
  const [recentUsers, setRecentUsers] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [failedAttempts, setFailedAttempts] = useState([])
  const [recentLogins, setRecentLogins] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState({ email: "", duration: "" })
  const [loading, setLoading] = useState(true)

  const openModal = (email) => {
    setModalData({ email, duration: "" })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalData({ email: null, duration: "" })
  }

  // Cargar datos si el usuario es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"
    } else {
      setLoading(false)
    }
    if (isAuthenticated && user?.role === "admin") {
      const fetchData = async () => {
        try {
          // 1. Usuarios recientes
          const recentUsersResponse = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`, {
            method: "GET",
            credentials: "include",
          })
          const recentUsersData = await recentUsersResponse.json()
          setRecentUsers(recentUsersData)

          // 2. Usuarios bloqueados
          await fetchBlockedUsers()

          // 3. Intentos fallidos
          const failedAttemptsResponse = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/failed-login-attempts`, {
            method: "GET",
            credentials: "include",
          })
          const failedAttemptsData = await failedAttemptsResponse.json()
          setFailedAttempts(failedAttemptsData)

          // 4. Inicios de sesión recientes
          await fetchRecentLogins()
        } catch (error) {
          console.error("Error al obtener datos del backend:", error)
        }
      }

      fetchData()
      const intervalId = setInterval(fetchData, 30_000)
      return () => clearInterval(intervalId)
    }
  }, [isAuthenticated, user])

  // Bloqueo temporal de usuario
  const blockUserTemporarily = async ({ email, duration }) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/block-user-temporarily`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, lockDuration: duration }),
      })
      if (response.ok) {
        console.log("Usuario bloqueado temporalmente")
        closeModal()
      } else {
        const data = await response.json()
        console.error("Error al bloquear temporalmente:", data.message)
      }
    } catch (error) {
      console.error("Error al bloquear temporalmente:", error)
    }
  }

  // Bloqueo permanente de usuario
  const blockUser = async (userId) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/block-user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        console.log("Usuario bloqueado exitosamente")
      } else {
        const data = await response.json()
        console.error("Error al bloquear usuario:", data.message)
      }
    } catch (error) {
      console.error("Error al bloquear usuario:", error)
    }
  }

  // Obtener usuarios bloqueados
  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`, {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      setBlockedUsers(data)
    } catch (error) {
      console.error("Error al obtener usuarios bloqueados:", error)
    }
  }

  // Obtener inicios de sesión recientes
  const fetchRecentLogins = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-logins`, {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      setRecentLogins(data)
    } catch (error) {
      console.error("Error al obtener los inicios de sesión recientes:", error)
    }
  }

  // Desbloquear usuario
  const unblockUser = async (userId) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/unblock-user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        console.log("Usuario desbloqueado exitosamente")
        fetchBlockedUsers()
      } else {
        const data = await response.json()
        console.error("Error al desbloquear usuario:", data.message)
      }
    } catch (error) {
      console.error("Error al desbloquear usuario:", error)
    }
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className={`mt-4 text-lg ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Cargando dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen py-8 pt-36 ${theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"}`}>
      <div className="container mx-auto px-4">
        {/* Header Elegante */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center px-6 py-3 rounded-full mb-6 ${
              theme === "dark"
                ? "bg-indigo-900/50 text-pink-400 border border-pink-400/30"
                : "bg-purple-50 text-purple-600 border border-purple-200"
            }`}
          >
            <FiSettings className="mr-2" />
            <span className="font-medium">Panel de Administración</span>
          </div>

          <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Dashboard{" "}
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Admin
            </span>
          </h1>

          <p className={`text-xl max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Monitorea y gestiona la actividad de usuarios en tiempo real
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Usuarios Recientes */}
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden ${
              theme === "dark"
                ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                : "bg-white shadow-xl border border-indigo-100"
            }`}
          >
            {/* Header de la tarjeta */}
            <div
              className={`p-6 border-b ${
                theme === "dark" ? "bg-indigo-900/30 border-indigo-800/50" : "bg-indigo-50 border-indigo-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-xl mr-4 ${
                    theme === "dark" ? "bg-green-600/20 text-green-400" : "bg-green-100 text-green-600"
                  }`}
                >
                  <FiUsers className="w-6 h-6" />
                </div>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  Usuarios Recientes
                </h2>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        theme === "dark" ? "bg-indigo-800/30 hover:bg-indigo-800/50" : "bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            theme === "dark" ? "bg-green-600/20 text-green-400" : "bg-green-100 text-green-600"
                          }`}
                        >
                          <FiUserCheck className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xs ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                        <FiClock className="inline mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiUsers
                    className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <p className={`${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                    No hay usuarios recientes
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Usuarios Bloqueados */}
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden ${
              theme === "dark"
                ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                : "bg-white shadow-xl border border-indigo-100"
            }`}
          >
            {/* Header de la tarjeta */}
            <div
              className={`p-6 border-b ${
                theme === "dark" ? "bg-indigo-900/30 border-indigo-800/50" : "bg-indigo-50 border-indigo-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-xl mr-4 ${
                    theme === "dark" ? "bg-red-600/20 text-red-400" : "bg-red-100 text-red-600"
                  }`}
                >
                  <FiShield className="w-6 h-6" />
                </div>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  Usuarios Bloqueados
                </h2>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {blockedUsers.length > 0 ? (
                <div className="space-y-4">
                  {blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        user.currentlyBlocked
                          ? theme === "dark"
                            ? "bg-red-900/30 hover:bg-red-900/50"
                            : "bg-red-50 hover:bg-red-100"
                          : theme === "dark"
                            ? "bg-yellow-900/30 hover:bg-yellow-900/50"
                            : "bg-yellow-50 hover:bg-yellow-100"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            user.currentlyBlocked
                              ? theme === "dark"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-red-100 text-red-600"
                              : theme === "dark"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          <FiUserX className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className={`text-xs ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                          <strong>Tipo:</strong> {user.blockedType}
                        </p>
                        {user.blockedType === "Temporary" && (
                          <p className={`text-xs ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                            <strong>Hasta:</strong> {new Date(user.lockedUntil).toLocaleString()}
                          </p>
                        )}
                        {user.currentlyBlocked && (
                          <button
                            className={`w-full mt-3 py-2 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                              theme === "dark"
                                ? "bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30"
                                : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                            }`}
                            onClick={() => unblockUser(user.id)}
                          >
                            <FiUnlock className="mr-2 w-4 h-4" />
                            Desbloquear
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiShield
                    className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <p className={`${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                    No hay usuarios bloqueados
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Intentos Fallidos */}
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden ${
              theme === "dark"
                ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                : "bg-white shadow-xl border border-indigo-100"
            }`}
          >
            {/* Header de la tarjeta */}
            <div
              className={`p-6 border-b ${
                theme === "dark" ? "bg-indigo-900/30 border-indigo-800/50" : "bg-indigo-50 border-indigo-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-xl mr-4 ${
                    theme === "dark" ? "bg-yellow-600/20 text-yellow-400" : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <FiAlertTriangle className="w-6 h-6" />
                </div>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  Intentos Fallidos
                </h2>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {failedAttempts.length > 0 ? (
                <div className="space-y-4">
                  {failedAttempts.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        theme === "dark"
                          ? "bg-yellow-900/30 hover:bg-yellow-900/50"
                          : "bg-yellow-50 hover:bg-yellow-100"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            theme === "dark" ? "bg-yellow-600/20 text-yellow-400" : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          <FiAlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                          <strong>Intentos:</strong> {user.failedLoginAttempts}
                        </p>
                        <button
                          className={`py-2 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                            theme === "dark"
                              ? "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30"
                              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          }`}
                          onClick={() => blockUser(user.id)}
                        >
                          <FiLock className="mr-2 w-4 h-4" />
                          Bloquear
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiActivity
                    className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <p className={`${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                    No hay intentos fallidos recientes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal para bloqueo temporal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className={`rounded-3xl shadow-2xl overflow-hidden max-w-md w-full mx-4 ${
                theme === "dark"
                  ? "bg-indigo-900/90 backdrop-blur-sm border border-indigo-800/50"
                  : "bg-white shadow-xl border border-indigo-100"
              }`}
            >
              <div
                className={`p-6 border-b ${
                  theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  Bloqueo Temporal
                </h3>
              </div>
              <div className="p-6">
                <p className={`mb-4 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                  Usuario: <strong>{modalData.email}</strong>
                </p>
                <input
                  type="number"
                  placeholder="Duración en minutos"
                  value={modalData.duration}
                  onChange={(e) => setModalData({ ...modalData, duration: e.target.value })}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 mb-4 ${
                    theme === "dark"
                      ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                      : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => blockUserTemporarily(modalData)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg"
                        : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg"
                    }`}
                  >
                    Bloquear
                  </button>
                  <button
                    onClick={closeModal}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-indigo-800 text-indigo-300 hover:bg-indigo-700"
                        : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
