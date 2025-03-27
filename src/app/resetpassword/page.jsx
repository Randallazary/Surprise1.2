'use client';
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiMail, FiKey, FiUser, FiPhone, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { CONFIGURACIONES } from '../config/config';
import { useAuth } from '../../context/authContext';

function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [preguntaSecreta, setPreguntaSecreta] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [method, setMethod] = useState('email');
  const [loading, setLoading] = useState(false);
  const { theme } = useAuth();
  const router = useRouter();

  // Paleta de colores morados y azules bajos
  const colors = {
    dark: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      header: 'bg-purple-800',  // Morado oscuro suave
      button: 'bg-indigo-600',   // Azul medio suave
      buttonHover: 'bg-indigo-500',
      input: 'bg-gray-700 border-gray-600',
      text: 'text-gray-100',
      secondary: 'bg-purple-900/50',
      accent: 'text-indigo-300'
    },
    light: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      header: 'bg-purple-200',  // Morado pastel
      button: 'bg-indigo-300',   // Azul pastel
      buttonHover: 'bg-indigo-400',
      input: 'bg-white border-gray-300',
      text: 'text-gray-900',
      secondary: 'bg-purple-100',
      accent: 'text-indigo-600'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (method === 'email') {
        response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/send-reset-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      } else {
        response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/verify-secret-question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email,
            respuestaSecreta,
            telefono
          })
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (method === 'email') {
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
            confirmButtonColor: colors[theme].button.replace('bg-', '')
          });
        } else {
          router.push(`/restorepassword/${data.token}`);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Ocurrió un error al procesar tu solicitud',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${colors[theme].bg}`}>
      <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${colors[theme].card}`}>
        {/* Encabezado */}
        <div className={`p-6 ${colors[theme].header} text-${theme === 'dark' ? 'white' : 'gray-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FiKey className="mr-2" /> Recuperar Contraseña
              </h1>
              <p className="mt-1">Elige cómo quieres recuperar tu acceso</p>
            </div>
            <Link href="/login" className={`hover:opacity-80 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <FiArrowLeft size={24} />
            </Link>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Selector de método */}
          <div className="flex mb-6 rounded-lg overflow-hidden border">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                method === 'email' 
                  ? `${colors[theme].button} text-white` 
                  : `${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
              }`}
            >
              <FiMail className="inline mr-2" /> Por correo
            </button>
            <button
              type="button"
              onClick={() => setMethod('secretQuestion')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                method === 'secretQuestion' 
                  ? `${colors[theme].button} text-white` 
                  : `${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
              }`}
            >
              <FiUser className="inline mr-2" /> Por pregunta secreta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de email */}
            <div>
              <label className={`block mb-2 font-medium ${colors[theme].text}`}>
                Correo electrónico
              </label>
              <div className={`flex items-center border rounded-lg ${colors[theme].input}`}>
                <FiMail className="ml-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 p-2 outline-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Campos para pregunta secreta */}
            {method === 'secretQuestion' && (
              <>
                <div>
                  <label className={`block mb-2 font-medium ${colors[theme].text}`}>
                    Teléfono registrado
                  </label>
                  <div className={`flex items-center border rounded-lg ${colors[theme].input}`}>
                    <FiPhone className="ml-3 text-gray-500" />
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className={`flex-1 p-2 outline-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                      placeholder="10 dígitos"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${colors[theme].text}`}>
                    Pregunta secreta
                  </label>
                  <select
                    value={preguntaSecreta}
                    onChange={(e) => setPreguntaSecreta(e.target.value)}
                    className={`w-full p-2 border rounded-lg ${colors[theme].input}`}
                    required
                  >
                    <option value="" disabled>Selecciona tu pregunta secreta</option>
                    <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                    <option value="¿Cuál es tu película favorita?">¿Cuál es tu película favorita?</option>
                    <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${colors[theme].text}`}>
                    Respuesta secreta
                  </label>
                  <div className={`flex items-center border rounded-lg ${colors[theme].input}`}>
                    <FiKey className="ml-3 text-gray-500" />
                    <input
                      type="text"
                      value={respuestaSecreta}
                      onChange={(e) => setRespuestaSecreta(e.target.value)}
                      className={`flex-1 p-2 outline-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                      placeholder="Tu respuesta"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                colors[theme].button
              } hover:${
                colors[theme].buttonHover
              } text-white transition-colors ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                method === 'email' ? 'Enviar enlace al correo' : 'Verificar respuesta'
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className={`mt-6 p-4 rounded-lg ${colors[theme].secondary}`}>
            <div className="flex items-start">
              <FiAlertCircle className={`mt-1 mr-2 flex-shrink-0 ${colors[theme].accent}`} />
              <div>
                <p className={`font-medium mb-1 ${colors[theme].text}`}>Importante:</p>
                <p className={`text-sm ${colors[theme].text}`}>
                  {method === 'email' 
                    ? 'El enlace para restablecer tu contraseña expirará en 15 minutos.'
                    : 'Debes proporcionar exactamente la misma respuesta que registraste inicialmente.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;