"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { FiShoppingCart, FiPlus, FiStar, FiDollarSign, FiClock, FiGift } from "react-icons/fi"

function OfertasPage() {
  const { isAuthenticated, theme } = useAuth()
  const router = useRouter()
  const [productos, setProductos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOfertas = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/ofertas`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Error al cargar productos en oferta")
        const data = await res.json()
        setProductos(data)
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los productos en oferta.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOfertas()
  }, [])

  const agregarAlCarrito = async (productId) => {
    if (!isAuthenticated) {
      return Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) router.push("/login")
      })
    }

    setIsAddingToCart(true)
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado",
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const comprarAhora = async (productId) => {
    if (!isAuthenticated) {
      return Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para comprar productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) router.push("/login")
      })
    }

    setIsAddingToCart(true)
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      router.push("/carrito")
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }
  const calcularDescuento = (precio, descuento) => {
    if (!descuento || descuento === precio) return 0
    return Math.round(((precio - descuento) / precio) * 100)
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
            <FiDollarSign className="mr-2" />
            <span className="font-medium">Ofertas Especiales</span>
          </div>

          <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Productos en{" "}
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Oferta
            </span>
          </h1>

          <p className={`text-xl max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Descubre increíbles descuentos en nuestros productos más populares. ¡Ofertas por tiempo limitado!
          </p>

          {/* Contador de ofertas */}
          <div
            className={`inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full ${
              theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
            }`}
          >
            <FiClock className="w-4 h-4" />
            <span className="text-sm font-medium">{productos.length} productos en oferta disponibles</span>
          </div>
        </div>

        {/* Contenido Principal */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className={`mt-4 text-lg ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
              Cargando ofertas especiales...
            </p>
          </div>
        ) : error ? (
          <div
            className={`text-center py-20 rounded-3xl ${
              theme === "dark" ? "bg-indigo-900/50 border border-red-500/30" : "bg-white border border-red-200"
            }`}
          >
            <div className="text-6xl mb-4">😔</div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              Oops, algo salió mal
            </h3>
            <p className={`text-lg ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>{error}</p>
          </div>
        ) : productos.length === 0 ? (
          <div
            className={`text-center py-20 rounded-3xl ${theme === "dark" ? "bg-indigo-900/50" : "bg-white shadow-lg"}`}
          >
            <div className="text-6xl mb-4">🎁</div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              No hay ofertas disponibles
            </h3>
            <p className={`text-lg ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
              Vuelve pronto para descubrir nuevas ofertas especiales
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {productos.map((producto) => {
              const descuentoPorcentaje = calcularDescuento(producto.price, producto.discount)

              return (
                <div
                  key={producto.id}
                  className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    theme === "dark"
                      ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                      : "bg-white shadow-lg border border-indigo-100"
                  }`}
                >
                  {/* Badge de descuento */}
                  {descuentoPorcentaje > 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center animate-pulse">
                        <FiDollarSign className="mr-1 w-3 h-3" />-{producto.discount}%
                      </div>
                    </div>
                  )}

                  {/* Imagen del producto */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={producto.images?.[0]?.url || "/placeholder.jpg"}
                      alt={producto.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized={true}
                    />

                    {/* Overlay con efecto hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div
                          className={`px-4 py-2 rounded-full backdrop-blur-sm ${
                            theme === "dark" ? "bg-white/90 text-indigo-900" : "bg-indigo-900/90 text-white"
                          } flex items-center gap-2`}
                        >
                          <FiGift className="w-4 h-4" />
                          <span className="text-sm font-medium">¡Oferta especial!</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-6">
                    {/* Categoría */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                        theme === "dark" ? "bg-indigo-800 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {producto.category || "Oferta Especial"}
                    </span>

                    {/* Nombre del producto */}
                    <h2
                      className={`text-lg font-bold mb-2 line-clamp-2 ${
                        theme === "dark" ? "text-white" : "text-indigo-900"
                      }`}
                    >
                      {producto.name}
                    </h2>

                    {/* Descripción */}
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}
                    >
                      {producto.description}
                    </p>

                    {/* Precios */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl font-bold text-pink-600">
                        $
                        {producto.discount
                          ? (producto.price * (1 - producto.discount / 100)).toFixed(2)
                          : producto.price.toFixed(2)}
                      </span>
                      {producto.discount > 0 && (
                        <span
                          className={`text-lg line-through ${theme === "dark" ? "text-indigo-500" : "text-slate-400"}`}
                        >
                          ${producto.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock indicator */}
                    <div
                      className={`flex items-center gap-2 mb-4 ${
                        producto.stock > 0
                          ? theme === "dark"
                            ? "text-green-400"
                            : "text-green-600"
                          : theme === "dark"
                            ? "text-red-400"
                            : "text-red-600"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          producto.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">
                        {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => comprarAhora(producto.id)}
                        disabled={isAddingToCart || producto.stock <= 0}
                        className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${
                          producto.stock <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : theme === "dark"
                              ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 hover:shadow-lg hover:shadow-pink-500/25"
                              : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 hover:shadow-lg hover:shadow-purple-500/25"
                        } text-white ${isAddingToCart ? "opacity-75" : ""}`}
                      >
                        {isAddingToCart ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <FiShoppingCart className="mr-2" />
                            Comprar ahora
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => agregarAlCarrito(producto.id)}
                        disabled={isAddingToCart || producto.stock <= 0}
                        className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                          producto.stock <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : theme === "dark"
                              ? "bg-indigo-800 hover:bg-indigo-700 text-white"
                              : "bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                        }`}
                        title="Agregar al carrito"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>

                      <button
                        className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                          theme === "dark"
                            ? "bg-indigo-800/50 text-indigo-300 hover:bg-indigo-700"
                            : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        }`}
                        title="Favoritos (no implementado)"
                      >
                        <FiStar className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 -left-4 w-4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Section */}
        {productos.length > 0 && (
          <div className="mt-20">
            <div
              className={`relative rounded-3xl overflow-hidden p-12 text-center ${
                theme === "dark"
                  ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
              }`}
            >
              <div className="relative z-10 text-white">
                <FiGift className="w-16 h-16 mx-auto mb-6 opacity-80 animate-bounce" />
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Explora nuestro catálogo completo y descubre miles de productos personalizados
                </p>
                <button
                  onClick={() => router.push("/productos")}
                  className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Ver Catálogo Completo
                </button>
              </div>

              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OfertasPage
