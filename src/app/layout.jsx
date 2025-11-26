"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";
import { AuthProvider, useAuth } from "../context/authContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

// Definir fonts
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

// =============================================
// ⭐ DETECTOR DE ESTADO DE INTERNET
// =============================================
function useNetworkStatusListener() {
  useEffect(() => {
    function handleOffline() {
      toast.error("❌ Sin conexión a Internet", {
        position: "top-center",
      });
    }

    function handleOnline() {
      toast.success("✅ Conectado nuevamente", {
        position: "top-center",
      });
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}

// =============================================
// Layout principal
// =============================================
function Layout({ children }) {
  const { theme } = useAuth();

  // Activar el listener de red
  useNetworkStatusListener();

  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-[#BFECFF] text-gray-900"
      }`}
    >
      <Navbar />
      <div className="container mx-auto py-4">
        <Breadcrumb />
        {children}
      </div>
      <Footer />

      <ToastContainer position="top-center" autoClose={3000} />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ("serviceWorker" in navigator) {
              if (!window.__SW_REGISTERED__) {
                window.__SW_REGISTERED__ = true;
                navigator.serviceWorker
                  .register("/sw.js")
                  .then(r => console.log("SW registrado:", r))
                  .catch(err => console.error("Error al registrar el SW:", err));
              }
            }
          `,
        }}
      />
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <AuthProvider>
        <CartProvider>
          <Layout>{children}</Layout>
        </CartProvider>
      </AuthProvider>
    </html>
  );
}
