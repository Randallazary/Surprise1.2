'use client'; // Indicar que es un Client Component para poder usar hooks

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, theme } = useAuth(); // Obtén `login` y `theme` desde el contexto
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      if (result.success) {
        setMessage('Inicio de sesión exitoso');
        router.push('/');
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setMessage('Error interno del servidor');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-white text-gray-900'
      }`}
      style={{
        backgroundImage:
          theme === 'light' ? "../assets/fondoLogin.jpg" : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={`w-full md:w-1/2 flex flex-col justify-center items-center p-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="w-full max-w-md">
          <Link href="/">
            <p
              className={`font-bold mb-6 flex ${
                theme === 'dark'
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-purple-700 font-bold mb-6 flex hover:text-purple-600'
              }`}
            >
              &larr; Atrás
            </p>
          </Link>

          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            Inicia Sesión
          </h2>

          {message && (
            <p className="text-center text-red-500 mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className={`block text-white-700 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className={`w-full p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="mb-4">
              <label
                className={`block text-white-700 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className={`w-full p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-500"
            >
              Iniciar Sesión
            </button>

            <p
              className={`text-sm mt-4 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              ¿No tienes una cuenta?{' '}
              <Link href="/register">
                <span
                  className="font-semibold hover:underline"
                  style={{
                    color: theme === 'dark' ? '#9ae6b4' : '#2f855a',
                  }}
                >
                  Crear una cuenta
                </span>
              </Link>
            </p>

            <p
              className={`text-sm mt-4 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              ¿Olvidaste tu contraseña?{' '}
              <Link href="/resetpassword">
                <span
                  className="font-semibold hover:underline"
                  style={{
                    color: theme === 'dark' ? '#9ae6b4' : '#2f855a',
                  }}
                >
                  Recuperar contraseña
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
