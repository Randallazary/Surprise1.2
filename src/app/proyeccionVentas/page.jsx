'use client';

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';

export default function ProyeccionVentas() {
  const { theme } = useAuth();

  // Datos estructurados jerárquicamente (NUEVO) sin "Insumo: Material Básico"
  const [datosVentas, setDatosVentas] = useState([
    {
      id: 2,
      tipo: "Playeras",
      nombre: "Playeras Variadas",
      ventas: 580,
      detalles: [
        { 
          id: 21, 
          subtipo: "Color", 
          nombre: "Blancas", 
          ventas: 230,
          tallas: [
            { id: 211, talla: "CH", ventas: 50 },
            { id: 212, talla: "M", ventas: 100 },
            { id: 213, talla: "G", ventas: 80 }
          ]
        },
        { 
          id: 22, 
          subtipo: "Color", 
          nombre: "Negras", 
          ventas: 350,
          tallas: [
            { id: 221, talla: "CH", ventas: 70 },
            { id: 222, talla: "M", ventas: 180 },
            { id: 223, talla: "G", ventas: 100 }
          ]
        }
      ]
    }
  ]);

  // Estado para controlar qué filas están expandidas (NUEVO)
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  // Datos de ventas de productos (ORIGINAL)
  const [ventasProductos, setVentasProductos] = useState([
    { producto: "Peluches", ventas: 150 },
    { producto: "Gorras", ventas: 100 },
    { producto: "Tazas", ventas: 120 },
    { producto: "Playeras", ventas: 300 },
  ]);

  // Datos de ventas mensuales (proyección) (ORIGINAL)
  const [ventas, setVentas] = useState([
    { mes: "Ene", proyectadas: 38, crecimiento: 0, total: 38, stock: 250, estado: "Histórico" },
    { mes: "Feb", proyectadas: 17, crecimiento: -55.3, total: 55, stock: 250, estado: "Histórico" },
    { mes: "Mar", proyectadas: 25, crecimiento: 47.1, total: 80, stock: 225, estado: "Proyección" },
    { mes: "Abr", proyectadas: 35, crecimiento: 40.0, total: 115, stock: 190, estado: "Proyección" },
    { mes: "May", proyectadas: 52, crecimiento: 48.6, total: 167, stock: 138, estado: "Proyección" },
    { mes: "Jun", proyectadas: 74, crecimiento: 42.3, total: 241, stock: 9, estado: "Proyección" },
    { mes: "Jul", proyectadas: 108, crecimiento: 45.9, total: 349, stock: 0, estado: "Agotamiento" },
    { mes: "Ago", proyectadas: 156, crecimiento: 44.4, total: 505, stock: 0, estado: "Agotamiento" },
    { mes: "Sep", proyectadas: 227, crecimiento: 45.5, total: 732, stock: 0, estado: "Agotamiento" },
  ]);

  // Información del producto (ORIGINAL)
  const [producto, setProducto] = useState({
    nombre: "Playera poliester",
    talla: "CH",
    color: "Rosa",
    precio: 280,
    stockInicial: 250
  });

  return (
    <div className={`min-h-screen p-5 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-bold text-center mb-5">
        Proyección de Ventas
      </h1>

     
      {/* Sección ORIGINAL: Gráfica de barras de ventas de productos */}
      <div className={`mb-8 p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
        <h2 className="text-xl font-semibold mb-4">Gráfica de Ventas por Producto</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={ventasProductos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="producto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
       {/* Sección NUEVA: Tabla jerárquica de playeras */}
       <div className={`mb-8 p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
        <h2 className="text-xl font-semibold mb-4">Ventas por Producto, Color y Talla</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"}>
                <th className="border p-2 text-left">Producto</th>
                <th className="border p-2 text-right">Ventas</th>
                <th className="border p-2 text-right">% del Total</th>
              </tr>
            </thead>
            <tbody>
              {datosVentas.map((item) => (
                <>
                  <tr 
                    key={item.id} 
                    className={`cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    onClick={() => toggleRow(item.id)}
                  >
                    <td className="border p-2 font-bold">
                      <div className="flex items-center">
                        {expandedRows.includes(item.id) ? '▼' : '►'} {item.tipo}: {item.nombre}
                      </div>
                    </td>
                    <td className="border p-2 text-right">{item.ventas} unidades</td>
                    <td className="border p-2 text-right">
                      {((item.ventas / datosVentas.reduce((sum, i) => sum + i.ventas, 0)) * 100).toFixed(1)}%
                    </td>
                  </tr>

                  {expandedRows.includes(item.id) && item.detalles.map((detalle) => (
                    <>
                      <tr 
                        key={detalle.id} 
                        className={`${theme === "dark" ? "bg-gray-750" : "bg-gray-50"} cursor-pointer`}
                        onClick={() => toggleRow(detalle.id)}
                      >
                        <td className="border p-2 pl-8">
                          <div className="flex items-center">
                            {detalle.tallas ? (expandedRows.includes(detalle.id) ? '▼' : '►') : null}
                            {detalle.subtipo}: {detalle.nombre}
                          </div>
                        </td>
                        <td className="border p-2 text-right">{detalle.ventas} unidades</td>
                        <td className="border p-2 text-right">
                          {((detalle.ventas / datosVentas.reduce((sum, i) => sum + i.ventas, 0)) * 100).toFixed(1)}%
                        </td>
                      </tr>

                      {expandedRows.includes(detalle.id) && detalle.tallas && detalle.tallas.map((talla) => (
                        <tr key={talla.id} className={theme === "dark" ? "bg-gray-800" : "bg-gray-100"}>
                          <td className="border p-2 pl-16">Talla {talla.talla}</td>
                          <td className="border p-2 text-right">{talla.ventas} unidades</td>
                          <td className="border p-2 text-right">
                            {((talla.ventas / datosVentas.reduce((sum, i) => sum + i.ventas, 0)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen comparativo (NUEVO) */}
        <div className={`mt-6 p-4 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`}>
          <h3 className="font-bold mb-2">Resumen Playeras:</h3>
          <p>
            Las playeras negras se venden más que las blancas (
            {datosVentas.find(i => i.tipo === "Playeras")?.detalles.find(c => c.nombre === "Negras")?.ventas} vs 
            {datosVentas.find(i => i.tipo === "Playeras")?.detalles.find(c => c.nombre === "Blancas")?.ventas} unidades).
            La talla M es la más popular en ambos colores.
          </p>
        </div>
      </div>


      {/* Sección ORIGINAL: Gráfica de líneas de proyección de ventas */}
      <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
        <h2 className="text-xl font-semibold mb-4">Proyección de Ventas</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={ventas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="proyectadas" stroke="#82ca9d" />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
