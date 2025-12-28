import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { AuthResponse } from "../../types";

const registerSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Dirección de correo inválida"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "Confirmar Contraseña debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      registerAuth(response.data.token, response.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              inicia sesión en tu cuenta existente
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name")}
                className={`relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 ${
                  errors.name ? "ring-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Nombre completo"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={`relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 ${
                  errors.email ? "ring-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Correo electrónico"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className={`relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 ${
                  errors.password ? "ring-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Contraseña"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={`relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 ${
                  errors.confirmPassword
                    ? "ring-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="Confirmar Contraseña"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
