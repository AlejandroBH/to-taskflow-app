import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      setUploading(true);
      try {
        await api.post("/users/profile/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await checkAuth();
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error al subir la imagen");
      } finally {
        setUploading(false);
      }
    }
  };

  if (!user) {
    return <p>Cargando información del usuario...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Perfil de Usuario</h1>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Información Personal
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detalles de tu cuenta y perfil.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Nombre completo
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Correo electrónico
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Rol</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 capitalize">
                {user.role || "Usuario"}
              </dd>
            </div>
            {user.createdAt && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Miembro desde
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            )}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                ID de Usuario
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.id}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Foto de Perfil
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Sube una foto para personalizar tu perfil.
          </p>
        </div>
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              {user.profileImage ? (
                <img
                  className="h-24 w-24 object-cover rounded-full"
                  src={`http://localhost:3001${user.profileImage}`}
                  alt="Current profile"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <label className="block">
              <span className="sr-only">Elegir foto de perfil</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                "
              />
            </label>
            {uploading && (
              <span className="text-sm text-gray-500">Subiendo...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
