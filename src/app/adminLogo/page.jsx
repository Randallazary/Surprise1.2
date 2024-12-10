"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useLogo } from "../../context/LogoContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";

function AdminLogoPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const { fetchLogo } = useLogo();
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirigir a login si no está autenticado o no es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Validar tipo de archivo en el frontend
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogo(file);
      setMessage("");
    } else {
      setLogo(null);
      setMessage("Por favor, selecciona un archivo de imagen válido (JPG, PNG, etc.).");
    }
  };

  // Subir el archivo al backend
  const handleUploadLogo = async () => {
    if (!logo) {
      setMessage("Selecciona un archivo antes de subir.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", logo);
    formData.append("autor", user.name);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/subir`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Logo subido correctamente.");
        setLogo(null);
        await fetchLogo(); // Refresca el logo en el frontend
      } else {
        const error = await response.json();
        setMessage(error.message || "Error al subir el logo.");
      }
    } catch (error) {
      console.error("Error al subir el logo:", error);
      setMessage("Error al subir el logo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`container mx-auto py-8  ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-extrabold text-center mb-10 underline decoration-wavy decoration-purple-500">
        Administración de Logo
      </h1>
  
      <div
        className={`shadow-lg rounded-2xl p-8 transform transition duration-300 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100 "
            : "bg-purple-200 text-gray-900 "
        }`}
      >
        {/* Encabezado del formulario */}
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-500">
          Subir Nuevo Logo
        </h2>
  
        {/* Input para subir imágenes */}
        <div className="mb-6">
          <label
            className={`block mb-2 text-lg font-semibold ${
              theme === "dark" ? "text-gray-300" : "text-purple-700"
            }`}
          >
            Selecciona un logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-4 transition ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-yellow-500"
                : "border-purple-400 bg-purple-100 focus:ring-purple-500"
            }`}
          />
        </div>
  
        {/* Botón para subir */}
        <div className="text-center mb-6">
          <button
            onClick={handleUploadLogo}
            disabled={isLoading}
            className={`py-3 px-6 rounded-full font-bold text-lg shadow-md transform transition-all ${
              isLoading
                ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                : theme === "dark"
                ? "bg-green-600 text-white hover:bg-green-500 hover:scale-110"
                : "bg-pink-500 text-white hover:bg-pink-400 hover:scale-110"
            }`}
          >
            {isLoading ? "Subiendo..." : "Subir Logo"}
          </button>
        </div>
  
        {/* Mensajes de estado */}
        {message && (
          <p
            className={`mt-6 text-center text-xl font-semibold transition-all ${
              message.includes("Error")
                ? "text-red-500 animate-pulse"
                : "text-green-500 animate-bounce"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
  
}

export default AdminLogoPage;