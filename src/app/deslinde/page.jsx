"use client"; // Aseguramos que este es un Client Component

import { useEffect, useState } from "react";
import { CONFIGURACIONES } from '../config/config';

function DeslindePage() {
  const [deslinde, setDeslinde] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada a la API para obtener el deslinde actual
    const fetchDeslinde = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde/current`); // URL del endpoint
        if (!response.ok) throw new Error("Error al obtener el deslinde.");
        const data = await response.json();
        setDeslinde(data);
      } catch (error) {
        console.error("Error al cargar el deslinde:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeslinde();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <p className="text-center text-gray-700">Cargando información del deslinde...</p>
      ) : deslinde ? (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full">
          {/* Título */}
          <h1 className="text-3xl font-bold mb-6 text-center">{deslinde.title || "Deslinde Actual"}</h1>

          {/* Fecha de entrada en vigor */}
          <p className="text-sm text-gray-500 text-center mb-4">
            Fecha de entrada en vigor:{" "}
            {deslinde.effectiveDate
              ? new Date(deslinde.effectiveDate).toLocaleDateString()
              : "No disponible"}
          </p>

          {/* Contenido */}
          <div className="text-gray-700 text-justify whitespace-pre-line leading-relaxed">
            {deslinde.content || "No hay contenido disponible."}
          </div>

          {/* Fecha de creación */}
          <p className="text-xs text-gray-400 mt-8 text-center">
            Creado el:{" "}
            {deslinde.createdAt
              ? new Date(deslinde.createdAt).toLocaleDateString()
              : "No disponible"}
          </p>
        </div>
      ) : (
        <p className="text-center text-red-500">No se pudieron cargar los datos del deslinde.</p>
      )}
    </div>
  );
}

export default DeslindePage;
