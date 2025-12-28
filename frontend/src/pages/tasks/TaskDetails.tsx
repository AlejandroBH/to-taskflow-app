import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { Task, Project, User as UserType } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { Calendar, Clock, User, CheckCircle, ArrowLeft } from "lucide-react";

export default function TaskDetails() {
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();
  const Navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, projectRes, usersRes] = await Promise.all([
          api.get<Task>(`/tasks/${taskId}`),
          api.get<Project>(`/projects/${projectId}`),
          api.get<UserType[]>("/users"),
        ]);
        setTask(taskRes.data);
        setProject(projectRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error al obtener los detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, taskId]);

  const handleStatusChange = async (newStatus: "pending" | "completed") => {
    try {
      if (!task) return;
      const { data } = await api.put<Task>(`/tasks/${taskId}`, {
        status: newStatus,
      });
      setTask(data);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleAssignChange = async (userId: string) => {
    try {
      if (!task) return;
      const { data } = await api.put<Task>(`/tasks/${taskId}`, {
        assignedTo: userId ? parseInt(userId) : null,
      });
      setTask(data);
    } catch (error) {
      console.error("Error al asignar tarea:", error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!task || !project) return <div>Tarea o proyecto no encontrado</div>;

  const isManager = user?.id === project.managerId;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => Navigate(-1)}
        className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Volver
      </button>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold leading-6 text-gray-900">
              {task.title}
            </h3>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5 ${
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : task.status === "in-progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {task.status === "completed"
                ? "Completada"
                : task.status === "in-progress"
                ? "En Progreso"
                : "Pendiente"}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            {task.description}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="mr-1.5 h-4 w-4" /> Prioridad
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {task.priority === "high"
                  ? "Alta"
                  : task.priority === "medium"
                  ? "Media"
                  : "Baja"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="mr-1.5 h-4 w-4" /> Vencimiento
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="mr-1.5 h-4 w-4" /> Asignado a
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {isManager ? (
                  <select
                    value={task.assignedTo || ""}
                    onChange={(e) => handleAssignChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Sin asignar</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  users.find((u) => u.id === task.assignedTo)?.name ||
                  "Sin asignar"
                )}
              </dd>
            </div>
          </dl>
        </div>

        {isManager && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Acciones de Administrador
            </h4>
            <div className="flex gap-4">
              {task.status !== "completed" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <CheckCircle className="-ml-0.5 mr-1.5 h-5 w-5" />
                  Marcar como Completada
                </button>
              )}
              {task.status === "completed" && (
                <button
                  onClick={() => handleStatusChange("pending")}
                  className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                >
                  <Clock className="-ml-0.5 mr-1.5 h-5 w-5" />
                  Marcar como Pendiente
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
