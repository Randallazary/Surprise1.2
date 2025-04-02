'use client';
import { useState, useMemo } from "react";
import { useAuth } from "../../context/authContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine, Label } from 'recharts';

const calcularModelo = (t, k) => 20 * Math.exp(k * t);

export default function ProyeccionVentas() {
  const { theme } = useAuth();
  const [parametros] = useState({
    k: 0.9555,
    stockInicial: 300
  });

  const datosReales = [
    { mes: "Enero", tiempo: 0, ventas: 20, acumuladas: 20, tipo: "real", stock: 280 },
    { mes: "Febrero", tiempo: 1, ventas: 32, acumuladas: 52, tipo: "real", stock: 248 }
  ];

  const proyecciones = useMemo(() => {
    const meses = ["Marzo", "Abril", "Mayo", "Junio", "Julio"];
    let resultado = [...datosReales];
    let stockRestante = parametros.stockInicial - 52;
    
    meses.forEach((mes, i) => {
      const tiempo = i + 2;
      const ventasAcumuladas = calcularModelo(tiempo, parametros.k);
      const ventasMes = ventasAcumuladas - resultado.reduce((sum, x) => sum + (x.ventas || 0), 0);
      
      stockRestante = Math.max(0, stockRestante - ventasMes);
      
      let estadoStock = "ÓPTIMO";
      let colorStock = "green";
      let alertaReorden = "";
      
      if (stockRestante <= 0) {
        estadoStock = "AGOTADO";
        colorStock = "red";
      } else if (stockRestante <= 180) {
        estadoStock = "REORDEN";
        colorStock = "orange";
        alertaReorden = "¡REORDENAR! Stock ≤ 180";
      } else if (stockRestante <= 120) {
        estadoStock = "ALERTA";
        colorStock = "yellow";
      }
      
      resultado.push({
        mes,
        tiempo,
        ventas: Math.round(ventasMes),
        acumuladas: Math.round(ventasAcumuladas),
        stock: Math.round(stockRestante),
        tipo: "proyección",
        estado: estadoStock,
        color: colorStock,
        alertaReorden,
        proyeccionDoc: tiempo === 3 ? 219 : tiempo === 4 ? 562 : null
      });
    });
    
    return resultado;
  }, [parametros.k, parametros.stockInicial]);

  const puntosClave = {
    alcanza180: proyecciones.find(p => p.stock <= 180),
    agotamiento: proyecciones.find(p => p.stock <= 0),
    abril: proyecciones.find(p => p.mes === "Abril"),
    mayo: proyecciones.find(p => p.mes === "Mayo")
  };

  const [ventasProductos] = useState([
    { producto: "Peluches", ventas: 150 },
    { producto: "Gorras", ventas: 100 },
    { producto: "Tazas", ventas: 120 },
    { producto: "Playeras", ventas: 300 },
  ]);

  const colors = {
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-gray-100",
      green: "bg-green-900/50",
      yellow: "bg-yellow-900/50",
      orange: "bg-orange-900/50",
      red: "bg-red-900/50",
      blue: "bg-blue-900/50",
      purple: "bg-purple-900/50",
      border: "border-gray-700"
    },
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-900",
      green: "bg-green-100",
      yellow: "bg-yellow-100",
      orange: "bg-orange-100",
      red: "bg-red-100",
      blue: "bg-blue-100",
      purple: "bg-purple-100",
      border: "border-gray-200"
    }
  };

  return (
    <div className={`min-h-screen p-5 ${colors[theme].bg} ${colors[theme].text}`}>
      
      {/* Gráfica de ventas por producto */}
      <div className={`mb-8 p-4 rounded-lg shadow-md ${colors[theme].card} border ${colors[theme].border}`}>
        <h2 className="text-xl font-semibold mb-4">Ventas por Producto</h2>
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

      {/* Información del producto analizado */}
      <div className={`mb-6 p-4 rounded-lg shadow-md ${colors[theme].card} border ${colors[theme].border}`}>
        <h2 className="text-xl font-semibold mb-4">Producto Analizado: Playera Dama</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Producto", value: "Playera dama" },
            { label: "Talla", value: "M" },
            { label: "Color", value: "Negro" },
            { label: "Stock Inicial", value: "300 unidades" }
          ].map((item, index) => (
            <div key={index} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="font-medium text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfica de proyección principal actualizada */}
      <div className={`mb-8 p-4 rounded-lg shadow-md ${colors[theme].card} border ${colors[theme].border}`}>
        <h2 className="text-xl font-semibold mb-4">Proyección de tiempo en función de unidades vendidas</h2>
        
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3 rounded-md ${colors[theme].orange}`}>
            <p className="font-medium text-sm">Punto de reabastecimiento</p>
            <p className="text-lg font-semibold">180 unidades</p>
          </div>
          <div className={`p-3 rounded-md ${colors[theme].green}`}>
            <p className="font-medium text-sm">Stock máximo</p>
            <p className="text-lg font-semibold">300 unidades</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={proyecciones}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4b5563' : '#e5e7eb'} />
            <XAxis 
              dataKey="mes"
              stroke={colors[theme].text.replace('text-', '')}
              label={{
                value: 'Tiempo (meses)',
                position: 'insideBottomRight',
                offset: -10,
                fill: colors[theme].text.replace('text-', '')
              }}
            />
            <YAxis 
              stroke={colors[theme].text.replace('text-', '')}
              domain={[0, 320]}
              ticks={[0, 50, 100, 150, 180, 200, 250, 300]}
              label={{
                value: 'Unidades vendidas acumuladas',
                angle: -90,
                position: 'insideLeft',
                fill: colors[theme].text.replace('text-', '')
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                borderRadius: '0.5rem'
              }}
              formatter={(value) => [`${value} unidades`, 'Ventas acumuladas']}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="acumuladas" 
              stroke={theme === 'dark' ? '#8b5cf6' : '#8884d8'}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <ReferenceLine 
              y={180}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{
                value: "Reabastecimiento (180)",
                position: "right",
                fill: theme === 'dark' ? '#f59e0b' : '#b45309'
              }}
            />
            <ReferenceLine 
              y={300}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{
                value: "Stock máximo (300)",
                position: "right",
                fill: theme === 'dark' ? '#10b981' : '#065f46'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resultados clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { 
            title: "Punto de Reorden", 
            value: puntosClave.alcanza180?.mes || "Marzo/Abril", 
            color: "orange",
            icon: "🔄",
            desc: "Stock ≤ 180 unidades"
          },
          { 
            title: "Agotamiento Estimado", 
            value: puntosClave.agotamiento?.mes || "Abril", 
            color: "red",
            icon: "⚠️",
            desc: "Stock llega a 0 unidades"
          },
          { 
            title: "Proyección Mayo", 
            value: puntosClave.mayo?.proyeccionDoc ? `${puntosClave.mayo.proyeccionDoc} unidades` : "562 unidades", 
            color: "yellow",
            icon: "📈",
            desc: "Ventas estimadas para mayo"
          }
        ].map((item, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${colors[theme][item.color]} border-${item.color}-${theme === 'dark' ? '800' : '200'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{item.icon}</span>
              <h3 className="font-bold">{item.title}</h3>
            </div>
            <p className="text-2xl font-bold mb-1">
              {item.value}
            </p>
            <p className="text-sm opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Tabla detallada */}
      <div className={`mb-8 overflow-x-auto rounded-lg shadow-md ${colors[theme].card} border ${colors[theme].border}`}>
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
            <tr>
              {["Mes", "Ventas", "Acumulado", "Stock", "Estado", "Alerta Reorden"].map((header, index) => (
                <th 
                  key={index} 
                  className={`p-3 ${index === 0 ? 'text-left' : 'text-right'} ${index >= 4 ? 'text-center' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proyecciones.map((item, index) => {
              const bgColor = colors[theme][item.color] || (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50');
              const textColor = theme === 'dark' 
                ? item.color === 'green' ? 'text-green-300' 
                  : item.color === 'yellow' ? 'text-yellow-300' 
                  : item.color === 'orange' ? 'text-orange-300' 
                  : item.color === 'red' ? 'text-red-300' 
                  : 'text-gray-300'
                : item.color === 'green' ? 'text-green-800' 
                  : item.color === 'yellow' ? 'text-yellow-800' 
                  : item.color === 'orange' ? 'text-orange-800' 
                  : item.color === 'red' ? 'text-red-800' 
                  : 'text-gray-800';
              
              return (
                <tr key={index} className={`border-t ${colors[theme].border} ${bgColor}`}>
                  <td className="p-3">{item.mes}</td>
                  <td className="p-3 text-right">{item.ventas?.toFixed(0) || "-"}</td>
                  <td className="p-3 text-right">{item.acumuladas?.toFixed(0) || "-"}</td>
                  <td className="p-3 text-right">{item.stock?.toFixed(0) || "-"}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${textColor}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {item.alertaReorden && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        theme === 'dark' ? 'bg-orange-600 text-white' : 'bg-orange-200 text-orange-900'
                      } animate-pulse`}>
                        {item.alertaReorden}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Conclusiones */}
      <div className={`p-4 rounded-lg shadow-md ${colors[theme].green} border ${theme === 'dark' ? 'border-green-800' : 'border-green-200'}`}>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <span>📌</span> Conclusiones
        </h2>
        <ul className="space-y-2">
          {[
            "El punto de reabastecimiento (180 unidades) se alcanzará en " + (puntosClave.alcanza180?.mes || "Marzo/Abril"),
            "El stock máximo es de 300 unidades",
            "Se recomienda realizar pedidos cuando el stock alcance las 180 unidades",
            "La proyección muestra un crecimiento exponencial en las ventas"
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