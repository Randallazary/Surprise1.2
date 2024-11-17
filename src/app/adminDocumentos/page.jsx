"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";

function PrivacyPolicyPage() {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  const fetchCurrentPolicyWithVersions = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current-with-versions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      setPolicies([data.currentPolicy]);
      setLoading(false);
    } else {
      setLoading(false);
      console.error("Error fetching policies:", response.statusText);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchCurrentPolicyWithVersions();
    }
  }, [isAuthenticated, user]);

  const handleCreateOrUpdatePolicy = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPolicy),
        }
      );

      if (response.ok) {
        await fetchPolicies();
        setNewPolicy({ title: "", content: "", effectiveDate: "" });
      }
    } catch (error) {
      console.error("Error al crear o actualizar la política de privacidad:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">Cargando políticas de privacidad...</p>
    );
  }

  return (
    <div className={`container mx-auto py-12 pt-32 px-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h1 className="text-4xl font-bold text-center mb-8">
        Gestión de Política de Privacidad
      </h1>

      {/* Contenedor Flex para crear dos columnas */}
      <div className="flex space-x-8">
        {/* Sección para crear o actualizar la política */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-8 mb-8 border border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Crear o Actualizar Política de Privacidad
          </h2>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              value={newPolicy.title}
              onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Contenido</label>
            <textarea
              value={newPolicy.content}
              onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de Vigencia</label>
            <input
              type="date"
              value={newPolicy.effectiveDate}
              onChange={(e) => setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCreateOrUpdatePolicy}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Crear Política
          </button>
        </div>

        {/* Sección para mostrar la política actual */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-8 border border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Política de Privacidad Actual</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-3 border-b text-left text-lg text-gray-600">Título</th>
                <th className="px-4 py-3 border-b text-left text-lg text-gray-600">Fecha de Creación</th>
                <th className="px-4 py-3 border-b text-left text-lg text-gray-600">Fecha de Vigencia</th>
              </tr>
            </thead>
            <tbody>
              {policies.length > 0 ? (
                <tr key={policies[0]._id}>
                  <td className="px-4 py-3 border-b text-gray-800">{policies[0].title}</td>
                  <td className="px-4 py-3 border-b text-gray-800">
                    {new Date(policies[0].createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-800">
                    {new Date(policies[0].effectiveDate).toLocaleDateString()}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">No hay políticas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
