"use client";

import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]); // Lista de mensajes (usuario y bot)
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para controlar si el chat está abierto o cerrado

  // Preguntas y respuestas predefinidas
  const predefinedQuestions = [
    { question: "¿Qué productos venden?", answer: "Vendemos regalos personalizados como tazas, camisetas y llaveros. ¡Visita nuestra tienda!" },
    { question: "¿Cómo puedo hacer un pedido?", answer: "Selecciona los productos, personalízalos y añádelos al carrito. Luego sigue el proceso de pago." },
    { question: "¿Cuáles son los métodos de pago?", answer: "Aceptamos tarjeta de crédito, PayPal y transferencias bancarias." },
    { question: "¿Cuánto tarda en llegar mi pedido?", answer: "El envío tarda entre 3 y 5 días hábiles según tu ubicación." },
    { question: "¿Tienen garantía los productos?", answer: "Sí, todos los productos tienen garantía de satisfacción." },
    { question: "¿Puedo personalizar los productos?", answer: "¡Sí! Puedes añadir tu propio diseño o texto en la página de cada producto." }
  ];

  // Manejar la selección de una pregunta
  const handleQuestionClick = (selectedQuestion) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: selectedQuestion.question, sender: "user" }, // Agregar pregunta como mensaje del usuario
      { text: selectedQuestion.answer, sender: "bot" } // Respuesta automática del bot
    ]);
  };

  return (
    <div>
      {/* Burbuja flotante */}
      {!isChatOpen && (
        <div
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 z-50 p-4 bg-blue-500 text-white rounded-full cursor-pointer shadow-lg"
        >
          <span className="text-xl">💬</span>
        </div>
      )}

      {/* Cuadro de chat */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 border border-gray-300 rounded-lg shadow-lg w-80 max-h-96 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="text-lg font-semibold">Chat de Ayuda</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>

          {/* Lista de preguntas */}
          <div className="overflow-y-auto h-40 space-y-2">
            {predefinedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(q)}
                className="block w-full text-left p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {q.question}
              </button>
            ))}
          </div>

          {/* Conversación */}
          <div className="messages space-y-3 overflow-y-auto h-40 p-2 border-t mt-2">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p className={msg.sender === "user" ? "text-right text-blue-600" : "text-left text-gray-800"}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
