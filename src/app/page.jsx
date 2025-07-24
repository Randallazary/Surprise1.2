"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "../context/authContext"
import { CONFIGURACIONES } from "../app/config/config"
import {
  FiArrowRight,
  FiShoppingCart,
  FiPhone,
  FiGift,
  FiStar,
  FiTruck,
  FiAward,
  FiPlay,
  FiMail,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"

function HomePage() {
  const { theme } = useAuth()
  const [productosAleatorios, setProductosAleatorios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Categorías populares actualizadas para regalos personalizados
  const categoriasPopulares = [
    "Tazas",
    "Cojines",
    "Marcos",
    "Llaveros",
    "Playeras",
    "Sublimados",
    "Bordados",
    "Grabados",
  ]

  // Obtener productos aleatorios
  useEffect(() => {
    const fetchProductosAleatorios = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/productos/aleatorios?cantidad=8`, {
          method: "GET",
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setProductosAleatorios(data)
        } else {
          throw new Error("Error al obtener productos aleatorios")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductosAleatorios()
  }, [])

  // Manejar el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === productosAleatorios.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? productosAleatorios.length - 1 : prev - 1))
  }

  // Auto-play del carrusel
  useEffect(() => {
    if (productosAleatorios.length > 0) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [productosAleatorios.length])

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-indigo-950" : "bg-white"}`}>
      {/* Hero Section Elegante */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido Principal */}
            <div className="text-center lg:text-left">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full mb-6 ${
                  theme === "dark"
                    ? "bg-indigo-900/50 text-pink-400 border border-pink-400/30"
                    : "bg-purple-50 text-purple-600 border border-purple-200"
                }`}
              >
                <FiStar className="mr-2" />
                <span className="text-sm font-medium">Diseños Únicos desde 2020</span>
              </div>

              <h1
                className={`text-5xl lg:text-7xl font-bold mb-6 leading-tight ${
                  theme === "dark" ? "text-white" : "text-indigo-900"
                }`}
              >
                Crea{" "}
                <span
                  className={`relative ${
                    theme === "dark"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
                  }`}
                >
                  Momentos
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10C50 2 100 2 198 10"
                      stroke={theme === "dark" ? "#ec4899" : "#db2777"}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                Únicos
              </h1>

              <p
                className={`text-xl mb-8 max-w-lg ${
                  theme === "dark" ? "text-indigo-200" : "text-slate-600"
                } leading-relaxed`}
              >
                Transforma tus ideas en regalos extraordinarios. Cada producto es una obra de arte personalizada que
                cuenta tu historia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  className={`group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-pink-500/25"
                      : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-2xl hover:shadow-purple-500/25"
                  } transform hover:-translate-y-1`}
                >
                  <span className="flex items-center">
                    Explorar Catálogo
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button
                  className={`group px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-indigo-700 text-indigo-200 hover:bg-indigo-900/50"
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  <span className="flex items-center">
                    <FiPlay className="mr-2" />
                    Ver Proceso
                  </span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
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

            {/* Imagen Hero */}
            <div className="relative">
              <div
                className={`relative rounded-3xl overflow-hidden ${
                  theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50"
                } p-8`}
              >
                <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center">
                  <div className="text-8xl">🎨</div>
                </div>

                {/* Elementos flotantes */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl rotate-12">
                  ✨
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl -rotate-12">
                  🎁
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Servicios Flotantes */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiGift className="w-8 h-8" />,
                title: "Personalización Total",
                description: "Cada detalle diseñado especialmente para ti",
                color: "pink",
              },
              {
                icon: <FiAward className="w-8 h-8" />,
                title: "Calidad Premium",
                description: "Materiales de primera y acabados perfectos",
                color: "purple",
              },
              {
                icon: <FiTruck className="w-8 h-8" />,
                title: "Entrega Express",
                description: "Recibe tu pedido en tiempo récord",
                color: "blue",
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl transition-all duration-500 hover:-translate-y-4 ${
                  theme === "dark"
                    ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                    : "bg-white shadow-xl border border-indigo-100"
                }`}
              >
                <div
                  className={`inline-flex p-4 rounded-2xl mb-6 ${
                    service.color === "pink"
                      ? theme === "dark"
                        ? "bg-pink-600/20 text-pink-400"
                        : "bg-pink-100 text-pink-600"
                      : service.color === "purple"
                        ? theme === "dark"
                          ? "bg-purple-600/20 text-purple-400"
                          : "bg-purple-100 text-purple-600"
                        : theme === "dark"
                          ? "bg-blue-600/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {service.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  {service.title}
                </h3>
                <p className={`${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados con Carrusel */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}
            >
              Creaciones{" "}
              <span
                className={`${
                  theme === "dark"
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
                }`}
              >
                Destacadas
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
              Descubre nuestras piezas más populares, cada una diseñada con amor y atención al detalle
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : productosAleatorios.length > 0 ? (
            <div className="relative">
              {/* Carrusel de Productos */}
              <div className="overflow-hidden rounded-3xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {productosAleatorios.map((producto) => (
                    <div key={producto.id} className="w-full flex-shrink-0">
                      <div
                        className={`relative rounded-3xl overflow-hidden h-96 mx-4 ${
                          theme === "dark" ? "bg-indigo-900/50" : "bg-gradient-to-br from-pink-50 to-purple-50"
                        }`}
                      >
                        <div className="absolute inset-0 p-8 flex items-center">
                          <div className="flex-1">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                                theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
                              }`}
                            >
                              {producto.category || "Destacado"}
                            </span>
                            <h3
                              className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}
                            >
                              {producto.name}
                            </h3>
                            <p className={`text-lg mb-6 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                              {producto.description}
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                              <span className="text-3xl font-bold text-pink-600">
                                $
                                {producto.discount > 0
                                  ? (producto.price * (1 - producto.discount / 100)).toFixed(2)
                                  : producto.price.toFixed(2)}
                              </span>
                              {producto.discount > 0 && (
                                <span
                                  className={`text-lg line-through ${
                                    theme === "dark" ? "text-indigo-500" : "text-slate-400"
                                  }`}
                                >
                                  ${producto.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-4">
                              <button
                                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                                  theme === "dark"
                                    ? "bg-pink-600 text-white hover:bg-pink-500"
                                    : "bg-pink-500 text-white hover:bg-pink-600"
                                }`}
                              >
                                <FiShoppingCart className="inline mr-2" />
                                Comprar Ahora
                              </button>
                              <button
                                className={`p-3 rounded-2xl transition-all ${
                                  theme === "dark"
                                    ? "bg-indigo-800 text-indigo-300 hover:bg-indigo-700"
                                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                }`}
                              >
                                <FiHeart />
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <div className="relative w-64 h-64">
                              {producto.images && producto.images.length > 0 ? (
                                <Image
                                  src={producto.images[0].url || "/placeholder.svg"}
                                  alt={producto.name}
                                  fill
                                  className="object-cover rounded-2xl"
                                  unoptimized={true}
                                />
                              ) : (
                                <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center text-6xl">
                                  🎁
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles del Carrusel */}
              <button
                onClick={prevSlide}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all ${
                  theme === "dark"
                    ? "bg-indigo-900/80 text-white hover:bg-indigo-800"
                    : "bg-white/90 text-indigo-900 hover:bg-white shadow-lg"
                }`}
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all ${
                  theme === "dark"
                    ? "bg-indigo-900/80 text-white hover:bg-indigo-800"
                    : "bg-white/90 text-indigo-900 hover:bg-white shadow-lg"
                }`}
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              {/* Indicadores */}
              <div className="flex justify-center mt-8 gap-2">
                {productosAleatorios.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? theme === "dark"
                          ? "bg-pink-400"
                          : "bg-pink-600"
                        : theme === "dark"
                          ? "bg-indigo-800"
                          : "bg-indigo-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={`text-center py-20 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
              <div className="text-6xl mb-4">🎁</div>
              <p>No hay productos disponibles en este momento</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section Elegante */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className={`relative rounded-3xl overflow-hidden p-12 lg:p-20 ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            }`}
          >
            <div className="relative z-10 text-center text-white">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                ¿Listo para crear algo{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  extraordinario
                </span>
                ?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Únete a miles de clientes satisfechos y convierte tus ideas en realidad con nuestros diseños
                personalizados
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-semibold hover:bg-gray-100 transition-colors">
                  <FiMail className="inline mr-2" />
                  Solicitar Cotización
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-indigo-900 transition-colors">
                  <FiPhone className="inline mr-2" />
                  Llamar Ahora
                </button>
              </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
