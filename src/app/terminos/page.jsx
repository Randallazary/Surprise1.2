"use client"; // Aseguramos que este es un Client Component

import { useEffect, useState } from "react";
import { CONFIGURACIONES } from '../config/config';

function PoliticasPage() {
  const [politicas, setPoliticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamada a la API para obtener las políticas actuales
    const fetchPoliticas = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/current`); // Ajusta la URL correcta
        if (!response.ok) throw new Error("Error al obtener las políticas.");
        const data = await response.json();
        setPoliticas(data);
      } catch (error) {
        console.error("Error al cargar las políticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticas();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <p className="text-center text-gray-700">Cargando políticas...</p>
      ) : politicas ? (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full">
          {/* Título */}
          <h1 className="text-3xl font-bold mb-6 text-center">{politicas.title || "Términos y Condiciones"}</h1>

          {/* Fecha de entrada en vigor */}
          <p className="text-sm text-gray-500 text-center mb-4">
            Fecha de entrada en vigor:{" "}
            {politicas.effectiveDate
              ? new Date(politicas.effectiveDate).toLocaleDateString()
              : "No disponible"}
          </p>

          {/* Contenido */}
          <div className="text-gray-700 text-justify whitespace-pre-line leading-relaxed">
            {politicas.content || "No hay contenido disponible."}
          </div>

          {/* Fecha de creación */}
          <p className="text-xs text-gray-400 mt-8 text-center">
            Creado el:{" "}
            {politicas.createdAt
              ? new Date(politicas.createdAt).toLocaleDateString()
              : "No disponible"}
          </p>
        </div>
      ) : (
        <p className="text-center text-red-500">No se pudieron cargar las políticas.</p>
      )}
    </div>
  );
}

export default PoliticasPage;
