"use client"; // Indicar que es un Client Component

import Image from 'next/image';
import { useAuth } from '../context/authContext';

function HomePage() {
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto

  // Lista de productos para llenar las cartas
  const productos = [
    {
      id: 1,
      nombre: 'Reloj rosa en forma de unicornio',
      descripcion: 'Reloj decorativo en forma de unicornio de color rosa.',
      precio: '$250 MXN',
      imagen: '/assets/producto1.jpg',
    },
    {
      id: 2,
      nombre: 'Reloj blanco en forma de dinosaurio',
      descripcion: 'Reloj decorativo en forma de dinosaurio de color blanco',
      precio: '$100 MXN',
      imagen: '/assets/cosa.jpg',
    },
    {
      id: 3,
      nombre: 'Peluche de Patricio',
      descripcion: 'Peluche de Patricio de la serie de Bob Esponja',
      precio: '$200 MXN',
      imagen: '/assets/cosa2.jpg',
    },
    {
      id: 4,
      nombre: 'Taza de la serie de Gravity Falls',
      descripcion: 'Taza con la imagen del personaje de pato de la serie de Gravity Falls',
      precio: '$150 MXN',
      imagen: '/assets/tasa.jpg',
    },
    {
      id: 5,
      nombre: 'Gorra de Bob Esponja',
      descripcion: 'Gorra de color amarillo con la cara del personaje de Bob Esponja',
      precio: '$250 MXN',
      imagen: '/assets/gorradebobsponja.jpg',
    },
  ];

  return (
    <div>
      {/* Barra superior con imagen desplazable */}
      <div className="relative w-full h-40 overflow-hidden bg-purple-300">
        <div className="absolute w-full h-full flex items-center animate-marquee">
          <Image
            src="/assets/image.png" // Cambia esta ruta a tu imagen
            alt="Banner"
            width={1600} // Asegúrate de que el ancho sea mayor que la pantalla para el efecto
            height={200}
            className="object-cover"
          />
        </div>
      </div>

      {/* Contenedor principal */}
      <div
        className={`min-h-screen container mx-auto py-8 pt-36 bg-pink-100 ${
          theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h1>

        {/* Catálogo de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              } shadow-md rounded-lg overflow-hidden`}
            >
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                width={700}
                height={600}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{producto.nombre}</h2>
                <p
                  className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  } mb-4`}
                >
                  {producto.descripcion}
                </p>
                <p className="text-lg font-bold mb-4">{producto.precio}</p>
                <button className="bg-[#8dd5ed] text-white py-2 px-4 rounded hover:bg-green-500">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
