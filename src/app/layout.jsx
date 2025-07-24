"use client"; // Indicar que es un Client Component

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from '../context/CartContext';
import Breadcrumb from "@/components/Breadcrumb";
import { AuthProvider, useAuth } from "../context/authContext"; // Importa el theme desde AuthProvider
import { LogoProvider } from "../context/LogoContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Definir los fonts como localFont
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Componente Layout con Theme
function Layout({ children }) {
  const { theme } = useAuth(); // Obtener el tema actual

  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-[#BFECFF] text-gray-900"
      }`}
    >
      <Navbar />
      <div className="container mx-auto py-4">
        <Breadcrumb /> {/* Breadcrumb en todas las páginas */}
        {children}
      </div>
      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="fixed bottom-4 right-4 z-50">
        
      </div>
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <LogoProvider>
          <CartProvider>
          <Layout>{children}</Layout>
          </CartProvider>
        </LogoProvider>
      </AuthProvider>
    </html>
  );
}
