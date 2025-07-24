"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { useCart } from "../../context/CartContext"
import { CONFIGURACIONES } from "../config/config"
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiMapPin } from "react-icons/fi"
import { FaShippingFast } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import Image from "next/image"
import Script from "next/script"
import { useRef } from "react"

function CarritoPage() {
  const { carrito: cartItems, recomendaciones, refreshCart } = useCart()
  const { user, isAuthenticated, theme, isAuthLoading } = useAuth()
  const [carrito, setCarrito] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [paypalInitialized, setPaypalInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [direcciones, setDirecciones] = useState([])
  const [selectedDireccionId, setSelectedDireccionId] = useState(null)
  const [showDireccionForm, setShowDireccionForm] = useState(false)
  const [setRecomendaciones] = useState([])
  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    estado: "",
    cp: "",
    pais: "México",
    referencias: "",
  })
  const paypalRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Obtener el carrito del usuario
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login")
    }
    const obtenerCarrito = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito`, {
          credentials: "include",
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || "Error al obtener el carrito")
        }
        setCarrito(data.carrito)
      } catch (error) {
        console.error("Error:", error)
        Swal.fire({
          title: "Error",
          text: error.message || "Error al cargar el carrito",
          icon: "error",
          background: theme === "dark" ? "#1e1b4b" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1e1b4b",
        })
      } finally {
        setIsLoading(false)
      }
    }

    const obtenerDirecciones = async () => {
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/direccion/direcciones`, {
          credentials: "include",
        })
        if (!res.ok) {
          throw new Error("Error al obtener direcciones")
        }
        const response = await res.json()
        const direccionesArray = Array.isArray(response.data) ? response.data : []
        if (direccionesArray.length === 0) {
          setShowDireccionForm(true)
        } else {
          setDirecciones(direccionesArray)
          setSelectedDireccionId(direccionesArray[0]?.id || null)
        }
      } catch (error) {
        console.error("Error al obtener direcciones:", error)
        setDirecciones([])
        setShowDireccionForm(true)
      }
    }

    refreshCart()
    obtenerCarrito()
    obtenerDirecciones()
  }, [isAuthLoading, isAuthenticated, router])

  // PayPal Effect
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !carrito ||
      !carrito.items ||
      carrito.items.length === 0 ||
      paypalRef.current === null
    )
      return

    let isCancelled = false
    paypalRef.current.innerHTML = ""

    const renderPaypalButton = async () => {
      try {
        await window.paypal
          .Buttons({
            createOrder: async () => {
              if (!selectedDireccionId) {
                Swal.fire({
                  title: "Dirección requerida",
                  text: "Debes seleccionar o registrar una dirección de envío",
                  icon: "warning",
                  background: theme === "dark" ? "#1e1b4b" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#1e1b4b",
                })
                throw new Error("No address selected")
              }
              const res = await fetch(`${CONFIGURACIONES.BASEURL2}/paypal/create-order`, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  items: carrito.items.map((item) => {
                    const discount = item.product.discount || 0
                    const priceWithDiscount = item.product.price * (1 - discount / 100)
                    return {
                      id: item.product.id,
                      name: item.product.name,
                      price: Number.parseFloat(priceWithDiscount.toFixed(2)),
                      quantity: item.quantity,
                    }
                  }),
                  total: calcularTotales().total,
                  direccionId: selectedDireccionId,
                }),
              })
              const data = await res.json()
              if (!res.ok) throw new Error(data.message || "Error al crear orden")
              return data.orderId
            },
            onApprove: async (data) => {
              const res = await fetch(`${CONFIGURACIONES.BASEURL2}/paypal/capture-order`, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                  direccionId: selectedDireccionId,
                }),
              })
              const result = await res.json()
              if (res.ok && !isCancelled) {
                Swal.fire({
                  title: "¡Pago exitoso!",
                  text: "Gracias por tu compra",
                  icon: "success",
                  background: theme === "dark" ? "#1e1b4b" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#1e1b4b",
                })
                refreshCart()
                router.push("/gracias")
              } else if (!isCancelled) {
                Swal.fire({
                  title: "Error",
                  text: result.message || "Error al capturar el pago",
                  icon: "error",
                  background: theme === "dark" ? "#1e1b4b" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#1e1b4b",
                })
              }
            },
            onError: (err) => {
              if (!isCancelled) {
                console.error("PayPal error:", err)
                Swal.fire({
                  title: "Error",
                  text: "Hubo un error con PayPal",
                  icon: "error",
                  background: theme === "dark" ? "#1e1b4b" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#1e1b4b",
                })
              }
            },
            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
              height: 55,
            },
          })
          .render(paypalRef.current)
      } catch (err) {
        if (!isCancelled) {
          console.error("Error al renderizar botón PayPal:", err)
        }
      }
    }

    if (window.paypal) {
      renderPaypalButton()
    } else {
      const interval = setInterval(() => {
        if (window.paypal) {
          clearInterval(interval)
          renderPaypalButton()
        }
      }, 200)
      return () => clearInterval(interval)
    }

    return () => {
      isCancelled = true
      if (paypalRef.current) {
        paypalRef.current.innerHTML = ""
      }
    }
  }, [carrito, selectedDireccionId])

  const handleDireccionChange = (e) => {
    setSelectedDireccionId(e.target.value)
  }

  const handleNuevaDireccionChange = (e) => {
    const { name, value } = e.target
    setNuevaDireccion((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const agregarDireccion = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/direccion/nueva`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaDireccion),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error al agregar dirección")
      setDirecciones([...direcciones, data])
      setSelectedDireccionId(data.id)
      setShowDireccionForm(false)
      setNuevaDireccion({
        calle: "",
        numero: "",
        ciudad: "",
        estado: "",
        cp: "",
        pais: "México",
        referencias: "",
      })
      Swal.fire({
        title: "¡Éxito!",
        text: "Dirección agregada correctamente",
        icon: "success",
        background: theme === "dark" ? "#1e1b4b" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1e1b4b",
      })
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "Error al guardar la dirección",
        icon: "error",
        background: theme === "dark" ? "#1e1b4b" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1e1b4b",
      })
    }
  }

  const selectedDireccion = direcciones?.find((d) => d.id === selectedDireccionId) || null

  const actualizarCantidad = async (productId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return
    setIsUpdating(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/actualizar/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quantity: nuevaCantidad,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el carrito")
      }
      refreshCart()
      setCarrito((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.product.id === productId ? { ...item, quantity: nuevaCantidad } : item)),
      }))
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "Error al actualizar la cantidad",
        icon: "error",
        background: theme === "dark" ? "#1e1b4b" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1e1b4b",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const eliminarProducto = async (productId) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "¿Estás seguro de que quieres eliminar este producto del carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: theme === "dark" ? "#1e1b4b" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#1e1b4b",
    })
    if (!result.isConfirmed) return
    setIsUpdating(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/eliminar/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Error al eliminar del carrito")
      refreshCart()
      setCarrito((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.product.id !== productId),
      }))
      Swal.fire({
        title: "¡Eliminado!",
        text: "El producto ha sido removido del carrito.",
        icon: "success",
        background: theme === "dark" ? "#1e1b4b" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1e1b4b",
      })
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "Error al eliminar el producto",
        icon: "error",
        background: theme === "dark" ? "#1e1b4b" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1e1b4b",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const calcularTotales = () => {
    if (!carrito || !carrito.items) return { subtotal: 0, envio: 0, total: 0 }
    const subtotal = carrito.items.reduce((sum, item) => {
      const priceWithDiscount = item.product.price * (1 - (item.product.discount || 0) / 100)
      return sum + priceWithDiscount * item.quantity
    }, 0)
    const envio = subtotal > 500 ? 0 : 99
    const total = subtotal + envio
    return { subtotal, envio, total }
  }

  const { subtotal, envio, total } = calcularTotales()

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div
        className={`min-h-screen py-8 pt-36 flex justify-center items-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
            : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
        }`}
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-2 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen py-8 pt-36 ${
        theme === "dark"
          ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-sky-200"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-indigo-900"
      }`}
    >
      {/* Formas decorativas de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 ${
            theme === "dark" ? "bg-pink-500" : "bg-pink-300"
          } blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 ${
            theme === "dark" ? "bg-purple-500" : "bg-purple-300"
          } blur-3xl animate-pulse delay-1000`}
        ></div>
      </div>

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${CONFIGURACIONES.PAYPAL_CLIENT_ID}&currency=USD`}
        strategy="afterInteractive"
      />
      <div className="container px-4 mx-auto relative z-10">
        {/* Encabezado elegante */}
        <div
          className={`p-8 rounded-3xl shadow-2xl mb-8 backdrop-blur-md border relative overflow-hidden ${
            theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10"></div>
          <div className="relative z-10">
            <h1 className="flex items-center mb-2 text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              <FiShoppingCart className="mr-3 text-pink-500" /> Mi Carrito de Compras
            </h1>
            <p className={`${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>
              Revisa y gestiona los productos en tu carrito
            </p>
          </div>
        </div>

        {!carrito || carrito.items.length === 0 ? (
          <div
            className={`p-12 rounded-3xl text-center backdrop-blur-md border ${
              theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
            }`}
          >
            <FiShoppingCart className="mx-auto mb-6 text-6xl text-pink-500" />
            <h2 className="mb-4 text-3xl font-bold">Tu carrito está vacío</h2>
            <p className={`mb-8 text-lg ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
              Aún no has agregado productos a tu carrito
            </p>
            <button
              onClick={() => router.push("/catalog")}
              className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              Ir al catálogo de productos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-2/3">
              <div
                className={`rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md border ${
                  theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
                }`}
              >
                <div
                  className={`hidden md:grid grid-cols-12 p-6 border-b font-bold ${
                    theme === "dark" ? "border-indigo-800/50" : "border-indigo-200"
                  }`}
                >
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-center">Precio</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                {carrito.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 border-b transition-colors hover:bg-opacity-50 ${
                      theme === "dark"
                        ? "border-indigo-800/50 hover:bg-indigo-800/20"
                        : "border-indigo-200 hover:bg-indigo-50/50"
                    }`}
                  >
                    <div className="grid items-center grid-cols-12 gap-4">
                      <div className="flex items-center col-span-12 md:col-span-6">
                        <div className="relative flex-shrink-0 w-20 h-20 mr-4 rounded-2xl overflow-hidden">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0].url || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center rounded-2xl ${
                                theme === "dark" ? "bg-indigo-800/50" : "bg-indigo-100"
                              }`}
                            >
                              <span className={`text-xs ${theme === "dark" ? "text-indigo-500" : "text-indigo-400"}`}>
                                Sin imagen
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{item.product.name}</h3>
                          <p className={`text-sm ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                            {item.product.brand} - {item.product.category}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-4 text-center md:col-span-2">
                        <span className="mr-2 font-medium md:hidden">Precio:</span>
                        {(() => {
                          const discount = item.product.discount || 0
                          const priceWithDiscount = item.product.price * (1 - discount / 100)
                          return (
                            <>
                              <span className="text-xl font-bold text-pink-600">${priceWithDiscount.toFixed(2)}</span>
                              {discount > 0 && (
                                <span
                                  className={`ml-2 text-sm line-through ${theme === "dark" ? "text-indigo-500" : "text-indigo-400"}`}
                                >
                                  ${item.product.price.toFixed(2)}
                                </span>
                              )}
                            </>
                          )
                        })()}
                      </div>
                      <div className="flex items-center justify-center col-span-4 md:col-span-2">
                        <div className="flex items-center overflow-hidden border-2 rounded-2xl bg-white/50 backdrop-blur-sm">
                          <button
                            className="p-3 hover:bg-pink-100 transition-colors"
                            onClick={() => actualizarCantidad(item.product.id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <FiMinus className="text-pink-600" />
                          </button>
                          <span className="px-4 py-2 font-bold text-indigo-900">{item.quantity}</span>
                          <button
                            className="p-3 hover:bg-pink-100 transition-colors"
                            onClick={() => actualizarCantidad(item.product.id, item.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <FiPlus className="text-pink-600" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-center col-span-4 md:col-span-2">
                        <div className="text-center">
                          <p className="text-xl font-bold text-purple-600 mb-3">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            className="flex items-center px-4 py-2 font-bold text-red-500 border-2 border-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                            onClick={() => eliminarProducto(item.product.id)}
                            disabled={isUpdating}
                          >
                            <FiTrash2 className="mr-2" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/3">
              <div
                className={`rounded-3xl shadow-2xl overflow-hidden sticky top-4 backdrop-blur-md border ${
                  theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
                }`}
              >
                <div
                  className={`p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 ${
                    theme === "dark" ? "border-b border-indigo-800/50" : "border-b border-indigo-200"
                  }`}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Resumen del Pedido
                  </h2>
                </div>
                <div className="p-6">
                  {/* Sección de dirección de envío */}
                  <div className="mb-8">
                    <h3 className="flex items-center mb-4 text-lg font-bold">
                      <FiMapPin className="mr-2 text-pink-500" /> Dirección de envío
                    </h3>
                    {showDireccionForm ? (
                      <form onSubmit={agregarDireccion} className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium">Calle</label>
                          <input
                            type="text"
                            name="calle"
                            value={nuevaDireccion.calle}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                              theme === "dark"
                                ? "bg-indigo-800/50 border-indigo-700 text-white"
                                : "bg-white border-indigo-200 text-indigo-900"
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium">Número</label>
                          <input
                            type="text"
                            name="numero"
                            value={nuevaDireccion.numero}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                              theme === "dark"
                                ? "bg-indigo-800/50 border-indigo-700 text-white"
                                : "bg-white border-indigo-200 text-indigo-900"
                            }`}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium">Ciudad</label>
                            <input
                              type="text"
                              name="ciudad"
                              value={nuevaDireccion.ciudad}
                              onChange={handleNuevaDireccionChange}
                              className={`w-full p-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                                theme === "dark"
                                  ? "bg-indigo-800/50 border-indigo-700 text-white"
                                  : "bg-white border-indigo-200 text-indigo-900"
                              }`}
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium">Estado</label>
                            <input
                              type="text"
                              name="estado"
                              value={nuevaDireccion.estado}
                              onChange={handleNuevaDireccionChange}
                              className={`w-full p-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                                theme === "dark"
                                  ? "bg-indigo-800/50 border-indigo-700 text-white"
                                  : "bg-white border-indigo-200 text-indigo-900"
                              }`}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium">Código Postal</label>
                          <input
                            type="text"
                            name="cp"
                            value={nuevaDireccion.cp}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                              theme === "dark"
                                ? "bg-indigo-800/50 border-indigo-700 text-white"
                                : "bg-white border-indigo-200 text-indigo-900"
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium">Referencias</label>
                          <textarea
                            name="referencias"
                            value={nuevaDireccion.referencias}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                              theme === "dark"
                                ? "bg-indigo-800/50 border-indigo-700 text-white"
                                : "bg-white border-indigo-200 text-indigo-900"
                            }`}
                            rows="3"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                        >
                          Guardar Dirección
                        </button>
                      </form>
                    ) : (
                      <>
                        {direcciones.length > 0 && (
                          <select
                            value={selectedDireccionId || ""}
                            onChange={handleDireccionChange}
                            className={`w-full p-3 mb-4 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                              theme === "dark"
                                ? "bg-indigo-800/50 border-indigo-700 text-white"
                                : "bg-white border-indigo-200 text-indigo-900"
                            }`}
                          >
                            {direcciones.map((direccion) => (
                              <option key={direccion.id} value={direccion.id}>
                                {direccion.calle} {direccion.numero}, {direccion.ciudad}
                              </option>
                            ))}
                          </select>
                        )}
                        {selectedDireccion && (
                          <div
                            className={`p-4 rounded-2xl mb-4 ${
                              theme === "dark" ? "bg-indigo-800/30" : "bg-indigo-100/50"
                            }`}
                          >
                            <p className="font-bold">
                              {selectedDireccion.calle} {selectedDireccion.numero}
                            </p>
                            <p>
                              {selectedDireccion.ciudad}, {selectedDireccion.estado}
                            </p>
                            <p>CP: {selectedDireccion.cp}</p>
                            {selectedDireccion.referencias && (
                              <p className="mt-2 text-sm">Referencias: {selectedDireccion.referencias}</p>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => setShowDireccionForm(true)}
                          className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105"
                        >
                          Agregar Nueva Dirección
                        </button>
                      </>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-lg">
                      <span>Subtotal:</span>
                      <span className="font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span>Envío:</span>
                      <span className="font-bold">
                        {envio === 0 ? (
                          <span className="flex items-center text-green-500">
                            <FaShippingFast className="mr-2" /> Gratis
                          </span>
                        ) : (
                          `$${envio.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div
                      className={`flex justify-between items-center text-xl font-bold pt-4 border-t ${
                        theme === "dark" ? "border-indigo-800/50" : "border-indigo-200"
                      }`}
                    >
                      <span>Total:</span>
                      <span className="text-pink-600">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 py-4">
                      <Image
                        src="/assets/mercado-pago.png"
                        alt="Pago con Mercado Pago"
                        width={120}
                        height={80}
                        className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                      />
                      <Image
                        src="/assets/paypal-logo.png"
                        alt="Pago con Paypal"
                        width={120}
                        height={80}
                        className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div ref={paypalRef} id="paypal-button-container" className="mt-6"></div>
                    {subtotal < 500 && (
                      <div
                        className={`mt-6 p-4 rounded-2xl text-center text-sm backdrop-blur-md border ${
                          theme === "dark"
                            ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                            : "bg-yellow-100/80 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        <FaShippingFast className="inline mr-2" />
                        ¡Faltan ${(500 - subtotal).toFixed(2)} para envío gratis!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Seccion para Recomendaciones */}
        <section>
          {recomendaciones && recomendaciones.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Recomendaciones para ti
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {recomendaciones.map((producto) => (
                  <div
                    key={producto.id}
                    className={`p-6 rounded-3xl shadow-2xl backdrop-blur-md border transition-all hover:shadow-xl hover:-translate-y-1 ${
                      theme === "dark" ? "bg-indigo-900/50 border-indigo-800/50" : "bg-white/70 border-indigo-200"
                    }`}
                  >
                    <Image
                      width={300}
                      height={200}
                      src={producto.images[0]?.url || "/sin-imagen.jpg"}
                      alt={producto.name}
                      className="object-contain w-full h-32 rounded-2xl mb-4"
                    />
                    <h3 className="text-lg font-bold mb-2">{producto.name}</h3>
                    <p className="text-xl font-bold text-pink-600">${producto.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default CarritoPage
