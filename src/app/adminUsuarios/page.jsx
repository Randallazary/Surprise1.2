'use client'; // Indica que es un componente del lado del cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';

function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]); // Inicializar como un arreglo vacío

  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.href = '/login';  // Redirige manualmente
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      const fetchUsers = async () => {
        const token = localStorage.getItem('token');  // Obtiene el token del localStorage
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Incluye el token en el encabezado
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Solo si usas cookies
        });
        const data = await response.json();
        setUsers(data);
      };
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId)); // Elimina el usuario de la lista
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 pt-36">
      <h1 className="text-4xl font-semibold text-center text-blue-800 mb-8">Panel de Administración</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Gestión de Usuarios</h2>

        <table className="min-w-full table-auto border-collapse text-gray-700">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-4 border-b text-left text-sm font-medium">Nombre</th>
              <th className="px-6 py-4 border-b text-left text-sm font-medium">Apellido</th>
              <th className="px-6 py-4 border-b text-left text-sm font-medium">Email</th>
              <th className="px-6 py-4 border-b text-left text-sm font-medium">Rol</th>
              <th className="px-6 py-4 border-b text-left text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm">{user.name}</td>
                  <td className="px-6 py-4 border-b text-sm">{user.lastname}</td> {/* Se añadió el apellido */}
                  <td className="px-6 py-4 border-b text-sm">{user.email}</td>
                  <td className="px-6 py-4 border-b text-sm capitalize">{user.role}</td>
                  <td className="px-6 py-4 border-b text-sm">
                    <button
                      className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
                      onClick={() => handleDelete(user._id)}
                    >
                      Eliminar
                    </button>
                    <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out ml-2">
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
