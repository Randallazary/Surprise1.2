"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Mensaje enviado correctamente.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
        required
      />
      <textarea
        name="message"
        placeholder="Mensaje"
        value={formData.message}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
        rows="5"
        required
      />
      <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-lg w-full">
        Enviar
      </button>
    </form>
  );
}
