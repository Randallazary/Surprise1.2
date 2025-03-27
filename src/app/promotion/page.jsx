"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Descuentos() {
  const { theme } = useAuth();
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [campanas, setCampanas] = useState([]);

  useEffect(() => {
    const fetchDescuentos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/descuentos`);
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          throw new Error("Error al obtener los productos en descuento");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar los productos en descuento");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDescuentos();
  }, []);

  useEffect(() => {
    const fetchCampanas = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/campanas-promocionales`);
        if (response.ok) {
          const data = await response.json();
          setCampanas(data);
        } else {
          throw new Error("Error al obtener las campañas promocionales");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar las campañas promocionales");
      }
    };
    fetchCampanas();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredProductos = productos.filter((producto) => {
    if (filter === "all") return true;
    return producto.discountPercentage >= parseInt(filter);
  });

  return (
    <div className={`container mx-auto py-8 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <h1 className="text-4xl font-extrabold text-center mb-8">Productos en Descuento</h1>

      {/* Banner de promoción */}
      {isBannerVisible && (
        <div className="bg-green-500 text-white py-4 px-8 mb-6 rounded-md shadow-md text-center">
          <p className="font-semibold">¡Oferta exclusiva! 30% de descuento en toda la tienda, solo por hoy.</p>
          <button
            onClick={() => setIsBannerVisible(false)}
            className="mt-2 bg-white text-green-500 py-1 px-4 rounded-full"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Cupones y Campañas de Promoción */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Campañas de Promoción</h2>
        {campanas.length > 0 ? (
          campanas.map((campana) => (
            <div key={campana.id} className="p-4 mb-4 bg-yellow-100 rounded-md shadow-md">
              <h3 className="text-xl font-bold">{campana.titulo}</h3>
              <p>{campana.descripcion}</p>
            </div>
          ))
        ) : (
          <p>No hay campañas activas en este momento.</p>
        )}
      </div>

      {/* Filtro de descuentos */}
      <div className="mb-6 text-center">
        <label htmlFor="filter" className="text-lg font-medium mr-4">Filtrar por descuento:</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="px-4 py-2 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="all">Todos</option>
          <option value="10">Descuento 10% o más</option>
          <option value="20">Descuento 20% o más</option>
          <option value="30">Descuento 30% o más</option>
        </select>
      </div>

      {/* Productos en descuento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {isLoading ? (
          <p className="text-center text-lg font-medium">Cargando productos...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : (
          filteredProductos.map((producto) => (
            <div key={producto._id} className="relative shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <Image
                src={producto.image}
                alt={producto.name}
                width={300}
                height={200}
                className="w-full h-64 object-contain bg-white dark:bg-gray-700"
              />
              <div className="p-4 text-center">
                <h3 className="text-md font-bold">{producto.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{producto.description}</p>
                <p className="text-lg font-semibold mt-2 line-through text-red-500">${producto.originalPrice}</p>
                <p className="text-lg font-bold text-green-500">${producto.discountedPrice}</p>
                <p className="text-sm text-gray-500">Descuento: {producto.discountPercentage}%</p>
              </div>

              {/* Temporizador de oferta */}
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs py-1 px-2 rounded-full shadow-lg">
                ¡Solo hoy!
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
