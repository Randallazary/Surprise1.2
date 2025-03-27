"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/authContext";

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const { theme } = useAuth(); // Obtener el tema actual

  return (
    <nav
      className={`text-sm mb-4 p-4 rounded-lg transition-all ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-[#fff6] text-gray-600"
      }`}
    >
      <ul className="flex gap-2">
        <li>
          <Link
            href="/"
            className={`hover:underline font-semibold ${
              theme === "dark" ? "text-blue-400" : "text-purple-700"
            }`}
          >
            Inicio
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          return (
            <span key={href} className="flex items-center">
              <span className="mx-2">/</span>
              <Link
                href={href}
                className={`hover:underline ${
                  theme === "dark" ? "text-blue-300" : "text-purple-700"
                }`}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            </span>
          );
        })}
      </ul>
    </nav>
  );
}
