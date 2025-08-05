"use client"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import {
  FiUsers,
  FiUser,
  FiMail,
  FiShield,
  FiEdit,
  FiTrash2,
  FiSettings,
  FiSearch,
  FiFilter,
  FiUserX,
} from "react-icons/fi"

function AdminPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const fetchUsers = async () => {
        setIsLoading(true)
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
          const data = await response.json()
          setUsers(data)
        } catch (error) {
          console.error("Error al obtener usuarios:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchUsers()
    }
  }, [isAuthenticated, user])

  // Función para filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleDelete = async (userId) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId))
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error)
    }
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("")
  }

  // Obtener color del rol
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return theme === "dark"
          ? "bg-purple-600/20 text-purple-400 border-purple-600/30"
          : "bg-purple-100 text-purple-700 border-purple-200"
      case "user":
        return theme === "dark"
          ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
          : "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return theme === "dark"
          ? "bg-gray-600/20 text-gray-400 border-gray-600/30"
          : "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  // Obtener icono del rol
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FiShield className="w-4 h-4" />
      case "user":
        return <FiUser className="w-4 h-4" />
      default:
        return <FiUser className="w-4 h-4" />
    }
  }

  return (
    <div className={`min-h-screen py-8 pt-36 ${theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"}`}>
      <div className="container mx-auto px-4">
        {/* Header Elegante */}
        <div className="text-center mb-12">
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

          <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Gestión de{" "}
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Usuarios
            </span>
          </h1>

          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Administra todos los usuarios registrados en tu plataforma
          </p>
        </div>

        {/* Contenedor Principal */}
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden p-8 max-w-7xl mx-auto ${
            theme === "dark"
              ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
              : "bg-white shadow-xl border border-indigo-100"
          }`}
        >
          <div className="flex items-center mb-8">
            <div
              className={`p-3 rounded-2xl mr-4 ${
                theme === "dark" ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
              <FiUsers className="w-6 h-6" />
            </div>
            <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              Lista de Usuarios
            </h2>
          </div>

          {/* Filtros de búsqueda */}
          <div
            className={`mb-8 p-6 rounded-2xl ${
              theme === "dark"
                ? "bg-indigo-800/50 border border-indigo-700/50"
                : "bg-indigo-50 border border-indigo-200"
            }`}
          >
            <div className="flex items-center mb-4">
              <FiFilter className={`mr-2 ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`} />
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                Filtros de Búsqueda
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda por texto */}
              <div className="md:col-span-2">
                <label
                  className={`block mb-2 text-sm font-medium ${
                    theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  Buscar usuario
                </label>
                <div className="relative">
                  <FiSearch
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                    }`}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-indigo-700 border-indigo-600 text-white placeholder-indigo-400 focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-white border-indigo-300 text-indigo-900 placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                  />
                </div>
              </div>

              {/* Filtro por rol */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${
                    theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  Rol
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`w-full py-3 px-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-indigo-700 border-indigo-600 text-white focus:border-pink-500 focus:ring-pink-500/20"
                      : "bg-white border-indigo-300 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                >
                  <option value="">Todos los roles</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
            </div>

            {/* Botón para limpiar filtros y contador de resultados */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-indigo-200/20">
              <div className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </div>
              <button
                onClick={clearFilters}
                className={`mt-2 sm:mt-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-indigo-700 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                    : "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                }`}
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Lista de usuarios */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className={`mt-4 text-lg ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                Cargando usuarios...
              </p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((userData) => (
                <div
                  key={userData._id}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    theme === "dark"
                      ? "bg-indigo-800/50 border border-indigo-700/50"
                      : "bg-white shadow-md border border-indigo-100"
                  }`}
                >
                  {/* Header de la tarjeta */}
                  <div
                    className={`p-6 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-indigo-800/50 to-purple-800/50"
                        : "bg-gradient-to-r from-indigo-50 to-purple-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-full ${theme === "dark" ? "bg-indigo-700/50" : "bg-white shadow-md"}`}
                      >
                        <FiUser className={`w-6 h-6 ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`} />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleColor(
                          userData.role,
                        )}`}
                      >
                        {getRoleIcon(userData.role)}
                        {userData.role === "admin" ? "Administrador" : "Usuario"}
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                      {userData.name}
                    </h3>

                    <div className="flex items-center">
                      <FiMail className={`mr-2 w-4 h-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`} />
                      <p className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="p-6">
                    <div className="flex gap-3">
                      <button
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                          theme === "dark"
                            ? "bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30"
                            : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                        }`}
                      >
                        <FiEdit className="mr-2 w-4 h-4" />
                        Editar
                      </button>

                      {userData.role !== "admin" && (
                        <button
                          onClick={() => handleDelete(userData._id)}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            theme === "dark"
                              ? "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30"
                              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {userData.role === "admin" && (
                      <p
                        className={`text-xs text-center mt-2 ${
                          theme === "dark" ? "text-indigo-400" : "text-slate-500"
                        }`}
                      >
                        Los administradores no pueden ser eliminados
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-20 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
              <FiUserX className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                {users.length === 0 ? "No hay usuarios registrados" : "No se encontraron usuarios"}
              </h3>
              <p>
                {users.length === 0 ? "Aún no hay usuarios en el sistema" : "Intenta ajustar los filtros de búsqueda"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
