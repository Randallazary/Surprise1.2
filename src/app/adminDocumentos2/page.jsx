"use client"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  FiFileText,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiCheck,
  FiCalendar,
  FiSettings,
  FiBook,
} from "react-icons/fi"

function TermsPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const [terms, setTerms] = useState([])
  const [currentTerms, setCurrentTerms] = useState(null)
  const [newTerms, setNewTerms] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  })
  const [editingTerms, setEditingTerms] = useState(null)

  // Verificar si el usuario es admin; si no, redirigir
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"
    }
  }, [isAuthenticated, user])

  // Obtener todos los términos
  const fetchTerms = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setTerms(data)
      } else {
        setTerms([])
        console.error("La respuesta no es un array:", data)
      }
    } catch (error) {
      console.error("Error al obtener términos:", error)
    }
  }

  // Obtener los términos actuales
  const fetchCurrentTerms = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/current`, {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentTerms(data)
      } else {
        console.error("Error al obtener los términos actuales")
      }
    } catch (error) {
      console.error("Error al obtener términos actuales:", error)
    }
  }

  // Cargar datos iniciales si es admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchTerms()
      fetchCurrentTerms()
    }
  }, [isAuthenticated, user])

  // Crear nuevos términos
  const handleCreateTerms = async () => {
    if (!newTerms.title || !newTerms.content || !newTerms.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      })
      return
    }
    if (new Date(newTerms.effectiveDate) < new Date()) {
      toast.error("La fecha de vigencia no puede ser anterior a la fecha actual.", { position: "top-center" })
      return
    }
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTerms),
      })
      if (response.ok) {
        toast.success("Términos creados exitosamente.", {
          position: "top-center",
        })
        fetchTerms()
        fetchCurrentTerms()
        setNewTerms({ title: "", content: "", effectiveDate: "" })
      } else {
        const errorData = await response.json()
        toast.error(errorData.message, { position: "top-center" })
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" })
    }
  }

  // Actualizar términos existentes
  const handleUpdateTerms = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/${editingTerms.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTerms),
      })
      if (response.ok) {
        setEditingTerms(null)
        fetchTerms()
        fetchCurrentTerms()
        toast.success("Términos actualizados exitosamente.", {
          position: "top-center",
        })
      } else {
        console.error("Error al actualizar los términos")
        toast.error("Error al actualizar los términos.", {
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("Error al actualizar los términos:", error)
      toast.error("Error al actualizar los términos.", {
        position: "top-center",
      })
    }
  }

  // Eliminar términos
  const handleDeleteTerms = async (id) => {
    if (!confirm("¿Estás seguro de eliminar estos términos?")) return

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        fetchTerms()
        fetchCurrentTerms()
        toast.success("Términos eliminados exitosamente.", {
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("Error al eliminar los términos:", error)
      toast.error("Error al eliminar los términos.", {
        position: "top-center",
      })
    }
  }

  // Establecer términos como actuales
  const handleSetCurrentTerms = async (id) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/${id}/set-current`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        fetchTerms()
        fetchCurrentTerms()
        toast.success("Términos establecidos como actuales.", {
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("Error al establecer los términos como actuales:", error)
      toast.error("Error al establecer los términos como actuales.", {
        position: "top-center",
      })
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
              Términos y Condiciones
            </span>
          </h1>

          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Administra los términos y condiciones de uso de tu plataforma de manera profesional
          </p>
        </div>

        {/* Términos Actuales */}
        {currentTerms && (
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden p-8 max-w-4xl mx-auto mb-12 ${
              theme === "dark"
                ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                : "bg-white shadow-xl border border-indigo-100"
            }`}
          >
            <div className="flex items-center mb-6">
              <div
                className={`p-3 rounded-2xl mr-4 ${
                  theme === "dark" ? "bg-green-600/20 text-green-400" : "bg-green-100 text-green-600"
                }`}
              >
                <FiCheck className="w-6 h-6" />
              </div>
              <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                Términos Actuales
              </h2>
            </div>

            <div
              className={`p-6 rounded-2xl ${
                theme === "dark"
                  ? "bg-indigo-800/50 border border-indigo-700/50"
                  : "bg-indigo-50 border border-indigo-200"
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                {currentTerms.title}
              </h3>
              <p
                className={`text-base leading-relaxed mb-4 ${theme === "dark" ? "text-indigo-300" : "text-slate-700"}`}
              >
                {currentTerms.content}
              </p>
              <div className="flex items-center">
                <FiCalendar className={`mr-2 ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`} />
                <span className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>
                  Vigencia: {new Date(currentTerms.effectiveDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Formulario para crear nuevos términos */}
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden p-8 max-w-4xl mx-auto mb-12 ${
            theme === "dark"
              ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
              : "bg-white shadow-xl border border-indigo-100"
          }`}
        >
          <div className="flex items-center mb-8">
            <div
              className={`p-3 rounded-2xl mr-4 ${
                theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
              }`}
            >
              <FiPlus className="w-6 h-6" />
            </div>
            <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              Crear Nuevos Términos
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label
                className={`block mb-3 font-semibold flex items-center ${
                  theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                <FiBook className="mr-2" />
                Título de los Términos
              </label>
              <input
                type="text"
                value={newTerms.title}
                onChange={(e) => setNewTerms({ ...newTerms, title: e.target.value })}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  theme === "dark"
                    ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                    : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                }`}
                placeholder="Ingresa el título de los términos y condiciones"
              />
            </div>

            <div>
              <label
                className={`block mb-3 font-semibold flex items-center ${
                  theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                <FiEdit className="mr-2" />
                Contenido
              </label>
              <textarea
                value={newTerms.content}
                onChange={(e) => setNewTerms({ ...newTerms, content: e.target.value })}
                rows={8}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 resize-none ${
                  theme === "dark"
                    ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                    : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                }`}
                placeholder="Describe detalladamente los términos y condiciones de uso"
              />
            </div>

            <div>
              <label
                className={`block mb-3 font-semibold flex items-center ${
                  theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                <FiCalendar className="mr-2" />
                Fecha de Vigencia
              </label>
              <input
                type="date"
                value={newTerms.effectiveDate}
                onChange={(e) => setNewTerms({ ...newTerms, effectiveDate: e.target.value })}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  theme === "dark"
                    ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                    : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                }`}
              />
            </div>

            <button
              onClick={handleCreateTerms}
              className={`w-full py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25"
                  : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
              }`}
            >
              <FiSave className="mr-2" />
              Crear Términos
            </button>
          </div>
        </div>

        {/* Lista de Términos */}
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden p-8 max-w-6xl mx-auto ${
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
              <FiFileText className="w-6 h-6" />
            </div>
            <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              Lista de Términos
            </h2>
          </div>

          {terms.length > 0 ? (
            <div className="space-y-6">
              {terms.map((term) => (
                <div
                  key={term.id}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-indigo-800/50 border border-indigo-700/50"
                      : "bg-indigo-50 border border-indigo-200"
                  }`}
                >
                  {editingTerms && editingTerms.id === term.id ? (
                    // Modo edición
                    <div className="p-6 space-y-6">
                      <div>
                        <label
                          className={`block mb-2 font-medium ${
                            theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        >
                          Título
                        </label>
                        <input
                          type="text"
                          value={editingTerms.title}
                          onChange={(e) =>
                            setEditingTerms({
                              ...editingTerms,
                              title: e.target.value,
                            })
                          }
                          className={`w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                            theme === "dark"
                              ? "bg-indigo-700 border-indigo-600 text-white focus:border-pink-500 focus:ring-pink-500/20"
                              : "bg-white border-indigo-300 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 font-medium ${
                            theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        >
                          Contenido
                        </label>
                        <textarea
                          value={editingTerms.content}
                          onChange={(e) =>
                            setEditingTerms({
                              ...editingTerms,
                              content: e.target.value,
                            })
                          }
                          rows={6}
                          className={`w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
                            theme === "dark"
                              ? "bg-indigo-700 border-indigo-600 text-white focus:border-pink-500 focus:ring-pink-500/20"
                              : "bg-white border-indigo-300 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 font-medium ${
                            theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        >
                          Fecha de Vigencia
                        </label>
                        <input
                          type="date"
                          value={editingTerms.effectiveDate?.split("T")[0] || ""}
                          onChange={(e) =>
                            setEditingTerms({
                              ...editingTerms,
                              effectiveDate: e.target.value,
                            })
                          }
                          className={`w-full p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                            theme === "dark"
                              ? "bg-indigo-700 border-indigo-600 text-white focus:border-pink-500 focus:ring-pink-500/20"
                              : "bg-white border-indigo-300 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                          }`}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdateTerms}
                          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg"
                          }`}
                        >
                          <FiSave className="mr-2" />
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingTerms(null)}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-gray-600/20 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30"
                              : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          <FiX className="mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                          {term.title}
                        </h3>
                        {term.isCurrent && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              theme === "dark"
                                ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                          >
                            <FiCheck className="inline mr-1 w-3 h-3" />
                            Actual
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-base leading-relaxed mb-4 ${theme === "dark" ? "text-indigo-300" : "text-slate-700"}`}
                      >
                        {term.content}
                      </p>

                      <div className="flex items-center mb-6">
                        <FiCalendar className={`mr-2 ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`} />
                        <span className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>
                          Vigencia: {new Date(term.effectiveDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setEditingTerms(term)}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                            theme === "dark"
                              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30"
                              : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          <FiEdit className="mr-2 w-4 h-4" />
                          Editar
                        </button>

                        <button
                          onClick={() => handleDeleteTerms(term.id)}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                            theme === "dark"
                              ? "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30"
                              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          <FiTrash2 className="mr-2 w-4 h-4" />
                          Eliminar
                        </button>

                        {!term.isCurrent && (
                          <button
                            onClick={() => handleSetCurrentTerms(term.id)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                              theme === "dark"
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg"
                            }`}
                          >
                            <FiCheck className="mr-2 w-4 h-4" />
                            Establecer como Actual
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-20 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
              <FiBook className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                No hay términos disponibles
              </h3>
              <p>Crea tus primeros términos y condiciones para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TermsPage
