"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useSearchParams } from "next/navigation";
import Image from 'next/image';
import Slider from '@mui/material/Slider';

function ProductosPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroRangoPrecio, setFiltroRangoPrecio] = useState([0, 1000]);
  const [filtroStock, setFiltroStock] = useState("");
  const [filtroOrdenPrecio, setFiltroOrdenPrecio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalProductos: 0,
  });

  // Captura los parámetros de búsqueda de la URL
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");

  useEffect(() => {
    if (searchTerm) {
      setBusquedaGeneral(searchTerm);
    }
  }, [searchTerm]);

  // Obtener productos al cargar la página o cambiar filtros
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url = new URL(`${CONFIGURACIONES.BASEURL2}/productos`);
        
        // Parámetros de búsqueda
        const params = {
          search: busquedaGeneral,
          categoria: filtroCategoria,
          minPrecio: filtroRangoPrecio[0],
          maxPrecio: filtroRangoPrecio[1],
          minStock: filtroStock,
          sort: filtroOrdenPrecio,
          page: paginacion.paginaActual,
          pageSize: 10
        };
        
        // Agregar solo los parámetros que tienen valor
        Object.entries(params).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            url.searchParams.append(key, value);
          }
        });

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProductos(data.productos);
          setPaginacion({
            paginaActual: data.paginacion.paginaActual,
            totalPaginas: data.paginacion.totalPaginas,
            totalProductos: data.paginacion.totalProductos,
          });
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

    fetchProductos();
  }, [
    busquedaGeneral, 
    filtroCategoria, 
    filtroRangoPrecio, 
    filtroStock,
    filtroOrdenPrecio,
    paginacion.paginaActual
  ]);

  // Restablecer página al cambiar filtros
  useEffect(() => {
    setPaginacion(prev => ({...prev, paginaActual: 1}));
  }, [busquedaGeneral, filtroCategoria, filtroRangoPrecio, filtroStock, filtroOrdenPrecio]);

  // Cambiar de página
  const cambiarPagina = (pagina) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
  };

  // Manejador del slider de precios
  const handlePriceChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    
    // Limitar el rango mínimo entre los thumb
    const minDistance = 50;
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 1000 - minDistance);
        setFiltroRangoPrecio([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setFiltroRangoPrecio([clamped - minDistance, clamped]);
      }
    } else {
      setFiltroRangoPrecio(newValue);
    }
  };

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Productos</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros en la izquierda */}
        <div className="w-full md:w-1/4">
          <div
            className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-white text-gray-900"
              }`}
          >
            <h2 className="text-2xl font-bold mb-4">Filtrar Productos</h2>

            {/* Buscador general */}
            <div className="mb-6">
              <label className="block mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busquedaGeneral}
                onChange={(e) => setBusquedaGeneral(e.target.value)}
                className={`w-full border p-2 rounded-lg ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "border-gray-300"
                  }`}
              />
            </div>

            {/* Filtro por categoría */}
            <div className="mb-6">
              <label className="block mb-2">Categoría</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className={`w-full border p-2 rounded-lg ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "border-gray-300"
                  }`}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Aceites y Lubricantes">Aceites y Lubricantes</option>
                <option value="Afinaciones">Afinaciones</option>
                <option value="Reparaciones de Motor">Reparaciones de Motor</option>
                <option value="Suspensión y Dirección">Suspensión y Dirección</option>
                <option value="Accesorios y Partes de Colisión">Accesorios y Partes de Colisión</option>
                <option value="Partes Eléctricas">Partes Eléctricas</option>
              </select>
            </div>

            {/* Filtro por rango de precio con Slider */}
            <div className="mb-6">
              <label className="block mb-2">Rango de Precio</label>
              <div className="px-2">
                <Slider
                  value={filtroRangoPrecio}
                  onChange={handlePriceChange}
                  onChangeCommitted={(e, newValue) => setFiltroRangoPrecio(newValue)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                  min={0}
                  max={1000}
                  step={10}
                  disableSwap
                  sx={{
                    color: theme === 'dark' ? '#60a5fa' : '#2563eb',
                    '& .MuiSlider-thumb': {
                      backgroundColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
                    }
                  }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>${filtroRangoPrecio[0]}</span>
                <span>${filtroRangoPrecio[1]}</span>
              </div>
            </div>

            {/* Filtro por orden de precio */}
            <div className="mb-6">
              <label className="block mb-2">Ordenar por precio</label>
              <select
                value={filtroOrdenPrecio}
                onChange={(e) => setFiltroOrdenPrecio(e.target.value)}
                className={`w-full border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
              >
                <option value="">Por defecto</option>
                <option value="asc">Más baratos primero</option>
                <option value="desc">Más caros primero</option>
              </select>
            </div>

            {/* Filtro por stock */}
            <div className="mb-6">
              <label className="block mb-2">Stock Mínimo</label>
              <input
                type="number"
                placeholder="Stock mínimo"
                value={filtroStock}
                onChange={(e) => setFiltroStock(e.target.value)}
                className={`w-full border p-2 rounded-lg ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "border-gray-300"
                  }`}
              />
            </div>
          </div>
        </div >

        {/* Lista de productos en la derecha */}
        < div className="w-full md:w-3/4" >
          {
            isLoading ? (
              <p className="text-center" > Cargando productos...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productos.map((producto) => (
                    <div
                      key={producto.id}
                      className={`shadow-md rounded-lg overflow-hidden flex flex-col h-full ${theme === "dark"
                        ? "bg-gray-800 text-gray-100"
                        : "bg-white text-gray-900"
                        }`}
                    >
                      {/* Contenedor flexible para la imagen */}
                      <div className="flex items-center justify-center min-h-[200px] max-h-[300px] overflow-hidden">
                        {producto.images?.length > 0 ? (
                          <Image
                            src={producto.images[0].url}
                            alt={producto.name}
                            width={300}
                            height={300}
                            className="w-full h-auto object-contain"
                            style={{
                              maxHeight: '300px',
                              width: 'auto'
                            }}
                          />
                        ) : (
                          <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Sin imagen</span>
                          </div>
                        )}
                      </div>

                      {/* Contenido de la tarjeta */}
                      <div className="p-4 flex-grow flex flex-col">
                        <h2 className="text-xl font-bold mb-2">{producto.name}</h2>
                        <p className="text-sm mb-2">{producto.description}</p>
                        <div className="mt-auto">
                          <p className="text-lg font-bold">${producto.price}</p>
                          <p className="text-sm">Categoría: {producto.category}</p>
                          <p className="text-sm">Stock: {producto.stock}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {paginacion.totalPaginas > 1 && (
                  <div className="flex justify-center mt-8">
                    {Array.from({ length: paginacion.totalPaginas }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => cambiarPagina(i + 1)}
                        className={`mx-1 px-4 py-2 rounded ${paginacion.paginaActual === i + 1
                          ? "bg-green-600 text-white"
                          : theme === "dark"
                            ? "bg-gray-700 text-gray-200"
                            : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )
          }
        </div >
      </div >
    </div >
  );
}

export default ProductosPage;