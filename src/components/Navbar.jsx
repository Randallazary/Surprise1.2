import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaBars, FaFileInvoice, FaMoon, FaSun } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useLogo } from "../context/LogoContext";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../app/config/config";

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Para el menú móvil
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { logoUrl } = useLogo();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleDocumentAdminMenu = () => setDocumentAdminMenuOpen(!documentAdminMenuOpen);
  const toggleMobileMenu = () => setMenuOpen(!menuOpen); // Para alternar el menú móvil

  // Función para cerrar el menú móvil cuando se hace clic en un enlace
  const closeMobileMenu = () => setMenuOpen(false);

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
      {/* Navbar principal */}
      <nav
        className={`sticky top-0 w-full z-50 shadow-md ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-200"
            : "bg-gradient-to-r from-blue-300 to-purple-400 border-gray-200 text-gray-700"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4">
          {/* Logo y Menú de Categorías */}
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

          {/* Menú de hamburguesa (solo en pantallas pequeñas) */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center text-xl"
          >
            <FaBars />
          </button>

          {/* Campo de Búsqueda */}
          <div className="hidden lg:flex items-center w-1/2">
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

          {/* Íconos de Usuario, Cotizador, Carrito y Menú */}
          <div className="hidden lg:flex items-center space-x-6">
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

              {/* Dropdown de usuario */}
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-4 z-50 ${
                    theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
                  }`}
                >
                  {!isAuthenticated ? (
                    <div className="flex flex-col items-center pb-4 border-b border-gray-300">
                      <Link href="/login" onClick={closeMobileMenu}>
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
                      <Link href="/register" onClick={closeMobileMenu}>
                        <p className="w-full text-center bg-purple-700 text-white hover:bg-purple-600 px-4 py-2 rounded-lg">
                          Crear Cuenta
                        </p>
                      </Link>
                    </div>
                  ) : (
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold">¡Hola, {user?.name}!</p>
                      <Link href="/profileuser" onClick={closeMobileMenu}>
                        <p className={`mt-2 font-semibold ${theme === "dark" ? "" : ""}`}></p>
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
                                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <Link href="/adminDashboard" onClick={closeMobileMenu}>
                                <p
                                  className={`mt-2 ${
                                    theme === "dark" ? "hover:text-purple-400" : "hover:text-blue-400"
                                  }`}
                                >
                                  Panel administrador
                                </p>
                              </Link>
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
              onClick={closeMobileMenu}
              className={`flex flex-col items-center ${
                theme === "dark" ? "hover:text-purple-600" : "hover:text-blue-600"
              }`}
            >
              <FaShoppingCart className="w-6 h-6" />
              <span className="text-sm">Compras</span>
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                closeMobileMenu(); // Cierra el menú al cambiar el tema
              }}
              className={`flex flex-col items-center ${
                theme === "dark" ? "hover:text-yellow-300" : "hover:text-black-1000"
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
                  <span className="text-sm">Tema oscuro</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="lg:hidden bg-gray-800 text-white p-4">
            <Link href="/login" onClick={closeMobileMenu} className="block py-2">
              Iniciar sesión
            </Link>
            <Link href="/register" onClick={closeMobileMenu} className="block py-2">
              Crear Cuenta
            </Link>
            <Link href="/ventaProducto" onClick={closeMobileMenu} className="block py-2">
              Compras
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                closeMobileMenu(); // Cierra el menú al cambiar el tema
              }}
              className="block py-2 text-sm"
            >
              Cambiar Tema
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
