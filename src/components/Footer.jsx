import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaBoxOpen,
  FaBriefcase,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa"; // Importamos los íconos
import Image from "next/image";


function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 py-4">
         
        </div>
        {/* Iconos de redes sociales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm py-8 text-center">
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">ENCUENTRA</h3> {/* Cambié el color del texto */}
            <ul className="space-y-2">
              <li>
                <Link href="/ubicaciones">
                  <p className="hover:text-red-400 text-lg">Ubicacion</p> {/* Cambié el color hover */}
                </Link>
              </li>
              <li>
                <Link href="/marca">
                  <p className="hover:text-red-400 text-lg"></p>
                </Link>
              </li>
              <li>
                <Link href="/modelo">
                  <p className="hover:text-red-400 text-lg"></p>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg text-white">INFORMACIÓN</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros">
                  <p className="hover:text-red-400 text-lg">Acerca de Diseño y regalos Surprise</p>
                </Link>
              </li>
              <li>
                <Link href="/politicas">
                  <p className="hover:text-red-400 text-lg">Politicas de Privacidad</p>
                </Link>
              </li>
              <li>
                <Link href="/terminos&condiciones">
                  <p className="hover:text-red-400 text-lg">Terminos y Condiciones</p>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg text-white">SERVICIO AL CLIENTE</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/factura">
                  <p className="hover:text-green-400 text-lg"></p>
                </Link>
              </li>
              <li>
                <Link href="/contactos">
                  <p className="hover:text-red-400 text-lg">Contáctanos</p>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <p className="hover:text-red-400 text-lg">Preguntas frecuentes</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Iconos de redes sociales alineados */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-white">Síguenos</h3>
            <div className="flex justify-center space-x-6 py-4">
              <FaFacebook className="w-6 h-6 cursor-pointer hover:text-red-400" />
              <FaTwitter className="w-6 h-6 cursor-pointer hover:text-red-400" />
              <FaInstagram className="w-6 h-6 cursor-pointer hover:text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
