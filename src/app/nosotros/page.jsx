'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';

export default function AboutUsViewPage() {
  const { user, isAuthenticated } = useAuth();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar permisos (opcional, puedes ajustar según necesidades)
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, user]);

  // Obtener información
  const fetchCompanyInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/about-us`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanyInfo(data);
      }
    } catch (error) {
      console.error('Error al cargar la información:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando información de la empresa...</p>
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="text-center py-8">
        <p>No se encontró información de la empresa</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Sobre Nuestra Empresa</h1>

      {companyInfo.imagenUrl && (
        <div className="flex justify-center mb-8">
          <img 
            src={companyInfo.imagenUrl} 
            alt="Nuestra empresa" 
            className="rounded-lg shadow-md max-w-full h-auto max-h-96"
          />
        </div>
      )}

      <div className="prose max-w-none mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Misión</h2>
          <p className="text-gray-700 whitespace-pre-line">{companyInfo.mision}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Visión</h2>
          <p className="text-gray-700 whitespace-pre-line">{companyInfo.vision}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Nuestros Valores</h2>
          <p className="text-gray-700 whitespace-pre-line">{companyInfo.valores}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Nuestra Historia</h2>
          <p className="text-gray-700 whitespace-pre-line">{companyInfo.historia}</p>
        </section>

        {companyInfo.equipo && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Nuestro Equipo</h2>
            <p className="text-gray-700 whitespace-pre-line">{companyInfo.equipo}</p>
          </section>
        )}
      </div>
    </div>
  );
}