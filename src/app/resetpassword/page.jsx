"use client";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";

function RequestPasswordResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("email");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const { theme } = useAuth();
  const router = useRouter();

  const resetStates = () => {
    setMessage("");
    setError("");
    setQuestion("");
    setAnswer("");
    setNewPassword("");
    setConfirmPassword("");
    setStep(1);
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    resetStates();
  };

  const fetchSecretQuestion = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/get-secret-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("No se pudo obtener la pregunta secreta");

      const data = await response.json();
      setQuestion(data.preguntaSecreta);
      setStep(2);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, ingresa un correo existente");
      return;
    }

    try {
      if (selectedMethod === "email") {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/send-reset-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setMessage("Correo enviado con éxito, revisa tu bandeja de entrada");
        } else {
          const result = await response.json();
          setError(result.message || "No se pudo enviar el correo");
        }
      } else {
        if (step === 1) {
          await fetchSecretQuestion();
        } else if (step === 2) {
          const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/verify-secret-answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, respuestaSecreta: answer }),
          });

          if (response.ok) {
            setStep(3);
          } else {
            const result = await response.json();
            setError(result.message || "Respuesta incorrecta");
          }
        } else if (step === 3) {
          if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
          }

          const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword }),
          });

          if (response.ok) {
            setMessage("Contraseña cambiada con éxito. Redirigiendo...");
            setTimeout(() => router.push("/login"), 2000);
          } else {
            const result = await response.json();
            setError(result.message || "Error al cambiar la contraseña");
          }
        }
      }
    } catch (error) {
      setError(error.message || "Hubo un problema al procesar tu solicitud");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Restablecer Contraseña</h2>

        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 font-medium ${selectedMethod === "email" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            onClick={() => handleMethodChange("email")}
          >
            Por Email
          </button>
          <button
            className={`flex-1 py-2 font-medium ${selectedMethod === "question" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            onClick={() => handleMethodChange("question")}
          >
            Por Pregunta Secreta
          </button>
        </div>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>

          {selectedMethod === "question" && step === 2 && (
            <div className="mb-4">
              <label className="block text-gray-700">Pregunta Secreta</label>
              <p className="p-2 bg-gray-100 rounded-lg mb-4">{question}</p>
              <label className="block text-gray-700">Respuesta</label>
              <input
                type="text"
                placeholder="Ingresa tu respuesta secreta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>
          )}

          {selectedMethod === "question" && step === 3 && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                  minLength="6"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                  minLength="6"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full text-white py-2 px-4 rounded-lg hover:opacity-90 bg-green-700 mt-4"
          >
            {selectedMethod === "email"
              ? "Enviar enlace de restablecimiento"
              : step === 1
                ? "Obtener Pregunta Secreta"
                : step === 2
                  ? "Verificar Respuesta"
                  : "Cambiar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;
