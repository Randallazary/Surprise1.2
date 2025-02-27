"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";

function ProductosPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [filtroRating, setFiltroRating] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/productos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          throw new Error("Error al obtener los productos");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar los productos");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProductos();
    }
  }, [isAuthenticated]);

  const productosFiltrados = productos.filter((producto) => {
    const coincideConBusquedaGeneral =
      busquedaGeneral === "" ||
      producto.name.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.description.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.category.toLowerCase().includes(busquedaGeneral.toLowerCase());

    return (
      coincideConBusquedaGeneral &&
      (filtroCategoria === "" || producto.category === filtroCategoria) &&
      (filtroPrecioMin === "" || producto.price >= parseFloat(filtroPrecioMin)) &&
      (filtroPrecioMax === "" || producto.price <= parseFloat(filtroPrecioMax)) &&
      (filtroRating === "" || producto.rating >= parseFloat(filtroRating))
    );
  });

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gradient-to-r from-purple-200 to-yellow-100 text-gray-900"}`}
    >
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
        ¡Descubre Nuestros Productos Especiales!
      </h1>

      {/* Buscador general */}
      <div
        className={`shadow-lg rounded-xl overflow-hidden p-6 mb-8 ${
          theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Buscar Productos</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busquedaGeneral}
            onChange={(e) => setBusquedaGeneral(e.target.value)}
            className={`w-full border p-3 rounded-lg text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white border-gray-300"}`}
          />
          <button
            className="ml-2 p-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div
        className={`shadow-lg rounded-xl overflow-hidden p-6 mb-8 ${
          theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Filtrar Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Filtro por categoría */}
          <div>
            <label className="block mb-2 font-medium">Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className={`w-full border p-3 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
            >
              <option value="">Todas</option>
              <option value="Juguetes">Juguetes</option>
              <option value="Peluches">Peluches</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Niños">Niños</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          {/* Filtro por precio mínimo */}
          <div>
            <label className="block mb-2 font-medium">Precio Mínimo</label>
            <input
              type="number"
              placeholder="Mínimo"
              value={filtroPrecioMin}
              onChange={(e) => setFiltroPrecioMin(e.target.value)}
              className={`w-full border p-3 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
            />
          </div>

          {/* Filtro por precio máximo */}
          <div>
            <label className="block mb-2 font-medium">Precio Máximo</label>
            <input
              type="number"
              placeholder="Máximo"
              value={filtroPrecioMax}
              onChange={(e) => setFiltroPrecioMax(e.target.value)}
              className={`w-full border p-3 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
            />
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Nuestros Productos</h2>
        {isLoading ? (
          <p className="text-center text-lg font-medium text-purple-700">Cargando productos...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((producto) => (
              <div
                key={producto._id}
                className="shadow-xl rounded-lg overflow-hidden transition duration-300 transform hover:scale-105"
              >
                <img
                  src={producto.image}
                  alt={producto.name}
                  className="w-full h-60 object-cover rounded-t-lg"
                />
                <div className="p-6 bg-white rounded-b-lg">
                  <h3 className="text-xl font-bold text-purple-700 mb-2">{producto.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{producto.description}</p>
                  <p className="text-lg font-semibold text-purple-600">${producto.price}</p>
                  <p className="text-sm text-gray-500">Categoría: {producto.category}</p>
                  <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
                  <p className="text-sm text-gray-500">Rating: {producto.rating}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  
}

export default ProductosPage;
