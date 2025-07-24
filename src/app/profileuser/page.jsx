"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CONFIGURACIONES } from "../config/config"
import { useAuth } from "../../context/authContext"
import { FiUser, FiMail, FiPhone, FiShield, FiClock, FiEdit, FiSave, FiX, FiCheck, FiAlertCircle } from "react-icons/fi"

function UserProfile() {
  const { theme, toggleTheme } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const router = useRouter()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/profile`, {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        if (response.ok) {
          setUserData(data)
          setFormData({
            name: data.name,
            lastname: data.lastname,
            telefono: data.telefono,
          })
          setError("")
        } else {
          setError(data.message || "Error al obtener el perfil")
        }
      } catch (err) {
        console.error("Error en fetchProfile:", err)
        setError("Error interno del servidor")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setUserData(data)
        setEditMode(false)
      } else {
        setError(data.message || "Error al actualizar el perfil")
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err)
      setError("Error interno del servidor")
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
            Cargando perfil...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"
        }`}
      >
        <div
          className={`p-8 rounded-3xl text-center max-w-md ${
            theme === "dark" ? "bg-indigo-900/50 border border-red-500/30" : "bg-white border border-red-200"
          }`}
        >
          <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Error al cargar perfil
          </h3>
          <p className={`${theme === "dark" ? "text-red-400" : "text-red-600"}`}>{error}</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"
        }`}
      >
        <div className={`p-8 rounded-3xl text-center ${theme === "dark" ? "bg-indigo-900/50" : "bg-white"}`}>
          <FiUser className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className={`text-lg ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            No hay datos de usuario
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen py-8 pt-36 transition-colors duration-300 ${
        theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"
      }`}
    >
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
            <FiUser className="mr-2" />
            <span className="font-medium">Perfil de Usuario</span>
          </div>

          <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Mi{" "}
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Perfil
            </span>
          </h1>

          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Tarjeta Principal */}
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden ${
            theme === "dark"
              ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
              : "bg-white shadow-xl border border-indigo-100"
          }`}
        >
          {/* Header de la tarjeta */}
          <div
            className={`relative p-8 ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            } text-white`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                    theme === "dark" ? "bg-white/20" : "bg-white/30"
                  }`}
                >
                  {userData.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    {userData.name} {userData.lastname}
                  </h2>
                  <p className="flex items-center mt-2 opacity-90">
                    <FiMail className="mr-2" /> {userData.email}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userData.role === "admin" ? "bg-pink-500/30 text-pink-200" : "bg-blue-500/30 text-blue-200"
                      }`}
                    >
                      {userData.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3">
                {/* Botón Editar Perfil */}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center ${
                    editMode
                      ? "bg-red-500/20 text-red-200 hover:bg-red-500/30"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  title={editMode ? "Cancelar edición" : "Editar perfil"}
                >
                  {editMode ? (
                    <>
                      <FiX className="mr-2" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <FiEdit className="mr-2" />
                      Editar Perfil
                    </>
                  )}
                </button>

                {editMode && (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-2xl font-semibold bg-green-500/20 text-green-200 hover:bg-green-500/30 transition-all duration-300 flex items-center"
                    title="Guardar cambios"
                  >
                    <FiSave className="mr-2" />
                    Guardar
                  </button>
                )}
              </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl"></div>
          </div>

          {/* Contenido de la tarjeta */}
          <div className="p-8">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 flex items-center ${
                        theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      <FiUser className="mr-2" /> Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                        theme === "dark"
                          ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                          : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 flex items-center ${
                        theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      <FiUser className="mr-2" /> Apellido
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                        theme === "dark"
                          ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                          : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-semibold mb-3 flex items-center ${
                        theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      <FiPhone className="mr-2" /> Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                        theme === "dark"
                          ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                          : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                      }`}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información Personal */}
                <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-indigo-800/30" : "bg-indigo-50"}`}>
                  <h3
                    className={`text-xl font-bold mb-6 flex items-center ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    <FiUser className="mr-3 text-pink-500" />
                    Información Personal
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-opacity-20">
                      <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Nombre:
                      </span>
                      <span className={`${theme === "dark" ? "text-white" : "text-indigo-900"}`}>{userData.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-opacity-20">
                      <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Apellido:
                      </span>
                      <span className={`${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                        {userData.lastname}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-opacity-20">
                      <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Teléfono:
                      </span>
                      <span className={`${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                        {userData.telefono || "No especificado"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Fecha Nacimiento:
                      </span>
                      <span className={`${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                        {new Date(userData.fechadenacimiento).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seguridad */}
                <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-indigo-800/30" : "bg-indigo-50"}`}>
                  <h3
                    className={`text-xl font-bold mb-6 flex items-center ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    <FiShield className="mr-3 text-purple-500" />
                    Seguridad
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-opacity-20">
                      <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Pregunta Secreta:
                      </span>
                      <span className={`${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                        {userData.preguntaSecreta}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-opacity-20">
                      <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Verificada:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                          userData.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {userData.verified ? <FiCheck className="mr-1" /> : <FiAlertCircle className="mr-1" />}
                        {userData.verified ? "Verificada" : "Pendiente"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Estado:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userData.blocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {userData.blocked ? "Bloqueada" : "Activa"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actividad */}
                <div
                  className={`p-6 rounded-2xl lg:col-span-2 ${theme === "dark" ? "bg-indigo-800/30" : "bg-indigo-50"}`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 flex items-center ${
                      theme === "dark" ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    <FiClock className="mr-3 text-blue-500" />
                    Actividad de la Cuenta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-pink-400" : "text-purple-600"}`}>
                        {userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : "Nunca"}
                      </div>
                      <div className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Último inicio
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-pink-400" : "text-purple-600"}`}>
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </div>
                      <div className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Cuenta creada
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${theme === "dark" ? "text-pink-400" : "text-purple-600"}`}>
                        {new Date(userData.updatedAt).toLocaleDateString()}
                      </div>
                      <div className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Última actualización
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
