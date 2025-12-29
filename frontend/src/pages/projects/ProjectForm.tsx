import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const projectSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["active", "completed", "archived"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await api.post("/projects", data);
      navigate("/projects");
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Crear Proyecto
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Nombre del Proyecto
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="name"
              {...register("name")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Descripción
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Fecha de Inicio
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="startDate"
                {...register("startDate")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Fecha de Fin
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="endDate"
                {...register("endDate")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6">
          <Link
            to="/projects"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
          >
            {isSubmitting ? "Guardando..." : "Guardar Proyecto"}
          </button>
        </div>
      </form>
    </div>
  );
}
