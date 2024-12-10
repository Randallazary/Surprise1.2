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
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
        Panel de Administración
      </h1>
  
      <div className="bg-purple-200 shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Gestión de Usuarios</h2>
  
        <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
          <thead className="bg-yellow-100">
            <tr>
              <th className="px-4 py-2 border text-left text-purple-700">Nombre</th>
              <th className="px-4 py-2 border text-left text-purple-700">Email</th>
              <th className="px-4 py-2 border text-left text-purple-700">Rol</th>
              <th className="px-4 py-2 border text-left text-purple-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-purple-100">
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border flex space-x-2">
                    {user.role !== "admin" && (
                      <button
                        className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                        onClick={() => handleDelete(user._id)}
                      >
                        Eliminar
                      </button>
                    )}
                    <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-purple-700">
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