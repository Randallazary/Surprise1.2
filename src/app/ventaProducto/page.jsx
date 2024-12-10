"use client";
import Image from "next/image";

function BrakePadView() {
  const products = [
    {
      id: 1,
      title: "Reloj blanco en forma de dinosaurio",
      description:
        "Un reloj creativo y único en forma de dinosaurio, ideal para decorar cualquier espacio. Perfecto para amantes de los detalles originales.",
      price: "$350.00 MX",
      imgSrc: "/assets/cosa.jpg",
      qrSrc: "/assets/qr1.jpg",
      bgColor: "from-blue-50",
      textColor: "text-blue-800",
      buttonColor: "bg-blue-600",
    },
    {
      id: 2,
      title: "Peluche de Patricio Estrella",
      description:
        "Un peluche adorable y suave de Patricio Estrella, ideal para decorar, abrazar y coleccionar. Perfecto para los fans de Bob Esponja.",
      price: "$450.00 MX",
      imgSrc: "/assets/cosa2.jpg",
      qrSrc: "/assets/qr2.jpg",
      bgColor: "from-yellow-50",
      textColor: "text-yellow-800",
      buttonColor: "bg-yellow-600",
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      {products.map((product) => (
        <div
          key={product.id}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gradient-to-r ${product.bgColor} via-white to-white shadow-md rounded-lg overflow-hidden`}
        >
          {/* Imagen del producto */}
          <div className="relative group">
            <div className="h-65 overflow-hidden rounded-lg flex justify-center items-center bg-gray-100">
              <Image
                src={product.imgSrc}
                alt={product.title}
                width={400}
                height={400}
                className="object-contain w-100 h-100"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="p-4 flex flex-col justify-between">
            {/* Título y QR */}
            <div className="flex justify-between items-center mb-4">
              <h1 className={`text-2xl font-bold ${product.textColor} tracking-wide`}>
                {product.title}
              </h1>
              <div className="text-center">
                <p className="text-xs text-gray-600">Escanea el siguiente QR para ver en 3D</p>
                <Image
                  src={product.qrSrc}
                  alt={`QR de ${product.title}`}
                  width={90}
                  height={90}
                  className="mt-2 rounded-md shadow-md"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-2 p-3 bg-gray-50 rounded-lg shadow-md">
              <h2 className={`text-lg font-bold ${product.textColor} mb-2`}>Descripción</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Precio */}
            <div className={`text-2xl font-semibold ${product.textColor.replace("800", "600")} mt-4`}>
              {product.price}
            </div>

            {/* Cantidad */}
            <div className="mb-4">
              <label
                className="block text-sm text-gray-700 font-medium mb-1"
                htmlFor={`quantity${product.id}`}
              >
                Cantidad del producto
              </label>
              <input
                type="number"
                id={`quantity${product.id}`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                defaultValue={1}
                min={1}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                className={`${product.buttonColor} text-white py-2 rounded-lg font-semibold shadow-md hover:${product.buttonColor.replace(
                  "600",
                  "700"
                )} transition-all duration-300 flex-1 text-sm`}
              >
                Añadir al Carrito
              </button>
              <button className="bg-red-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300 flex-1 text-sm">
                Eliminar Producto
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BrakePadView;
