"use client"; // Indicar que es un Client Component

import Image from 'next/image';
import { useAuth } from '../context/authContext';

function HomePage() {
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto

  // Lista de productos para llenar las cartas
  const productos = [
    {
      id: 1,
      nombre: 'Reloj unicornio rosa',
      descripcion: 'Player con estampado de esqueleto de gato.',
      precio: '$250 MXN',
      imagen: '/assets/producto1.jpg', 
    },
    {
      id: 2,
      nombre: 'Playera Xantolera',
      descripcion: 'Player negra con calavera.',
      precio: '$100 MXN',
      imagen: '',
    },
    {
      id: 3,
      nombre: 'Playera Xantolera',
      descripcion: 'Player blanca con estampado de calavera.',
      precio: '$200 MXN',
      imagen: '',
    },
    {
      id: 4,
      nombre: 'Playera Xantolera',
      descripcion: 'Playera con estamapdo de calavera con flores de cempasúchil.',
      precio: '$150 MXN',
      imagen: '',
    },
    {
      id: 5,
      nombre: 'Playera Xantolera',
      descripcion: 'Playera con estapado de mascara de diablo.',
      precio: '$250 MXN',
      imagen: '',
    },
  ];

  return (
    <div className={`min-h-screen container mx-auto py-8 pt-36 bf-pink-100 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h1>

      

      {/* Catálogo de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md rounded-lg overflow-hidden`}>
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              width={700}
              height={600}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{producto.nombre}</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{producto.descripcion}</p>
              <p className="text-lg font-bold mb-4">{producto.precio}</p>
              <button className="bg-[#8dd5ed] text-white py-2 px-4 rounded hover:bg-green-500">
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
