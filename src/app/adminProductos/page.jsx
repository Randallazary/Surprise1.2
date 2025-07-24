"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { useRouter } from "next/navigation"
import { CONFIGURACIONES } from "../config/config"
import {
  FiPlus,
  FiList,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiImage,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiUpload,
  FiEye,
  FiSettings,
  FiSearch,
  FiFilter,
} from "react-icons/fi"

function AdminProductsPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const router = useRouter()

  // Verificar autenticación y rol de administrador
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user])

  // Estado para la pestaña activa: "create" para crear o editar, "list" para listar
  const [activeTab, setActiveTab] = useState("create")

  // Estados para el formulario (usado tanto en creación como en edición)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discount: "",
  })
  const [images, setImages] = useState([])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para el listado de productos
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  // Estados para el filtro
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [stockFilter, setStockFilter] = useState("all") // all, inStock, outOfStock

  // Para saber si estamos editando y cuál producto
  const [editingProductId, setEditingProductId] = useState(null)

  // Función para filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "" || product.category === selectedCategory

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.stock > 0) ||
      (stockFilter === "outOfStock" && product.stock === 0)

    return matchesSearch && matchesCategory && matchesStock
  })

  // Manejar la selección de archivos para imágenes (múltiples)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    const invalid = files.find((file) => !allowedTypes.includes(file.type))
    if (invalid) {
      setImages([])
      setMessage("Formato de imagen no permitido. Usa JPG, PNG o GIF.")
      return
    }
    setImages(files)
    setMessage("")
  }

  // Actualizar el estado del formulario según cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Limpiar el formulario
  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      discount: "",
    })
    setImages([])
  }

  // Frontend: handleCreateProduct function
  const handleCreateProduct = async (e) => {
    e.preventDefault()
    // Validar campos obligatorios
    if (!form.name) {
      setMessage("Faltan campos obligatorios: name.")
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    // Agregar campos del formulario al FormData
    for (const key in form) {
      formData.append(key, form[key])
    }
    // Agregar imágenes al FormData
    images.forEach((file) => formData.append("images", file))

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/crear`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setMessage("Producto creado exitosamente.")
        clearForm()
        if (activeTab === "list") fetchProducts()
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Error al crear el producto.")
      }
    } catch (error) {
      console.error("Error al crear producto:", error)
      setMessage("Error al crear el producto.")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener la lista de productos
  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/?page=1&pageSize=100`, {
        credentials: "include",
      })
      console.log("Response status:", response.status)
      if (response.ok) {
        const data = await response.json()
        console.log("Products data:", data)
        // Asegúrate de que estás accediendo a la propiedad correcta
        setProducts(data.productos || data) // Dependiendo de la estructura de la respuesta
      } else {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        setMessage("Error al obtener productos.")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setMessage("Error al obtener productos.")
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        setMessage("Producto eliminado exitosamente.")
        fetchProducts()
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Error al eliminar el producto.")
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      setMessage("Error al eliminar el producto.")
    }
  }

  // Preparar la edición del producto: se rellenan los campos del formulario
  const handleEditProduct = (product) => {
    setEditingProductId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      discount: product.discount,
    })
    // Si se van a subir nuevas imágenes, se resetea el array
    setImages([])
    // Se activa la vista de edición
    setActiveTab("edit")
  }

  // Actualizar el producto
  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    if (!editingProductId) return
    setIsLoading(true)
    const formData = new FormData()
    for (const key in form) {
      formData.append(key, form[key])
    }
    images.forEach((file) => formData.append("images", file))

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${editingProductId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setMessage("Producto actualizado exitosamente.")
        clearForm()
        setEditingProductId(null)
        setActiveTab("list")
        fetchProducts()
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Error al actualizar el producto.")
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      setMessage("Error al actualizar el producto.")
    } finally {
      setIsLoading(false)
    }
  }

  // Cancelar edición y volver a la pestaña de listado
  const cancelEdit = () => {
    setEditingProductId(null)
    clearForm()
    setActiveTab("list")
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setStockFilter("all")
  }

  // Actualizar el listado de productos al cambiar a la pestaña "list"
  useEffect(() => {
    if (activeTab === "list") {
      fetchProducts()
    }
  }, [activeTab])

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
              Productos
            </span>
          </h1>

          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Crea, edita y administra todos los productos de tu tienda desde un solo lugar
          </p>
        </div>

        {/* Pestañas Elegantes */}
        <div className="flex justify-center mb-12">
          <div
            className={`inline-flex rounded-2xl p-2 ${
              theme === "dark"
                ? "bg-indigo-900/50 border border-indigo-800/50"
                : "bg-white shadow-lg border border-indigo-100"
            }`}
          >
            <button
              onClick={() => {
                clearForm()
                setEditingProductId(null)
                setActiveTab("create")
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === "create"
                  ? theme === "dark"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : theme === "dark"
                    ? "text-indigo-300 hover:text-white hover:bg-indigo-800/50"
                    : "text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
              }`}
            >
              <FiPlus className="mr-2" />
              Crear Producto
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === "list"
                  ? theme === "dark"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : theme === "dark"
                    ? "text-indigo-300 hover:text-white hover:bg-indigo-800/50"
                    : "text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
              }`}
            >
              <FiList className="mr-2" />
              Listar Productos
            </button>
          </div>
        </div>

        {/* Formulario para crear o editar producto */}
        {(activeTab === "create" || activeTab === "edit") && (
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
                  editingProductId
                    ? theme === "dark"
                      ? "bg-purple-600/20 text-purple-400"
                      : "bg-purple-100 text-purple-600"
                    : theme === "dark"
                      ? "bg-pink-600/20 text-pink-400"
                      : "bg-pink-100 text-pink-600"
                }`}
              >
                {editingProductId ? <FiEdit className="w-6 h-6" /> : <FiPlus className="w-6 h-6" />}
              </div>
              <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                {editingProductId ? "Editar Producto" : "Crear Nuevo Producto"}
              </h2>
            </div>

            <form onSubmit={editingProductId ? handleUpdateProduct : handleCreateProduct} className="space-y-8">
              {/* Campos básicos del producto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiPackage className="mr-2" />
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                    placeholder="Ingresa el nombre del producto"
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiTag className="mr-2" />
                    Categoría
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Peluches">Peluches</option>
                    <option value="Reloj">Reloj</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Gorras">Gorras</option>
                    <option value="Playeras">Playeras</option>
                    <option value="Tazas">Tazas</option>
                    <option value="Llaveros">Llaveros</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiEdit className="mr-2" />
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 resize-none ${
                      theme === "dark"
                        ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                    placeholder="Describe las características del producto"
                  ></textarea>
                </div>

                <div>
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiDollarSign className="mr-2" />
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiPackage className="mr-2" />
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                    placeholder="Cantidad disponible"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block mb-3 font-semibold flex items-center ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    <FiDollarSign className="mr-2" />
                    Precio con Descuento (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount"
                    value={form.discount}
                    onChange={handleInputChange}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                      theme === "dark"
                        ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                    placeholder="Precio con descuento"
                  />
                </div>
              </div>

              {/* Subida de imágenes */}
              <div>
                <label
                  className={`block mb-3 font-semibold flex items-center ${
                    theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  <FiImage className="mr-2" />
                  Imágenes {editingProductId ? "(Nuevas)" : "(puedes seleccionar varias)"}
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:border-solid ${
                    theme === "dark"
                      ? "border-indigo-700 hover:border-pink-500 bg-indigo-800/30"
                      : "border-indigo-300 hover:border-purple-500 bg-indigo-50/50"
                  }`}
                >
                  <FiUpload
                    className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-500"}`}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className={`text-lg font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>
                    Arrastra las imágenes aquí o haz clic para seleccionar
                  </p>
                  <p className={`text-sm mt-2 ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}>
                    Formatos soportados: JPG, PNG, GIF
                  </p>
                  {images.length > 0 && (
                    <p className={`text-sm mt-2 font-medium ${theme === "dark" ? "text-pink-400" : "text-purple-600"}`}>
                      {images.length} imagen(es) seleccionada(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                    isLoading
                      ? "bg-slate-400 cursor-not-allowed text-white"
                      : theme === "dark"
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25"
                        : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  {isLoading
                    ? editingProductId
                      ? "Actualizando..."
                      : "Creando..."
                    : editingProductId
                      ? "Actualizar Producto"
                      : "Crear Producto"}
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                      theme === "dark"
                        ? "bg-red-600/20 text-red-400 border-2 border-red-600/30 hover:bg-red-600/30"
                        : "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100"
                    }`}
                  >
                    <FiX className="mr-2" />
                    Cancelar
                  </button>
                )}
              </div>

              {/* Mensajes de éxito o error */}
              {message && (
                <div
                  className={`p-4 rounded-2xl text-center font-medium ${
                    message.includes("Error")
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
            </form>
          </div>
        )}

        {/* Listado de productos */}
        {activeTab === "list" && (
          <div
            className={`rounded-3xl shadow-2xl overflow-hidden p-8 max-w-7xl mx-auto ${
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
                <FiList className="w-6 h-6" />
              </div>
              <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                Listado de Productos
              </h2>
            </div>

            {/* Filtros de búsqueda */}
            <div
              className={`mb-8 p-6 rounded-2xl ${
                theme === "dark"
                  ? "bg-indigo-800/50 border border-indigo-700/50"
                  : "bg-indigo-50 border border-indigo-200"
              }`}
            >
              <div className="flex items-center mb-4">
                <FiFilter className={`mr-2 ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`} />
                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  Filtros de Búsqueda
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Búsqueda por texto */}
                <div className="md:col-span-2">
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    Buscar producto
                  </label>
                  <div className="relative">
                    <FiSearch
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                      }`}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre o descripción..."
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                        theme === "dark"
                          ? "bg-indigo-700 border-indigo-600 text-white placeholder-indigo-400 focus:border-pink-500 focus:ring-pink-500/20"
                          : "bg-white border-indigo-300 text-indigo-900 placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                      }`}
                    />
                  </div>
                </div>

                {/* Filtro por categoría */}
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full py-3 px-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-indigo-700 border-indigo-600 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-white border-indigo-300 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                  >
                    <option value="">Todas las categorías</option>
                    <option value="Peluches">Peluches</option>
                    <option value="Reloj">Reloj</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Gorras">Gorras</option>
                    <option value="Playeras">Playeras</option>
                    <option value="Tazas">Tazas</option>
                    <option value="Llaveros">Llaveros</option>
                  </select>
                </div>

                {/* Filtro por stock */}
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    Disponibilidad
                  </label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className={`w-full py-3 px-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-indigo-700 border-indigo-600 text-white focus:border-pink-500 focus:ring-pink-500/20"
                        : "bg-white border-indigo-300 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                  >
                    <option value="all">Todos</option>
                    <option value="inStock">En stock</option>
                    <option value="outOfStock">Agotado</option>
                  </select>
                </div>
              </div>

              {/* Botón para limpiar filtros y contador de resultados */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-indigo-200/20">
                <div className={`text-sm ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}>
                  Mostrando {filteredProducts.length} de {products.length} productos
                </div>
                <button
                  onClick={clearFilters}
                  className={`mt-2 sm:mt-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-indigo-700 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                      : "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                  }`}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className={`mt-4 text-lg ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                  Cargando productos...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                      theme === "dark"
                        ? "bg-indigo-800/50 border border-indigo-700/50"
                        : "bg-white shadow-md border border-indigo-100"
                    }`}
                  >
                    {/* Imagen del producto */}
                    <div className="relative h-48 overflow-hidden">
                      {prod.images.length > 0 ? (
                        <img
                          src={prod.images[0].url || "/placeholder.svg"}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            theme === "dark" ? "bg-indigo-800" : "bg-indigo-100"
                          }`}
                        >
                          <FiImage
                            className={`w-12 h-12 ${theme === "dark" ? "text-indigo-600" : "text-indigo-400"}`}
                          />
                        </div>
                      )}

                      {/* Overlay con botón de vista */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <button
                          className={`opacity-0 group-hover:opacity-100 transition-all duration-300 px-4 py-2 rounded-full ${
                            theme === "dark" ? "bg-white/90 text-indigo-900" : "bg-indigo-900/90 text-white"
                          } flex items-center gap-2`}
                        >
                          <FiEye className="w-4 h-4" />
                          Ver detalles
                        </button>
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3
                          className={`text-lg font-bold line-clamp-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}
                        >
                          {prod.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prod.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {prod.stock > 0 ? `Stock: ${prod.stock}` : "Agotado"}
                        </span>
                      </div>

                      <p
                        className={`text-sm mb-4 line-clamp-2 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}
                      >
                        {prod.description}
                      </p>

                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-bold text-pink-600">${prod.price}</span>
                        {prod.category && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              theme === "dark" ? "bg-indigo-800 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                            }`}
                          >
                            {prod.category}
                          </span>
                        )}
                      </div>

                      {/* Acciones (editar/eliminar) */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30"
                              : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          <FiEdit className="mr-2 w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            theme === "dark"
                              ? "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30"
                              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-20 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                <FiPackage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                  {products.length === 0 ? "No hay productos" : "No se encontraron productos"}
                </h3>
                <p>
                  {products.length === 0
                    ? "Crea tu primer producto para comenzar"
                    : "Intenta ajustar los filtros de búsqueda"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProductsPage
