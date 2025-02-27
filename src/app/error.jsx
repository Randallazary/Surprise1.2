"use client"; 

import { useAuth } from "../context/authContext";
import Link from "next/link";
import Image from "next/image";

const ServerErrorPage = () => {
  const { theme } = useAuth(); 

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <Image
        src="/assets/error500.png" // 🔹 Imagen fija de error 500
        alt="Error del servidor"
        width={256}
        height={256}
        className="w-64 h-64 mb-8"
      />

      <h1 className="text-4xl font-bold mb-4">¡Error en el servidor!</h1>
      <p className="text-xl text-center mb-8">
        Oops... parece que hay un problema en el servidor.
      </p>

      <Link href="/">
        <button className={`px-6 py-2 rounded-lg font-semibold ${theme === "dark" ? "bg-red-600 text-white hover:bg-red-500" : "bg-red-700 text-white hover:bg-red-500"}`}>
          Regresar al inicio
        </button>
      </Link>
    </div>
  );
};

export default ServerErrorPage;
