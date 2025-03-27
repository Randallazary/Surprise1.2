"use client";

import { useAuth } from "@/context/authContext"; // Para el theme
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

export default function UbicacionPage() {
  const { theme } = useAuth(); // Obtener el estado del theme

  return (
    <div
      className={`container mx-auto py-16 transition-all ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-5xl font-extrabold text-center mb-12">
        Nuestra Ubicación
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Sección de Información */}
        <div className="lg:w-1/2 space-y-6">
          <p className="text-lg">
            Ven a visitarnos en nuestra tienda física o contáctanos para obtener más información.
          </p>
          <div className="space-y-4">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              <strong>Dirección:</strong> 123 Calle Principal, Ciudad, País
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-blue-500" />
              <strong>Email:</strong> contacto@miempresa.com
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-green-500" />
              <strong>Teléfono:</strong> +123 456 7890
            </p>
          </div>
        </div>

        {/* Mapa */}
        <div
          className={`lg:w-1/2 rounded-lg overflow-hidden shadow-lg transition-all ${
            theme === "dark" ? "border border-gray-700" : "border border-gray-300"
          }`}
        >
          <iframe
            title="Mapa Ubicación"
            className="w-full h-96"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450937!2d144.9556513153181!3d-37.8173239797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df1f4f3b5%3A0x4b89b1f7f77e2a0!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1611815682449!5m2!1sen!2sau"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
