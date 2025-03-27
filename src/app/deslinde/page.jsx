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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando deslinde de responsabilidad...</p>
        </div>
      ) : deslinde ? (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {deslinde.title || "Deslinde de Responsabilidad"}
                </h1>
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm sm:text-base">
                    Vigente desde: {deslinde.effectiveDate ? new Date(deslinde.effectiveDate).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : "No disponible"}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ACTUAL
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="prose max-w-none">
              {deslinde.content ? (
                <div dangerouslySetInnerHTML={{ __html: deslinde.content }} />
              ) : (
                <p className="text-gray-500 italic">No hay contenido disponible.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 sm:px-10 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <div className="mb-2 sm:mb-0">
                <span className="font-medium">Última actualización:</span> {deslinde.updatedAt ? new Date(deslinde.updatedAt).toLocaleDateString() : "No disponible"}
              </div>
              <div>
                <span className="font-medium">Creado el:</span> {deslinde.createdAt ? new Date(deslinde.createdAt).toLocaleDateString() : "No disponible"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error al cargar el deslinde</h3>
          <p className="mt-2 text-gray-600">No se pudieron cargar los términos de deslinde. Por favor, inténtalo de nuevo más tarde.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}

export default DeslindePage;
