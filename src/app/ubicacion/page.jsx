"use client"
import { useAuth } from "@/context/authContext"
import { FaMapMarkerAlt, FaStore } from "react-icons/fa"
import { FiNavigation, FiMail, FiPhone, FiClock, FiMapPin } from "react-icons/fi"

export default function UbicacionPage() {
  const { theme } = useAuth()

  const handleGetDirections = () => {
    const address = "Avenida Juarez, Col.Centro, Huejutla de Reyes, Hidalgo, México"
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank")
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
            <FiMapPin className="mr-2" />
            <span className="font-medium">Encuéntranos</span>
          </div>

          <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Nuestra{" "}
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Ubicación
            </span>
          </h1>

          <p className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Visítanos en nuestra tienda física en el corazón de Huejutla de Reyes, Hidalgo. Te esperamos con los mejores
            productos personalizados.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Información de Contacto */}
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
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mr-4">
                  <FaStore className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Surprise - Diseños y Regalos</h2>
                  <p className="opacity-90">Tu tienda de confianza</p>
                </div>
              </div>

              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl"></div>
            </div>

            {/* Contenido de contacto */}
            <div className="p-8 space-y-6">
              {/* Dirección */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  theme === "dark" ? "bg-indigo-800/30 hover:bg-indigo-800/50" : "bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    <FiMapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                      Dirección
                    </h3>
                    <p className={`${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                      Avenida Juárez, Col. Centro
                      <br />
                      Huejutla de Reyes, Hidalgo
                      <br />
                      México, C.P. 43000
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  theme === "dark" ? "bg-indigo-800/30 hover:bg-indigo-800/50" : "bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      theme === "dark" ? "bg-purple-600/20 text-purple-400" : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    <FiMail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-1 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                      Correo Electrónico
                    </h3>
                    <a
                      href="mailto:surprisecentro@gmail.com"
                      className={`hover:underline ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
                    >
                      surprisecentro@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Teléfono */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  theme === "dark" ? "bg-indigo-800/30 hover:bg-indigo-800/50" : "bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      theme === "dark" ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <FiPhone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-1 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                      Teléfono
                    </h3>
                    <a
                      href="tel:+527713538853"
                      className={`hover:underline ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                    >
                      +52 771 353 8853
                    </a>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  theme === "dark" ? "bg-indigo-800/30 hover:bg-indigo-800/50" : "bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      theme === "dark" ? "bg-green-600/20 text-green-400" : "bg-green-100 text-green-600"
                    }`}
                  >
                    <FiClock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                      Horarios de Atención
                    </h3>
                    <div className={`space-y-1 text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                      <p>
                        <span className="font-medium">Lunes - Viernes:</span> 9:00 AM - 7:00 PM
                      </p>
                      <p>
                        <span className="font-medium">Sábados:</span> 9:00 AM - 6:00 PM
                      </p>
                      <p>
                        <span className="font-medium">Domingos:</span> 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de direcciones */}
              <button
                onClick={handleGetDirections}
                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
                } transform hover:-translate-y-1`}
              >
                <FiNavigation className="mr-2" />
                Cómo Llegar
              </button>
            </div>
          </div>

          {/* Mapa */}
          <div
            className={`rounded-3xl overflow-hidden shadow-2xl ${
              theme === "dark"
                ? "border-2 border-indigo-800/50 bg-indigo-900/30"
                : "border-2 border-indigo-200 bg-white"
            }`}
          >
            {/* Header del mapa */}
            <div
              className={`p-6 border-b ${
                theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-indigo-50 border-indigo-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-xl mr-3 ${
                    theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
                  }`}
                >
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                    Ubicación en el Mapa
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                    Huejutla de Reyes, Hidalgo
                  </p>
                </div>
              </div>
            </div>

            {/* Mapa embebido */}
            <div className="relative">
              <iframe
                title="Mapa de Surprise - Huejutla de Reyes"
                className="w-full h-96 lg:h-[500px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.8234567890123!2d-98.42030000000001!3d21.139400000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d72c5c5c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2sAv.%20Ju%C3%A1rez%2C%20Centro%2C%20Huejutla%20de%20Reyes%2C%20Hgo.%2C%20M%C3%A9xico!5e0!3m2!1ses!2smx!4v1640000000000!5m2!1ses!2smx"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              ></iframe>

              {/* Overlay con información adicional */}
              <div className="absolute bottom-4 left-4 right-4">
                <div
                  className={`p-4 rounded-2xl backdrop-blur-sm ${
                    theme === "dark"
                      ? "bg-indigo-900/80 border border-indigo-700/50"
                      : "bg-white/90 border border-indigo-200/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                        Surprise - Diseños y Regalos
                      </p>
                      <p className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                        Centro de Huejutla de Reyes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                        Abierto
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección adicional de información */}
        <div className="mt-16">
          <div
            className={`rounded-3xl overflow-hidden p-12 text-center ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            } text-white`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">¿Necesitas ayuda para llegar?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Estamos ubicados en una zona céntrica y de fácil acceso. Si tienes dudas sobre cómo llegar, no dudes en
              contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+527713538853"
                className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <FiPhone className="mr-2" />
                Llamar Ahora
              </a>
              <a
                href="mailto:surprisecentro@gmail.com"
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-indigo-900 transition-colors flex items-center justify-center"
              >
                <FiMail className="mr-2" />
                Enviar Email
              </a>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
