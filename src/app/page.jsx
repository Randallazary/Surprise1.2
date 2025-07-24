"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/authContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useState, useEffect } from "react";

function HomePage() {
  const { theme } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/api/productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Datos estáticos para banners y testimonios
  const banners = [
    '¡Envío gratis en compras mayores a $500 MXN!',
    'Descuentos del 20% en todos los productos este mes',
    'Nuevas colecciones disponibles ¡No te las pierdas!',
    'Compra 2 productos y obtén el 3ro con 50% de descuento',
  ];

  const testimonios = [
    {
      quote: 'Me encantaron los productos, excelente calidad y servicio!',
      author: 'María López'
    },
    {
      quote: 'La entrega fue rápida y segura. Recomiendo 100%!',
      author: 'Juan Pérez'
    },
    {
      quote: 'Los precios y promociones son increíbles. Volveré a comprar!',
      author: 'Ana Torres'
    }
  ];

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
      {/* Banner Promocional Deslizante */}
      <div className="overflow-hidden whitespace-nowrap bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-semibold py-3">
        <div className="inline-block min-w-full animate-marquee">
          {banners.map((texto, index) => (
            <span key={index} className="mx-8">{texto} 🚀</span>
          ))}
        </div>
      </div>

      {/* Contenedor de dos columnas */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-12 gap-8">
        {/* Carrusel a la izquierda */}
        <div className="w-full md:w-1/2 flex justify-start">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={-200}
            slidesPerView={1.5}
            centeredSlides
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="overflow-visible"
          >
            {productos.slice(0, 5).map((producto, index) => (
              <SwiperSlide key={producto.id} className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.8 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    scale: activeIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`relative w-[500px] h-[550px] shadow-lg rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                >
                  {producto.images.length > 0 && (
                    <Image
                      src={producto.images[0].url}
                      alt={producto.name}
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />
                  )}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sección de información a la derecha */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <h2 className="text-3xl font-bold mb-4">🔥 Ofertas Especiales</h2>
          <p className="text-lg mb-4">
            Descubre nuestras promociones exclusivas y productos en tendencia.
          </p>
          <ul className="list-disc pl-5 text-lg">
            <li>Envío gratis en compras mayores a $500 MXN</li>
            <li>20% de descuento en todos los productos este mes</li>
            <li>Compra 2 productos y obtén el 3ro con 50% de descuento</li>
          </ul>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h1>

        {/* Catálogo de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className={`relative shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}
            >
              <Link href={`/productos/${producto.id}`}>
                <div className="relative w-full h-80">
                  {producto.images.length > 0 && (
                    <Image
                      src={producto.images[0].url}
                      alt={producto.name}
                      fill
                      className="object-contain"
                    />
                  )}
                  {/* Botón de Vistazo Rápido */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                      Ver detalles
                    </button>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h2 className="text-lg font-bold mb-1">{producto.name}</h2>
                  <p className="mb-2 line-clamp-2">{producto.description}</p>
                  <p className="text-xl font-bold">
                    ${producto.price.toFixed(2)}
                    {producto.discount > 0 && (
                      <span className="ml-2 text-sm line-through text-gray-500">
                        ${(producto.price / (1 - producto.discount / 100)).toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Sección de Testimonios */}
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-bold text-center mb-6">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((testimonio, index) => (
              <div
                key={index}
                className={`shadow-md rounded-lg p-6 text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              >
                <p className="italic">&quot;{testimonio.quote}&quot;</p>
                <p className="mt-2 font-bold">- {testimonio.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;