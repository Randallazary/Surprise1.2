import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaBoxOpen,
  FaBriefcase,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa"; // Importamos los íconos


function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        {/* Sección de enlaces organizados en grid para pantallas grandes y en columna para pantallas pequeñas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm py-8 text-center">
          {/* Sección "Encuentra" */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">ENCUENTRANOS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ubicacion">
                  <p className="hover:text-red-400 text-lg">Ubicación</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección "Información" */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">INFORMACIÓN</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros">
                  <p className="hover:text-red-400 text-lg">Acerca de Diseño y Regalos Surprise</p>
                </Link>
              </li>
              <li>
                <Link href="/politicas">
                  <p className="hover:text-red-400 text-lg">Políticas de privacidad</p>
                </Link>
              </li>
              <li>
                <Link href="/terminos">
                  <p className="hover:text-red-400 text-lg">Términos y Condiciones</p>
                </Link>
              </li>
              <li>
                <Link href="/deslinde">
                  <p className="hover:text-red-400 text-lg">Deslinde</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección "Servicio al Cliente" */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">SERVICIO AL CLIENTE</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contactanos">
                  <p className="hover:text-red-400 text-lg">Contáctanos</p>
                </Link>
              </li>
              <li>
                <Link href="/Faq">
                  <p className="hover:text-red-400 text-lg">Preguntas frecuentes</p>
                </Link>
              </li>
              <li>
                <Link href="/PolitivasPriv">
                  <p className="hover:text-red-400 text-lg">Politicas de envio</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección "Síguenos" (redes sociales) */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">Síguenos</h3>
            <div className="flex justify-center space-x-6 py-4">
              {/* Facebook - Versión corregida */}
              <Link
                href="https://www.facebook.com/share/1BtkYyLYmj/"
                passHref
                legacyBehavior
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400"
                >
                  <FaFacebook className="w-6 h-6 cursor-pointer" />
                </a>
              </Link>

              {/*Instagram */}
              <Link
                href="https://www.instagram.com/disenosyregalossurprise?igsh=ZXI2Ym0xNmxrY2xl"
                passHref
                legacyBehavior>
                  <a
                  target="_black"
                  rel="noopener noreferrer"
                  className="hover:text-red-400"
                  >
                    <FaInstagram className="w-6 h-6 cursor-pointer hover:text-red-400" />
                  </a>
              </Link>
              
              {/*Wpp */}
              <Link
                href="https://wa.me/7713538853"
                passHref
                legacyBehavior>
                  <a
                  target="_black"
                  rel="noopener noreferrer"
                  className="hover:text-red-400"
                  >
                    <FaWhatsapp className="w-6 h-6 cursor-pointer hover:text-red-400" />
                  </a>
              </Link>
              
              {/* TikTok */}
              <Link
                href="https://www.tiktok.com/@surpriseregalos53?_t=ZS-8xqT2OsYUYE&_r=1"
                passHref
                legacyBehavior>
                  <a
                  target="_black"
                  rel="noopener noreferrer"
                  className="hover:text-red-400"
                  >
                    <FaTiktok className="w-6 h-6 cursor-pointer hover:text-red-400" />
                  </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Sección de Copyright */}
        <div className="text-center py-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Diseño y Regalos Surprise. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
