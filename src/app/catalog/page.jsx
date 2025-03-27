"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Slider from "@mui/material/Slider";

export default function Catalogo() {
  const { theme } = useAuth();
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [precio, setPrecio] = useState([0, 10000]);
  const [orden, setOrden] = useState("A-Z");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/catalogo`);
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
    fetchProductos();
  }, []);

  const productosFiltrados = productos
    .filter((producto) => {
      return (
        (filtroCategoria === "" || producto.category === filtroCategoria) &&
        producto.price >= precio[0] && producto.price <= precio[1]
      );
    })
    .sort((a, b) => {
      if (orden === "A-Z") return a.name.localeCompare(b.name);
      if (orden === "Z-A") return b.name.localeCompare(a.name);
      if (orden === "Precio ascendente") return a.price - b.price;
      if (orden === "Precio descendente") return b.price - a.price;
      return 0;
    });

  return (
    <div className={`container mx-auto py-8 flex ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      {/* Filtros en la izquierda */}
      <div className={`w-1/5 h-screen sticky top-0 p-3 rounded-lg transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-900"}`}>
        <h2 className="text-md font-bold mb-3">Filtros</h2>
        
        <label className="block mb-2 text-sm">Categoría:</label>
        <select
          className={`w-full p-2 border rounded-lg transition-all duration-300 ${theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"}`}
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Juguetes">Juguetes</option>
          <option value="Peluches">Peluches</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Niños">Niños</option>
          <option value="Otros">Otros</option>
        </select>

        {/* Filtro de precio con slider */}
        <label className="block mt-3 mb-2 text-sm">Precio:</label>
        <div className="flex justify-between text-xs mb-2">
          <span>${precio[0]}</span>
          <span>${precio[1]}</span>
        </div>
        <Slider
          value={precio}
          onChange={(e, newValue) => setPrecio(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={100}
        />

        <label className="block mt-4 mb-2 text-sm">Ordenar por:</label>
        <select
          className={`w-full p-2 border rounded-lg transition-all duration-300 ${theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"}`}
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        >
          <option value="A-Z">Alfabéticamente, A-Z</option>
          <option value="Z-A">Alfabéticamente, Z-A</option>
          <option value="Precio ascendente">Precio, menor a mayor</option>
          <option value="Precio descendente">Precio, mayor a menor</option>
        </select>
      </div>

      {/* Catálogo */}
      <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {isLoading ? (
          <p className="text-center text-lg font-medium">Cargando productos...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : (
          productosFiltrados.map((producto) => (
            <div key={producto._id} className={`shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
              <Image src={producto.image} alt={producto.name} width={300} height={200} className="w-full h-64 object-contain" />
              <div className="p-4 text-center">
                <h3 className="text-md font-bold">{producto.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{producto.description}</p>
                <p className="text-lg font-semibold mt-2">${producto.price}</p>
                <p className="text-xs text-gray-500">Categoría: {producto.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
