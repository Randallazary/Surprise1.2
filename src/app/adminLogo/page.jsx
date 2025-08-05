"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { useLogo } from "../../context/LogoContext"
import { useRouter } from "next/navigation"
import { CONFIGURACIONES } from "../config/config"
import { FiImage, FiUpload, FiSettings, FiCheck, FiX, FiUser, FiEye } from "react-icons/fi"

function AdminLogoPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const { fetchLogo } = useLogo()
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Verificar si el usuario es admin; si no, redirigir
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user])

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        setLogo(null)
        setLogoPreview(null)
        setMessage("Formato de imagen no permitido. Usa JPG, PNG o GIF.")
        return
      }

      // Crear preview de la imagen
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      setLogo(file)
      setMessage("")
    }
  }

  // Manejar drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        setLogo(null)
        setLogoPreview(null)
        setMessage("Formato de imagen no permitido. Usa JPG, PNG o GIF.")
        return
      }

      // Crear preview de la imagen
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      setLogo(file)
      setMessage("")
    }
  }

  // Subir el logo a tu servidor
  const handleUploadLogo = async () => {
    if (!logo) {
      setMessage("Selecciona un archivo antes de subir.")
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", logo)
    formData.append("autor", user.name)

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/subir`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setMessage("Logo subido correctamente.")
        setLogo(null)
        setLogoPreview(null)
        // Refresca el logo en el front
        await fetchLogo()
      } else {
        const error = await response.json()
        setMessage(error.message || "Error al subir el logo.")
      }
    } catch (error) {
      console.error("Error al subir el logo:", error)
      setMessage("Error al subir el logo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Limpiar selección
  const clearSelection = () => {
    setLogo(null)
    setLogoPreview(null)
    setMessage("")
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
            Administración de{" "}
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Logo
            </span>
          </h1>

          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Gestiona el logo de tu plataforma de manera sencilla y profesional
          </p>
        </div>

        {/* Contenedor Principal */}
        <div
          className={`rounded-3xl shadow-2xl overflow-hidden p-8 max-w-4xl mx-auto ${
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
              <FiImage className="w-6 h-6" />
            </div>
            <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              Subir Nuevo Logo
            </h2>
          </div>

          {/* Zona de Drag & Drop */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:border-solid mb-6 ${
              theme === "dark"
                ? "border-indigo-700 hover:border-pink-500 bg-indigo-800/30"
                : "border-indigo-300 hover:border-purple-500 bg-indigo-50/50"
            }`}
          >
            {logoPreview ? (
              // Preview del logo seleccionado
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Preview del logo"
                    className="max-w-xs max-h-48 rounded-xl shadow-lg mx-auto"
                  />
                  <button
                    onClick={clearSelection}
                    className={`absolute -top-2 -right-2 p-2 rounded-full transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/40"
                        : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    }`}
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <FiEye className={`mr-2 ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`} />
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>
                    Vista previa del logo seleccionado
                  </span>
                </div>
              </div>
            ) : (
              // Zona de selección
              <>
                <FiUpload
                  className={`w-16 h-16 mx-auto mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  Selecciona o arrastra tu logo aquí
                </h3>
                <p className={`text-base mb-4 ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
                  Haz clic para seleccionar o arrastra y suelta tu archivo
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      theme === "dark"
                        ? "bg-indigo-800 text-indigo-300 border border-indigo-700"
                        : "bg-indigo-100 text-indigo-600 border border-indigo-200"
                    }`}
                  >
                    JPG
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      theme === "dark"
                        ? "bg-indigo-800 text-indigo-300 border border-indigo-700"
                        : "bg-indigo-100 text-indigo-600 border border-indigo-200"
                    }`}
                  >
                    PNG
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      theme === "dark"
                        ? "bg-indigo-800 text-indigo-300 border border-indigo-700"
                        : "bg-indigo-100 text-indigo-600 border border-indigo-200"
                    }`}
                  >
                    GIF
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Información del usuario */}
          {user && (
            <div
              className={`p-4 rounded-2xl mb-6 ${
                theme === "dark"
                  ? "bg-indigo-800/50 border border-indigo-700/50"
                  : "bg-indigo-50 border border-indigo-200"
              }`}
            >
              <div className="flex items-center">
                <FiUser className={`mr-2 ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`} />
                <span className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>
                  Subido por: {user.name}
                </span>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleUploadLogo}
              disabled={isLoading || !logo}
              className={`flex-1 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                isLoading || !logo
                  ? "bg-slate-400 cursor-not-allowed text-white"
                  : theme === "dark"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Subir Logo
                </>
              )}
            </button>

            {logo && (
              <button
                onClick={clearSelection}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gray-600/20 text-gray-400 border-2 border-gray-600/30 hover:bg-gray-600/30"
                    : "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200"
                }`}
              >
                <FiX className="mr-2" />
                Cancelar
              </button>
            )}
          </div>

          {/* Mensajes de estado */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-2xl text-center font-medium flex items-center justify-center ${
                message.includes("Error")
                  ? theme === "dark"
                    ? "bg-red-900/50 text-red-400 border border-red-500/30"
                    : "bg-red-50 text-red-600 border border-red-200"
                  : theme === "dark"
                    ? "bg-green-900/50 text-green-400 border border-green-500/30"
                    : "bg-green-50 text-green-600 border border-green-200"
              }`}
            >
              {message.includes("Error") ? <FiX className="mr-2 w-5 h-5" /> : <FiCheck className="mr-2 w-5 h-5" />}
              {message}
            </div>
          )}

          {/* Consejos y recomendaciones */}
          <div
            className={`mt-8 p-6 rounded-2xl ${
              theme === "dark"
                ? "bg-indigo-800/30 border border-indigo-700/50"
                : "bg-indigo-50/50 border border-indigo-200/50"
            }`}
          >
            <h3 className={`text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              Recomendaciones para tu logo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-2 mr-3 ${theme === "dark" ? "bg-pink-400" : "bg-purple-500"}`}
                ></div>
                <div>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
                    Tamaño recomendado: 200x200px o superior
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-2 mr-3 ${theme === "dark" ? "bg-pink-400" : "bg-purple-500"}`}
                ></div>
                <div>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
                    Formato PNG para mejor calidad
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-2 mr-3 ${theme === "dark" ? "bg-pink-400" : "bg-purple-500"}`}
                ></div>
                <div>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
                    Fondo transparente preferible
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div
                  className={`w-2 h-2 rounded-full mt-2 mr-3 ${theme === "dark" ? "bg-pink-400" : "bg-purple-500"}`}
                ></div>
                <div>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
                    Tamaño máximo: 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogoPage
