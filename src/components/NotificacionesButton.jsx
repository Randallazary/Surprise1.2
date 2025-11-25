"use client";

export default function NotificacionesButton() {
  const pedirPermiso = async () => {
    if (!("Notification" in window)) {
      alert("Este navegador no soporta notificaciones");
      return;
    }

    const permiso = await Notification.requestPermission();

    if (permiso === "granted") {
      new Notification("Notificaciones activadas 🎉", {
        body: "Ahora podremos enviarte avisos cuando haya ofertas o novedades.",
        icon: "/icon-192x192.png"
      });
    } else {
      alert("No aceptaste el permiso de notificaciones.");
    }
  };

  return (
    <button
      onClick={pedirPermiso}
      className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-500 transition-all"
    >
      Activa las notificaiones para ofertas y productos en descuento
    </button>
  );
}
