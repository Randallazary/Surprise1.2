"use client";

import { useState, useEffect, Suspense } from "react";
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

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");

  useEffect(() => {
    if (searchTerm) {
      setBusquedaGeneral(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/productos?search=${busquedaGeneral}&categoria=${filtroCategoria}&minPrecio=${filtroRangoPrecio[0]}&maxPrecio=${filtroRangoPrecio[1]}&page=${paginacion.paginaActual}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  }, [busquedaGeneral, filtroCategoria, filtroRangoPrecio, paginacion.paginaActual]);

  const cambiarPagina = (pagina) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
  };

  const handlePriceChange = (event, newValue) => {
    setFiltroRangoPrecio(newValue);
  };

  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
        <h1 className="text-3xl font-bold text-center mb-8">Productos</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
              <h2 className="text-2xl font-bold mb-4">Filtrar Productos</h2>
              
              {/* Buscador general */}
              <div className="mb-6">
                <label className="block mb-2">Buscar</label>
                <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  value={busquedaGeneral} 
                  onChange={(e) => setBusquedaGeneral(e.target.value)} 
                  className={`w-full border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`} 
                />
              </div>
              
              {/* Filtro por categoría */}
              <div className="mb-6">
                <label className="block mb-2">Categoría</label>
                <select 
                  value={filtroCategoria} 
                  onChange={(e) => setFiltroCategoria(e.target.value)} 
                  className={`w-full border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Peluches">Peluches</option>
                  <option value="Jugetes">Jugetes</option>
                  <option value="Playeras">Playeras</option>
                  <option value="Tazas">Tazas</option>
                  <option value="Gorras">Gorras</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              {/* Filtro por rango de precio con Slider */}
              <div className="mb-6">
                <label className="block mb-2">Rango de Precio</label>
                <Slider 
                  value={filtroRangoPrecio} 
                  onChange={handlePriceChange} 
                  valueLabelDisplay="auto" 
                  min={0} 
                  max={1000} 
                  step={10} 
                  className="text-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="w-full md:w-3/4">
            {isLoading ? (
              <p className="text-center">Cargando productos...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productos.map((producto) => (
                    <div 
                      key={producto.id} 
                      className={`shadow-md rounded-lg overflow-hidden flex flex-col h-full ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
                    >
                      <div className="flex items-center justify-center min-h-[200px] max-h-[300px] overflow-hidden">
                        {producto.images?.length > 0 ? (
                          <Image 
                            src={producto.images[0].url} 
                            alt={producto.name} 
                            width={300} 
                            height={300} 
                            className="w-full h-auto object-contain" 
                          />
                        ) : (
                          <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Sin imagen</span>
                          </div>
                        )}
                      </div>
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
                        className={`mx-1 px-4 py-2 rounded ${paginacion.paginaActual === i + 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default ProductosPage;
