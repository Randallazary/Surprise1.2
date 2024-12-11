"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TermsPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [terms, setTerms] = useState([]);
  const [currentTerms, setCurrentTerms] = useState(null);
  const [newTerms, setNewTerms] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const [editingTerms, setEditingTerms] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Obtener todos los términos
  const fetchTerms = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (Array.isArray(data)) {
      setTerms(data);
    } else {
      setTerms([]);
      console.error("La respuesta no es un array:", data);
    }
  };

  // Obtener los términos actuales
  const fetchCurrentTerms = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/terms/current`,
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
      setCurrentTerms(data);
    } else {
      console.error("Error al obtener los términos actuales");
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchTerms();
      fetchCurrentTerms();
    }
  }, [isAuthenticated, user]);

  // Crear nuevos términos
  const handleCreateTerms = async () => {
    if (!newTerms.title || !newTerms.content || !newTerms.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      });
      return;
    }

    if (new Date(newTerms.effectiveDate) < new Date()) {
      toast.error(
        "La fecha de vigencia no puede ser anterior a la fecha actual.",
        { position: "top-center" }
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTerms),
      });

      if (response.ok) {
        toast.success("Términos creados exitosamente.", {
          position: "top-center",
        });
        fetchTerms();
        fetchCurrentTerms();
        setNewTerms({ title: "", content: "", effectiveDate: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" });
    }
  };

  // Actualizar términos existentes
  const handleUpdateTerms = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/${editingTerms._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTerms),
        }
      );
      if (response.ok) {
        setEditingTerms(null);
        fetchTerms();
        fetchCurrentTerms();
      }
    } catch (error) {
      console.error("Error al actualizar los términos:", error);
    }
  };

  // Eliminar términos
  const handleDeleteTerms = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchTerms();
        fetchCurrentTerms();
      }
    } catch (error) {
      console.error("Error al eliminar los términos:", error);
    }
  };

  // Establecer términos como actuales
  const handleSetCurrentTerms = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/${id}/set-current`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchTerms();
        fetchCurrentTerms();
      }
    } catch (error) {
      console.error("Error al establecer los términos como actuales:", error);
    }
  };

  return (
    <div
      className={`container mx-auto py-10 px-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
    >
      <div>
        <h1 className="text-4xl font-extrabold text-center mb-10 underline decoration-wavy decoration-purple-500">
          Gestión de Términos y Condiciones
        </h1>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  
        {/* Crear o editar términos */}
        <div className="shadow-lg rounded-lg overflow-hidden p-6 mb-8 bg-gradient-to-r from-purple-300 to-purple-400">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {editingTerms ? "Editar Términos" : "Crear Nuevos Términos"}
          </h2>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Título</label>
            <input
              type="text"
              value={editingTerms ? editingTerms.title : newTerms.title}
              onChange={(e) =>
                editingTerms
                  ? setEditingTerms({ ...editingTerms, title: e.target.value })
                  : setNewTerms({ ...newTerms, title: e.target.value })
              }
              className="w-full border bg-white p-2 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Contenido</label>
            <textarea
              value={editingTerms ? editingTerms.content : newTerms.content}
              onChange={(e) =>
                editingTerms
                  ? setEditingTerms({ ...editingTerms, content: e.target.value })
                  : setNewTerms({ ...newTerms, content: e.target.value })
              }
              className="w-full border bg-white p-2 rounded-lg"
              rows="6"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Fecha de Vigencia</label>
            <input
              type="date"
              value={editingTerms ? editingTerms.effectiveDate : newTerms.effectiveDate}
              onChange={(e) =>
                editingTerms
                  ? setEditingTerms({ ...editingTerms, effectiveDate: e.target.value })
                  : setNewTerms({ ...newTerms, effectiveDate: e.target.value })
              }
              className="w-full border bg-white p-2 rounded-lg"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <button
            onClick={editingTerms ? handleUpdateTerms : handleCreateTerms}
            className="py-2 px-4 bg-green-400 text-white rounded hover:bg-green-500"
          >
            {editingTerms ? "Guardar Cambios" : "Crear Términos"}
          </button>
        </div>
  
        {/* Mostrar los términos actuales */}
        {currentTerms && (
          <div className="mb-8 shadow-lg rounded-lg p-6 bg-gradient-to-r from-purple-300 to-purple-400">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Términos Actuales</h2>
            <p>
              <strong>Título:</strong> {currentTerms.title}
            </p>
            <p>
              <strong>Contenido:</strong> {currentTerms.content}
            </p>
            <p className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
              <strong>Fecha de Creación:</strong>{" "}
              {new Date(currentTerms.createdAt).toLocaleDateString()}
            </p>
            <p className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
              <strong>Fecha de Vigencia:</strong>{" "}
              {new Date(currentTerms.effectiveDate).toLocaleDateString()}
            </p>
          </div>
        )}
  
        {/* Listar términos */}
        <div>
          <div className="shadow-lg rounded-lg overflow-hidden p-6 bg-gradient-to-r from-purple-300 to-purple-400">
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">Listado de Términos</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-lg font-semibold">Título</th>
                  <th className="px-6 py-3 text-lg font-semibold">Fecha de Creación</th>
                  <th className="px-6 py-3 text-lg font-semibold">Fecha de Vigencia</th>
                  <th className="px-6 py-3 text-lg font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(terms) &&
                  terms.map((term) => (
                    <tr
                      key={term._id}
                      className={term.isCurrent ? "bg-green-100" : ""} // Fondo verde claro si es actual
                    >
                      {/* Título con etiqueta "Actual" si aplica */}
                      <td className="px-4 py-2">
                        {term.title}{" "}
                        {term.isCurrent && (
                          <span className="text-green-500 font-semibold">
                            (Actual)
                          </span>
                        )}
                      </td>
  
                      {/* Fecha de creación */}
                      <td className="px-4 py-2">
                        <span
                          className={`text-sm ${theme === "dark" ? "text-blue-900" : "text-gray-700"}`}
                        >
                          {new Date(term.createdAt).toLocaleDateString()}
                        </span>
                      </td>
  
                      <td className="px-4 py-2">
                        <span
                          className={`text-sm ${theme === "dark" ? "text-red-900" : "text-gray-700"}`}
                        >
                          {new Date(term.effectiveDate).toLocaleDateString()}
                        </span>
                      </td>
  
                      {/* Acciones */}
                      <td className="px-4 py-2">
                        {/* Botón Editar */}
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-500"
                          onClick={() => setEditingTerms(term)}
                        >
                          Editar
                        </button>
  
                        {/* Botón Establecer como Actual o deshabilitado si ya es actual */}
                        {term.isCurrent ? (
                          <button
                            className="bg-gray-500 text-white px-2 py-1 rounded mr-2 cursor-not-allowed"
                            disabled
                          >
                            Actual
                          </button>
                        ) : (
                          <button
                            className="bg-blue-400 text-white px-2 py-1 rounded mr-2 hover:bg-blue-500"
                            onClick={() => handleSetCurrentTerms(term._id)}
                          >
                            Establecer termino
                          </button>
                        )}
  
                        {/* Botón Eliminar */}
                        <button
                          className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500"
                          onClick={() => handleDeleteTerms(term._id)}
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

export default TermsPage;