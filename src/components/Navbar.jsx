"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FaUser,
  FaShoppingCart,
  FaBars,
  FaFileInvoice,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaBoxes,
  FaTags,
  FaInfoCircle,
  FaPhone,
  FaTruck,
  FaSignInAlt,
  FaUserPlus,

} from "react-icons/fa"
import { MdCelebration } from "react-icons/md";
import { FiSearch } from "react-icons/fi"
import { useLogo } from "../context/LogoContext"
import { useAuth } from "../context/authContext"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [documentsMenuOpen, setDocumentsMenuOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const dropdownRef = useRef(null)
  const { cartCount } = useCart()
  const router = useRouter()
  const { logoUrl } = useLogo()

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
        setAdminMenuOpen(false)
        setDocumentsMenuOpen(false)
        setProductsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      router.push(`/ventaProducto?search=${encodeURIComponent(searchQuery)}`)
      // Resetear el estado de búsqueda después de un pequeño delay
      setTimeout(() => setIsSearching(false), 1000)
    }
  }

  // Navegación principal con íconos
  const mainNavItems = [
    { name: "Inicio", path: "/", icon: FaHome },
    { name: "Catálogo", path: "/catalog", icon: FaBoxes },
    { name: "Ocaciones", path: "/ocasiones", icon: MdCelebration },
    { name: "Ofertas y Descuentos", path: "/ofertas", icon: FaTags },
 
    ...(isAuthenticated ? [{ name: "Seguimiento", path: "/mispedidos", icon: FaTruck }] : []),
  ]

  return (
    <>
      {/* Navbar principal */}
      <nav className={`sticky top-0 w-full z-50 ${theme === "dark" ? "bg-indigo-950" : "bg-white"} shadow-md`}>
        <div className="container px-4 mx-auto">
          {/* Primera fila - Logo, búsqueda y acciones */}
          <div className="flex items-center justify-between py-3">
            {/* Logo y menú hamburguesa móvil */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className={`mr-4 p-2 rounded-full md:hidden ${
                  theme === "dark"
                    ? "text-sky-200 hover:bg-indigo-900 hover:text-pink-400"
                    : "text-indigo-800 hover:bg-indigo-50 hover:text-pink-600"
                }`}
              >
                <FaBars className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center">
                {logoUrl ? (
                  <Image
                    src={logoUrl || "/assets/logo-actual.png"}
                    alt="Logo de la empresa"
                    width={120}
                    height={50}
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-[120px] h-[50px] bg-indigo-200 animate-pulse" />
                )}
              </Link>
            </div>

            {/* Búsqueda - Solo en desktop */}
            <div className="items-center flex-1 hidden max-w-2xl mx-6 md:flex">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar producto, marca, categoría..."
                  className={`w-full px-4 py-2 rounded-l-lg border ${
                    theme === "dark"
                      ? "bg-indigo-900 border-indigo-700 text-indigo-100 placeholder-slate-400"
                      : "border-indigo-200 placeholder-slate-500 bg-white"
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`px-4 py-2 rounded-r-lg flex items-center ${
                    theme === "dark"
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } ${isSearching ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {isSearching ? (
                    <svg
                      className="w-5 h-5 mr-2 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FiSearch className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-4">
              {/* Botón de tema */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full hidden sm:inline-flex ${
                  theme === "dark" ? "text-pink-400 hover:bg-indigo-900" : "text-indigo-800 hover:bg-indigo-50"
                }`}
                aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
              >
                {theme === "light" ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
              </button>

              {/* Carrito con indicador */}
              <Link
                href="/Carrito"
                className={`p-2 rounded-full relative ${
                  theme === "dark"
                    ? "text-sky-200 hover:bg-indigo-900 hover:text-pink-400"
                    : "text-indigo-800 hover:bg-indigo-50 hover:text-pink-600"
                }`}
                aria-label="Carrito de compras"
              >
                <FaShoppingCart className="w-5 h-5" />
                {/* Indicador de items en carrito - ahora con el contador real */}
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${
                      theme === "dark" ? "bg-pink-500 text-white" : "bg-pink-600 text-white"
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

            

              {/* Usuario con tooltip */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className={`p-2 rounded-full group relative ${
                    theme === "dark"
                      ? "text-sky-200 hover:bg-indigo-900 hover:text-pink-400"
                      : "text-indigo-800 hover:bg-indigo-50 hover:text-pink-600"
                  }`}
                  aria-label="Menú de usuario"
                >
                  <FaUser className="w-5 h-5" />
                  {/* Tooltip para indicar que es clickeable */}
                  <span
                    className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded ${
                      theme === "dark" ? "bg-indigo-900 text-pink-400" : "bg-indigo-100 text-slate-700"
                    } opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                  >
                    Mi cuenta
                  </span>
                </button>

                {/* Dropdown de usuario */}
                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-2 z-50 ${
                      theme === "dark"
                        ? "bg-indigo-900 text-indigo-100 border border-indigo-700"
                        : "bg-white text-slate-700 border border-indigo-200"
                    }`}
                  >
                    {!isAuthenticated ? (
                      <div className="p-4">
                        <p className="mb-3 text-sm">Accede a tu cuenta</p>
                        <div className="flex flex-col space-y-2">
                          <Link href="/login">
                            <button
                              className={`w-full py-2 rounded-lg text-sm flex items-center justify-center ${
                                theme === "dark"
                                  ? "border border-indigo-700 hover:bg-indigo-900"
                                  : "border border-indigo-200 hover:bg-indigo-50"
                              }`}
                            >
                              <FaSignInAlt className="mr-2" /> Iniciar Sesión
                            </button>
                          </Link>
                          <Link href="/register">
                            <button className="flex items-center justify-center w-full py-2 text-sm text-white bg-pink-500 rounded-lg hover:bg-pink-600">
                              <FaUserPlus className="mr-2" /> Crear Cuenta
                            </button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center mb-3 space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              theme === "dark" ? "bg-slate-700" : "bg-indigo-100"
                            }`}
                          >
                            <FaUser className="text-lg" />
                          </div>
                          <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-xs opacity-75">{user?.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link href="/profileuser">
                            <p
                              className={`flex items-center py-2 px-3 rounded ${
                                theme === "dark"
                                  ? "hover:bg-indigo-900 hover:text-pink-400"
                                  : "hover:bg-indigo-50 hover:text-pink-600"
                              }`}
                            >
                              <FaUser className="mr-2 text-sm" /> Mi perfil
                            </p>
                          </Link>
                          {user?.role === "admin" && (
                            <>
                              {/* Menú de Administrador */}
                              <div
                                className={`py-2 px-3 rounded cursor-pointer ${
                                  theme === "dark"
                                    ? "hover:bg-indigo-900 hover:text-pink-400"
                                    : "hover:bg-indigo-50 hover:text-pink-600"
                                }`}
                                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <FaUser className="mr-2 text-sm" /> Administración
                                  </span>
                                  {adminMenuOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                </div>
                                {adminMenuOpen && (
                                  <div className="mt-2 ml-4 space-y-2">
                                    <Link href="/adminDashboard">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${
                                          theme === "dark"
                                            ? "hover:bg-indigo-900 hover:text-pink-400"
                                            : "hover:bg-indigo-50 hover:text-pink-600"
                                        }`}
                                      >
                                        <span className="ml-4">Dashboard</span>
                                      </p>
                                    </Link>
                                    <Link href="/adminUsuarios">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${
                                          theme === "dark"
                                            ? "hover:bg-indigo-900 hover:text-pink-400"
                                            : "hover:bg-indigo-50 hover:text-pink-600"
                                        }`}
                                      >
                                        <span className="ml-4">Usuarios</span>
                                      </p>
                                    </Link>
                                  </div>
                                )}
                              </div>

                              {/* Menú de Documentos */}
                              <div
                                className={`py-2 px-3 rounded cursor-pointer ${
                                  theme === "dark"
                                    ? "hover:bg-indigo-900 hover:text-pink-400"
                                    : "hover:bg-indigo-50 hover:text-pink-600"
                                }`}
                                onClick={() => setDocumentsMenuOpen(!documentsMenuOpen)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <FaFileInvoice className="mr-2 text-sm" /> Documentos
                                  </span>
                                  {documentsMenuOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                </div>
                                {documentsMenuOpen && (
                                  <div className="mt-2 ml-4 space-y-2">
                                    {[
                                      {
                                        path: "/adminDocumentos",
                                        name: "Políticas",
                                      },
                                      {
                                        path: "/adminDocumentos2",
                                        name: "Términos",
                                      },
                                      {
                                        path: "/adminDocumentos3",
                                        name: "Deslinde",
                                      },
                                      { path: "/adminLogo", name: "Logo" },
                                    ].map((doc, i) => (
                                      <Link key={i} href={doc.path}>
                                        <p
                                          className={`py-1 px-2 rounded flex items-center ${
                                            theme === "dark"
                                              ? "hover:bg-indigo-900 hover:text-pink-400"
                                              : "hover:bg-indigo-50 hover:text-pink-600"
                                          }`}
                                        >
                                          <span className="ml-4">{doc.name}</span>
                                        </p>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Menú de Productos */}
                              <div
                                className={`py-2 px-3 rounded cursor-pointer ${
                                  theme === "dark"
                                    ? "hover:bg-indigo-900 hover:text-pink-400"
                                    : "hover:bg-indigo-50 hover:text-pink-600"
                                }`}
                                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <FaBoxes className="mr-2 text-sm" /> Productos
                                  </span>
                                  {productsMenuOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                </div>
                                {productsMenuOpen && (
                                  <div className="mt-2 ml-4 space-y-2">
                                    <Link href="/adminProductos">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${
                                          theme === "dark"
                                            ? "hover:bg-indigo-900 hover:text-pink-400"
                                            : "hover:bg-indigo-50 hover:text-pink-600"
                                        }`}
                                      >
                                        <span className="ml-4">Todos los Productos</span>
                                      </p>
                                    </Link>
                                    <Link href="/adminDashboardProductos">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${
                                          theme === "dark"
                                            ? "hover:bg-indigo-900 hover:text-pink-400"
                                            : "hover:bg-indigo-50 hover:text-pink-600"
                                        }`}
                                      >
                                        <span className="ml-4">Estadísticas</span>
                                      </p>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                          <button
                            onClick={handleLogout}
                            className={`w-full text-left py-2 px-3 rounded flex items-center ${
                              theme === "dark"
                                ? "hover:bg-indigo-900 text-red-400 hover:text-red-300"
                                : "hover:bg-indigo-50 text-red-600 hover:text-red-500"
                            }`}
                          >
                            <FaSignInAlt className="mr-2 transform rotate-180" /> Cerrar sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Segunda fila - Navegación principal */}
          <div
            className={`hidden md:flex items-center justify-center py-2 border-t ${
              theme === "dark" ? "border-indigo-700" : "border-indigo-200"
            }`}
          >
            <div className="flex space-x-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`py-2 px-1 text-sm font-medium flex items-center ${
                    theme === "dark" ? "text-sky-200 hover:text-pink-400" : "text-indigo-800 hover:text-pink-600"
                  }`}
                >
                  <item.icon className="mr-2 text-sm" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden py-4 fixed inset-0 bg-black bg-opacity-50 z-40 ${
                theme === "dark" ? "text-sky-100" : "text-slate-700"
              }`}
              onClick={toggleMobileMenu}
            >
              <div
                className={`w-4/5 h-full overflow-y-auto ${theme === "dark" ? "bg-indigo-950" : "bg-white"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4">
                  {/* Búsqueda en móvil */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex w-full">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar producto..."
                        className={`w-full px-4 py-2 rounded-l-lg border ${
                          theme === "dark"
                            ? "bg-indigo-900 border-indigo-700 text-indigo-100 placeholder-slate-400"
                            : "border-indigo-200 placeholder-slate-500 bg-white"
                        } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                      />
                      <button
                        type="submit"
                        disabled={isSearching}
                        className={`px-4 py-2 rounded-r-lg ${
                          theme === "dark"
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        } ${isSearching ? "opacity-75 cursor-not-allowed" : ""}`}
                      >
                        <FiSearch className="w-5 h-5" />
                      </button>
                    </div>
                  </form>

                  {/* Navegación en móvil */}
                  <div className="space-y-1">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`py-3 px-4 rounded flex items-center ${
                          theme === "dark"
                            ? "hover:bg-indigo-900 hover:text-pink-400"
                            : "hover:bg-indigo-50 hover:text-pink-600"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        <item.icon className="mr-3" />
                        {item.name}
                      </Link>
                    ))}

                    {/* Opciones de cuenta */}
                    <div className="pt-4 mt-4 border-t">
                      {!isAuthenticated ? (
                        <>
                          <Link href="/login">
                            <div
                              className={`py-3 px-4 rounded flex items-center ${
                                theme === "dark"
                                  ? "hover:bg-indigo-900 hover:text-pink-400"
                                  : "hover:bg-indigo-50 hover:text-pink-600"
                              }`}
                              onClick={toggleMobileMenu}
                            >
                              <FaSignInAlt className="mr-3" /> Iniciar Sesión
                            </div>
                          </Link>
                          <Link href="/register">
                            <div
                              className={`py-3 px-4 rounded flex items-center ${
                                theme === "dark"
                                  ? "hover:bg-indigo-900 hover:text-pink-400"
                                  : "hover:bg-indigo-50 hover:text-pink-600"
                              }`}
                              onClick={toggleMobileMenu}
                            >
                              <FaUserPlus className="mr-3" /> Crear Cuenta
                            </div>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/profileuser">
                            <div
                              className={`py-3 px-4 rounded flex items-center ${
                                theme === "dark"
                                  ? "hover:bg-indigo-900 hover:text-pink-400"
                                  : "hover:bg-indigo-50 hover:text-pink-600"
                              }`}
                              onClick={toggleMobileMenu}
                            >
                              <FaUser className="mr-3" /> Mi Perfil
                            </div>
                          </Link>
                          {user?.role === "admin" && (
                            <>
                              <div className="flex items-center px-4 py-2 font-medium">
                                <FaUser className="mr-3" /> Administración
                              </div>
                              <div className="ml-6 space-y-1">
                                <Link href="/adminDashboard">
                                  <div
                                    className={`py-2 px-4 rounded flex items-center ${
                                      theme === "dark"
                                        ? "hover:bg-indigo-900 hover:text-pink-400"
                                        : "hover:bg-indigo-50 hover:text-pink-600"
                                    }`}
                                    onClick={toggleMobileMenu}
                                  >
                                    Dashboard
                                  </div>
                                </Link>
                                <Link href="/adminUsuarios">
                                  <div
                                    className={`py-2 px-4 rounded flex items-center ${
                                      theme === "dark"
                                        ? "hover:bg-indigo-900 hover:text-pink-400"
                                        : "hover:bg-indigo-50 hover:text-pink-600"
                                    }`}
                                    onClick={toggleMobileMenu}
                                  >
                                    Usuarios
                                  </div>
                                </Link>
                              </div>
                            </>
                          )}
                          <button
                            onClick={() => {
                              handleLogout()
                              toggleMobileMenu()
                            }}
                            className={`w-full text-left py-3 px-4 rounded flex items-center ${
                              theme === "dark"
                                ? "hover:bg-indigo-900 text-red-400 hover:text-red-300"
                                : "hover:bg-indigo-50 text-red-600 hover:text-red-500"
                            }`}
                          >
                            <FaSignInAlt className="mr-3 transform rotate-180" /> Cerrar Sesión
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
