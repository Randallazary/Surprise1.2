"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useNetworkStatus() {
  useEffect(() => {
    const handleOffline = () => {
      toast.error("🔴 Sin conexión a internet");
    };

    const handleOnline = () => {
      toast.success("🟢 Conectado nuevamente");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
