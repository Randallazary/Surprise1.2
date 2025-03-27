"use client";

import { useState } from "react";
import { useAuth } from "@/context/authContext";

const faqData = [
  {
    question: "¿Cuánto tarda en llegar mi pedido?",
    answer: "El tiempo de entrega depende de tu ubicación, pero generalmente toma entre 3 a 7 días hábiles.",
  },
  {
    question: "¿Puedo personalizar mi producto?",
    answer: "Sí, ofrecemos opciones de personalización en la mayoría de nuestros productos. Puedes especificarlo al momento de hacer tu pedido.",
  },
  {
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer: "Aceptamos pagos con tarjeta de crédito, débito y PayPal.",
  },
  
];

export default function FAQ() {
  const { theme } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className={`container mx-auto py-16 transition-all ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-5xl font-extrabold text-center mb-12">Preguntas Frecuentes</h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {faqData.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <button
              className="w-full text-left flex justify-between items-center py-2 text-lg font-medium"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && <p className="mt-2 text-gray-400">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
