"use client"
import { useState } from "react"
import { useAuth } from "@/context/authContext"
import {
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiPackage,
  FiCreditCard,
  FiTruck,
  FiSettings,
} from "react-icons/fi"

const faqData = [
  // Pedidos y Entregas
  {
    category: "Pedidos y Entregas",
    icon: <FiTruck className="w-5 h-5" />,
    questions: [
      {
        question: "¿Cuánto tarda en llegar mi pedido?",
        answer:
          "El tiempo de entrega depende de tu ubicación y el tipo de producto. Para productos personalizados: 3-5 días hábiles. Para productos en stock: 1-3 días hábiles. Los pedidos urgentes pueden procesarse en 24-48 horas con costo adicional.",
      },
      {
        question: "¿Hacen entregas a domicilio?",
        answer:
          "Sí, realizamos entregas a domicilio en Huejutla de Reyes y municipios cercanos. También enviamos a toda la República Mexicana a través de paqueterías especializadas. Los costos de envío se calculan según la distancia y peso del producto.",
      },
      {
        question: "¿Puedo rastrear mi pedido?",
        answer:
          "Absolutamente. Una vez que tu pedido sea enviado, recibirás un número de guía para rastrear tu paquete en tiempo real. También te notificaremos por WhatsApp y email sobre el estado de tu pedido.",
      },
      {
        question: "¿Qué pasa si no estoy en casa cuando llegue mi pedido?",
        answer:
          "Nuestro repartidor intentará contactarte. Si no estás disponible, dejaremos una nota con instrucciones para reagendar la entrega. También puedes especificar un lugar seguro para dejar el paquete o una persona de confianza que pueda recibirlo.",
      },
    ],
  },
  // Personalización
  {
    category: "Personalización",
    icon: <FiSettings className="w-5 h-5" />,
    questions: [
      {
        question: "¿Puedo personalizar mi producto?",
        answer:
          "¡Por supuesto! Ofrecemos personalización completa en la mayoría de nuestros productos. Puedes agregar nombres, fechas, fotos, logos, frases especiales y más. Nuestro equipo de diseño te ayudará a crear el producto perfecto.",
      },
      {
        question: "¿Qué formatos de imagen aceptan para personalización?",
        answer:
          "Aceptamos JPG, PNG, PDF y vectores (AI, EPS). Para mejores resultados, recomendamos imágenes de alta resolución (300 DPI mínimo). Si tu imagen no tiene la calidad suficiente, nuestro equipo puede ayudarte a mejorarla.",
      },
      {
        question: "¿Puedo ver una vista previa antes de la producción?",
        answer:
          "Sí, siempre enviamos una vista previa digital de tu diseño antes de comenzar la producción. Puedes solicitar cambios hasta que estés completamente satisfecho con el resultado.",
      },
      {
        question: "¿Hay límite en la cantidad de texto o imágenes?",
        answer:
          "Depende del producto y técnica de personalización. Para sublimación no hay límite de colores, pero para bordado recomendamos máximo 15,000 puntadas. Te asesoramos sobre las mejores opciones para tu diseño específico.",
      },
    ],
  },
  // Pagos
  {
    category: "Pagos y Precios",
    icon: <FiCreditCard className="w-5 h-5" />,
    questions: [
      {
        question: "¿Cuáles son los métodos de pago aceptados?",
        answer:
          "Aceptamos efectivo, transferencias bancarias, tarjetas de crédito y débito (Visa, MasterCard), PayPal, Mercado Pago, y pagos en OXXO. Para pedidos grandes ofrecemos planes de pago flexibles.",
      },
      {
        question: "¿Puedo pagar en mensualidades?",
        answer:
          "Sí, para pedidos mayores a $1,000 pesos ofrecemos planes de pago sin intereses hasta 6 meses. También aceptamos tarjetas de crédito con meses sin intereses según tu banco.",
      },
      {
        question: "¿Los precios incluyen la personalización?",
        answer:
          "Los precios base incluyen personalización básica (texto simple, 1-2 colores). Diseños complejos, múltiples imágenes o técnicas especiales pueden tener costo adicional que se cotiza previamente.",
      },
      {
        question: "¿Ofrecen descuentos por volumen?",
        answer:
          "Sí, manejamos precios especiales para pedidos grandes. A partir de 10 piezas iguales aplicamos descuentos progresivos. Para eventos corporativos y escuelas tenemos tarifas preferenciales.",
      },
    ],
  },
  // Productos
  {
    category: "Productos y Calidad",
    icon: <FiPackage className="w-5 h-5" />,
    questions: [
      {
        question: "¿Qué tipos de productos personalizan?",
        answer:
          "Personalizamos tazas, playeras, gorras, cojines, llaveros, marcos, termos, mouse pads, calendarios, agendas, peluches, y mucho más. Si tienes algo específico en mente, consúltanos y te diremos si es posible.",
      },
      {
        question: "¿Qué técnicas de personalización utilizan?",
        answer:
          "Utilizamos sublimación, serigrafía, bordado, grabado láser, vinil textil, impresión digital, y transfer. Cada técnica tiene sus ventajas y te recomendamos la mejor según tu producto y diseño.",
      },
      {
        question: "¿Los productos son de buena calidad?",
        answer:
          "Trabajamos solo con proveedores certificados y materiales de primera calidad. Todos nuestros productos pasan por control de calidad antes del envío. Nos esforzamos por entregar productos que superen tus expectativas.",
      },
      {
        question: "¿Los colores se desvanecen con el tiempo?",
        answer:
          "Nuestras técnicas de personalización están diseñadas para durar. La sublimación es permanente y no se desvanece. El bordado es muy duradero. Te damos instrucciones de cuidado para maximizar la vida útil de tu producto.",
      },
      {
        question: "¿Pueden hacer productos para eventos especiales?",
        answer:
          "¡Absolutamente! Nos especializamos en productos para bodas, XV años, graduaciones, baby showers, cumpleaños, eventos corporativos y más. Podemos crear paquetes personalizados para tu evento especial.",
      },
    ],
  },
]

export default function FAQ() {
  const { theme } = useAuth()
  const [openIndex, setOpenIndex] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => selectedCategory === "all" || category.category === selectedCategory)
    .filter((category) => category.questions.length > 0)

  const categories = ["all", ...faqData.map((cat) => cat.category)]

  return (
    <div className={`min-h-screen py-8 pt-36 ${theme === "dark" ? "bg-indigo-950" : "bg-indigo-50"}`}>
      <div className="container mx-auto px-4">
        {/* Header Elegante */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center px-6 py-3 rounded-full mb-6 ${
              theme === "dark"
                ? "bg-indigo-900/50 text-pink-400 border border-pink-400/30"
                : "bg-purple-50 text-purple-600 border border-purple-200"
            }`}
          >
            <FiHelpCircle className="mr-2" />
            <span className="font-medium">Centro de Ayuda</span>
          </div>

          <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
            Preguntas{" "}
            <span
              className={`${
                theme === "dark"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
              }`}
            >
              Frecuentes
            </span>
          </h1>

          <p className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros productos y servicios de
            personalización.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="max-w-4xl mx-auto mb-12">
          <div
            className={`rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-indigo-900/50 border border-indigo-800/50"
                : "bg-white shadow-lg border border-indigo-100"
            }`}
          >
            {/* Buscador */}
            <div className="relative mb-6">
              <FiSearch
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                }`}
              />
              <input
                type="text"
                placeholder="Buscar en preguntas frecuentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  theme === "dark"
                    ? "bg-indigo-800 border-indigo-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                    : "bg-indigo-50 border-indigo-200 text-indigo-900 focus:border-purple-500 focus:ring-purple-500/20"
                }`}
              />
            </div>

            {/* Filtros por categoría */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? theme === "dark"
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                        : "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : theme === "dark"
                        ? "bg-indigo-800/50 text-indigo-300 hover:bg-indigo-800"
                        : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  }`}
                >
                  {category === "all" ? "Todas" : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className={`rounded-3xl overflow-hidden ${
                theme === "dark"
                  ? "bg-indigo-900/50 backdrop-blur-sm border border-indigo-800/50"
                  : "bg-white shadow-xl border border-indigo-100"
              }`}
            >
              {/* Category Header */}
              <div
                className={`p-6 border-b ${
                  theme === "dark" ? "bg-indigo-900/30 border-indigo-800/50" : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      theme === "dark" ? "bg-pink-600/20 text-pink-400" : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {category.icon}
                  </div>
                  <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
                    {category.category}
                  </h2>
                </div>
              </div>

              {/* Questions */}
              <div className="divide-y divide-opacity-20">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openIndex === `${categoryIndex}-${questionIndex}`
                  return (
                    <div key={questionIndex} className="p-6">
                      <button
                        className="w-full text-left flex justify-between items-start py-2 group"
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                      >
                        <span
                          className={`text-lg font-semibold pr-4 group-hover:text-pink-500 transition-colors ${
                            theme === "dark" ? "text-white" : "text-indigo-900"
                          }`}
                        >
                          {faq.question}
                        </span>
                        <div
                          className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                            isOpen
                              ? theme === "dark"
                                ? "bg-pink-600/20 text-pink-400"
                                : "bg-pink-100 text-pink-600"
                              : theme === "dark"
                                ? "bg-indigo-800/50 text-indigo-400 group-hover:bg-pink-600/20 group-hover:text-pink-400"
                                : "bg-indigo-100 text-indigo-600 group-hover:bg-pink-100 group-hover:text-pink-600"
                          }`}
                        >
                          {isOpen ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                          <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-indigo-800/30" : "bg-indigo-50"}`}>
                            <p className={`leading-relaxed ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredFAQ.length === 0 && (
          <div className={`text-center py-20 ${theme === "dark" ? "text-indigo-300" : "text-slate-600"}`}>
            <FiHelpCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-indigo-900"}`}>
              No se encontraron resultados
            </h3>
            <p>Intenta con otros términos de búsqueda o selecciona una categoría diferente</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16">
          <div
            className={`rounded-3xl overflow-hidden p-12 text-center ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            } text-white`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">¿No encontraste lo que buscabas?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Nuestro equipo de atención al cliente está listo para ayudarte con cualquier pregunta específica sobre
              nuestros productos y servicios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contacto"
                className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Contáctanos
              </a>
              <a
                href="tel:+527713538853"
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
              >
                Llamar Ahora
              </a>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
