"use client";

import ContactForm from "@/components/ContactForm";
import { useAuth } from "@/context/authContext"; // Importa el contexto del theme

export default function ContactPage() {
  const { theme } = useAuth(); // Obtener el estado del theme

  return (
    <div
      className={`container mx-auto py-16 transition-all ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-5xl font-extrabold text-center mb-12">
        Contáctanos
      </h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Sección de Información */}
        <div className="lg:w-1/2 space-y-6">
          <p className="text-lg">
            ¿Tienes alguna duda o sugerencia? ¡Nos encantaría escucharte!
            Rellena el formulario y nuestro equipo se pondrá en contacto contigo lo antes posible.
          </p>
          <div className="space-y-4">
            <p className="flex items-center gap-2">
              📍 <strong>Dirección:</strong> Avenida Juarez, Col.Centro Huejutla de Reyes Hidalgo
            </p>
            <p className="flex items-center gap-2">
              📧 <strong>Email:</strong> surprisecentro@gmail.com
            </p>
            <p className="flex items-center gap-2">
              📞 <strong>Teléfono:</strong> 77 13 53 88 53
            </p>
          </div>
        </div>

        {/* Formulario con adaptación al theme */}
        <div
          className={`lg:w-1/2 shadow-lg rounded-lg p-8 w-full max-w-lg transition-all ${
            theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
