import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { Project, Task } from "../../types";
import { Plus, Calendar, Clock, Trash } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.get<Project>(`/projects/${id}`),
          api.get<Task[]>(`/tasks?projectId=${id}`),
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error al obtener los datos del proyecto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  const handleDeleteProject = async () => {
    if (!project) return;
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      try {
        await api.delete(`/projects/${project.id}`);
        navigate("/projects");
      } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        alert("Ocurrió un error al eliminar el proyecto.");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {project.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{project.description}</p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          {project && user && (user.id === project.managerId || user.role === "admin") && (
            <button
              onClick={handleDeleteProject}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <Trash className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Eliminar Proyecto
            </button>
          )}
          <Link
            to={`/projects/${id}/tasks/new`}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Agregar Tarea
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Tareas
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Tareas asociadas con este proyecto.
          </p>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No se encontraron tareas.
            </li>
          ) : (
            tasks.map((task) => (
              <li key={task.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/projects/${id}/tasks/${task.id}`}
                        className="truncate text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        {task.title}
                      </Link>
                      <div className="ml-2 flex flex-shrink-0">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${task.status === "completed"
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
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          Prioridad:{" "}
                          {task.priority === "high"
                            ? "Alta"
                            : task.priority === "medium"
                              ? "Media"
                              : "Baja"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <p>
                          Vence el{" "}
                          <time dateTime={task.dueDate}>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "N/A"}
                          </time>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div >
  );
}
