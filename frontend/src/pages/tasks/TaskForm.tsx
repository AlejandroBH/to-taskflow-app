import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await api.post("/tasks", { ...data, projectId: Number(projectId) });
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Crear Tarea
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Título de la Tarea
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="title"
              {...register("title")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
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
              htmlFor="priority"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Prioridad
            </label>
            <div className="mt-2">
              <select
                id="priority"
                {...register("priority")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Fecha de Vencimiento
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="dueDate"
                {...register("dueDate")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6">
          <Link
            to={`/projects/${projectId}`}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
          >
            {isSubmitting ? "Guardando..." : "Guardar Tarea"}
          </button>
        </div>
      </form>
    </div>
  );
}
