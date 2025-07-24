"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/authContext"
import { FiEye, FiEyeOff, FiArrowLeft, FiMail, FiLock, FiLogIn, FiStar, FiHeart } from "react-icons/fi"
import Image from "next/image"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, theme } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        console.log("Usuario completo tras login:", result.user)
        setMessage("Inicio de sesión exitoso")
        router.push("/")
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error)
      setMessage("Error interno del servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"}`}>
      {/* Fondo con formas orgánicas */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === "dark" ? "bg-purple-600" : "bg-purple-400"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 ${
            theme === "dark" ? "bg-pink-600" : "bg-pink-400"
          }`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 ${
            theme === "dark" ? "bg-blue-600" : "bg-blue-400"
          }`}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Lado Izquierdo - Logo y Frase */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div
            className={`rounded-3xl p-12 text-center ${
              theme === "dark"
                ? "bg-indigo-900/30 backdrop-blur-sm border border-indigo-800/50"
                : "bg-white/80 backdrop-blur-sm shadow-2xl border border-indigo-100"
            }`}
          >
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/assets/logo-actual.png"
                alt="Surprise - Diseños y Regalos"
                width={300}
                height={200}
                className="mx-auto object-contain"
                priority
              />
            </div>

            {/* Frase motivacional */}
            <div className="space-y-6">
              <h2
                className={`text-4xl lg:text-5xl font-bold leading-tight ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Crea{" "}
                <span
                  className={`${
                    theme === "dark"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
                  }`}
                >
                  Momentos
                </span>{" "}
                Únicos
              </h2>

              <p className={`text-xl leading-relaxed ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                Transforma tus ideas en regalos extraordinarios que sorprenderán a quienes más amas
              </p>

              {/* Elementos decorativos */}
              <div className="flex justify-center space-x-4 mt-8">
                <div
                  className={`p-3 rounded-2xl ${
                    theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
                  }`}
                >
                  <FiHeart className="w-6 h-6" />
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    theme === "dark" ? "bg-purple-600/20 text-purple-400" : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <FiStar className="w-6 h-6" />
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    theme === "dark" ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <FiHeart className="w-6 h-6" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                {[
                  { number: "2K+", label: "Clientes Felices" },
                  { number: "5K+", label: "Productos Creados" },
                  { number: "99%", label: "Satisfacción" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${theme === "dark" ? "text-pink-400" : "text-purple-600"}`}>
                      {stat.number}
                    </div>
                    <div className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho - Formulario de Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${
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
              <div className="flex items-center justify-between mb-4">
                <Link href="/" className="flex items-center text-white/80 hover:text-white transition-colors">
                  <FiArrowLeft className="mr-2" />
                  Atrás
                </Link>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <FiLogIn className="w-6 h-6" />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2">Bienvenido de vuelta</h1>
              <p className="opacity-90">Inicia sesión en tu cuenta</p>

              {/* Logo móvil */}
              <div className="lg:hidden mt-6 flex justify-center">
                <Image
                  src="/assets/logo-actual.png"
                  alt="Logo Surprise - Diseños y Regalos"
                  width={150}
                  height={100}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl"></div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-8">
              {message && (
                <div
                  className={`p-4 rounded-2xl text-center font-medium mb-6 ${
                    message.includes("Error") || message.includes("error")
                      ? theme === "dark"
                        ? "bg-red-900/50 text-red-400 border border-red-500/30"
                        : "bg-red-50 text-red-600 border border-red-200"
                      : theme === "dark"
                        ? "bg-green-900/50 text-green-400 border border-green-500/30"
                        : "bg-green-50 text-green-600 border border-green-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo de email */}
                <div>
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiMail className="mr-2" />
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20 placeholder-slate-400"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20 placeholder-slate-500"
                    }`}
                  />
                </div>

                {/* Campo de contraseña */}
                <div>
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiLock className="mr-2" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      required
                      className={`w-full p-4 pr-12 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                        theme === "dark"
                          ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20 placeholder-slate-400"
                          : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20 placeholder-slate-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "text-indigo-400 hover:text-pink-400 hover:bg-indigo-700"
                          : "text-indigo-500 hover:text-purple-600 hover:bg-indigo-100"
                      }`}
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                    isLoading
                      ? "bg-slate-400 cursor-not-allowed text-white"
                      : theme === "dark"
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25 transform hover:-translate-y-1"
                        : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </form>

              {/* Enlaces adicionales */}
              <div className="mt-8 space-y-4">
                <div className="text-center">
                  <span className={`text-sm ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                    ¿No tienes una cuenta?{" "}
                  </span>
                  <Link
                    href="/register"
                    className={`text-sm font-semibold hover:underline ${
                      theme === "dark" ? "text-pink-400 hover:text-pink-300" : "text-purple-600 hover:text-purple-500"
                    }`}
                  >
                    Crear cuenta
                  </Link>
                </div>

                <div className="text-center">
                  <Link
                    href="/resetpassword"
                    className={`text-sm font-medium hover:underline ${
                      theme === "dark"
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-500"
                    }`}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
