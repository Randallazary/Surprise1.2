"use client"
import ContactForm from "@/components/ContactForm"
import { useAuth } from "@/context/authContext"
import { FiMail, FiPhone, FiMapPin, FiMessageCircle, FiSend, FiClock, FiUsers } from "react-icons/fi"

export default function ContactPage() {
  const { theme } = useAuth()

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
            <FiMessageCircle className="mr-2" />
            <span className="font-medium">Estamos aquí para ayudarte</span>
          </div>

          <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Contáctanos
            </span>
          </h1>

          <p className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            ¿Tienes alguna duda o sugerencia? ¡Nos encantaría escucharte! Nuestro equipo está listo para ayudarte con
            cualquier consulta sobre nuestros productos personalizados.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Sección de Información */}
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
                  <FiUsers className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Información de Contacto</h2>
                  <p className="opacity-90">Múltiples formas de comunicarte con nosotros</p>
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
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
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
                      Nuestra Ubicación
                    </h3>
                    <p className={`${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                      Avenida Juárez, Col. Centro
                      <br />
                      Huejutla de Reyes, Hidalgo
                      <br />
                      México
                    </p>
                    <button
                      className={`mt-3 text-sm font-medium hover:underline ${
                        theme === "dark" ? "text-pink-400" : "text-pink-600"
                      }`}
                    >
                      Ver en el mapa →
                    </button>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
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
                    <p className={`text-sm mt-1 ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                      Respuesta en 24 horas
                    </p>
                  </div>
                </div>
              </div>

              {/* Teléfono */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
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
                    <p className={`text-sm mt-1 ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                      Atención inmediata
                    </p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div
                className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
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
                    <div className="flex items-center mt-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                        Abierto ahora
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden ${
              theme === "dark"
                ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                : "bg-white shadow-xl border border-indigo-100"
            }`}
          >
            {/* Header del formulario */}
            <div
              className={`p-8 border-b ${
                theme === "dark" ? "bg-indigo-900/30 border-indigo-800/50" : "bg-indigo-50 border-indigo-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-xl mr-4 ${
                    theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
                  }`}
                >
                  <FiSend className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                    Envíanos un Mensaje
                  </h2>
                  <p className={`${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                    Completa el formulario y te responderemos pronto
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-8">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Sección de FAQ rápidas */}
        <div className="mt-16">
          <div
            className={`rounded-3xl overflow-hidden p-12 text-center ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            } text-white`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">¿Necesitas ayuda inmediata?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Consulta nuestras preguntas frecuentes o contáctanos directamente para obtener respuestas rápidas sobre
              nuestros productos y servicios.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-bold mb-2">Tiempos de Entrega</h3>
                <p className="text-sm opacity-90">3-5 días hábiles para productos personalizados</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-bold mb-2">Diseños Personalizados</h3>
                <p className="text-sm opacity-90">Envía tu diseño o nosotros lo creamos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="font-bold mb-2">Garantía de Calidad</h3>
                <p className="text-sm opacity-90">100% satisfacción garantizada</p>
              </div>
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
