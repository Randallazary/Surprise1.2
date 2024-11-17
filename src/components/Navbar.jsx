"use client"; // Indicar que es un Client Component

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaBars, FaFileInvoice, FaMoon, FaSun } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import logo from "../assets/Surprise-logo.jpg";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { useRouter } from "next/navigation"; // Importa el hook de useRouter para la redirección

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleDocumentAdminMenu = () => setDocumentAdminMenuOpen(!documentAdminMenuOpen);

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
            ? "bg-gray-900 border-gray-700 text-gray-200"
            : "bg-[#ffd2bf] border-gray-200 text-gray-700"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4">
          {/* Logo y Menú de Categorías */}
          <div className="flex items-center space-x-4">
            <Link href={"/"} className="flex items-center">
              <Image
                src={logo}
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

          {/* Campo de Búsqueda */}
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

          {/* Íconos de Usuario, Cotizador, Carrito y Menú */}
          <div className="flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex flex-col items-center ${
                  theme === "dark"
                    
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
                    <div className="flex flex-col items-center pb-4 border-b border-gray-300">
                    <Link href="/login">
                      <p
                        className={`px-4 py-2 mb-2 w-full text-center rounded-lg ${
                          theme === "dark"
                            ? "border border-gray-500 text-gray-300 hover:bg-gray-700"
                            : "bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-100 hover:text-green-700"
                        }`}
                      >
                        Iniciar Sesión
                      </p>
                    </Link>
                    <Link href="/register">
                      <p className="w-full text-center bg-green-700 text-white hover:bg-green-600 px-4 py-2 rounded-lg">
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
                          Ver perfil
                        </p>
                      </Link>
                      {user?.role === "admin" && (
                        <div className="mt-4">
                          <button
                            onClick={toggleAdminMenu}
                            className={`w-full text-left font-semibold ${
                              theme === "dark"
                                
                            }`}
                          >
                            Opciones de Admin
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
                                     
                                  }`}
                                >
                                  Panel admin 
                                  </p>
                              </Link>
                              <Link href="/adminUsuarios">
                                <p
                                  className={`mt-2 ${
                                    theme === "dark"
                                      
                                  }`}
                                >
                                  Administrar Usuarios
                                </p>
                              </Link>
                              {/* Menú adicional para gestión de documentos */}
                              <button
                                onClick={toggleDocumentAdminMenu}
                                className={`mt-4 w-full text-left font-semibold ${
                                  theme === "dark"
                                  
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
                                         
                                      }`}
                                    >
                                      Administrar Políticas
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos2">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                         
                                      }`}
                                    >
                                      Administrar Términos
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos3">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          
                                      }`}
                                    >
                                      Administrar Deslinde
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
              href="/cotizador"
              className={`flex flex-col items-center ${
                theme === "dark"
                
              }`}
            >
              <FaFileInvoice className="w-6 h-6" />
              <span className="text-sm">Cotizador</span>
            </Link>
            <Link
              href="/carrito"
              className={`flex flex-col items-center ${
                theme === "dark"
                  
              }`}
            >
              <FaShoppingCart className="w-6 h-6" />
              <span className="text-sm">Carrito</span>
            </Link>
            <button
              onClick={toggleTheme}
              className={`flex flex-col items-center ${
                theme === "dark"
              
              }`}
            >
              {theme === "dark" ? (
                <>
                  <FaSun className="w-6 h-6" />
                  <span className="text-sm">Claro</span>
                </>
              ) : (
                <>
                  <FaMoon className="w-6 h-6" />
                  <span className="text-sm">Oscuro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
