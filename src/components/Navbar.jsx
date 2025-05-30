/*"use client"; // Indicar que es un Client Component

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaBars, FaFileInvoice, FaMoon, FaSun } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useLogo } from "../context/LogoContext";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { useRouter } from "next/navigation"; // Importa el hook de useRouter para la redirección
import { CONFIGURACIONES } from "../app/config/config";

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const {logoUrl} = useLogo();

  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleDocumentAdminMenu = () => setDocumentAdminMenuOpen(!documentAdminMenuOpen);


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setFiltersVisible(event.target.value.length > 0); // Mostrar filtros si hay algo en la búsqueda
  };

  // Filtrar productos (puedes ajustar esto según tu lógica)
  const handleFilterChange = () => {
    // Aquí puedes hacer un filtro real basado en el estado de los filtros
    console.log("Filtrando por:", { searchQuery, selectedCategory, selectedPriceRange });
  };

  
  // Este useEffect asegura que el componente se renderice solo después de que esté montado en el cliente
  useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
        setDocumentAdminMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/ultimo`);
      if (response.ok) {
        const data = await response.json();
        setLogoUrl(`${data.url}?timestamp=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error("Error al obtener el logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo(); // Cargar logo al iniciar la app
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isMounted) return null;
  
  return (
    <>
      {/* Navbar principal *
      <nav
        className={`sticky top-0 w-full z-50 shadow-md ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-200"
            : "bg-gradient-to-r from-blue-300 to-purple-400 border-gray-200 text-gray-700"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4">
           //Logo y Menú de Categorías 
          <div className="flex items-center space-x-4">
            <Link href={"/"} className="flex items-center">
              <Image
                src={logoUrl || "/fallback-logo.png"}
                alt="surprise"
                width={100}
                height={40}
                className="object-contain"
              />
              <div
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                ¿Alguien dijo regalos?
              </div>
            </Link>
          </div>

          {/* Campo de Búsqueda *
          <div className="flex items-center w-1/2">
            <input
              type="text"
              placeholder="Buscar la mejor opción para regalar"
              className={`w-full px-4 py-2 rounded-l-lg focus:outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "border-gray-300"
              }`}
            />
            <button
              className={`px-4 py-2 rounded-r-lg ${
                theme === "dark"
                  ? "bg-pink-500 text-gray-900"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </div>

          {/* Íconos de Usuario, Cotizador, Carrito y Menú *
          <div className="flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex flex-col items-center ${
                  theme === "dark"
                  ? "hover:text-purple-600"
                                          : "hover:text-blue-600"
                    
                }`}
              >
                <FaUser className="w-6 h-6" />
                <span className="text-sm">
                  {isAuthenticated ? user?.name : "Iniciar Sesión"}
                </span>
              </button>


              {/* Dropdown de usuario *
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-4 z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-200"
                      : "bg-white text-gray-700"
                      
                  }`}
                >
                  {!isAuthenticated ? (
                    <div className="flex flex-col items-center pb-4 border-b border-gray-300">
                    <Link href="/login">
                      <p
                        className={`px-4 py-2 mb-2 w-full text-center rounded-lg ${
                          theme === "dark"
                            ? "border border-gray-500 text-gray-300 hover:bg-gray-700"
                            : "bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-100 hover:text-purple-700"
                        }`}
                      >
                        Iniciar Sesión
                      </p>
                    </Link>
                    <Link href="/register">
                      <p className="w-full text-center bg-purple-700 text-white hover:bg-purple-600 px-4 py-2 rounded-lg">
                        Crear Cuenta
                      </p>
                    </Link>
                  </div>                  
                  ) : (
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold">¡Hola, {user?.name}!</p>
                      <Link href="/profileuser">
                        <p
                          className={`mt-2 font-semibold ${
                            theme === "dark"
                           
                          }`}
                        >
                         
                        </p>
                      </Link>
                      {user?.role === "admin" && (
                        <div className="mt-4">
                          <button
                            onClick={toggleAdminMenu}
                            className={`w-full text-left font-semibold ${
                              theme === "dark"
                              ? "hover:text-pink-400"
                                          : "hover:text-green-600"
                                
                            }`}
                          >
                            Opciones de Administrador
                          </button>
                          {adminMenuOpen && (
                            <div
                              className={`mt-2 border-t ${
                                theme === "dark"
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <Link href="/adminDashboard">
                                <p
                                  className={`mt-2 ${
                                    theme === "dark"
                                    ? "hover:text-purple-400"
                                          : "hover:text-blue-400"
                                     
                                  }`}
                                >
                                  Panel administrador
                                  </p>
                              </Link>
                              <Link href="/adminUsuarios">
                                <p
                                  className={`mt-2 ${
                                    theme === "dark"
                                    ? "hover:text-purple-400"
                                          : "hover:text-blue-400"
                                      
                                  }`}
                                >
                                  Administracion Usuarios
                                </p>
                              </Link>
                              {/* Menú adicional para gestión de documentos *
                              <button
                                onClick={toggleDocumentAdminMenu}
                                className={`mt-4 w-full text-left font-semibold ${
                                  theme === "dark"
                                   ? "hover:text-pink-400"
                                          : "hover:text-green-600"
                                  
                                }`}
                              >
                                Gestión de Documentos
                              </button>
                              {documentAdminMenuOpen && (
                                <div
                                  className={`mt-2 border-t ${
                                    theme === "dark"
                                      ? "bg-gray-800 border-gray-700"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <Link href="/adminDocumentos">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                       ? "hover:text-purple-400"
                                          : "hover:text-blue-400"
                                      }`}
                                    >
                                      Administrar Políticas
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos2">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                        ? "hover:text-purple-400"
                                          : "hover:text-blue-400"
                                         
                                      }`}
                                    >
                                      Administrar Términos
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos3">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                      ? "hover:text-purple-400"
                                          : "hover:text-blue-400"
                                          
                                      }`}
                                    >
                                       Administrar Deslinde
                                    </p>
                                  </Link>
                                  <Link href="/adminLogo">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                         ? "hover:text-purple-400"
                                          : "hover:text-blue-400"
                                      }`}
                                    >
                                      Administrar Logo
                                    </p>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={handleLogout}
                        className="mt-2 text-red-500 hover:text-red-400"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/ventaProducto"
              className={`flex flex-col items-center ${
                theme === "dark"
                ? "hover:text-purple-600"
                                          : "hover:text-blue-600"
                
              }`}
            >
             
              <FaShoppingCart className="w-6 h-6" />
              <span className="text-sm">Compras</span>
            </Link>
            <button
              onClick={toggleTheme}
              className={`flex flex-col items-center ${
                theme === "dark"
                ? "hover:text-yellow-300"
                                          : "hover:text-black-1000"
              
              }`}
            >
              {theme === "dark" ? (
                <>
                  <FaSun className="w-6 h-6" />
                  <span className="text-sm">Tema Claro</span>

                </>
              ) : (
                <>
                  <FaMoon className="w-6 h-6" />
                  <span className="text-sm">Tema obscuro</span>
                </>
              )}
            </button>
          </div>
          
        </div>
      </nav>
    </>
  );
}

export default Navbar;*/
"use client"; // Indicar que es un Client Component

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaShoppingCart,
  FaFileInvoice,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useLogo } from "../context/LogoContext";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../app/config/config";

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const [productAdminMenuOpen, setProductAdminMenuOpen] = useState(false); // Definición añadida para menú de productos
  const dropdownRef = useRef(null);
  const router = useRouter();
  // Tomamos `logoUrl`, `setLogoUrl` y `fetchLogo` del LogoContext
  const { logoUrl, setLogoUrl, fetchLogo } = useLogo();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleDocumentAdminMenu = () =>
    setDocumentAdminMenuOpen(!documentAdminMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
        setDocumentAdminMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Si deseas refrescar el logo manualmente (por ejemplo, en un botón), puedes llamar `fetchLogo()`.
  // useEffect(() => {
  //   fetchLogo();
  // }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      
      {/* Navbar principal */}
      <nav
        className={`sticky top-0 w-full z-50 shadow-md ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700 text-gray-200"
            : "bg-[linear-gradient(to_right_top,_#ab46d2,_#8b76f0,_#7199ff,_#6eb6ff,_#88cfff,_#8edbff,_#9ae6ff,_#a9f0ff,_#97f3ff,_#84f6fd,_#71f9f8,_#5ffbf1);]  border-gray-200 text-gray-700"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4">
          {/* Logo y Menú de Categorías */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              {/* Si logoUrl está cargando (null), muestra un placeholder */}
              {logoUrl ? (
                <Image
                  src="/assets/Surprise-logo.jpg"
                  alt="suprise"
                  width={100}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <div className="w-[100px] h-[40px] bg-gray-300 animate-pulse" />
              )}
            </Link>
           
          </div>
          {/* Campo de Búsqueda */}
          <form
            action="/ventaProducto" // Redirige a la página de productos
            method="GET" // Usa el método GET para pasar el parámetro en la URL
            className="flex items-center w-1/2"
          >
            <input
              type="text"
              name="search" // Nombre del parámetro que se enviará en la URL
              placeholder="Buscar producto"
              className={`w-full px-4 py-2 rounded-l-lg focus:outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "border-gray-300"
              }`}
            />
            <button
              type="submit" // Botón para enviar el formulario
              className={`px-4 py-2 rounded-r-lg ${
                theme === "dark"
                  ? "bg-blue-500 text-gray-900"
                  : "bg-purple-500 text-white hover:bg-blue-600"
              }`}
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </form>

          {/* Íconos de Usuario, Cotizador, Carrito y Menú */}
          <div className="flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex flex-col items-center ${
                  theme === "dark"
                    ? "text-gray-200 hover:text-purple-400"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <FaUser className="w-6 h-6" />
                <span className="text-sm">
                  {isAuthenticated ? user?.name : "Iniciar Sesión"}
                </span>
              </button>

              {/* Dropdown de usuario */}
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-4 z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-200"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {!isAuthenticated ? (
                    <div className="flex justify-around items-center pb-4 border-b border-gray-300">
                      <Link href="/login">
                        <p
                          className={`px-4 py-2 rounded-lg ${
                            theme === "dark"
                              ? "border border-gray-500 text-gray-300 hover:bg-gray-700"
                              : "bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-100 hover:text-purple-700"
                          }`}
                        >
                          Ingresar
                        </p>
                      </Link>
                      <Link href="/register">
                        <p className="bg-purple-700 text-white hover:bg-blue-600 px-4 py-2 rounded-lg">
                          Crear Cuenta
                        </p>
                      </Link>
                    </div>
                  ) : (
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold">
                        ¡Hola, {user?.name}!
                      </p>
                      <Link href="/profileuser">
                        <p
                          className={`mt-2 font-semibold ${
                            theme === "dark"
                              ? "hover:text-purple-400"
                              : "hover:text-blue-700"
                          }`}
                        >
                          Ver perfil
                        </p>
                      </Link>
                      {user?.role === "admin" && (
                        <div className="mt-4">
                          <button
                            onClick={toggleAdminMenu}
                            className={`w-full text-left font-semibold ${
                              theme === "dark"
                                ? "hover:text-purple-400"
                                : "hover:text-blue-700"
                            }`}
                          >
                            Opciones de Administrador
                          </button>
                          {adminMenuOpen && (
                            <div
                              className={`mt-2 border-t ${
                                theme === "dark"
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <Link href="/adminDashboard">
                                <p
                                  className={`mt-2 ${
                                    theme === "dark"
                                      ? "hover:text-purple-400"
                                      : "hover:text-blue-700"
                                  }`}
                                >
                                  Dashboard Admin
                                </p>
                              </Link>
                              <Link href="/adminUsuarios">
                                <p
                                  className={`mt-2 ${
                                    theme === "dark"
                                      ? "hover:text-purple-400"
                                      : "hover:text-blue-700"
                                  }`}
                                >
                                  Administrar Usuarios
                                </p>
                              </Link>
                            </div>
                          )}
                          {user?.role === "admin" && (
                            <div className="mt-4">
                              <button
                                onClick={toggleDocumentAdminMenu}
                                className={`w-full text-left font-semibold ${
                                  theme === "dark"
                                    ? "hover:text-purple-400"
                                    : "hover:text-blue-700"
                                }`}
                              >
                                Gestión de Documentos
                              </button>
                              {documentAdminMenuOpen && (
                                <div
                                  className={`mt-2 border-t ${
                                    theme === "dark"
                                      ? "bg-gray-800 border-gray-700"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <Link href="/adminDocumentos">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-purple-400"
                                          : "hover:text-blue-700"
                                      }`}
                                    >
                                      Administrar Politicas
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos2">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-purple-400"
                                          : "hover:text-blue-700"
                                      }`}
                                    >
                                      Administrar Terminos
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos3">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-purple-400"
                                          : "hover:text-blue-700"
                                      }`}
                                    >
                                      Administrar Deslinde
                                    </p>
                                  </Link>
                                  <Link href="/adminLogo">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-purple-400"
                                          : "hover:text-blue-700"
                                      }`}
                                    >
                                      Administrar Logo
                                    </p>
                                  </Link>
                                </div>
                              )}
                              <button
                                onClick={() =>
                                  setProductAdminMenuOpen(!productAdminMenuOpen)
                                }
                                className={`${
                                  theme === "dark"
                                    ? "hover:text-purple-400"
                                    : "hover:text-blue-700"
                                }`}
                              >
                                Gestión de Productos
                              </button>
                              {productAdminMenuOpen && (
                                <div
                                  className={`mt-2 border-t ${
                                    theme === "dark"
                                      ? "bg-gray-800 border-gray-700"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <Link href="/adminProductos">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-purple-400"
                                          : "hover:text-blue-700"
                                      }`}
                                    >
                                      Administrar Todos los Productos
                                    </p>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={handleLogout}
                        className="mt-2 text-red-500 hover:text-red-400"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

           
            <Link
              href="/ventaProducto"
              className={`flex flex-col items-center ${
                theme === "dark"
                  ? "text-gray-200 hover:text-purple-400"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <FaShoppingCart className="w-6 h-6" />
              <span className="text-sm">Tienda</span>
            </Link>

            {/* Botón de alternancia de tema con iconos de sol/luna */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center ${
                theme === "dark"
                  ? "text-red-400"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {theme === "light" ? (
                <FaMoon className="w-6 h-6" title="Modo Oscuro" />
              ) : (
                <FaSun className="w-6 h-6" title="Modo Claro" />
              )}
            </button>
          </div>
        </div>
        <div className="container mx-auto flex justify-center space-x-8 font-semibold">
          <Link href="/" className="hover:underline">Inicio</Link>
          <Link href="/catalog" className="hover:underline">Catálogo</Link>
          <Link href="/promotion" className="text-red-600 hover:underline">Promociones y descuentos</Link>
          <Link href="/proyeccionVentas" className="text-red-600 hover:underline">Propuesta</Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;



