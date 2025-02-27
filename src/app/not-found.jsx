'use client'; // Indicar que es un Client Component para usar hooks

import { useAuth } from '../context/authContext'; // Importar el contexto de autenticación
import Link from 'next/link';
import Image from 'next/image'; // Importar el componente Image de Next.js


const NotFoundPage = () => {
  const { theme } = useAuth(); // Obtener el tema actual (claro/oscuro)

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
     
      <Image
        src={theme === 'dark' ? '/assets/error 404.png' : '/assets/error 404.png'} // Cambiar la imagen según el tema
        alt="Coche"
        width={256} // Ancho de la imagen
        height={256} // Alto de la imagen
        className="w-64 h-64 mb-8"
      />

      {/* Mensaje de error */}
      <h1 className="text-4xl font-bold mb-4"></h1>
      <p className='text-xl text-center mb-8'>
      404 - Página no encontrada 🎁
      </p>
      <p className="text-xl text-center mb-8">
      
      Oops! Parece que este regalo se ha perdido en el camino. 
      </p>
      <p className='text-xl text-center mb-8'>
      Vuelve a la página principal y encuentra algo increíble.
      </p>

      {/* Botón para regresar al inicio */}
      <Link href="/">
        <button
          className={`px-6 py-2 rounded-lg font-semibold ${
            theme === 'dark'
              ? 'bg-green-600 text-white hover:bg-blue-500'
              : 'bg-purple-700 text-white hover:bg-cyan-600'
          }`}
        >
          Regresar al inicio
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;