'use client';
import { useState, useMemo } from "react";
import { useAuth } from "../../context/authContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine, Label } from 'recharts';

// Función matemática basada en tu documento
const calcularModelo = (t, k) => 20 * Math.exp(k * t);

export default function ProyeccionVentas() {
  const { theme } = useAuth();
  const [parametros] = useState({
    k: 0.9555,       // Constante de crecimiento del documento
    stockInicial: 300 // Stock inicial del documento
  });

  // Datos históricos exactos de tu documento
  const datosReales = [
    { mes: "Enero", tiempo: 0, ventas: 20, tipo: "real" },
    { mes: "Febrero", tiempo: 1, ventas: 32, tipo: "real" }
  ];

  // Proyección mejorada (calculada automáticamente)
  const proyecciones = useMemo(() => {
    const meses = ["Marzo", "Abril", "Mayo", "Junio", "Julio"];
    let resultado = [...datosReales];
    let stockRestante = parametros.stockInicial - 52; // 52 ventas acumuladas (20+32)
    
    meses.forEach((mes, i) => {
      const tiempo = i + 2;
      const ventasAcumuladas = calcularModelo(tiempo, parametros.k);
      const ventasMes = ventasAcumuladas - resultado.reduce((sum, x) => sum + (x.ventas || 0), 0);
      
      stockRestante = Math.max(0, stockRestante - ventasMes);
      
      resultado.push({
        mes,
        tiempo,
        ventas: Math.round(ventasMes),
        acumuladas: Math.round(ventasAcumuladas),
        stock: Math.round(stockRestante),
        tipo: "proyección",
        estado: stockRestante <= 0 ? "AGOTADO" : "DISPONIBLE"
      });
    });
    
    return resultado;
  }, [parametros.k, parametros.stockInicial]);

  // Puntos clave del documento
  const puntosClave = {
    alcanza180: proyecciones.find(p => p.acumuladas >= 180),
    agotamiento: proyecciones.find(p => p.stock <= 0)
  };

  const [ventasProductos] = useState([
    { producto: "Peluches", ventas: 150 },
    { producto: "Gorras", ventas: 100 },
    { producto: "Tazas", ventas: 120 },
    { producto: "Playeras", ventas: 300 },
  ]);

  // Paleta de colores optimizada para ambos temas
  const colors = {
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-gray-100",
      accent: "bg-blue-900",
      highlight: "bg-purple-900",
      success: "bg-green-900",
      warning: "bg-yellow-900",
      danger: "bg-red-900"
    },
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-900",
      accent: "bg-blue-50",
      highlight: "bg-purple-50",
      success: "bg-green-50",
      warning: "bg-yellow-50",
      danger: "bg-red-50"
    }
  };

  return (
    <div className={`min-h-screen p-5 ${colors[theme].bg} ${colors[theme].text}`}>
      {/* Sección ORIGINAL: Gráfica de barras de ventas de productos */}
      <div className={`mb-8 p-4 rounded-lg shadow-md ${colors[theme].card} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold mb-4">Gráfica de Ventas por Producto</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={ventasProductos}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4b5563' : '#e5e7eb'} />
            <XAxis dataKey="producto" stroke={colors[theme].text.replace('text-', '')} />
            <YAxis stroke={colors[theme].text.replace('text-', '')} />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar 
              dataKey="ventas" 
              fill={theme === 'dark' ? '#7c3aed' : '#8884d8'} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sección de información del producto */}
      <div className={`mb-6 p-4 rounded-lg shadow-md ${colors[theme].card} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold mb-4">Producto Analizado</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Producto", value: "Playera dama" },
            { label: "Talla", value: "M" },
            { label: "Color", value: "Negro" },
            { label: "Stock Actual", value: "300 unidades" }
          ].map((item, index) => (
            <div key={index} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="font-medium text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sección de modelo matemático */}
      <div className={`mb-8 p-4 rounded-lg shadow-md ${colors[theme].card} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold mb-4">Modelo Matemático (Ecuación Diferencial)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'} border ${theme === 'dark' ? 'border-blue-800' : 'border-blue-200'}`}>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300 mb-2">Ecuación:</p>
            <code className="text-lg font-mono">dP/dt = kP</code>
          </div>
          <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'} border ${theme === 'dark' ? 'border-green-800' : 'border-green-200'}`}>
            <p className="text-sm font-medium text-green-600 dark:text-green-300 mb-2">Solución:</p>
            <code className="text-lg font-mono">P(t) = 20e<sup>{parametros.k}t</sup></code>
          </div>
        </div>
      </div>

      {/* Gráfica interactiva */}
      <div className={`mb-8 p-4 rounded-lg shadow-md ${colors[theme].card} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-semibold mb-4">Proyección de Ventas</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={proyecciones}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4b5563' : '#e5e7eb'} />
            <XAxis 
              dataKey="mes" 
              stroke={colors[theme].text.replace('text-', '')} 
            />
            <YAxis 
              stroke={colors[theme].text.replace('text-', '')} 
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                borderRadius: '0.5rem',
                color: colors[theme].text.replace('text-', '')
              }}
              formatter={(value, name) => [`${value} unidades`, name]}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="acumuladas" 
              name="Ventas Acumuladas" 
              stroke={theme === 'dark' ? '#8b5cf6' : '#8884d8'}
              strokeWidth={2}
              activeDot={{ r: 8, stroke: colors[theme].text.replace('text-', ''), fill: theme === 'dark' ? '#7c3aed' : '#8884d8' }} 
            />
            {puntosClave.alcanza180 && (
              <ReferenceLine 
                x={puntosClave.alcanza180.mes} 
                stroke="#f59e0b"
                label={
                  <Label 
                    value="180 unidades" 
                    position="top" 
                    fill={theme === 'dark' ? '#f59e0b' : '#b45309'}
                  />
                }
              />
            )}
            {puntosClave.agotamiento && (
              <ReferenceLine 
                x={puntosClave.agotamiento.mes} 
                stroke="#ef4444"
                label={
                  <Label 
                    value="Agotamiento" 
                    position="insideBottom" 
                    fill={theme === 'dark' ? '#ef4444' : '#b91c1c'}
                  />
                }
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resultados clave (del documento) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { 
            title: "Stock de Seguridad", 
            value: puntosClave.agotamiento?.mes || "No calculado", 
            color: "red",
            icon: "⚠️"
          },
          { 
            title: "Punto de Reorden", 
            value: puntosClave.alcanza180?.mes || "No calculado", 
            color: "yellow",
            icon: "🔔"
          },
          { 
            title: "Constante (k)", 
            value: parametros.k.toFixed(4), 
            color: "purple",
            icon: "📊"
          }
        ].map((item, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${
              theme === 'dark' 
                ? `bg-${item.color}-900/30 border-${item.color}-800` 
                : `bg-${item.color}-50 border-${item.color}-200`
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{item.icon}</span>
              <h3 className="font-bold">{item.title}</h3>
            </div>
            <p className="text-2xl font-bold">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabla detallada */}
      <div className={`mb-8 overflow-x-auto rounded-lg shadow-md ${colors[theme].card} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
            <tr>
              {["Mes", "Ventas", "Acumulado", "Stock", "Estado"].map((header, index) => (
                <th 
                  key={index} 
                  className={`p-3 ${index === 0 ? 'text-left' : 'text-right'} ${index === 4 ? 'text-center' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proyecciones.map((item, index) => (
              <tr 
                key={index} 
                className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${
                  item.tipo === "real" 
                    ? theme === 'dark' 
                      ? 'bg-green-900/20' 
                      : 'bg-green-50' 
                    : ''
                }`}
              >
                <td className="p-3">{item.mes}</td>
                <td className="p-3 text-right">{item.ventas?.toFixed(0) || "-"}</td>
                <td className="p-3 text-right">{item.acumuladas?.toFixed(0) || "-"}</td>
                <td className="p-3 text-right">{item.stock?.toFixed(0) || "-"}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.estado === "AGOTADO" 
                      ? theme === 'dark' 
                        ? 'bg-red-900/50 text-red-300' 
                        : 'bg-red-100 text-red-800'
                      : item.tipo === "real"
                        ? theme === 'dark'
                          ? 'bg-blue-900/50 text-blue-300'
                          : 'bg-blue-100 text-blue-800'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.estado || item.tipo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de recomendaciones */}
      <div className={`p-4 rounded-lg shadow-md ${
        theme === 'dark' ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'
      } border`}>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <span>📌</span> Recomendaciones
        </h2>
        <ul className="space-y-2">
          {[
            `Realizar pedido al proveedor 2 semanas antes de ${puntosClave.agotamiento?.mes || "el mes de agotamiento"}`,
            "Considerar aumentar stock inicial para productos con alta demanda",
            `Revisar constantemente la constante de crecimiento (k = ${parametros.k.toFixed(4)}) con nuevos datos`
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}