"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function PrivacyPolicyPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const [editingPolicy, setEditingPolicy] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Obtener todas las políticas
  const fetchPolicies = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    // Verifica si data es un array, si no, lo transformas
    if (Array.isArray(data)) {
      setPolicies(data);
    } else {
      setPolicies([]);
      console.error("La respuesta no es un array:", data);
    }
  };

  // Obtener la política actual
  const fetchCurrentPolicy = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setCurrentPolicy(data); // Actualiza el estado de la política actual
    } else {
      console.error("Error al obtener la política actual");
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPolicies();
      fetchCurrentPolicy();
    }
  }, [isAuthenticated, user]);

  // Crear una nueva política
  const handleCreatePolicy = async () => {
    if (!newPolicy.title || !newPolicy.content || !newPolicy.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", { position: "top-center" });
      return;
    }
  
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
        toast.success("Política creada exitosamente.", { position: "top-center" });
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
        setNewPolicy({ title: "", content: "", effectiveDate: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" });
    }
  };
  

  // Actualizar una política existente
  const handleUpdatePolicy = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${editingPolicy._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPolicy),
        }
      );
      if (response.ok) {
        setEditingPolicy(null);
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al actualizar la política:", error);
    }
  };

  // Eliminar una política
  const handleDeletePolicy = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al eliminar la política:", error);
    }
  };

  // Establecer una política como actual
  const handleSetCurrentPolicy = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}/set-current`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al establecer la política como actual:", error);
    }
  };

  return (
    <div
      className={`container mx-auto py-10 px-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-black-900"
        }`}
    >
      <h1 className="text-4xl font-extrabold text-center mb-10 underline decoration-wavy decoration-purple-500">
        Gestión de Políticas de Privacidad
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de Crear o Editar */}
        <div
          className={`shadow-lg rounded-lg p-6 ${theme === "dark" ? "bg-gray-100" : "bg-pink-100"
            }`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">
            {editingPolicy ? "Editar Política" : "Crear Nueva Política"}
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-600">Título</label>
            <input
              type="text"
              value={editingPolicy ? editingPolicy.title : newPolicy.title}
              onChange={(e) =>
                editingPolicy
                  ? setEditingPolicy({ ...editingPolicy, title: e.target.value })
                  : setNewPolicy({ ...newPolicy, title: e.target.value })
              }
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${theme === "dark"
                ? "border-gray-700 bg-gray-700 text-gray-100 focus:ring-blue-500"
                : "border-purple-300 bg-purple-50 text-gray-900 focus:ring-purple-500"
                }`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-600">Contenido</label>
            <textarea
              value={editingPolicy ? editingPolicy.content : newPolicy.content}
              onChange={(e) =>
                editingPolicy
                  ? setEditingPolicy({
                    ...editingPolicy,
                    content: e.target.value,
                  })
                  : setNewPolicy({ ...newPolicy, content: e.target.value })
              }
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${theme === "dark"
                ? "border-gray-700 bg-gray-700 text-gray-100 focus:ring-blue-500"
                : "border-purple-300 bg-purple-50 text-gray-900 focus:ring-purple-500"
                }`}
              rows="6"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-600">Fecha de Vigencia</label>
            <input
              type="date"
              value={editingPolicy ? editingPolicy.effectiveDate : newPolicy.effectiveDate}
              onChange={(e) =>
                editingPolicy
                  ? setEditingPolicy({
                    ...editingPolicy,
                    effectiveDate: e.target.value,
                  })
                  : setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })
              }
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${theme === "dark"
                ? "border-gray-700 bg-gray-700 text-gray-100 focus:ring-blue-500"
                : "border-purple-300 bg-purple-50 text-gray-900 focus:ring-purple-500"
                }`}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <button
            onClick={editingPolicy ? handleUpdatePolicy : handleCreatePolicy}
            className={`w-full py-3 rounded-lg hover:bg-pink-300 transition ${theme === "dark" ? "bg-blue-500 text-white" : "bg-blue-500 text-black"
              }`}
          >
            {editingPolicy ? "Guardar Cambios" : "Crear Política"}
          </button>
        </div>
  
        {/* Mostrar la política actual */}
        {currentPolicy && (
          <div className="mb-8 shadow-md rounded-lg p-6 bg-pink-50">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Política Actual</h2>
            <p>
              <strong>Título:</strong> {currentPolicy.title}
            </p>
            <p>
              <strong>Contenido:</strong> {currentPolicy.content}
            </p>
            <p>
              <strong>Fecha de Creación:</strong>{" "}
              {new Date(currentPolicy.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Fecha de Vigencia:</strong>{" "}
              {new Date(currentPolicy.effectiveDate).toLocaleDateString()}
            </p>
          </div>
        )}
  
        {/* Listado de Políticas */}
        <div>
          <div
            className={`shadow-lg rounded-lg p-6 ${theme === "dark" ? "bg-gray-100" : "bg-pink-100"
              }`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-purple-700">Listado de Políticas</h2>
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2 px-4 text-purple-700">Título</th>
                  <th className="border-b py-2 px-4 text-purple-700">Fecha de Creación</th>
                  <th className="border-b py-2 px-4 text-purple-700">Fecha de Vigencia</th>
                  <th className="border-b py-2 px-4 text-purple-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(policies) &&
                  policies.map((policy) => (
                    <tr
                      key={policy._id}
                    >
                      <td className="py-2 px-4">
                        {policy.title}{" "}
                        {policy.isCurrent && (
                          <span className="text-green-500 font-semibold">
                            (Actual)
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {new Date(policy.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">
                        {new Date(policy.effectiveDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 space-x-2">
                        <button
                          className={`px-2 py-1 rounded ${theme === "dark"
                            ? "bg-purple-300 text-gray-900 hover:bg-purple-400"
                            : "bg-purple-300 text-black-1000 hover:bg-purple-400"
                            }`}
                          onClick={() => setEditingPolicy(policy)}
                        >
                          Editar
                        </button>
                        {policy.isCurrent ? (
                          <button
                            className="bg-gray-500 text-white px-2 py-1 rounded cursor-not-allowed"
                            disabled
                          >
                            Actual
                          </button>
                        ) : (
                          <button
                            className={`px-2 py-1 rounded ${theme === "dark"
                              ? "bg-blue-500 text-gray-900 hover:bg-blue-600"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                            onClick={() => handleSetCurrentPolicy(policy._id)}
                          >
                            Actualizar
                          </button>
                        )}
                        <button
                          className={`px-2 py-1 rounded ${theme === "dark"
                            ? "bg-red-500 text-gray-900 hover:bg-red-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                          onClick={() => handleDeletePolicy(policy._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  
  

}

export default PrivacyPolicyPage;