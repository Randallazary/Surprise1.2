"use client";
import Image from "next/image";

function BrakePadView() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Producto 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-r from-blue-50 via-white to-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative group">
          <div className="h-80 lg:h-auto overflow-hidden rounded-lg transition-transform duration-300 transform group-hover:scale-105">
            <Image
              src="/assets/cosa.jpg" // Ruta correcta
              alt="Motor"
              width={500}
              height={500}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-blue-800 tracking-wide">Reloj blanco en forma de dinosaurio</h1>
            <div className="text-center">
              <p className="text-sm text-gray-600">Escanea el siguiente QR para ver en 3D</p>
              <Image
                src="/assets/qr1.jpg"
                alt="Código QR"
                width={120}
                height={120}
                className="mt-3 rounded-md shadow-md"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-800 mb-3">Descripción</h2>
            <p className="text-gray-600 leading-relaxed">
              Un reloj creativo y único en forma de dinosaurio, ideal para decorar cualquier espacio. Perfecto para amantes de los detalles originales.
            </p>
          </div>
          <div className="text-4xl font-semibold text-blue-600 mt-6">$350.00 MX</div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity1">
              Cantidad del producto
            </label>
            <input
              type="number"
              id="quantity1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              defaultValue={1}
              min={1}
            />
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white py-4 rounded-lg font-semibold shadow-xl hover:bg-blue-700 transition-all duration-300 flex-1">
              Añadir al Carrito
            </button>
            <button className="bg-red-600 text-white py-4 rounded-lg font-semibold shadow-xl hover:bg-red-700 transition-all duration-300 flex-1">
              Eliminar Producto
            </button>
          </div>
        </div>
      </div>

      {/* Producto 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-r from-yellow-50 via-white to-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative group">
          <div className="h-80 lg:h-auto overflow-hidden rounded-lg transition-transform duration-300 transform group-hover:scale-105">
            <Image
              src="/assets/cosa2.jpg" // Ruta correcta
              alt="Motor 2"
              width={500}
              height={500}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-yellow-800 tracking-wide">Peluche de Patricio Estrella</h1>
            <div className="text-center">
              <p className="text-sm text-gray-600">Escanea el siguiente QR para ver en 3D</p>
              <Image
                src="/assets/qr2.jpg"
                alt="Código QR"
                width={120}
                height={120}
                className="mt-3 rounded-md shadow-md"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-yellow-800 mb-3">Descripción</h2>
            <p className="text-gray-600 leading-relaxed">
              Un peluche adorable y suave de Patricio Estrella, ideal para decorar, abrazar y coleccionar. Perfecto para los fans de Bob Esponja.
            </p>
          </div>
          <div className="text-4xl font-semibold text-yellow-600 mt-6">$450.00 MX</div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity2">
              Cantidad del producto
            </label>
            <input
              type="number"
              id="quantity2"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-lg"
              defaultValue={1}
              min={1}
            />
          </div>
          <div className="flex gap-4">
            <button className="bg-yellow-600 text-white py-4 rounded-lg font-semibold shadow-xl hover:bg-yellow-700 transition-all duration-300 flex-1">
              Añadir al Carrito
            </button>
            <button className="bg-red-600 text-white py-4 rounded-lg font-semibold shadow-xl hover:bg-red-700 transition-all duration-300 flex-1">
              Eliminar Producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrakePadView;
