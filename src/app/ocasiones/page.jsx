'use client'
import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "../../context/authContext"
import { useCart } from "../../context/CartContext"
import { CONFIGURACIONES } from "../config/config"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { useSearchParams } from "next/navigation"
import { FiSearch, FiFilter, FiDollarSign, FiTag, FiShoppingCart, FiPlus } from "react-icons/fi"
import { FaBoxOpen, FaChevronDown, FaGift, FaHeart, FaBirthdayCake } from "react-icons/fa"
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io"

function OcasionesPage() {
  const { refreshCart, setRecomendaciones } = useCart()
  const router = useRouter()
  const { user, isAuthenticated, theme } = useAuth()
  const [productos, setProductos] = useState([])
  const [busquedaGeneral, setBusquedaGeneral] = useState("")
  const [filtroOcasion, setFiltroOcasion] = useState(null)
  const [filtroRangoPrecio, setFiltroRangoPrecio] = useState(["", ""])
  const [filtroStock, setFiltroStock] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [error, setError] = useState("")
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalProductos: 0,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Captura los parámetros de búsqueda de la URL
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("search")
  const ocasionParam = searchParams.get("ocasion")

  useEffect(() => {
    if (searchTerm) setBusquedaGeneral(searchTerm)
    if (ocasionParam) setFiltroOcasion(ocasionParam)
  }, [searchTerm, ocasionParam])

  // Función para obtener productos
  const fetchProductos = async () => {
  setIsLoading(true);
  setError("");
  try {
    const params = new URLSearchParams();
    
    if (busquedaGeneral) params.append('search', busquedaGeneral);
    if (filtroOcasion) params.append('ocasion', filtroOcasion);
    if (filtroRangoPrecio[0]) params.append('minPrice', filtroRangoPrecio[0]);
    if (filtroRangoPrecio[1]) params.append('maxPrice', filtroRangoPrecio[1]);
    if (filtroStock) params.append('stock', filtroStock);
    
    params.append('page', paginacion.paginaActual);
    params.append('pageSize', 12);

    const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos?${params}`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta completa del backend:", data); // Para depuración

    // Verificación de estructura de respuesta
    if (!data || !data.productos || !data.paginacion) {
      throw new Error("Estructura de respuesta inválida del servidor");
    }

    setProductos(data.productos);
    setPaginacion({
      paginaActual: data.paginacion.paginaActual || 1,
      totalPaginas: data.paginacion.totalPaginas || 1,
      totalProductos: data.paginacion.totalProductos || 0
    });

  } catch (error) {
    console.error("Error fetching productos:", error);
    setError(error.message || "Error al cargar los productos");
    // Opcional: mostrar notificación al usuario
    Swal.fire({
      title: "Error",
      text: "No se pudieron cargar los productos. Por favor intenta nuevamente.",
      icon: "error"
    });
  } finally {
    setIsLoading(false);
  }
};

  // Obtener productos al cargar o cambiar filtros
  useEffect(() => {
    const debounceTimer = setTimeout(fetchProductos, 300)
    return () => clearTimeout(debounceTimer)
  }, [busquedaGeneral, filtroOcasion, filtroRangoPrecio, filtroStock, paginacion.paginaActual])

  // Prefetch de páginas de productos
  useEffect(() => {
    if (productos.length > 0) {
      const prefetchProductPages = async () => {
        try {
          await Promise.all(
            productos.map((producto) => router.prefetch(`/producto/${producto.id}`))
          )
        } catch (error) {
          console.error("Error prefetching product pages:", error)
        }
      }
      prefetchProductPages()
    }
  }, [productos, router])

  // Cambiar de página
  const cambiarPagina = (pagina) => {
    setPaginacion(prev => ({ ...prev, paginaActual: pagina }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Ocasiones disponibles
  const ocasiones = [
    { id: 1, nombre: 'Cumpleaños', icono: <FaBirthdayCake />, valor: 'Cumpleaños', color: '#FF9AA2' },
    { id: 2, nombre: 'Amor', icono: <FaHeart />, valor: 'Amor', color: '#FFB7B2' },
    { id: 3, nombre: 'Amistad', icono: <FaGift />, valor: 'Amistad', color: '#B5EAD7' },
    { id: 4, nombre: 'Todos', icono: <FaBoxOpen />, valor: null, color: '#C7CEEA' }
  ]

  // Manejar cambio de ocasión
  const handleOcasionChange = (valor) => {
    setFiltroOcasion(valor === filtroOcasion ? null : valor)
    setPaginacion(prev => ({ ...prev, paginaActual: 1 }))
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setBusquedaGeneral("")
    setFiltroOcasion(null)
    setFiltroRangoPrecio(["", ""])
    setFiltroStock("")
    setPaginacion(prev => ({ ...prev, paginaActual: 1 }))
  }

  // Agregar al carrito
  const agregarAlCarrito = async (productId, e) => {
    e.stopPropagation()
    setIsAddingToCart(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (!response.ok) throw new Error("Error al agregar al carrito")

      const data = await response.json()
      
      if (data.success) {
        await refreshCart()
        Swal.fire({
          title: "¡Producto agregado!",
          text: "El producto se ha añadido a tu carrito",
          icon: "success",
          confirmButtonColor: "#6366f1",
        })
      } else {
        throw new Error(data.message || "Error al agregar al carrito")
      }
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo agregar el producto al carrito",
        icon: "error",
        confirmButtonColor: "#6366f1",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Comprar ahora
  const comprarAhora = async (productId, e) => {
    e.stopPropagation()
    setIsAddingToCart(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (!response.ok) throw new Error("Error al agregar al carrito")

      const data = await response.json()
      
      if (data.success) {
        await refreshCart()
        router.push("/checkout")
      } else {
        throw new Error(data.message || "Error al agregar al carrito")
      }
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo agregar el producto al carrito",
        icon: "error",
        confirmButtonColor: "#6366f1",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className={`min-h-screen py-8 pt-36 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-sky-200" 
        : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-indigo-900"
    }`}>
      <div className="container px-4 mx-auto relative z-10">
        {/* Encabezado */}
        <div className={`p-8 rounded-3xl shadow-2xl mb-8 backdrop-blur-md border ${
          theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
        }`}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center">
            Para tus ocasiones especiales
          </h1>
          <p className={`text-center max-w-2xl mx-auto ${
            theme === "dark" ? "text-indigo-300" : "text-indigo-600"
          }`}>
            Encuentra el regalo perfecto para cada ocasión especial en tu vida
          </p>
        </div>

        {/* Selector de ocasiones */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {ocasiones.map((ocasion) => (
              <div
                key={ocasion.id}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  filtroOcasion === ocasion.valor
                    ? "ring-4 ring-pink-500/50 transform scale-105"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: ocasion.color }}
                onClick={() => handleOcasionChange(ocasion.valor)}
              >
                <div className="flex flex-col items-center">
                  <div className="text-2xl mb-2">{ocasion.icono}</div>
                  <h3 className="font-bold text-center">{ocasion.nombre}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros móviles */}
        <div className="mb-6 md:hidden">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between backdrop-blur-md border ${
              theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
            }`}
          >
            <span className="flex items-center">
              <FiFilter className="mr-2" /> Filtros
            </span>
            {mobileFiltersOpen ? (
              <FaChevronDown className="transform rotate-180 transition-transform" />
            ) : (
              <FaChevronDown className="transition-transform" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Filtros en la izquierda */}
          <div className={`w-full md:w-1/4 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
            <div
              className={`rounded-3xl shadow-2xl overflow-hidden p-6 mb-8 backdrop-blur-md border ${
                theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  <FiFilter className="mr-2 text-pink-500" /> Filtros
                </h2>
                <button
                  onClick={limpiarFiltros}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    theme === "dark" ? "text-pink-400 hover:bg-pink-900/20" : "text-pink-600 hover:bg-pink-100"
                  }`}
                >
                  Limpiar todo
                </button>
              </div>

              {/* Buscador general */}
              <div className="mb-6">
                <label
                  className={`flex items-center mb-2 font-medium ${
                    theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  <FiSearch className="mr-2" /> Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nombre, descripción..."
                  value={busquedaGeneral}
                  onChange={(e) => setBusquedaGeneral(e.target.value)}
                  className={`w-full p-3 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                    theme === "dark"
                      ? "bg-indigo-800/50 border-indigo-700 placeholder-indigo-400 text-white"
                      : "bg-white border-indigo-200 placeholder-indigo-500 text-indigo-900"
                  }`}
                />
              </div>

              {/* Filtro por rango de precio */}
              <div className="mb-6">
                <label
                  className={`flex items-center mb-2 font-medium ${
                    theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  <FiDollarSign className="mr-2" /> Rango de Precio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1 text-sm ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`}>
                      Mínimo
                    </label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={filtroRangoPrecio[0]}
                      onChange={(e) => setFiltroRangoPrecio([e.target.value, filtroRangoPrecio[1]])}
                      className={`w-full p-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        theme === "dark"
                          ? "bg-indigo-800/50 border-indigo-700 text-white"
                          : "bg-white border-indigo-200 text-indigo-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 text-sm ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`}>
                      Máximo
                    </label>
                    <input
                      type="number"
                      placeholder="$9999"
                      value={filtroRangoPrecio[1]}
                      onChange={(e) => setFiltroRangoPrecio([filtroRangoPrecio[0], e.target.value])}
                      className={`w-full p-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        theme === "dark"
                          ? "bg-indigo-800/50 border-indigo-700 text-white"
                          : "bg-white border-indigo-200 text-indigo-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Filtro por stock */}
              <div className="mb-6">
                <label
                  className={`flex items-center mb-2 font-medium ${
                    theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  <FaBoxOpen className="mr-2" /> Stock Mínimo
                </label>
                <input
                  type="number"
                  placeholder="Cantidad mínima"
                  value={filtroStock}
                  onChange={(e) => setFiltroStock(e.target.value)}
                  className={`w-full p-3 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                    theme === "dark"
                      ? "bg-indigo-800/50 border-indigo-700 text-white"
                      : "bg-white border-indigo-200 text-indigo-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Lista de productos en la derecha */}
          <div className="w-full md:w-3/4">
            {/* Resumen de filtros */}
            <div
              className={`p-4 rounded-2xl mb-6 flex flex-wrap items-center gap-2 backdrop-blur-md border ${
                theme === "dark" ? "bg-indigo-900/30 border-indigo-800/50" : "bg-white/50 border-indigo-200"
              }`}
            >
              <span className="text-sm font-medium">Filtros aplicados:</span>
              {busquedaGeneral && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    theme === "dark" ? "bg-indigo-800/50" : "bg-white"
                  }`}
                >
                  <FiSearch className="mr-1" /> "{busquedaGeneral}"
                </span>
              )}
              {filtroOcasion && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    theme === "dark" ? "bg-indigo-800/50" : "bg-white"
                  }`}
                >
                  <FiTag className="mr-1" /> {filtroOcasion}
                </span>
              )}
              {Array.isArray(filtroRangoPrecio) && (filtroRangoPrecio[0] || filtroRangoPrecio[1]) && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    theme === "dark" ? "bg-indigo-800/50" : "bg-white"
                  }`}
                >
                  <FiDollarSign className="mr-1" />
                  {filtroRangoPrecio[0] ? `$${filtroRangoPrecio[0]}` : "$0"} -{" "}
                  {filtroRangoPrecio[1] ? `$${filtroRangoPrecio[1]}` : "∞"}
                </span>
              )}
              {filtroStock && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    theme === "dark" ? "bg-indigo-800/50" : "bg-white"
                  }`}
                >
                  <FaBoxOpen className="mr-1" /> Mín. {filtroStock}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-2 animate-pulse"></div>
                </div>
              </div>
            ) : error ? (
              <div
                className={`p-4 rounded-2xl text-center ${
                  theme === "dark" ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-800"
                }`}
              >
                {error}
              </div>
            ) : productos.length === 0 ? (
              <div
                className={`p-8 rounded-3xl text-center backdrop-blur-md border ${
                  theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
                }`}
              >
                <div className="mb-4 text-5xl">🔍</div>
                <h3 className="mb-2 text-xl font-bold">No se encontraron productos</h3>
                <p className={`mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                  No hay productos que coincidan con tus criterios de búsqueda
                </p>
                <button
                  onClick={limpiarFiltros}
                  className="px-6 py-2 rounded-2xl text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all duration-300"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {productos.map((producto) => (
                    <div
                      key={producto.id}
                      className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all hover:shadow-xl hover:-translate-y-1 backdrop-blur-md border ${
                        theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
                      }`}
                    >
                      {/* Contenido principal clickeable */}
                      <div
                        className="cursor-pointer"
                        onClick={() => router.push(`/producto/${producto.id}`)}
                        role="button"
                        tabIndex="0"
                        aria-label={`Ver detalles de ${producto.name}`}
                        onKeyDown={(e) => e.key === "Enter" && router.push(`/producto/${producto.id}`)}
                      >
                        {/* Imagen del producto */}
                        <div className="relative bg-gradient-to-br from-indigo-100 to-purple-100 h-60">
                          {producto.images.length > 0 ? (
                            <Image
                              src={producto.images[0].url || "/placeholder.svg"}
                              alt={producto.name}
                              fill
                              className="object-contain transition-transform duration-500 group-hover:scale-110 p-4"
                              unoptimized={true}
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center ${
                                theme === "dark" ? "bg-indigo-800/50" : "bg-indigo-100"
                              }`}
                            >
                              <span className={`text-lg ${theme === "dark" ? "text-indigo-500" : "text-indigo-400"}`}>
                                Sin imagen
                              </span>
                            </div>
                          )}
                          {/* Badge de stock */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                                producto.stock > 0
                                  ? theme === "dark"
                                    ? "bg-green-900/50 text-green-300 border border-green-500/30"
                                    : "bg-green-100/80 text-green-800 border border-green-200"
                                  : theme === "dark"
                                    ? "bg-red-900/50 text-red-300 border border-red-500/30"
                                    : "bg-red-100/80 text-red-800 border border-red-200"
                              }`}
                            >
                              {producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}
                            </span>
                          </div>
                        </div>

                        {/* Contenido de la tarjeta */}
                        <div className="p-6">
                          <h2 className="mb-2 text-lg font-bold line-clamp-1">{producto.name}</h2>
                          <p
                            className={`text-sm mb-3 line-clamp-2 ${
                              theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                            }`}
                          >
                            {producto.description}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-xl font-bold text-pink-600">
                                ${(producto.price * (1 - producto.discount / 100)).toFixed(2)}
                              </p>
                              {producto.discount > 0 && (
                                <p className={`text-xs ${theme === "dark" ? "text-indigo-500" : "text-indigo-400"}`}>
                                  <span className="line-through">${producto.price.toFixed(2)}</span> (
                                  {producto.discount}% OFF)
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                theme === "dark" ? "bg-indigo-800/50" : "bg-indigo-100"
                              }`}
                            >
                              {producto.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="px-6 pb-6">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              comprarAhora(producto.id, e)
                            }}
                            disabled={isAddingToCart || producto.stock <= 0}
                            className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center font-bold text-white transition-all duration-300 ${
                              producto.stock <= 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 hover:shadow-lg hover:shadow-pink-500/25 transform hover:scale-105"
                            }`}
                          >
                            {isAddingToCart ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            ) : (
                              <FiShoppingCart className="mr-2" />
                            )}
                            Comprar ahora
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              agregarAlCarrito(producto.id, e)
                            }}
                            disabled={isAddingToCart || producto.stock <= 0}
                            className={`p-3 rounded-2xl flex items-center justify-center font-bold text-white transition-all duration-300 ${
                              producto.stock <= 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                            }`}
                            title="Añadir al carrito"
                          >
                            {isAddingToCart ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FiPlus />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between mt-12">
                  <button
                    onClick={() => cambiarPagina(Math.max(1, paginacion.paginaActual - 1))}
                    disabled={paginacion.paginaActual === 1}
                    className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      paginacion.paginaActual === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-lg transform hover:scale-105"
                    } ${
                      theme === "dark"
                        ? "bg-indigo-900/50 hover:bg-indigo-800/50 border border-indigo-800/50"
                        : "bg-white/70 hover:bg-white border border-indigo-200"
                    }`}
                  >
                    <IoMdArrowRoundBack className="mr-2" /> Anterior
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className={`px-4 py-2 rounded-xl ${theme === "dark" ? "bg-indigo-900/50" : "bg-white/70"}`}>
                      Página {paginacion.paginaActual} de {paginacion.totalPaginas}
                    </span>
                  </div>

                  <button
                    onClick={() => cambiarPagina(Math.min(paginacion.totalPaginas, paginacion.paginaActual + 1))}
                    disabled={paginacion.paginaActual === paginacion.totalPaginas}
                    className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      paginacion.paginaActual === paginacion.totalPaginas
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-lg transform hover:scale-105"
                    } ${
                      theme === "dark"
                        ? "bg-indigo-900/50 hover:bg-indigo-800/50 border border-indigo-800/50"
                        : "bg-white/70 hover:bg-white border border-indigo-200"
                    }`}
                  >
                    Siguiente <IoMdArrowRoundForward className="ml-2" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OcasionesPage