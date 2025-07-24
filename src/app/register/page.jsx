"use client";

import { useState } from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { CONFIGURACIONES } from '../config/config';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [preguntaSecreta, setPreguntaSecreta] = useState("default");
  const [respuestaSecreta, setRespuestaSecreta] = useState("");

  const [nombreError, setNombreError] = useState("");
  const [apellidoError, setApellidoError] = useState("");
  const [respuestaError, setRespuestaError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");

   // ✅ Control de acceso y autenticación segura (ISO/IEC 27001:2013 - Control A.9.4)
  // Se usa ReCAPTCHA para evitar ataques automatizados en el formulario de registro.
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Almacena el token generado por el CAPTCHA
  };

  // ✅ Gestión segura de credenciales (ISO/IEC 27001:2013 - Control A.9.2)
  // Esta función evalúa la fortaleza de la contraseña, asegurando que cumpla con requisitos mínimos.
  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8 && password.length <= 30) strength++;
    if (/\d/.test(password)) strength++;
    if (/[a-zA-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
  };

  const [passwordWarning, setPasswordWarning] = useState(""); // Nuevo estado para el mensaje de advertencia

  // ✅ Protección contra contraseñas vulnerables (ISO/IEC 27001:2013 - Control A.12.6)
  // Se validan patrones inseguros y se verifica si la contraseña ha sido filtrada en bases de datos públicas.
  const handlePasswordChange = async (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);

    // Verificar si la contraseña contiene patrones prohibidos
    const containsForbiddenPattern = forbiddenPatterns.some((pattern) =>
      newPassword.toLowerCase().includes(pattern)
    );

    if (containsForbiddenPattern) {
      setPasswordWarning(
        "Tu contraseña contiene patrones comunes o inseguros."
      );
    } else {
      setPasswordWarning("");
    }

    // ✅ Protección contra exposición de credenciales (ISO/IEC 27001:2013 - Control A.12.6.1)
    // Verificar si la contraseña ha sido filtrada en bases de datos públicas comprometidas.
    const isPwned = await checkPasswordInPwned(newPassword);
    if (isPwned) {
      setPasswordWarning(
        "Tu contraseña ha sido filtrada en una base de datos pública. Por favor, elige otra."
      );
    } else {
      setPasswordWarning("");
    }

    checkPasswordMatch(newPassword, confirmPassword); // Verificar coincidencia de contraseñas
  };

  // ✅ Protección contra ataques de fuerza bruta (ISO/IEC 27001:2013 - Control A.9.4.3)
  // Asegura que las contraseñas ingresadas coincidan antes de permitir el registro.
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    checkPasswordMatch(password, newConfirmPassword);
  };

  // ✅ Verificación de integridad de datos (ISO/IEC 27001:2013 - Control A.14.2.5)
  // Se verifica que la contraseña confirmada coincida con la original.
  const checkPasswordMatch = (password, confirmPassword) => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  const requisitosContraseña = [
    { id: 1, texto: "Debe tener al menos 8 caracteres", check: (password) => password.length >= 8 },
    { id: 2, texto: "Debe contener una letra mayúscula", check: (password) => /[A-Z]/.test(password) },
    { id: 3, texto: "Debe contener una letra minúscula", check: (password) => /[a-z]/.test(password) },
    { id: 4, texto: "Debe contener un número", check: (password) => /\d/.test(password) },
    { id: 5, texto: "Debe contener un carácter especial", check: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  // Color de la barra según la fortaleza
  const getStrengthBarColor = () => {
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    if (passwordStrength === 4) return "bg-green-500";
    return "bg-gray-300";
  };

  // Texto de fortaleza según el nivel
  const getStrengthText = () => {
    if (passwordStrength === 1) return "Insegura";
    if (passwordStrength === 2) return "Poco segura";
    if (passwordStrength === 3) return "Segura";
    if (passwordStrength === 4) return "Muy Segura";
    return "";
  };

  // Color del texto según la fortaleza
  const getStrengthTextColor = () => {
    if (passwordStrength === 1) return "text-red-500";
    if (passwordStrength === 2) return "text-yellow-500";
    if (passwordStrength === 3) return "text-blue-500";
    if (passwordStrength === 4) return "text-green-500";
    return "text-gray-500";
  };

  // Añade un estado para controlar la visibilidad de la contraseña
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Añade un estado para controlar la visibilidad de la confirmación de la contraseña
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Función para alternar la visibilidad de la confirmación de la contraseña
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  //Funcion para patrones prohibidos
  const forbiddenPatterns = ["12345", "password", "admin", "qwerty", "abc123"];

  const checkPasswordInPwned = async (password) => {
    // 1. Hashear la contraseña usando SHA-1
    const sha1Hash = CryptoJS.SHA1(password).toString().toUpperCase();

    // 2. Tomar los primeros 5 caracteres del hash
    const hashPrefix = sha1Hash.substring(0, 5);
    const hashSuffix = sha1Hash.substring(5);

    try {
      // 3. Consultar la API de Have I Been Pwned
      const response = await fetch(
        `https://api.pwnedpasswords.com/range/${hashPrefix}`
      );
      const data = await response.text();

      // 4. Buscar si el sufijo completo está en la lista de hashes devueltos
      const isPwned = data.split("\n").some((line) => {
        const [hash, count] = line.split(":");
        return hash === hashSuffix;
      });

      return isPwned;
    } catch (error) {
      console.error("Error checking password with HIBP:", error);
      return false;
    }
  };

  // Función para manejar el envío del formulario al backend
  const router = useRouter(); // Inicializa el hook de enrutamiento

  // Función para manejar el envío del formulario al backend
  // Función para manejar el envío del formulario al backend
  const onSubmit = async (event) => {
    event.preventDefault();
    setOnSubmitLoading(true); // Mostrar loading al enviar
    if (preguntaSecreta === "default") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor selecciona una pregunta secreta válida.",
      });
      setOnSubmitLoading(false); // Detener loading
      return;
    }
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          lastname: apellido,
          email,
          password,
          user: nombre,
          telefono,
          preguntaSecreta,
          respuestaSecreta,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "🎉 ¡Registro Exitoso! 🎁",
          text: "¡Te has registrado con éxito! Revisa tu correo electrónico para activar tu cuenta.",
          background: "#fff5e6",
          color: "#8e44ad",
          confirmButtonText: "Ir a Iniciar Sesión",
          confirmButtonColor: "#ff4081",
          imageUrl: "/images/gift.png", // Puedes poner una URL de imagen de un regalo
          imageWidth: 100,
          imageHeight: 100,
        }).then(() => {
          // Redireccionar al login después de que el usuario haga clic en "OK"
          router.push("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          
          title: "🚨 Oops...",
          text: data.message,
          background: "#ffe6e6",
          color: "#c0392b",
          confirmButtonColor: "#ff4081",
        }).then(() => {

          router.push("/error");//  // 🔹 Redirige a la página de error del servidor
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "💥 Error en el servidor",
        text: "Ocurrió un error interno, inténtalo de nuevo más tarde.",
        background: "#ffe6e6",
        color: "#c0392b",
        confirmButtonColor: "#ff4081",
      }).then(() => {
        router.push(`/not-found?error=${encodeURIComponent(error.message)}`);
      });
    } finally {
      setOnSubmitLoading(false); // Dejar de mostrar loading
    }
  };

  const validateTelefono = (value) => {
    if (/^0{10}$/.test(value)) {
      setTelefonoError("El número no puede ser sólo ceros.");
      return false;
    } else if (/^(\d)\1{9}$/.test(value)) {
      setTelefonoError("El número no puede tener todos los dígitos iguales.");
      return false;
    } else if (!/^\d{10}$/.test(value)) {
      setTelefonoError("El número debe tener exactamente 10 dígitos.");
      return false;
    } else {
      setTelefonoError("");
      return true;
    }
  };

  const validateRespuestaSecreta = (value) => {
    if (/[^A-Za-z\s]/.test(value)) {
      setRespuestaError("Solo se permiten letras y espacios.");
      return false;
    } else if (/^\s*$/.test(value)) {
      setRespuestaError("La respuesta no puede estar vacía.");
      return false;
    } else {
      setRespuestaError("");
      return true;
    }
  };
  const valiteApellido = (value) => {
    if (/[^A-Az/z\s]/.test(value)){
      setApellidoError("solo se permiten letras y espacios");
    }else if (/^\s*$/.test(value)){
      setApellidoError("el apellido no puede estar vacio.");
      return false;
    }else{
      setApellidoError("");
      return true;
    }
  };

  const valiteNombre = (value) => {
    if (/[^A-Az/z\s]/.test(value)){
      setNombreError("solo se permiten letras y espacios");
    }else if (/^\s*$/.test(value)){
      setNombreError("el apellido no puede estar vacio.");
      return false;
    }else{
      setNombreError("");
      return true;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <Link href="/">
          <p className="text-purple-700 font-bold mb-6 block">&larr; Atrás</p>
        </Link>

        <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
          Crea tu cuenta
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={()=>valiteNombre(nombre)}
                className="w-full border border p-2 rounded-lg"
              />
              {nombreError && <p className="text-red-500 text-sm">{nombreError}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Apellido</label>
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                onBlur={()=>valiteApellido(apellido)}
                className="w-full border border p-2 rounded-lg"
              />
              {apellidoError && <p className="text-red-500 text-sm">{apellidoError}</p>}

            </div>

            <div>
              <label className="block text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700">Teléfono</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                onBlur={() => validateTelefono(telefono)}
                className="w-full border p-2 rounded-lg"
                placeholder="10 dígitos"
                maxLength={10}
              />
              {telefonoError && <p className="text-red-500 text-sm">{telefonoError}</p>}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Pregunta Secreta</label>
              <select
                value={preguntaSecreta}
                onChange={(e) => setPreguntaSecreta(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="default" disabled>
                  Selecciona una pregunta secreta
                </option>
                <option value="¿Cuál es el nombre de tu primera mascota?">
                  ¿Cuál es el nombre de tu primera mascota?
                </option>
                <option value="¿Cuál es tu película favorita?">
                  ¿Cuál es tu película favorita?
                </option>
                <option value="¿En qué ciudad naciste?">
                  ¿En qué ciudad naciste?
                </option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Respuesta Secreta</label>
              <input
                type="text"
                placeholder="respuesta secreta"
                value={respuestaSecreta}
                onChange={(e) => setRespuestaSecreta(e.target.value)}
                onBlur={() => validateRespuestaSecreta(respuestaSecreta)}
                className="w-full border p-2 rounded-lg"
              />
              {respuestaError && <p className="text-red-500 text-sm">{respuestaError}</p>}
            </div>

            <div className="relative">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Crear Contraseña"
                value={password}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-8 text-gray-600"
              >
                {passwordVisible ? "(Ocultar)" : "(Mostrar)"}
              </button>
            </div>

            <div className="relative">
              <label className="block text-gray-700">Confirmar Contraseña</label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full border p-2 rounded-lg ${passwordMatch ? "border-gray-300" : "border-red-500"}`}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-8 text-gray-600"
              >
                {confirmPasswordVisible ? "(Ocultar)" : "(Mostrar)"}
              </button>
              {!passwordMatch && (
                <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            {/* Requisitos de la contraseña */}
            <div className="text-sm mt-2">
              {requisitosContraseña.map((req) => {
                const cumple = req.check(password);
                return (
                  <p key={req.id} className={`flex items-center gap-2 ${cumple ? "text-green-600" : "text-gray-500"}`}>
                    {cumple ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-gray-500" />}
                    {req.texto}
                  </p>
                );
              })}
            </div>

            <div>
              <ReCAPTCHA
                sitekey="6LefaGgqAAAAADhSAE93iQBu95_kdAgBoBmrMUb7"
                onChange={handleRecaptchaChange}
              />
            </div>
          </div>

          {/* Botón Crear Cuenta al centro */}
          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className={`w-1/2 py-2 px-4 rounded-lg ${passwordMatch && recaptchaToken && !onSubmitLoading ? "bg-purple-700" : "bg-gray-400"} text-white hover:bg-purple-600`}
              disabled={!passwordMatch || !recaptchaToken || onSubmitLoading}
            >
              {onSubmitLoading ? "Cargando..." : "Crear Cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );


}

export default RegisterPage;